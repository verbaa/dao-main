import './App.css'
import {WagmiProvider} from 'wagmi'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {wagmiAdapter} from './config'
import WalletConnect from "./components/WalletConnect";

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>

        <div className="app-container">
          <h1>Hoodi DAO Interface</h1>

          <WalletConnect/>

        </div>

      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App