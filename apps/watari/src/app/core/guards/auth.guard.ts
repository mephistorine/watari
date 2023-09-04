import { CanActivateFn, Router } from "@angular/router"
import { inject } from "@angular/core"
import { map, of, switchMap } from "rxjs"
import { User, UserService } from "@watari/user/domain"
import { AuthService } from "@watari/auth/domain"

export const IS_USER_LOGGED_GUARD: CanActivateFn = () => {
  const userService: UserService = inject(UserService)
  const router: Router = inject(Router)
  const authService: AuthService = inject(AuthService)

  return userService.getAuthedUser().pipe(
    switchMap((user) => {
      if(user === null) {
        return authService.loginWithMetamask().pipe(
          switchMap((id: string | null) => {
            if (id === null) {
              return of(router.parseUrl("/login"))
            }

            return userService.findOneById(id).pipe(
              map((authUser: User | null) => {
                if (authUser === null) {
                  return router.parseUrl("/login")
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
