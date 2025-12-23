import './App.css'
import {WagmiProvider} from 'wagmi'
import {createAppKit} from '@reown/appkit/react'
import {generalConfig, queryClient} from './config/appConfig'
import {QueryClientProvider} from '@tanstack/react-query'
import {Toaster} from 'react-hot-toast';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import {wagmiAdapter} from './config'
import DAPPLayout from "./components/DAPPLayout";
import CreateProposalForm from "./components/CreateProposalForm";
import ProposalList from "./components/ProposalList";
import ProposalListener from "./components/ProposalListener";
import ProposalDetails from "./components/ProposalDetails";
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
        <BrowserRouter>
          <DAPPLayout>
            <div>
              <ProposalListener/>
              <Routes>
                <Route path="/" element={
                  <>
                    <CreateProposalForm/>
                    <ProposalList/>
                  </>
                }/>
                <Route path="/proposals/:id" element={<ProposalDetails/>}/>
              </Routes>
            </div>
          </DAPPLayout>
          <Toaster position="bottom-right" reverseOrder={false}/>
        </BrowserRouter>
      </AuthProvider>
    </AppKitProvider>
  )
}

export default App