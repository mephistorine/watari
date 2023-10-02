import { ChangeDetectionStrategy, Component, Inject, NgZone } from "@angular/core"
import { RouterLink } from "@angular/router"
import { TuiAvatarModule, TuiMarkerIconModule } from "@taiga-ui/kit"
import { TuiMoneyModule } from "@taiga-ui/addon-commerce"
import { TuiButtonModule, TuiFormatDatePipeModule } from "@taiga-ui/core"
import { map, Observable, repeat, Subject, withLatestFrom } from "rxjs"
import { CategoriesService, Category } from "@watari/category/domain"
import { Transaction, TransactionsService } from "@watari/transaction/domain"
import { AsyncPipe, DatePipe, NgForOf } from "@angular/common"
import { RxPush } from "@rx-angular/template/push"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"

type TransactionGroupItem = {
  categoryIcon: string
  categoryName: string
  transactionAmount: number
  date: Date
}

type TransactionGroup = {
  date: Date
  income: number
  expense: number
  items: TransactionGroupItem[]
}

@Component({
  selector: "home-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: [ "./home-page.component.scss" ],
  standalone: true,
  imports: [
    RouterLink,
    TuiAvatarModule,
    TuiMoneyModule,
    TuiButtonModule,
    NgForOf,
    AsyncPipe,
    TuiFormatDatePipeModule,
    DatePipe,
    TuiMarkerIconModule,
    RxPush
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private retry: Subject<void> = new Subject()
  protected readonly transactionGroups: Observable<TransactionGroup[]> = this.transactionsService.findAll().pipe(
    repeat({ delay: () => this.retry }),
    withLatestFrom(this.categoriesService.findAll()),
    map(([ transactions, categories ]) => {
      const categoryById: Map<string, Category> = categories.reduce((acc, curr) => {
        acc.set(curr.id, curr)
        return acc
      }, new Map<string, Category>())

      const transactionsByDay: Map<string, Transaction[]> = transactions
        .slice()
        .sort((a, b) => {
          return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        })
        .reduce((acc, curr) => {
          const day: string = curr.createTime.split("T")[ 0 ]

          if(acc.has(day)) {
            acc.get(day)!.push(curr)
          } else {
            acc.set(day, [ curr ])
          }

          return acc
        }, new Map<string, Transaction[]>())

      const groups: TransactionGroup[] = []

      transactionsByDay.forEach((value: Transaction[], key: string) => {
        groups.push({
          date: new Date(key),
          income: value.filter((t) => t.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0) / 100,
          expense: value.filter((t) => t.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0) / 100 * -1,
          items: value.map((transaction) => {
            const categoryId: string | null = transaction.categoryId

            if(categoryId === null) {
              return {
                categoryIcon: "tuiIconDisc",
                categoryName: "Не известно",
                transactionAmount: (transaction.type === "EXPENSE" ? transaction.amount * -1 : transaction.amount) / 100,
                date: new Date(transaction.createTime)
              }
            }

            const category: Category = categoryById.get(categoryId)!

            return {
              categoryIcon: category.icon,
              categoryName: category.name,
              transactionAmount: (transaction.type === "EXPENSE" ? transaction.amount * -1 : transaction.amount) / 100,
              date: new Date(transaction.createTime)
            }
          })
        })
      })

      return groups
    })
  )

  constructor(private readonly categoriesService: CategoriesService,
              private readonly transactionsService: TransactionsService,
              @Inject(DATABASE_CONNECTION)
              private readonly databaseConnection: DatabaseConnection,
              private readonly ngZone: NgZone) {
    this.databaseConnection.tblrx.onAny(() => {
      this.ngZone.run(() => {
        this.retry.next()
      })
    })
  }
}
