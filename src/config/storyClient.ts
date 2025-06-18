// src/config/storyClient.ts - Fixed implementation with proper wallet handling
import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk'
import { http, createWalletClient, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ENV } from './env'

// Define the Story Aeneid testnet chain
export const storyAeneidTestnet = {
  id: 1315,
  name: 'Story Aeneid Testnet',
  network: 'story-aeneid',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',
    symbol: 'IP',
  },
  rpcUrls: {
    default: {
      http: ['https://aeneid.storyrpc.io'],
    },
    public: {
      http: ['https://aeneid.storyrpc.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Story Aeneid Explorer',
      url: 'https://aeneid.explorer.story.foundation',
    },
  },
  testnet: true,
} as const

export class StoryClientManager {
  private static instance: StoryClientManager
  private client: StoryClient | null = null
  private publicClient: any = null
  private walletClient: any = null

  private constructor() {}

  public static getInstance(): StoryClientManager {
    if (!StoryClientManager.instance) {
      StoryClientManager.instance = new StoryClientManager()
    }
    return StoryClientManager.instance
  }

  public async initializeWithWallet(externalWalletClient?: any): Promise<StoryClient> {
    try {
      if (!ENV.RPC_PROVIDER_URL) {
        throw new Error('RPC_PROVIDER_URL is not configured')
      }

      let account
      const transport = http(ENV.RPC_PROVIDER_URL)

      if (externalWalletClient) {
        // FIXED: Properly extract account from external wallet client
        console.log('Using external wallet client:', externalWalletClient)
        
        // Get the account from the external wallet client
        account = externalWalletClient.account
        if (!account) {
          // Try to get accounts from the wallet client
          const accounts = await externalWalletClient.getAddresses?.() || 
                          await externalWalletClient.requestAddresses?.() ||
                          []
          
          if (accounts.length > 0) {
            account = { address: accounts[0] }
          } else {
            throw new Error('No account found in external wallet client')
          }
        }

        console.log('Using account from external wallet:', account)
      } else if (ENV.WALLET_PRIVATE_KEY) {
        // Use private key for backend operations
        account = privateKeyToAccount(`0x${ENV.WALLET_PRIVATE_KEY}` as `0x${string}`)
        console.log('Using private key account:', account.address)
      } else {
        throw new Error('No wallet or private key available')
      }

      // FIXED: Create a proper wallet client for Story SDK
      const walletClient = createWalletClient({
        chain: storyAeneidTestnet,
        transport,
        account,
      })

      const config: StoryConfig = {
        account: account.address || account,
        transport,
        chainId: 'aeneid',
      }

      this.client = StoryClient.newClient(config)
      this.walletClient = walletClient
      
      console.log('Story client initialized successfully with account:', account.address || account)
      return this.client
    } catch (error) {
      console.error('Failed to initialize Story client:', error)
      throw new Error(`Failed to initialize Story client: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  public async initializePublicClient(): Promise<any> {
    if (!this.publicClient) {
      if (!ENV.RPC_PROVIDER_URL) {
        throw new Error('RPC_PROVIDER_URL is not configured')
      }
      this.publicClient = createPublicClient({
        chain: storyAeneidTestnet,
        transport: http(ENV.RPC_PROVIDER_URL),
      })
    }
    return this.publicClient
  }

  public getClient(): StoryClient | null {
    return this.client
  }

  public getPublicClient(): any {
    return this.publicClient
  }

  public getWalletClient(): any {
    return this.walletClient
  }

  public reset(): void {
    this.client = null
    this.publicClient = null
    this.walletClient = null
  }

  // Helper method to check if client is properly initialized
  public isInitialized(): boolean {
    return this.client !== null && this.walletClient !== null
  }

  // Helper method to get current account address
  public getCurrentAccount(): string | null {
    try {
      // The account is stored in the client configuration, not in ipAccount
      return this.client ? (this.client as any).account?.address || null : null
    } catch (error) {
      console.error('Failed to get current account:', error)
      return null
    }
  }
}

export const storyClientManager = StoryClientManager.getInstance()

