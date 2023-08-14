import initWasm, { DB, SQLite3 } from "@vlcn.io/crsqlite-wasm"
import tblrx from "@vlcn.io/rx-tbl"
import { wdbRtc } from "@vlcn.io/sync-p2p"

import { SQLITE_WASM_FILE_URL } from "./constants"
import { DatabaseConnection } from "./types"

export async function openDatabaseConnection(schema: string): Promise<DatabaseConnection> {
  const sqlite: SQLite3 = await initWasm(() => SQLITE_WASM_FILE_URL)
  const database: DB = await sqlite.open(":memory:")
  await database.exec(schema)

  await database.exec("insert into users (id, name, create_time) values (?, ?, ?)", [
    "0x850dc4ae7ea9a326ad227477292bdef8f8fd16c6",
    "Sam Bulatov",
    new Date().toISOString()
  ])

  return {
    database,
    tblrx: tblrx(database),
    rtc: await wdbRtc(database)
  }
}