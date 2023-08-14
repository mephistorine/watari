import { InjectionToken } from "@angular/core"
import { DatabaseConnection } from "./types"

export const DATABASE_CONNECTION: InjectionToken<DatabaseConnection> = new InjectionToken<DatabaseConnection>("Watari database connection")
