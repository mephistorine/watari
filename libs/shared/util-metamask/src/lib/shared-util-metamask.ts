import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core"
import { MetaMaskSDK } from "@metamask/sdk"

import { METAMASK_INSTANCE, METAMASK_PROVIDER } from "./tokens"

export function provideMetamask(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: METAMASK_PROVIDER,
      useFactory: (metamask: MetaMaskSDK) => {
        return metamask.getProvider()
      },
      deps: [ METAMASK_INSTANCE ]
    }
  ])
}
