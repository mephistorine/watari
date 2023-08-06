import { MetaMaskSDK } from "@metamask/sdk"

export type MetamaskProvider = ReturnType<MetaMaskSDK["getProvider"]>
