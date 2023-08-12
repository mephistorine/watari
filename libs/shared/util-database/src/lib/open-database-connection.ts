import initWasm, { DB, SQLite3 } from "@vlcn.io/crsqlite-wasm"

import { SQLITE_WASM_FILE_URL } from "./constants"

export async function openDatabaseConnection(): Promise<DB> {
  const sqlite: SQLite3 = await initWasm(() => SQLITE_WASM_FILE_URL)
  return sqlite.open(":memory:")
}
