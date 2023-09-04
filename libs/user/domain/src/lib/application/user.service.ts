import { inject, Injectable } from "@angular/core"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"
import { defer, from, map, Observable } from "rxjs"

import { UserMapper } from "../infrastructure/mappers/user.mapper"
import { User } from "../entities/user.entity"
import { UserProps } from "../entities/user.props"

import { AuthedUserStore } from "./authed-user.store"

@Injectable({
  providedIn: "root"
})
export class UserService {
  private readonly mapper: UserMapper = new UserMapper()

  private readonly databaseConnection: DatabaseConnection = inject(DATABASE_CONNECTION)

  private readonly authedUserStore: AuthedUserStore = inject(AuthedUserStore)

  public findOneById(id: string): Observable<User | null> {
    return defer(() => from(this.databaseConnection.database.execO<UserProps>("SELECT * FROM users WHERE id = ?", [ id ])))
      .pipe(
        map((items) => typeof items[ 0 ] === "undefined" ? null : this.mapper.mapTo(items[ 0 ]))
      )
  }

  public create(user: User): Observable<User> {
    const userProps: UserProps = this.mapper.mapFrom(user)

    return defer(() => from(this.databaseConnection.database.execO<UserProps>(
      "INSERT INTO users (id, name, create_time) VALUES (?, ?, ?) RETURNING *",
      [ userProps.id, userProps.name, userProps.create_time ]
    ))).pipe(
      map((items) => {
        const first: UserProps | undefined = items[ 0 ]

        if(typeof first === "undefined") {
          throw new Error("User must be returned")
        }

        return this.mapper.mapTo(first)
      })
    )
  }

  // FIXME: Нужно вынести информации об авторизованном пользователе в другое место
  public setAuthedUser(user: User | null): void {
    this.authedUserStore.setUser(user)
  }

  public getAuthedUser(): Observable<User | null> {
    return this.authedUserStore.getUser()
  }
}
