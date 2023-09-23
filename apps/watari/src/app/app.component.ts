import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify"
import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogModule,
  TuiDropdownModule,
  TuiRootModule,
  TuiThemeNightModule
} from "@taiga-ui/core"
import { Component, Inject } from "@angular/core"
import { ActivationEnd, Router, RouterModule } from "@angular/router"
import { TuiTabBarModule } from "@taiga-ui/addon-mobile"
import { TuiActiveZoneModule, TuiPortalModule } from "@taiga-ui/cdk"
import { EMPTY, filter, forkJoin, map, Observable, switchMap } from "rxjs"
import { UserService } from "@watari/user/domain"
import { hasProperty } from "@watari/shared/util-common"
import { RiRoutes } from "@watari/shared/util-router"
import { RxIf } from "@rx-angular/template/if"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"
import { CategoriesService } from "@watari/category/domain"

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
  imports: [ RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule, TuiThemeNightModule, TuiTabBarModule, TuiPortalModule, TuiButtonModule, TuiActiveZoneModule, RxIf, TuiDropdownModule, TuiDataListModule ],
  selector: "ri-root",
  templateUrl: "./app.component.html",
  styleUrls: [ "./app.component.css" ],
  providers: [ { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer } ]
})
export class AppComponent {
  protected isAppTabBarEnabled: Observable<boolean> = this.router.events.pipe(
    filter((event): event is ActivationEnd => event instanceof ActivationEnd),
    map((event) => {
      if(hasProperty<{
        enableAppTabBar: boolean
      }>(event.snapshot.data, "enableAppTabBar")) {
        return event.snapshot.data.enableAppTabBar
      }

      return false
    })
  )

  public opened: boolean = false

  constructor(private readonly userService: UserService,
              private readonly router: Router,
              @Inject(DATABASE_CONNECTION)
              private readonly databaseConnection: DatabaseConnection,
              private readonly categoryService: CategoriesService) {
    this.databaseConnection.database.execA("select * from categories where name in ('Одежда', 'ЖКХ', 'Транспорт', 'Продукты', 'Еда вне дома')")
      .then((rows) => {
        if (rows.length > 0) {
          return
        }

        const now: string = new Date().toISOString()
        userService.getAuthedUser().pipe(
          switchMap((user) => {
            if (user === null) {
              return EMPTY
            }

            return forkJoin([
              categoryService.create({
                id: crypto.randomUUID(),
                createTime: now,
                name: "Одежда",
                icon: "twemoji::t-shirt",
                userId: user.id
              }),
              categoryService.create({
                id: crypto.randomUUID(),
                createTime: now,
                name: "ЖКХ",
                icon: "twemoji::hot-springs",
                userId: user.id
              }),
              categoryService.create({
                id: crypto.randomUUID(),
                createTime: now,
                name: "Транспорт",
                icon: "twemoji::bus",
                userId: user.id
              }),
              categoryService.create({
                id: crypto.randomUUID(),
                createTime: now,
                name: "Продукты",
                icon: "twemoji::red-apple",
                userId: user.id
              }),
              categoryService.create({
                id: crypto.randomUUID(),
                createTime: now,
                name: "Еда вне дома",
                icon: "twemoji::fork-and-knife",
                userId: user.id
              })
            ])
          })
        ).subscribe()
      })
  }

  public onClickLogoutButton(): void {
    this.userService.setAuthedUser(null)
    this.router.navigateByUrl(RiRoutes.login)
  }
}
