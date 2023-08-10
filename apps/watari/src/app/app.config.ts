import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { TuiRootModule } from "@taiga-ui/core"
import { ApplicationConfig, importProvidersFrom, Provider } from "@angular/core"
import { provideRouter, withEnabledBlockingInitialNavigation } from "@angular/router"
import { provideAppConfig } from "@watari/shared/util-config"
import { provideMetamask } from "@watari/shared/util-metamask"

import { appRoutes } from "./app.routes"

export function provideApplicationConfig(extraProviders: Provider[]): ApplicationConfig {
  return {
    providers: [
      ...extraProviders,
      provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
      importProvidersFrom(TuiRootModule, BrowserAnimationsModule),
      provideAppConfig(),
      provideMetamask()
    ]
  }
}
