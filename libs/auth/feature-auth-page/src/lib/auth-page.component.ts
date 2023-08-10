import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { TuiButtonModule } from "@taiga-ui/core"
import { AuthService } from "@watari/auth/domain"

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

  protected onClickConnectButton(): void {
    /*this.authService
      .loginWithMetamask()
      .subscribe()*/
  }
}
