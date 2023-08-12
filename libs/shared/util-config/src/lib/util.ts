import { RI_CONFIG_KEY_NAME } from "./const"
import { RiAppConfig } from "./types"

export function defineConfig(config: RiAppConfig): void {
  ;(window as any)[RI_CONFIG_KEY_NAME] = config
}
