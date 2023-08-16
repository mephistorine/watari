import { inject, Injectable } from "@angular/core"
import { catchError, defer, from, map, Observable, of } from "rxjs"
import { METAMASK_PROVIDER, MetamaskProvider } from "@watari/shared/util-metamask"

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly metamaskProvider: MetamaskProvider = inject(METAMASK_PROVIDER)

  public loginWithMetamask(): Observable<string | null> {
    return defer(() => from(this.metamaskProvider.request<readonly string[]>({
      method: "eth_requestAccounts",
      params: []
    }))).pipe(
      map((ids) => {
        if(ids === null || typeof ids === "undefined") {
          return null
        }

        return ids[ 0 ] as string
      }),
      catchError((error) => {
        console.debug(error)

        if ("code" in error && error.code === 4001) {
          return of(null)
        }

        return of(null)
      })
    )
  }
}
