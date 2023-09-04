import { ChangeDetectionStrategy, Component } from "@angular/core"
import {
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiTextAreaModule
} from "@taiga-ui/kit"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { AsyncPipe, NgForOf, NgIf } from "@angular/common"
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiGroupModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core"
import { TuiCurrencyPipeModule } from "@taiga-ui/addon-commerce"
import { EMPTY, Observable, startWith, switchMap, tap } from "rxjs"
import { Router, RouterLink } from "@angular/router"
import { TuiContextWithImplicit, TuiDay, TuiLetModule, tuiPure, TuiStringHandler, TuiTime } from "@taiga-ui/cdk"
import { TransactionsService, TransactionType } from "@watari/transaction/domain"
import { UserService } from "@watari/user/domain"
import { TuiTabBarModule } from "@taiga-ui/addon-mobile"
import { CategoriesService, Category } from "@watari/category/domain"

@Component({
  selector: "transaction-new-transaction-page",
  templateUrl: "./new-transaction-page.component.html",
  styleUrls: [ "./new-transaction-page.component.scss" ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TuiInputModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    AsyncPipe,
    TuiErrorModule,
    TuiInputNumberModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiCurrencyPipeModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextAreaModule,
    TuiGroupModule,
    TuiRadioBlockModule,
    TuiInputDateTimeModule,
    RouterLink,
    TuiTabBarModule,
    TuiLetModule,
    NgForOf,
    TuiDataListModule,
    NgIf,
    TuiLoaderModule
  ]
})
export class NewTransactionPageComponent {
  protected readonly types: string[] = [
    "INCOME",
    "EXPENSE"
  ]

  protected readonly form = this.formBuilder.group({
    amount: [ null, [ Validators.required, Validators.min(1) ] ],
    type: [ "EXPENSE", Validators.required ],
    createTime: [ [ TuiDay.currentLocal(), TuiTime.currentLocal() ] ],
    categoryId: [ null ],
    description: [ "" ]
  })

  protected categories: Observable<readonly Category[]> = this.categoryService.findAll().pipe(
    startWith([])
  )

  constructor(private readonly formBuilder: FormBuilder,
              private readonly transactionsService: TransactionsService,
              private readonly userService: UserService,
              private readonly categoryService: CategoriesService,
              private readonly router: Router) {
  }

  public onSubmitForm(event: SubmitEvent): void {
    event.preventDefault()

    if(this.form.invalid) {
      return
    }

    const value: any = this.form.value

    this.userService.getAuthedUser().pipe(
      switchMap((user) => {
        if(user === null) {
          return EMPTY
        }

        const [ day, time ] = value.createTime as [ TuiDay, TuiTime ]

        return this.transactionsService.create({
          id: crypto.randomUUID(),
          type: value.type as TransactionType,
          amount: (value.amount as number) * 100,
          description: value.description,
          user_id: user.id,
          create_time: new Date(day.toLocalNativeDate().getTime() + time.toAbsoluteMilliseconds()).toISOString(),
          category_id: value.categoryId
        }).pipe(
          tap(() => {
            this.router.navigateByUrl("/")
          })
        )
      })
    ).subscribe()
  }

  @tuiPure
  protected createLabelStringifier(categories: readonly Category[]): TuiStringHandler<TuiContextWithImplicit<string>> {
    const categoriesById: Map<string, Category> = new Map(
      categories.map((category) => [ category.id, category ])
    )

    return (context: TuiContextWithImplicit<string>) => {
      return categoriesById.has(context.$implicit)
        ? categoriesById.get(context.$implicit)!.name
        : ""
    }
  }
}
