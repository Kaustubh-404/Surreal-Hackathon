import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  IPAsset, 
  IPReport, 
  UserProfile, 
  PlatformStats, 
  NotificationPreferences,
  Reward,
  CrossChainPayment 
} from '../types/global'


interface AppState {
  // User state
  user: UserProfile | null
  notifications: NotificationPreferences
  rewards: Reward[]
  
  // IP Assets
  ipAssets: IPAsset[]
  myIPAssets: IPAsset[]
  
  // Reports
  reports: IPReport[]
  myReports: IPReport[]
  
  // Platform stats
  stats: PlatformStats
  
  // Cross-chain payments
  crossChainPayments: CrossChainPayment[]
  
  // UI state
  isLoading: boolean
  error: string | null
  selectedIPAsset: IPAsset | null
  
  // Filters and search
  searchQuery: string
  selectedFilters: {
    category?: string
    tags?: string[]
    reportStatus?: string[]
    violationType?: string[]
  }
}

interface AppActions {
  // User actions
  setUser: (user: UserProfile | null) => void
  updateUserProfile: (updates: Partial<UserProfile>) => void
  setNotifications: (notifications: NotificationPreferences) => void
  addReward: (reward: Reward) => void
  
  // IP Asset actions
  setIPAssets: (assets: IPAsset[]) => void
  addIPAsset: (asset: IPAsset) => void
  updateIPAsset: (id: string, updates: Partial<IPAsset>) => void
  setMyIPAssets: (assets: IPAsset[]) => void
  setSelectedIPAsset: (asset: IPAsset | null) => void
  
  // Report actions
  setReports: (reports: IPReport[]) => void
  addReport: (report: IPReport) => void
  updateReport: (id: string, updates: Partial<IPReport>) => void
  setMyReports: (reports: IPReport[]) => void
  
  // Platform stats
  setStats: (stats: PlatformStats) => void
  updateStats: (updates: Partial<PlatformStats>) => void
  
  // Cross-chain payments
  setCrossChainPayments: (payments: CrossChainPayment[]) => void
  addCrossChainPayment: (payment: CrossChainPayment) => void
  updateCrossChainPayment: (txHash: string, updates: Partial<CrossChainPayment>) => void
  
  // UI actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: AppState['selectedFilters']) => void
  
  // Utility actions
  reset: () => void
}

const initialState: AppState = {
  user: null,
  notifications: {
    email: true,
    inApp: true,
    discord: false,
    telegram: false,
    reportUpdates: true,
    voteUpdates: true,
    rewardUpdates: true,
    systemUpdates: true,
  },
  rewards: [],
  ipAssets: [],
  myIPAssets: [],
  reports: [],
  myReports: [],
  stats: {
    totalIPAssets: 0,
    totalReports: 0,
    resolvedReports: 0,
    totalStaked: 0n,
    totalRewarded: 0n,
    activeUsers: 0,
    crossChainTransactions: 0,
  },
  crossChainPayments: [],
  isLoading: false,
  error: null,
  selectedIPAsset: null,
  searchQuery: '',
  selectedFilters: {},
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User actions
      setUser: (user) => set({ user }),
      
      updateUserProfile: (updates) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, ...updates } : null 
        })),
      
      setNotifications: (notifications) => set({ notifications }),
      
      addReward: (reward) => 
        set((state) => ({ 
          rewards: [reward, ...state.rewards] 
        })),

      // IP Asset actions
      setIPAssets: (ipAssets) => set({ ipAssets }),
      
      addIPAsset: (asset) => 
        set((state) => ({ 
          ipAssets: [asset, ...state.ipAssets] 
        })),
      
      updateIPAsset: (id, updates) => 
        set((state) => ({
          ipAssets: state.ipAssets.map(asset => 
            asset.id === id ? { ...asset, ...updates } : asset
          ),
          myIPAssets: state.myIPAssets.map(asset => 
            asset.id === id ? { ...asset, ...updates } : asset
          ),
        })),
      
      setMyIPAssets: (myIPAssets) => set({ myIPAssets }),
      
      setSelectedIPAsset: (selectedIPAsset) => set({ selectedIPAsset }),

      // Report actions
      setReports: (reports) => set({ reports }),
      
      addReport: (report) => 
        set((state) => ({ 
          reports: [report, ...state.reports] 
        })),
      
      updateReport: (id, updates) => 
        set((state) => ({
          reports: state.reports.map(report => 
            report.id === id ? { ...report, ...updates } : report
          ),
          myReports: state.myReports.map(report => 
            report.id === id ? { ...report, ...updates } : report
          ),
        })),
      
      setMyReports: (myReports) => set({ myReports }),

      // Platform stats
      setStats: (stats) => set({ stats }),
      
      updateStats: (updates) => 
        set((state) => ({ 
          stats: { ...state.stats, ...updates } 
        })),

      // Cross-chain payments
      setCrossChainPayments: (crossChainPayments) => set({ crossChainPayments }),
      
      addCrossChainPayment: (payment) => 
        set((state) => ({ 
          crossChainPayments: [payment, ...state.crossChainPayments] 
        })),
      
      updateCrossChainPayment: (txHash, updates) => 
        set((state) => ({
          crossChainPayments: state.crossChainPayments.map(payment => 
            payment.txHash === txHash ? { ...payment, ...updates } : payment
          ),
        })),

      // UI actions
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      setFilters: (selectedFilters) => set({ selectedFilters }),

      // Utility actions
      reset: () => set(initialState),
    }),
    {
      name: 'ip-guardian-store',
      partialize: (state) => ({
        user: state.user,
        notifications: state.notifications,
        myIPAssets: state.myIPAssets,
        myReports: state.myReports,
        selectedFilters: state.selectedFilters,
      }),
    }
  )
)