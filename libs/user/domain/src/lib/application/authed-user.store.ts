import { Injectable } from "@angular/core"
import { RxState } from "@rx-angular/state"
import { Observable } from "rxjs"

import { User } from "../entities/user.entity"

type AuthedUserState = {
  user: User | null
}

@Injectable({
  providedIn: "root"
})
export class AuthedUserStore extends RxState<AuthedUserState> {
  constructor() {
    super()
    this.set({
      user: null
    })

    this.select().subscribe(console.debug)
  }

  public setUser(user: User | null): void {
    this.set({ user })
  }

  public getUser(): Observable<User | null> {
    return this.select("user")
  }
}
