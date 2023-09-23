import { Route } from "@angular/router"
import { AuthPageComponent } from "@watari/auth/feature-auth-page"
import { HomePageComponent } from "@watari/home/feature-home-page"
import { NewTransactionPageComponent } from "@watari/transaction/feature-new-transaction-page"
import { ConnectPageComponent } from "@watari/connect/feature-connect-page"
import { RiRoutes } from "@watari/shared/util-router"

import { IS_USER_LOGGED_GUARD } from "./core/guards/is-user-logged.guard"

export const appRoutes: Route[] = [
  {
    path: RiRoutes.login,
    component: AuthPageComponent,
    title: "Auth – Watari",
    data: {
      enableAppTabBar: false
    }
  },
  {
    path: RiRoutes.transactionNew,
    component: NewTransactionPageComponent,
    title: "New transaction – Watari",
    canActivate: [ IS_USER_LOGGED_GUARD ],
    data: {
      enableAppTabBar: true
    }
  },
  {
    path: RiRoutes.connect,
    component: ConnectPageComponent,
    title: "Connect – Watari",
    canActivate: [ IS_USER_LOGGED_GUARD ],
    data: {
      enableAppTabBar: true
    }
  },
  {
    path: RiRoutes.home,
    component: HomePageComponent,
    title: "Home – Watari",
    canActivate: [ IS_USER_LOGGED_GUARD ],
    data: {
      enableAppTabBar: true
    }
  }
]
