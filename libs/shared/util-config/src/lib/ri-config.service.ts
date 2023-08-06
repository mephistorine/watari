import { Injectable, inject } from "@angular/core"

import { RiAppConfig } from "./types"
import { RI_CONFIG } from "./tokens"

@Injectable({
  providedIn: "root"
})
export class RiConfigService {
  private readonly config: RiAppConfig = inject(RI_CONFIG)

  public get<K extends keyof RiAppConfig>(key: K): RiAppConfig[K] {
    return Reflect.get(this.config, key)
  }
}
