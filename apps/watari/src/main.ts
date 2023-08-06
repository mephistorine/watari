import { bootstrapApplication } from "@angular/platform-browser"
import { defineConfig } from "@watari/shared/util-config"

import { appConfig } from "./app/app.config"
import { AppComponent } from "./app/app.component"

fetch("/configs/config.json", {
  headers: new Headers({
    pragma: "no-cache",
    "Cache-Control": "no-cache"
  })
})
  .then((response) => response.json())
  .then((config) => {
    defineConfig(config)

    return bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err)
    )
  })
