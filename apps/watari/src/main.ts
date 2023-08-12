import { Provider } from "@angular/core"
import { bootstrapApplication } from "@angular/platform-browser"
import { defineConfig, loadConfig } from "@watari/shared/util-config"
import { MetaMaskSDK } from "@metamask/sdk"
import { forkJoin, switchMap } from "rxjs"
import { METAMASK_INSTANCE } from "@watari/shared/util-metamask"
import { DATABASE_CONNECTION, openDatabaseConnection } from "@watari/shared/util-database"

import { provideApplicationConfig } from "./app/app.config"
import { AppComponent } from "./app/app.component"

const metamask: MetaMaskSDK = new MetaMaskSDK()

const DATABASE_SCHEMA: string = `
  CREATE TABLE IF NOT EXISTS users (
    "id" TEXT PRIMARY KEY,
    "create_time" TEXT,
    "name" TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    "id" TEXT PRIMARY KEY,
    "create_time" TEXT,
    "description" TEXT,
    "type"        TEXT,
    "amount"      INT,
    "user_id"     TEXT
  );

  SELECT crsql_as_crr('users');
  SELECT crsql_as_crr('transactions');
`

forkJoin([
  openDatabaseConnection(),
  loadConfig()
]).pipe(
  switchMap(([ dbConnection, config ]) => {
    defineConfig(config)

    return bootstrapApplication(
      AppComponent,
      provideApplicationConfig([
        {
          provide: METAMASK_INSTANCE,
          useValue: metamask
        },
        {
          provide: DATABASE_CONNECTION,
          useValue: dbConnection
        }
      ] as Provider[])
    )
  })
).subscribe()
