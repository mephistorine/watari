import { ChangeDetectionStrategy, Component, Inject } from "@angular/core"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"
import { FormBuilder, FormControl, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { LOCATION, NAVIGATOR } from "@ng-web-apis/common"
import { BehaviorSubject, map, Observable, tap } from "rxjs"
import * as QRCode from "qrcode"
import { DomSanitizer, SafeHtml } from "@angular/platform-browser"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"

const FRIEND_PEER_ID_PARAM: string = "friend-peer-id"

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

  protected connectSvg: Observable<SafeHtml> = new Observable<string>((subscriber) => {
    QRCode.toString(this.makeShareUrl(), {
      type: "svg"
    }, (err, result) => {
      if (err) {
        subscriber.error(err)
        subscriber.complete()
        return
      }

      subscriber.next(result)
      subscriber.complete()
    })
  }).pipe(
    map((value) => this.domSanitizer.bypassSecurityTrustHtml(value))
  )

  constructor(@Inject(DATABASE_CONNECTION)
              private readonly databaseConnection: DatabaseConnection,
              private readonly formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              @Inject(NAVIGATOR)
              private readonly navigator: Navigator,
              private readonly domSanitizer: DomSanitizer,
              @Inject(LOCATION)
              private readonly location: Location) {
    this.databaseConnection.rtc.onConnectionsChanged((pending, established) => {
      this.loading.next(pending.length < 0)
    })

    this.activatedRoute.queryParams.pipe(
      tap((queryParams) => {
        if (FRIEND_PEER_ID_PARAM in queryParams) {
          this.friendPeerIdControl.patchValue(Reflect.get(queryParams, FRIEND_PEER_ID_PARAM))
        }
      }),
      takeUntilDestroyed()
    ).subscribe()
  }

  protected onClickConnectButton(): void {
    if(this.friendPeerIdControl.invalid) {
      this.friendPeerIdControl.markAsTouched()
      return
    }

    this.loading.next(true)
    this.databaseConnection.rtc.connectTo(this.friendPeerIdControl.value!)
  }

  protected onClickShareButton(): void {
    this.navigator.share({
      url: this.makeShareUrl(),
      title: "Connect"
    })
  }

  private makeShareUrl(): string {
    const url: URL = new URL(this.location.href)
    url.searchParams.set(FRIEND_PEER_ID_PARAM, this.myPeerId)
    return url.toString()
  }
}
