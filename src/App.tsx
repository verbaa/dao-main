import './App.css'
import {WagmiProvider} from 'wagmi'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {Toaster} from 'react-hot-toast';
import {wagmiAdapter} from './config'
import {AuthProvider} from './context/AuthContext'
import DAPPLayout from "./components/DAPPLayout";

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DAPPLayout>
            <div>
              <h2>Dashboard</h2>
            </div>
          </DAPPLayout>
          <Toaster position="bottom-right" reverseOrder={false}/>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App