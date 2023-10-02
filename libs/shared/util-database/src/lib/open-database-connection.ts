import initWasm, { DB, SQLite3 } from "@vlcn.io/crsqlite-wasm"
import tblrx from "@vlcn.io/rx-tbl"
import { wdbRtc } from "@vlcn.io/sync-p2p"
import { stringify as uuidStringify } from "uuid"

import { RI_DATABASE_NAME, SQLITE_WASM_FILE_URL } from "./constants"
import { DatabaseConnection } from "./types"

export async function openDatabaseConnection(schema: string): Promise<DatabaseConnection> {
  try {
    const sqlite: SQLite3 = await initWasm(() => SQLITE_WASM_FILE_URL)
    const database: DB = await sqlite.open(RI_DATABASE_NAME)
    await database.exec(schema)
    const peerIdRaw: any[][] = await database.execA("SELECT crsql_siteid();")
    const peerId: string = uuidStringify(peerIdRaw[ 0 ][ 0 ])

    ;(window as any).db = database
    ;(window as any).peerId = peerId

    const context: DatabaseConnection = {
      database,
      tblrx: tblrx(database),
      rtc: await wdbRtc(database),
      peerId: peerId
    }

    return context
  } catch (error) {
    debugger
    return Promise.reject(error)
  }
}
