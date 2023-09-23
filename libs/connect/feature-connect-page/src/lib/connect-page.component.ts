import { ChangeDetectionStrategy, Component, Inject } from "@angular/core"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"
import { FormBuilder, FormControl, Validators } from "@angular/forms"

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

  constructor(@Inject(DATABASE_CONNECTION)
              private readonly databaseConnection: DatabaseConnection,
              private formBuilder: FormBuilder) {
  }

  protected onClickConnectButton(): void {
    if (this.friendPeerIdControl.invalid) {
      this.friendPeerIdControl.markAsTouched()
      return
    }

    this.databaseConnection.rtc.connectTo(this.friendPeerIdControl.value!)
  }
}
