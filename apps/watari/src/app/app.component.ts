import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"

@Component({
  standalone: true,
  imports: [ RouterModule ],
  selector: "watari-root",
  templateUrl: "./app.component.html",
  styleUrls: [ "./app.component.css" ]
})
export class AppComponent {
}
