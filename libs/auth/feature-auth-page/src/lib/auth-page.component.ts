import { ChangeDetectionStrategy, Component, Inject } from "@angular/core"
import { AuthPageFacade } from "@watari/auth/domain"
import { TuiButtonModule } from "@taiga-ui/core"
import { METAMASK_PROVIDER, MetamaskProvider } from "@watari/shared/util-metamask"

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
  constructor(private authPageFacade: AuthPageFacade,
              @Inject(METAMASK_PROVIDER) private metamaskProvider: MetamaskProvider) {
  }

  protected onClickConnectButton(): void {
    this.metamaskProvider
      .request({
        method: "eth_requestAccounts",
        params: []
      })
      .then(console.log)
      .catch((error) => {
        debugger
      })
  }
}
