import './App.css'
import {WagmiProvider} from 'wagmi'
import {createAppKit} from '@reown/appkit/react'
import {generalConfig, queryClient} from './config/appConfig'
import {QueryClientProvider} from '@tanstack/react-query'
import {Toaster} from 'react-hot-toast';
import {wagmiAdapter} from './config'
import DAPPLayout from "./components/DAPPLayout";
import CreateProposalForm from "./components/CreateProposalForm";
import ProposalList from "./components/ProposalList";
import ProposalListener from "./components/ProposalListener";
import {AuthProvider} from "./context/AuthContext.tsx";

createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
})

export function AppKitProvider({children}: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export function App() {
  return (
    <AppKitProvider>
      <AuthProvider>
        <DAPPLayout>
          <div className="dashboard-content" style={{maxWidth: '800px', margin: '0 auto'}}>

            <h1 style={{marginBottom: '30px'}}>DAO Governance</h1>

            <CreateProposalForm/>

            <ProposalList/>
            <ProposalListener/>
          </div>
        </DAPPLayout>
        <Toaster position="bottom-right" reverseOrder={false}/>
      </AuthProvider>
    </AppKitProvider>
  )
}

export default App