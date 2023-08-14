import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { TuiButtonModule } from "@taiga-ui/core"
import { EMPTY, switchMap } from "rxjs"
import { AuthService } from "@watari/auth/domain"
import { UsersService } from "@watari/user/domain"

@Component({
  selector: "auth-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: [ "./auth-page.component.scss" ],
  standalone: true,
  imports: [
    TuiButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageComponent {
  private readonly authService: AuthService = inject(AuthService)

  private readonly usersService: UsersService = inject(UsersService)

  protected onClickConnectButton(): void {
    this.authService
      .loginWithMetamask()
      .pipe(
        switchMap((id: string | null) => {
          if (id === null) {
            return EMPTY
          }

          return this.usersService.findOneById(id)
        })
      )
      .subscribe(console.log)
  }
}
