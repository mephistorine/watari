import { Route } from "@angular/router"

export const appRoutes: Route[] = [
  {
    path: "login",
    loadComponent: () => import("@watari/auth/feature-auth-page").then((m) => m.AuthPageComponent)
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  }
]
