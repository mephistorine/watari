import { Provider } from "@angular/core"
import { bootstrapApplication } from "@angular/platform-browser"
import { defineConfig, loadConfig } from "@watari/shared/util-config"
import { MetaMaskSDK } from "@metamask/sdk"
import { forkJoin, switchMap } from "rxjs"
import { METAMASK_INSTANCE } from "@watari/shared/util-metamask"
import { DATABASE_CONNECTION, openDatabaseConnection } from "@watari/shared/util-database"
import { tuiSvgSrcInterceptors } from "@taiga-ui/core"
import { TuiSafeHtml } from "@taiga-ui/cdk"

import { provideApplicationConfig } from "./app/app.config"
import { AppComponent } from "./app/app.component"

const metamask: MetaMaskSDK = new MetaMaskSDK()

const DATABASE_SCHEMA: string = `
  CREATE TABLE IF NOT EXISTS users (
    "id" TEXT PRIMARY KEY,
    "create_time" TEXT,
    "name" TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    "id"          TEXT PRIMARY KEY,
    "create_time" TEXT,
    "name"        TEXT,
    "icon"        TEXT,
    "user_id"     TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    "id" TEXT PRIMARY KEY,
    "create_time" TEXT,
    "description" TEXT,
    "type"        TEXT,
    "amount"      INT,
    "user_id"     TEXT,
    "category_id" TEXT
  );

  SELECT crsql_as_crr('users');
  SELECT crsql_as_crr('categories');
  SELECT crsql_as_crr('transactions');
`

/*;(async () => {
  const sqlite: SQLite3 = await initWasm(() => SQLITE_WASM_FILE_URL)
  const database: DB = await sqlite.open(":memory:")
  await database.exec(DATABASE_SCHEMA)
  console.debug(database)
})()*/


forkJoin([
  openDatabaseConnection(DATABASE_SCHEMA),
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
        },
        tuiSvgSrcInterceptors((src: TuiSafeHtml) => {
          if (String(src).startsWith("twemoji")) {
            return `https://api.iconify.design/twemoji:${String(src).replace("twemoji::", "")}.svg`
          }

          return src
        })
        /*{
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: appInit
        }*/
      ] as Provider[])
    )
  })
).subscribe()
