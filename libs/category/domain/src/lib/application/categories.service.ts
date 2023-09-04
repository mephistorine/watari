import { Inject, Injectable } from "@angular/core"
import { DATABASE_CONNECTION, DatabaseConnection } from "@watari/shared/util-database"
import { defer, from, map, Observable } from "rxjs"
import { isUndefined } from "@watari/shared/util-common"

import { Category } from "../entities/category.entity"
import { CategoryProps } from "../entities/category.props"

@Injectable({
  providedIn: "root"
})
export class CategoriesService {
  constructor(@Inject(DATABASE_CONNECTION)
              private readonly databaseConnection: DatabaseConnection) {
  }

  public findOneById(id: string): Observable<Category | null> {
    return defer(() => {
      return from(this.databaseConnection.database.execO<CategoryProps>("SELECT * FROM categories WHERE id = ?", [ id ])).pipe(
        map((items) => {
          const category: CategoryProps | undefined = items[ 0 ]

          if(isUndefined(category)) {
            return null
          }

          return {
            id: category.id,
            name: category.name,
            createTime: category.create_time,
            userId: category.user_id,
            icon: category.icon
          }
        })
      )
    })
  }

  public findAll(): Observable<readonly Category[]> {
    return defer(() => {
      return from(this.databaseConnection.database.execO<CategoryProps>("SELECT * FROM categories")).pipe(
        map((categories: readonly CategoryProps[]) => {
          return categories.map((category) => {
            return {
              id: category.id,
              name: category.name,
              createTime: category.create_time,
              userId: category.user_id,
              icon: category.icon
            }
          })
        })
      )
    })
  }

  public create(category: Category): Observable<Category> {
    return defer(() => {
      return from(this.databaseConnection.database.execO<CategoryProps>(
        "INSERT INTO categories (id, name, create_time, user_id, icon) VALUES (?, ?, ?, ?, ?) RETURNING *",
        [ category.id, category.name, category.createTime, category.userId, category.icon ]
      )).pipe(
        map((items) => {
          const category: CategoryProps | undefined = items[ 0 ]

          if(isUndefined(category)) {
            throw new Error("When category created it must be returned")
          }

          return {
            id: category.id,
            name: category.name,
            createTime: category.create_time,
            userId: category.user_id,
            icon: category.icon
          }
        })
      )
    })
  }
}
