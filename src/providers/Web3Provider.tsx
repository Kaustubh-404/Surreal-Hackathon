import '@tomo-inc/tomo-evm-kit/styles.css'
import { getDefaultConfig, TomoEVMKitProvider } from '@tomo-inc/tomo-evm-kit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { type ReactNode, useMemo } from 'react'
import { ENV, CHAIN_CONFIG, validateEnv } from '../config/env'

interface Web3ProvidersProps {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
})

export default function Web3Providers({ children }: Web3ProvidersProps) {
  const config = useMemo(() => {
    const envValidation = validateEnv()
    
    if (!envValidation.isValid) {
      console.error('Missing required environment variables:', envValidation.missingVars)
      // Don't throw error in development, just log it
      if (import.meta.env.PROD) {
        throw new Error(`Missing required environment variables: ${envValidation.missingVars.join(', ')}`)
      }
    }

    try {
      return getDefaultConfig({
        appName: ENV.APP_NAME,
        clientId: ENV.TOMO_CLIENT_ID || 'demo-client-id',
        projectId: ENV.WALLET_CONNECT_PROJECT_ID || 'demo-project-id',
        chains: [CHAIN_CONFIG.aeneid as any],
        ssr: false,
      })
    } catch (error) {
      console.error('Failed to create Wagmi config:', error)
      // Return a minimal config for development
      return getDefaultConfig({
        appName: 'IP Guardian Platform',
        clientId: 'demo-client-id',
        projectId: 'demo-project-id',
        chains: [CHAIN_CONFIG.aeneid as any],
        ssr: false,
      })
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TomoEVMKitProvider>
          {children}
        </TomoEVMKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}