import { NgModule, makeEnvironmentProviders } from "@angular/core"
import { WINDOW } from "@ng-web-apis/common"
import { RI_CONFIG } from "./tokens"
import { RI_CONFIG_KEY_NAME } from "./const"

export function provideAppConfig() {
  return makeEnvironmentProviders([
    {
      provide: RI_CONFIG,
      useFactory: (global: Window) => {
        return Reflect.get(global, RI_CONFIG_KEY_NAME)
      },
      deps: [WINDOW]
    }
  ])
}
