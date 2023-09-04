import { Route } from "@angular/router"
import { AuthPageComponent } from "@watari/auth/feature-auth-page"
import { HomePageComponent } from "@watari/home/feature-home-page"
import { NewTransactionPageComponent } from "@watari/transaction/feature-new-transaction-page"

import { IS_USER_LOGGED_GUARD } from "./core/guards/auth.guard"

export const appRoutes: Route[] = [
  {
    path: "login",
    component: AuthPageComponent,
    title: "Auth – Watari",
    data: {
      enableAppTabBar: false
    }
  },
  {
    path: "transactions/new",
    component: NewTransactionPageComponent,
    title: "New transaction – Watari",
    canActivate: [ IS_USER_LOGGED_GUARD ],
    data: {
      enableAppTabBar: true
    }
  },
  {
    path: "",
    component: HomePageComponent,
    title: "Home – Watari",
    canActivate: [ IS_USER_LOGGED_GUARD ],
    data: {
      enableAppTabBar: true
    }
  }
]
