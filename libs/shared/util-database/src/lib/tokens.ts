import { InjectionToken } from "@angular/core"
import { DB } from "@vlcn.io/crsqlite-wasm"

export const DATABASE_CONNECTION: InjectionToken<DB> = new InjectionToken<DB>("Watari database connection")
