import { inject, Injectable } from "@angular/core"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"
import { defer, from, map, Observable } from "rxjs"

import { TransactionProps } from "../entities/transaction.props"
import { TransactionMapper } from "../infrastructure/mappers/transaction.mapper"
import { Transaction } from "../entities/transaction.entity"

@Injectable({
  providedIn: "root"
})
export class TransactionsService {
  private readonly mapper: TransactionMapper = new TransactionMapper()

  private readonly databaseConnection: DatabaseConnection = inject(DATABASE_CONNECTION)

  public findOneById(id: string | null): Observable<Transaction | null> {
    return defer(() => from(this.databaseConnection.database.execO<TransactionProps>("SELECT * FROM transactions WHERE id = ?", [ id ])))
      .pipe(
        map((items) => typeof items[ 0 ] === "undefined" ? null : this.mapper.mapTo(items[ 0 ]))
      )
  }

  public findAll(): Observable<readonly Transaction[]> {
    return defer(() => {
      return from(this.databaseConnection.database.execO<TransactionProps>("SELECT * FROM transactions")).pipe(
        map((transactions) => {
          return transactions.map(this.mapper.mapTo)
        })
      )
    })
  }

  public create(transactionProps: TransactionProps): Observable<Transaction> {
    return defer(() => from(this.databaseConnection.database.execO<TransactionProps>(
      "INSERT INTO transactions (id, create_time, description, type, amount, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *",
      [
        transactionProps.id,
        transactionProps.create_time,
        transactionProps.description,
        transactionProps.type,
        transactionProps.amount,
        transactionProps.user_id,
        transactionProps.category_id
      ]
    ))).pipe(
      map((items) => {
        const first: TransactionProps | undefined = items[ 0 ]

        if(typeof first === "undefined") {
          throw new Error("Transaction must be returned")
        }

        return this.mapper.mapTo(first)
      })
    )
  }
}
