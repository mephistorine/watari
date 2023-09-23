import { Inject, Injectable } from "@angular/core"
import { catchError, defer, from, map, Observable, of, tap } from "rxjs"
import { METAMASK_PROVIDER, MetamaskProvider } from "@watari/shared/util-metamask"
import { LOCAL_STORAGE } from "@ng-web-apis/common"

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(@Inject(METAMASK_PROVIDER)
              private readonly metamaskProvider: MetamaskProvider,
              @Inject(LOCAL_STORAGE)
              private readonly localStorage: Storage) {
  }

  public loginWithMetamask(): Observable<string | null> {
    return defer(() => {
      const idFromLocalStorage: string | null = this.localStorage.getItem("user_id")

      if (idFromLocalStorage !== null) {
        return of(idFromLocalStorage)
      }

      return from(this.metamaskProvider.request<readonly string[]>({
        method: "eth_requestAccounts",
        params: []
      })).pipe(
        map((ids) => {
          if(ids === null || typeof ids === "undefined") {
            return null
          }

          return ids[ 0 ] as string
        }),
        tap((id) => {
          if (id !== null) {
            this.localStorage.setItem("user_id", id)
          }
        }),
        catchError((error) => {
          console.debug(error)

          if ("code" in error && error.code === 4001) {
            return of(null)
          }

          return of(null)
        })
      )
    })
  }
}
