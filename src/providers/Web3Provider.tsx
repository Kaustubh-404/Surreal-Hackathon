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
      throw new Error(`Missing required environment variables: ${envValidation.missingVars.join(', ')}`)
    }

    return getDefaultConfig({
      appName: ENV.APP_NAME,
      clientId: ENV.TOMO_CLIENT_ID!,
      projectId: ENV.WALLET_CONNECT_PROJECT_ID!,
      chains: [CHAIN_CONFIG.aeneid as any],
      ssr: false,
    })
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