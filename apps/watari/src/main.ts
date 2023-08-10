import { Provider } from "@angular/core"
import { bootstrapApplication } from "@angular/platform-browser"
import { defineConfig } from "@watari/shared/util-config"
import { MetaMaskSDK } from "@metamask/sdk"
import { METAMASK_INSTANCE } from "@watari/shared/util-metamask"

import { provideApplicationConfig } from "./app/app.config"
import { AppComponent } from "./app/app.component"

const metamask: MetaMaskSDK = new MetaMaskSDK()

fetch("/configs/config.json", {
  headers: new Headers({
    pragma: "no-cache",
    "Cache-Control": "no-cache"
  })
})
  .then((response) => response.json())
  .then((config) => {
    defineConfig(config)

    return bootstrapApplication(
      AppComponent,
      provideApplicationConfig([
        {
          provide: METAMASK_INSTANCE,
          useValue: metamask
        }
      ] as Provider[])
    ).catch((err) =>
      console.error(err)
    )
  })
