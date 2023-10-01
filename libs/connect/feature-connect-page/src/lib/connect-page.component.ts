import { ChangeDetectionStrategy, Component, Inject } from "@angular/core"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"
import { FormBuilder, FormControl, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { NAVIGATOR } from "@ng-web-apis/common"
import { BehaviorSubject } from "rxjs"

@Component({
  selector: "connect-connect-page",
  templateUrl: "./connect-page.component.html",
  styleUrls: [ "./connect-page.component.scss" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectPageComponent {
  protected friendPeerIdControl: FormControl<string | null> = this.formBuilder.control(null, Validators.required)

  protected get myPeerId(): string {
    return this.databaseConnection.peerId
  }

  protected loading: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor(@Inject(DATABASE_CONNECTION)
              private readonly databaseConnection: DatabaseConnection,
              private readonly formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              @Inject(NAVIGATOR)
              private readonly navigator: Navigator) {
    this.databaseConnection.rtc.onConnectionsChanged((pending, established) => {
      this.loading.next(pending.length < 0)
    })
  }

  protected onClickConnectButton(): void {
    if (this.friendPeerIdControl.invalid) {
      this.friendPeerIdControl.markAsTouched()
      return
    }

    this.loading.next(true)
    this.databaseConnection.rtc.connectTo(this.friendPeerIdControl.value!)
  }

  protected onClickShareButton(): void {
    /*const url: URL = new URL(this.router.url)

    url.searchParams.set("friendPeerId", this.myPeerId)

    this.navigator.share({
      url: url.toString(),
      title: "Connect"
    })*/
  }
}
