import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { TuiButtonModule } from "@taiga-ui/core"
import { BehaviorSubject, EMPTY, switchMap, take, tap } from "rxjs"
import { RxPush } from "@rx-angular/template/push"
import { AuthService } from "@watari/auth/domain"
import { User, UserService } from "@watari/user/domain"
import { RxLet } from "@rx-angular/template/let"
import { RxIf } from "@rx-angular/template/if"
import { TuiInputModule } from "@taiga-ui/kit"
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { tuiMarkControlAsTouchedAndValidate } from "@taiga-ui/cdk"
import { RiRoutes } from "@watari/shared/util-router"

@Component({
  selector: "auth-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: [ "./auth-page.component.scss" ],
  standalone: true,
  imports: [
    TuiButtonModule,
    RxPush,
    RxLet,
    RxIf,
    TuiInputModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageComponent {
  private readonly authService: AuthService = inject(AuthService)

  private readonly usersService: UserService = inject(UserService)

  private readonly formBuilder: FormBuilder = inject(FormBuilder)

  private readonly router: Router = inject(Router)

  private walletId: string | null = null

  protected readonly isLoginButtonLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)

  protected readonly isShowRegistration: BehaviorSubject<boolean> = new BehaviorSubject(false)

  protected readonly stringFormControl: FormControl<string> = this.formBuilder.nonNullable.control("", Validators.required)

  public onClickLoginButton(): void {
    this.isLoginButtonLoading.next(true)

    this.authService.loginWithMetamask().pipe(
      take(1),
      switchMap((walletId: string | null) => {
        this.walletId = walletId

        if(walletId === null) {
          this.isLoginButtonLoading.next(false)
          return EMPTY
        }

        return this.usersService.findOneById(walletId).pipe(
          take(1),
          tap((user: User | null) => {
            this.isLoginButtonLoading.next(false)

            if(user === null) {
              this.isShowRegistration.next(true)
              return
            }

            this.redirectToHomePage(user)
          })
        )
      })
    ).subscribe()
  }

  public onClickCompleteRegisterButton(): void {
    if(this.stringFormControl.invalid) {
      tuiMarkControlAsTouchedAndValidate(this.stringFormControl)
      return
    }

    if(this.walletId === null) {
      throw new Error("Wallet id required")
    }

    const user: User = new User()
    user.id = this.walletId
    user.name = this.stringFormControl.value
    user.createTime = new Date().toISOString()

    this.usersService.create(user)
      .pipe(
        take(1),
        tap((user: User) => this.redirectToHomePage(user))
      )
      .subscribe()
  }

  private redirectToHomePage(user: User): void {
    this.usersService.setAuthedUser(user)
    this.router.navigateByUrl(RiRoutes.home)
  }
}
