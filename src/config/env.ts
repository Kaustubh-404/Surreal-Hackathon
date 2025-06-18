// Environment configuration with validation
export const ENV = {
  // Story Network
  RPC_PROVIDER_URL: import.meta.env.VITE_RPC_PROVIDER_URL || 'https://aeneid.storyrpc.io',
  STORY_CHAIN_ID: import.meta.env.VITE_STORY_CHAIN_ID || '1315',
  
  // Tomo SDK - Use fallback values for demo
  TOMO_CLIENT_ID: import.meta.env.VITE_TOMO_CLIENT_ID || 'demo_client_id',
  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'demo_project_id',
  
  // deBridge
  DEBRIDGE_API_KEY: import.meta.env.VITE_DEBRIDGE_API_KEY,
  DEBRIDGE_ENVIRONMENT: import.meta.env.VITE_DEBRIDGE_ENVIRONMENT || 'staging',
  
  // Application
  APP_NAME: import.meta.env.VITE_APP_NAME || 'IP Guardian Platform',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Community-powered IP protection platform',
  
  // Optional services
  PINATA_JWT: import.meta.env.VITE_PINATA_JWT,
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
  
  // Development flags
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const

// Validation function to check required environment variables
export function validateEnv(): { isValid: boolean; missingVars: string[] } {
  const optionalVars = [
    'VITE_TOMO_CLIENT_ID',
    'VITE_WALLET_CONNECT_PROJECT_ID',
  ]
  
  const missingVars = optionalVars.filter(varName => !import.meta.env[varName])
  
  // For demo purposes, we'll consider it valid even with missing vars
  return {
    isValid: true,
    missingVars,
  }
}

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  aeneid: {
    // Story Protocol Core Contracts
    IP_ASSET_REGISTRY: '0x28E59E91C0467e89fd0f0438D47Ca839cDfEc095',
    LICENSING_MODULE: '0x6ce880c269eB4C5Dab8b05F8B9659B1a2E3A5112',
    ROYALTY_MODULE: '0x8D5eD2A3eC46f85E5fb4a56e4cdB3a9ED7b6A2C7',
    DISPUTE_MODULE: '0xA7C1755eD45Ac83C0Ba8af99d2eBD1Ff0C4d2d4E',
    SPG_NFT_IMPL: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc',
    
    // Revenue Tokens
    WIP_TOKEN: '0x1514000000000000000000000000000000000000',
    IP_TOKEN: '0x1514000000000000000000000000000000000000',
    
    // Royalty Policies
    ROYALTY_POLICY_LAP: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E',
    
    // Platform-specific contracts (would be deployed)
    IP_GUARDIAN_PLATFORM: '0x0000000000000000000000000000000000000000', // To be deployed
    STAKING_POOL: '0x0000000000000000000000000000000000000000', // To be deployed
    REWARD_DISTRIBUTOR: '0x0000000000000000000000000000000000000000', // To be deployed
  },
  mainnet: {
    // Mainnet addresses would go here when available
  }
} as const

export const CHAIN_CONFIG = {
  aeneid: {
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
  },
} as const

// API endpoints
export const API_ENDPOINTS = {
  STORY_API: 'https://api.story.foundation',
  IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
  DEBRIDGE_API: ENV.DEBRIDGE_ENVIRONMENT === 'production' 
    ? 'https://api.debridge.finance' 
    : 'https://api-staging.debridge.finance',
} as const

// Feature flags
export const FEATURES = {
  AI_DETECTION: true,
  CROSS_CHAIN_PAYMENTS: true,
  SOCIAL_LOGIN: true,
  STAKING_POOLS: true,
  DISPUTE_ESCALATION: true,
  AUTOMATED_ROYALTIES: true,
} as const