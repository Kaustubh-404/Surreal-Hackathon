import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Web3Providers from './providers/Web3Provider'
import Layout from "./components/Layout"
import Dashboard from './pages/Dashboard'
import DiscoverIP from './pages/DiscoverIP'
import RegisterIP from './pages/RegisterIP'
import Reports from './pages/Reports'
import Portfolio from './pages/Portfolio'
import Staking from './pages/Staking'
import CrossChain from './pages/CrossChain'
import AIAgents from './pages/AIAgent'
import Community from './pages/Community'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Help from './pages/Help'
import { useAppStore } from './store/appStore'
import { validateEnv } from './config/env'


function AppContent() {
  const { setError } = useAppStore()

  useEffect(() => {
    // Validate environment variables on app start
    const envValidation = validateEnv()
    if (!envValidation.isValid) {
      console.error('Missing required environment variables:', envValidation.missingVars)
      setError(`Configuration error: Missing ${envValidation.missingVars.join(', ')}`)
    }
  }, [setError])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/discover" element={<DiscoverIP />} />
          <Route path="/register" element={<RegisterIP />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/cross-chain" element={<CrossChain />} />
          <Route path="/ai-agents" element={<AIAgents />} />
          <Route path="/community" element={<Community />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </Layout>
    </Router>
  )
}

function App() {
  return (
    <Web3Providers>
      <AppContent />
    </Web3Providers>
  )
}

export default App