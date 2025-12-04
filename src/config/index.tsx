import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { hoodi } from './customNetworks'

export const projectId = import.meta.env.VITE_PROJECT_ID || '2dd5dac505ae118c9403769987ff9a78'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// 2. Metadata
export const metadata = {
  name: 'Hoodi DAO',
  description: 'DAO Interaction App',
  url: 'https://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const networks = [hoodi, mainnet, sepolia] as [AppKitNetwork, ...AppKitNetwork[]];

// 4. Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// 5. Create AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  }
})