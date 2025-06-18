// src/store/appStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface User {
  id: string
  address: string
  username?: string
  email?: string
  avatar?: string
  reputation: number
  stakedTokens: bigint
  earnedRewards: bigint
  createdAt: Date
  lastActiveAt: Date
  profile?: {
    bio?: string
    website?: string
    twitter?: string
    discord?: string
  }
  preferences?: {
    notifications: boolean
    emailUpdates: boolean
    theme: 'light' | 'dark' | 'system'
    language: string
  }
  kyc?: {
    verified: boolean
    level: 'basic' | 'advanced'
    completedAt?: Date
  }
}

export interface IPAsset {
  id: string
  tokenId: string
  title: string
  description: string
  category: 'art' | 'music' | 'photo' | 'video' | 'document' | 'code' | 'other'
  ipfsHash: string
  metadataURI: string
  owner: string
  creator: string
  licenseTerms: {
    commercial: boolean
    derivatives: boolean
    attribution: boolean
    shareAlike: boolean
    revenueCap?: bigint
    royaltyRate?: number
  }
  royaltyPolicy: string
  registeredAt: Date
  lastUpdated: Date
  status: 'active' | 'disputed' | 'suspended'
  tags: string[]
  fileSize?: number
  mimeType?: string
  derivatives?: string[]
  parentIP?: string
  earnings: bigint
  views: number
  likes: number
}

export interface Report {
  id: string
  reporterAddress: string
  targetIPAsset: string
  violationType: 'copyright' | 'plagiarism' | 'unauthorized_use' | 'ai_fraud' | 'deepfake' | 'trademark' | 'other'
  description: string
  evidence: {
    urls: string[]
    screenshots: string[]
    documents: string[]
    metadata: Record<string, any>
  }
  submittedAt: Date
  status: 'pending' | 'under_review' | 'resolved' | 'rejected' | 'disputed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedValidator?: string
  validationDeadline?: Date
  votes: {
    validator: string
    decision: 'valid' | 'invalid' | 'needs_more_info'
    reasoning: string
    votedAt: Date
    stake: bigint
  }[]
  resolution?: {
    decision: 'upheld' | 'dismissed' | 'settled'
    reasoning: string
    compensation?: bigint
    resolvedAt: Date
    resolvedBy: string
  }
  rewards: {
    reporter: bigint
    validators: bigint
  }
}

export interface Reward {
  id: string
  type: 'validation' | 'reporting' | 'staking' | 'referral' | 'bonus'
  amount: bigint
  token: 'IP' | 'WIP'
  reason: string
  relatedEntity?: string // IP asset ID, report ID, etc.
  earnedAt: Date
  claimedAt?: Date
  txHash?: string
  multiplier?: number
  vestingPeriod?: number
  description: string
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  action?: {
    label: string
    url: string
  }
  read: boolean
  createdAt: Date
  expiresAt?: Date
  metadata?: Record<string, any>
}

export interface StakingPool {
  id: string
  name: string
  description: string
  type: 'validator' | 'guardian' | 'creator_support'
  totalStaked: bigint
  userStaked: bigint
  apy: number
  lockPeriod: number // in days
  minStake: bigint
  maxStake?: bigint
  active: boolean
  createdAt: Date
  lastRewardAt: Date
  pendingRewards: bigint
  slashingRisk: number // percentage
}

export interface CrossChainTransaction {
  id: string
  fromChain: string
  toChain: string
  fromToken: string
  toToken: string
  amount: bigint
  receivedAmount?: bigint
  status: 'pending' | 'processing' | 'completed' | 'failed'
  txHash?: string
  destinationTxHash?: string
  createdAt: Date
  completedAt?: Date
  estimatedTime: number
  fees: {
    bridge: bigint
    gas: bigint
    total: bigint
  }
  recipient: string
  metadata?: Record<string, any>
}

export interface AIAgent {
  id: string
  name: string
  description: string
  type: 'similarity_detection' | 'authenticity_verification' | 'content_moderation' | 'monitoring'
  provider: string
  accuracy: number
  pricing: {
    model: 'per_request' | 'subscription' | 'usage_based'
    cost: bigint
    currency: string
  }
  availability: 'available' | 'busy' | 'offline'
  features: string[]
  supportedFormats: string[]
  apiEndpoint: string
  lastUpdated: Date
  rating: number
  totalUsage: number
}

export interface AppStats {
  totalIPAssets: number
  totalReports: number
  resolvedReports: number
  totalStaked: bigint
  totalRewarded: bigint
  activeUsers: number
  crossChainTransactions: number
  totalValueLocked: bigint
  averageResolutionTime: number
  successRate: number
}

// App State Interface
interface AppState {
  // User
  user: User | null
  isConnected: boolean
  
  // Data
  ipAssets: IPAsset[]
  reports: Report[]
  rewards: Reward[]
  notifications: Notification[]
  stakingPools: StakingPool[]
  crossChainTxs: CrossChainTransaction[]
  aiAgents: AIAgent[]
  
  // UI State
  loading: boolean
  error: string | null
  
  // Stats
  stats: AppStats
  
  // Settings
  settings: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: boolean
    autoConnect: boolean
  }
}

// App Actions Interface
interface AppActions {
  // User actions
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  clearUser: () => void
  setConnected: (connected: boolean) => void
  
  // IP Asset actions
  addIPAsset: (asset: IPAsset) => void
  updateIPAsset: (id: string, updates: Partial<IPAsset>) => void
  removeIPAsset: (id: string) => void
  setIPAssets: (assets: IPAsset[]) => void
  
  // Report actions
  addReport: (report: Report) => void
  updateReport: (id: string, updates: Partial<Report>) => void
  setReports: (reports: Report[]) => void
  voteOnReport: (reportId: string, vote: Report['votes'][0]) => void
  
  // Reward actions
  addReward: (reward: Reward) => void
  claimReward: (id: string, txHash: string) => void
  setRewards: (rewards: Reward[]) => void
  
  // Notification actions
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  removeNotification: (id: string) => void
  
  // Staking actions
  setStakingPools: (pools: StakingPool[]) => void
  updateStakingPool: (id: string, updates: Partial<StakingPool>) => void
  stakeTokens: (poolId: string, amount: bigint) => void
  unstakeTokens: (poolId: string, amount: bigint) => void
  
  // Cross-chain actions
  addCrossChainTx: (tx: CrossChainTransaction) => void
  updateCrossChainTx: (id: string, updates: Partial<CrossChainTransaction>) => void
  setCrossChainTxs: (txs: CrossChainTransaction[]) => void
  
  // AI Agent actions
  setAIAgents: (agents: AIAgent[]) => void
  updateAIAgent: (id: string, updates: Partial<AIAgent>) => void
  
  // UI actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Stats actions
  updateStats: (stats: Partial<AppStats>) => void
  
  // Settings actions
  updateSettings: (settings: Partial<AppState['settings']>) => void
  
  // Utility actions
  reset: () => void
}

// Default state
const defaultState: AppState = {
  // User
  user: null,
  isConnected: false,
  
  // Data
  ipAssets: [],
  reports: [],
  rewards: [],
  notifications: [],
  stakingPools: [],
  crossChainTxs: [],
  aiAgents: [],
  
  // UI State
  loading: false,
  error: null,
  
  // Stats
  stats: {
    totalIPAssets: 0,
    totalReports: 0,
    resolvedReports: 0,
    totalStaked: BigInt(0),
    totalRewarded: BigInt(0),
    activeUsers: 0,
    crossChainTransactions: 0,
    totalValueLocked: BigInt(0),
    averageResolutionTime: 0,
    successRate: 0,
  },
  
  // Settings
  settings: {
    theme: 'system',
    language: 'en',
    notifications: true,
    autoConnect: true,
  },
}

// Create the store
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      // User actions
      setUser: (user) => set({ user, isConnected: true }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      clearUser: () => set({
        user: null,
        isConnected: false,
        rewards: [],
        notifications: [],
        ipAssets: [],
        reports: [],
        stakingPools: [],
        crossChainTxs: [],
        stats: defaultState.stats,
      }),
      
      setConnected: (connected) => set({ isConnected: connected }),
      
      // IP Asset actions
      addIPAsset: (asset) => set((state) => ({
        ipAssets: [...state.ipAssets, asset]
      })),
      
      updateIPAsset: (id, updates) => set((state) => ({
        ipAssets: state.ipAssets.map(asset => 
          asset.id === id ? { ...asset, ...updates } : asset
        )
      })),
      
      removeIPAsset: (id) => set((state) => ({
        ipAssets: state.ipAssets.filter(asset => asset.id !== id)
      })),
      
      setIPAssets: (assets) => set({ ipAssets: assets }),
      
      // Report actions
      addReport: (report) => set((state) => ({
        reports: [...state.reports, report]
      })),
      
      updateReport: (id, updates) => set((state) => ({
        reports: state.reports.map(report => 
          report.id === id ? { ...report, ...updates } : report
        )
      })),
      
      setReports: (reports) => set({ reports }),
      
      voteOnReport: (reportId, vote) => set((state) => ({
        reports: state.reports.map(report => 
          report.id === reportId 
            ? { ...report, votes: [...report.votes, vote] }
            : report
        )
      })),
      
      // Reward actions
      addReward: (reward) => set((state) => ({
        rewards: [...state.rewards, reward]
      })),
      
      claimReward: (id, txHash) => set((state) => ({
        rewards: state.rewards.map(reward => 
          reward.id === id 
            ? { ...reward, claimedAt: new Date(), txHash }
            : reward
        )
      })),
      
      setRewards: (rewards) => set({ rewards }),
      
      // Notification actions
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(notification => notification.id !== id)
      })),
      
      // Staking actions
      setStakingPools: (pools) => set({ stakingPools: pools }),
      
      updateStakingPool: (id, updates) => set((state) => ({
        stakingPools: state.stakingPools.map(pool => 
          pool.id === id ? { ...pool, ...updates } : pool
        )
      })),
      
      stakeTokens: (poolId, amount) => set((state) => ({
        stakingPools: state.stakingPools.map(pool => 
          pool.id === poolId 
            ? { 
                ...pool, 
                userStaked: pool.userStaked + amount,
                totalStaked: pool.totalStaked + amount 
              }
            : pool
        )
      })),
      
      unstakeTokens: (poolId, amount) => set((state) => ({
        stakingPools: state.stakingPools.map(pool => 
          pool.id === poolId 
            ? { 
                ...pool, 
                userStaked: pool.userStaked - amount,
                totalStaked: pool.totalStaked - amount 
              }
            : pool
        )
      })),
      
      // Cross-chain actions
      addCrossChainTx: (tx) => set((state) => ({
        crossChainTxs: [...state.crossChainTxs, tx]
      })),
      
      updateCrossChainTx: (id, updates) => set((state) => ({
        crossChainTxs: state.crossChainTxs.map(tx => 
          tx.id === id ? { ...tx, ...updates } : tx
        )
      })),
      
      setCrossChainTxs: (txs) => set({ crossChainTxs: txs }),
      
      // AI Agent actions
      setAIAgents: (agents) => set({ aiAgents: agents }),
      
      updateAIAgent: (id, updates) => set((state) => ({
        aiAgents: state.aiAgents.map(agent => 
          agent.id === id ? { ...agent, ...updates } : agent
        )
      })),
      
      // UI actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Stats actions
      updateStats: (statsUpdate) => set((state) => ({
        stats: { ...state.stats, ...statsUpdate }
      })),
      
      // Settings actions
      updateSettings: (settingsUpdate) => set((state) => ({
        settings: { ...state.settings, ...settingsUpdate }
      })),
      
      // Utility actions
      reset: () => set(defaultState),
    }),
    {
      name: 'ip-guardian-storage',
      partialize: (state) => ({
        user: state.user,
        rewards: state.rewards,
        notifications: state.notifications,
        settings: state.settings,
        ipAssets: state.ipAssets,
        stakingPools: state.stakingPools,
      }),
      // Custom serialization for BigInt values
      serialize: (state) => {
        return JSON.stringify(state, (key, value) =>
          typeof value === 'bigint' ? value.toString() + 'n' : value
        )
      },
      deserialize: (str) => {
        return JSON.parse(str, (key, value) => {
          if (typeof value === 'string' && value.endsWith('n')) {
            return BigInt(value.slice(0, -1))
          }
          return value
        })
      },
    }
  )
)

// Selectors for computed values
export const useUserRewards = () => {
  return useAppStore((state) => 
    state.rewards.filter(r => !r.claimedAt)
  )
}

export const useUnclaimedRewardsTotal = () => {
  return useAppStore((state) => 
    state.rewards
      .filter(r => !r.claimedAt)
      .reduce((total, reward) => total + reward.amount, BigInt(0))
  )
}

export const useUnreadNotifications = () => {
  return useAppStore((state) => 
    state.notifications.filter(n => !n.read)
  )
}

export const useUserIPAssets = () => {
  return useAppStore((state) => {
    const userAddress = state.user?.address
    return userAddress 
      ? state.ipAssets.filter(asset => asset.owner === userAddress)
      : []
  })
}

export const useUserReports = () => {
  return useAppStore((state) => {
    const userAddress = state.user?.address
    return userAddress 
      ? state.reports.filter(report => report.reporterAddress === userAddress)
      : []
  })
}

export const useActiveStakingPools = () => {
  return useAppStore((state) => 
    state.stakingPools.filter(pool => pool.active)
  )
}

export const usePendingCrossChainTxs = () => {
  return useAppStore((state) => 
    state.crossChainTxs.filter(tx => 
      tx.status === 'pending' || tx.status === 'processing'
    )
  )
}