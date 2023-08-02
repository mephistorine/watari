import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify"
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule } from "@taiga-ui/core"
import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"

@Component({
  standalone: true,
  imports: [ RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule],
  selector: "watari-root",
  templateUrl: "./app.component.html",
  styleUrls: [ "./app.component.css" ],
        providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}]
    })
export class AppComponent {
}
