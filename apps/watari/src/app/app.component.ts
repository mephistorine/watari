import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify"
import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiDialogModule,
  TuiRootModule
} from "@taiga-ui/core"
import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"
import initWasm from "@vlcn.io/crsqlite-wasm"
import createReactive from "@vlcn.io/rx-tbl"
import { wdbRtc } from "@vlcn.io/sync-p2p"

const dbStructure: string = `begin;
  create table if not exists users (
    id          text primary key,
    create_time text,
    name        text
  );

  create table if not exists wallets (
    id          text primary key,
    name        text,
    create_time text,
    amount      int default 0,
    icon        text,
    user_id     text
  );

  create table if not exists categories (
    id          text primary key,
    create_time text,
    name        text,
    icon        text,
    user_id     text
  );

  create table if not exists transactions (
    id          text primary key,
    create_time text,
    description text,
    type        text,
    amount      int,
    category_id text,
    user_id     text
  );

  select crsql_as_crr('users');
  select crsql_as_crr('wallets');
  select crsql_as_crr('categories');
  select crsql_as_crr('transactions');
commit;`

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

@Component({
  standalone: true,
  imports: [RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule],
  selector: "ri-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }]
})
export class AppComponent {
  constructor() {
    initWasm(() => "/assets/crsqlite-0.14.0.wasm")
      .then((sqlite) => sqlite.open(":memory:"))
      .then(async (db) => {
        await db.exec(DATABASE_SCHEMA)
        return db
      })
      .then(async (database) => {
        const rx: any = createReactive(database)
        const rtc: any = await wdbRtc(database)

        console.log({ database, rx, rtc })
      })
  }
}
