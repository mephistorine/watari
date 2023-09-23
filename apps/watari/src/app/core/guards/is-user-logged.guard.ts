import { CanActivateFn, Router } from "@angular/router"
import { inject } from "@angular/core"
import { map, of, switchMap } from "rxjs"
import { User, UserService } from "@watari/user/domain"
import { LOCAL_STORAGE } from "@ng-web-apis/common"
import { RiStorageKey } from "@watari/shared/util-common"
import { RiRoutes } from "@watari/shared/util-router"

export const IS_USER_LOGGED_GUARD: CanActivateFn = () => {
  const userService: UserService = inject(UserService)
  const router: Router = inject(Router)
  const localStorage: Storage = inject(LOCAL_STORAGE)

  return userService.getAuthedUser().pipe(
    switchMap((user) => {
      if(user === null) {
        return of(localStorage.getItem(RiStorageKey.loggedUserId)).pipe(
          switchMap((id: string | null) => {
            if(id === null) {
              return of(router.parseUrl(RiRoutes.login))
            }

            return userService.findOneById(id).pipe(
              map((authUser: User | null) => {
                if(authUser === null) {
                  return router.parseUrl(RiRoutes.login)
                }

                userService.setAuthedUser(authUser)
                return true
              })
            )
          })
        )
      }

      return of(true)
    })
  )
}
