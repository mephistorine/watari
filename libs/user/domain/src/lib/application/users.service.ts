import { inject, Injectable } from "@angular/core"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"
import { defer, from, map, Observable } from "rxjs"

import { UserMapper } from "../infrastructure/mappers/user.mapper"
import { User } from "../entities/user.entity"
import { UserProps } from "../entities/user.props"

@Injectable({
  providedIn: "root"
})
export class UsersService {
  private readonly mapper: UserMapper = new UserMapper()

  private readonly databaseConnection: DatabaseConnection = inject(DATABASE_CONNECTION)

  public findOneById(id: string): Observable<User | null> {
    return defer(() => from(this.databaseConnection.database.execO<UserProps>("SELECT * FROM users WHERE id = ?", [ id ])))
      .pipe(
        map((items) => this.mapper.mapTo(items[ 0 ]) ?? null)
      )
  }

  public create(user: User): Observable<any> {
    const userProps: UserProps = this.mapper.mapFrom(user)

    return defer(() => from(this.databaseConnection.database.execO(
      "INSERT INTO users (id, name, create_time) VALUES (?, ?, ?)",
      [ userProps.id, userProps.name, userProps.create_time ]
    )))
  }
}
