import { Inject, Injectable } from "@angular/core"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"

import {
  catchError,
  defer,
  EMPTY,
  forkJoin,
  from,
  fromEventPattern,
  isObservable,
  map,
  Observable,
  of,
  retry,
  Subject,
  Subscriber,
  switchMap,
  takeUntil,
  tap
} from "rxjs"

type QueryResultIsLoading = {
  data: null
  isLoading: true
  error: null
}

type QueryResultIsLoadedSuccess<T> = {
  data: T
  isLoading: false
  error: null
}

type QueryResultIsLoadedError = {
  data: null
  isLoading: false
  error: Error
}

export type QueryResult<T> = QueryResultIsLoading | QueryResultIsLoadedSuccess<T> | QueryResultIsLoadedError

function isSQLiteCompatibleType(target: any): boolean {
  return typeof target === "number"
    || typeof target === "string"
    || typeof target === "bigint"
    || target === null
    || target instanceof Uint8Array
    || Array.isArray(target)
}

const allUpdateTypes: number[] = [ 9, 18, 23 ]

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  constructor(@Inject(DATABASE_CONNECTION)
              private databaseConnection: DatabaseConnection) {
  }

  public query<T>(query: string,
                  bindings: (readonly SQLiteCompatibleType[]) | Observable<readonly SQLiteCompatibleType[]> = [],
                  rowId: bigint | null = null,
                  updateTypes: number[] = allUpdateTypes): Observable<QueryResult<T>> {
    return new Observable<QueryResult<T>>((subscriber: Subscriber<QueryResult<T>>) => {
      const onDestroy: Subject<void> = new Subject<void>()

      subscriber.next({
        isLoading: true,
        data: null,
        error: null
      })

      const { database, tblrx } = this.databaseConnection

      const bindingChanges: Observable<readonly SQLiteCompatibleType[]> = isObservable(bindings) ? bindings : of(bindings)

      forkJoin([
        from(database.prepare(query)),
        this.getUsedTables(query)
      ]).pipe(
        switchMap(([ stmt, usedTables ]) => {
          return bindingChanges.pipe(
            switchMap((bindingsValue) => {
              const runQuery: () => Observable<any> = () => from(stmt.bind(bindingsValue).raw(false).all(null)).pipe(
                tap((result) => {
                  subscriber.next({
                    isLoading: false,
                    data: result as T,
                    error: null
                  })
                })
              )

              return runQuery().pipe(
                switchMap(() => defer(() => {
                  if(rowId === null) {
                    return fromEventPattern<number[]>(
                      (next) => tblrx.onRange(usedTables.slice(), next),
                      (_, dispose) => dispose()
                    )
                  }

                  return fromEventPattern<number[]>(
                    (next) => tblrx.onPoint(usedTables.slice()[ 0 ], rowId, next),
                    (_, dispose) => dispose()
                  )
                }).pipe(
                  switchMap((updates) => {
                    if(updateTypes.every((u) => updates.includes(u))) {
                      return runQuery()
                    }

                    return EMPTY
                  })
                ))
              )
            })
          )
        }),
        catchError((error: Error) => {
          subscriber.next({
            isLoading: false,
            data: null,
            error: error
          })

          return EMPTY
        }),
        retry(3),
        takeUntil(onDestroy)
      ).subscribe()

      return () => {
        onDestroy.next()
        onDestroy.complete()
      }
    })
  }

  private getUsedTables(query: string): Observable<readonly string[]> {
    const queryReplaced: string = query.replaceAll("'", "''")

    return from(this.databaseConnection.database.execA(`SELECT tbl_name FROM tables_used('${queryReplaced}')
    AS u JOIN sqlite_master ON sqlite_master.name = u.name
    WHERE u.schema = 'main';`)).pipe(
      map(([ name ]) => name)
    )
  }
}

/*

interface StmtAsync {
    // Просто выполняет запрос
    run(tx: TXAsync | null, ...bindArgs: any[]): Promise<void>;
    // Возвращает одно значение, полезно когда ищите что-то одно
    get(tx: TXAsync | null, ...bindArgs: any[]): Promise<any>;
    // Выполняет запрос и возвращает все в виде списка
    all(tx: TXAsync | null, ...bindArgs: any[]): Promise<any[]>;
    // Возвращает «курсор», можно проитерироваться через цикл
    iterate<T>(tx: TXAsync | null, ...bindArgs: any[]): AsyncIterator<T>;
    // Переключает режим вывода, если true, то начинает возвращать строку в виде массива, если false то в виде объекта (флаг запоминается)
    raw(isRaw?: boolean): this;
    // Биндит параметры для запроса (запоминаемы)
    bind(args: readonly any[]): this;
    // Завершает запрос
    finalize(tx: TXAsync | null): Promise<void>;
}

 */
