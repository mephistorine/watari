import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { TuiRootModule } from "@taiga-ui/core"
import { ApplicationConfig, importProvidersFrom } from "@angular/core"
import {
  provideRouter,
  withEnabledBlockingInitialNavigation
} from "@angular/router"
import { provideAppConfig } from "@watari/shared/util-config"

import { appRoutes } from "./app.routes"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    importProvidersFrom(TuiRootModule, BrowserAnimationsModule),
    provideAppConfig()
  ]
}
