import { DB } from "@vlcn.io/crsqlite-wasm"
import { TblRx } from "@vlcn.io/rx-tbl"
import { wdbRtc } from "@vlcn.io/sync-p2p"

export type DatabaseConnection = {
  database: DB
  tblrx: TblRx
  rtc: Awaited<ReturnType<typeof wdbRtc>>
}
