import { inject, Injectable } from "@angular/core"
import { from, map, Observable } from "rxjs"
import { METAMASK_PROVIDER, MetamaskProvider } from "@watari/shared/util-metamask"

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly metamaskProvider: MetamaskProvider = inject(METAMASK_PROVIDER)

  public loginWithMetamask(): Observable<string | null> {
    return from(this.metamaskProvider.request<readonly string[]>({
      method: "eth_requestAccounts",
      params: []
    })).pipe(
      map((ids) => {
        if(ids === null || typeof ids === "undefined") {
          return null
        }

        return ids[ 0 ] as string
      })
    )
  }
}
