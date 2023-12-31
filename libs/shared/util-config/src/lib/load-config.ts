import { RiAppConfig } from "./types"

export function loadConfig(): Promise<RiAppConfig> {
  return fetch("/assets/configs/config.json", {
    headers: new Headers({
      pragma: "no-cache",
      "Cache-Control": "no-cache"
    })
  })
    .then((response) => response.json())
}
