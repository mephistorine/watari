import { Component, OnInit } from "@angular/core"
import { AuthPageFacade } from "@undefined/auth/domain"

@Component({
  selector: "auth-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: ["./auth-page.component.scss"]
})
export class AuthPageComponent implements OnInit {
  constructor(private authPageFacade: AuthPageFacade) {}

  ngOnInit() {}
}
