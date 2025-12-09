import { type AppKitNetwork } from "@reown/appkit/networks";

export const HOODI_SCAN = "https://hoodi.etherscan.io/"

export const hoodi: AppKitNetwork = {
  id: 560048,
  name: 'Ethereum Hoodi',
  nativeCurrency: {
    name: 'Hoodi Token',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://ethereum-hoodi-rpc.publicnode.com'],
      webSocket: ['wss://ethereum-hoodi-rpc.publicnode.com'],
    },
    public: {
      http: ['https://ethereum-hoodi-rpc.publicnode.com'],
      webSocket: ['wss://ethereum-hoodi-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hoodi Explorer',
      url: HOODI_SCAN,
    },
  },
}
