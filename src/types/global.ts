import type { Address } from 'viem'

// Utility function for formatting ether with decimals
export function formatEtherWithDecimals(value: bigint, decimals: number = 4): string {
  const etherValue = Number(value) / 1e18
  return etherValue.toFixed(decimals)
}

export interface IPAsset {
  id: string
  tokenId: string
  nftContract: Address
  metadataUri: string
  owner: Address
  title: string
  description: string
  imageUrl: string
  category: string
  tags: string[]
  registrationDate: Date
  licenseTerms?: LicenseTerms[]
  royaltyTokens?: number
  reports?: IPReport[]
  attestations?: IPAttestation[]
  crossChainData?: CrossChainData
}

export interface LicenseTerms {
  id: string
  transferable: boolean
  commercialUse: boolean
  commercialRevShare: number
  derivativesAllowed: boolean
  expiration: number
  currency: Address
  defaultMintingFee: bigint
}

export interface IPReport {
  evidence: any
  id: string
  reporterAddress: Address
  reportedIPId: string
  violationType: ViolationType
  description: string
  evidenceUrls: string[]
  status: ReportStatus
  votes: ReportVote[]
  stakedAmount: bigint
  createdAt: Date
  resolvedAt?: Date
  crossChainPayment?: CrossChainPayment
}

export interface ReportVote {
  id: string
  voterAddress: Address
  reportId: string
  vote: boolean // true for valid, false for invalid
  stakedAmount: bigint
  reasoning?: string
  createdAt: Date
}

export interface IPAttestation {
  id: string
  attestorAddress: Address
  ipAssetId: string
  attestationType: AttestationType
  score: number
  metadata: string
  createdAt: Date
}

export interface CrossChainData {
  sourceChain: string
  targetChains: string[]
  bridgeTransactions: string[]
  royaltyDistribution: RoyaltyDistribution[]
}

export interface CrossChainPayment {

  metadata: any
  txHash: string
  sourceChain: string
  targetChain: string
  amount: bigint
  token: Address
  recipient: Address
  status: PaymentStatus
}

export interface RoyaltyDistribution {
  chain: string
  amount: bigint
  recipients: Address[]
  percentages: number[]
}

export interface UserProfile {
  address: Address
  username?: string
  email?: string
  avatar?: string
  reputation: number
  totalReports: number
  successfulReports: number
  totalVotes: number
  accurateVotes: number
  stakedTokens: bigint
  earnedRewards: bigint
  createdAt: Date
  socialAccounts?: SocialAccount[]
}

export interface SocialAccount {
  platform: 'twitter' | 'discord' | 'telegram' | 'email'
  handle: string
  verified: boolean
}

export interface PlatformStats {
  totalIPAssets: number
  totalReports: number
  resolvedReports: number
  totalStaked: bigint
  totalRewarded: bigint
  activeUsers: number
  crossChainTransactions: number
}

export enum ViolationType {
  UNAUTHORIZED_USE = 'unauthorized_use',
  PLAGIARISM = 'plagiarism',
  COPYRIGHT_INFRINGEMENT = 'copyright_infringement',
  TRADEMARK_VIOLATION = 'trademark_violation',
  DEEPFAKE = 'deepfake',
  AI_GENERATED_FRAUD = 'ai_generated_fraud',
  MEME_THEFT = 'meme_theft',
  UNLICENSED_REPOST = 'unlicensed_repost'
}

export enum ReportStatus {
  PENDING = 'pending',
  VOTING = 'voting',
  UNDER_REVIEW = 'under_review',
  RESOLVED_VALID = 'resolved_valid',
  RESOLVED_INVALID = 'resolved_invalid',
  ESCALATED = 'escalated',
  DISPUTED = 'disputed'
}

export enum AttestationType {
  AUTHENTICITY = 'authenticity',
  QUALITY = 'quality',
  ORIGINALITY = 'originality',
  COMPLIANCE = 'compliance'
}

export enum PaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface SearchFilters {
  category?: string
  tags?: string[]
  owner?: Address
  dateRange?: {
    start: Date
    end: Date
  }
  reportStatus?: ReportStatus[]
  violationType?: ViolationType[]
  minStake?: bigint
  maxStake?: bigint
}

export interface NotificationPreferences {
  email: boolean
  inApp: boolean
  discord: boolean
  telegram: boolean
  reportUpdates: boolean
  voteUpdates: boolean
  rewardUpdates: boolean
  systemUpdates: boolean
}

export interface AIDetetionResult {
  confidence: number
  detectedViolations: ViolationType[]
  evidence: {
    similarImages?: string[]
    textMatches?: string[]
    metadataAnalysis?: any
  }
  recommendation: 'report' | 'investigate' | 'ignore'
}

export interface StakingPool {
  id: string
  name: string
  description: string
  minStake: bigint
  maxStake: bigint
  rewardRate: number
  totalStaked: bigint
  participants: number
  isActive: boolean
}

export interface Reward {
  id: string
  userId: Address
  type: 'report_reward' | 'vote_reward' | 'staking_reward' | 'referral_reward'
  amount: bigint
  token: Address
  description: string
  txHash?: string
  claimedAt?: Date
  createdAt: Date
}