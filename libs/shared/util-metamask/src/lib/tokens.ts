import { InjectionToken } from "@angular/core"
import { MetaMaskSDK } from "@metamask/sdk"

import { MetamaskProvider } from "./types"

export const METAMASK_INSTANCE: InjectionToken<MetaMaskSDK> = new InjectionToken<MetaMaskSDK>("__METAMASK_INSTANCE__")

export const METAMASK_PROVIDER: InjectionToken<MetamaskProvider> = new InjectionToken<MetamaskProvider>("__METAMASK_PROVIDER__")
