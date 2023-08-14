import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify"
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule, TuiThemeNightModule } from "@taiga-ui/core"
import { Component } from "@angular/core"
import { RouterModule } from "@angular/router"

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

@Component({
  standalone: true,
  imports: [ RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule, TuiThemeNightModule ],
  selector: "ri-root",
  templateUrl: "./app.component.html",
  styleUrls: [ "./app.component.css" ],
  providers: [ { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer } ]
})
export class AppComponent {
}
