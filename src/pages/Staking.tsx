import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Coins, 
  Plus,
  Minus,
  Award,
  Clock,
  Shield,
  Zap,
  DollarSign,
  Target,
  Users,
  Activity
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { useAppStore } from '../store/appStore'
import { formatNumber, formatDate } from '../utils/formatters'
import toast from 'react-hot-toast'

interface StakingPool {
  id: string
  name: string
  description: string
  apy: number
  totalStaked: bigint
  minStake: bigint
  maxStake: bigint
  participants: number
  isActive: boolean
  lockPeriod: number // in days
  rewards: string[]
}

const stakingPools: StakingPool[] = [
  {
    id: 'validator',
    name: 'Validator Pool',
    description: 'Stake tokens to validate IP reports and earn rewards for accurate voting',
    apy: 12.5,
    totalStaked: BigInt('125000000000000000000000'), // 125,000 tokens
    minStake: BigInt('100000000000000000000'), // 100 tokens
    maxStake: BigInt('10000000000000000000000'), // 10,000 tokens
    participants: 847,
    isActive: true,
    lockPeriod: 30,
    rewards: ['Voting rewards', 'Report validation', 'Community reputation']
  },
  {
    id: 'guardian',
    name: 'IP Guardian Pool',
    description: 'Secure the network and monitor IP violations for higher rewards',
    apy: 18.2,
    totalStaked: BigInt('89000000000000000000000'), // 89,000 tokens
    minStake: BigInt('500000000000000000000'), // 500 tokens
    maxStake: BigInt('50000000000000000000000'), // 50,000 tokens
    participants: 234,
    isActive: true,
    lockPeriod: 90,
    rewards: ['Enhanced monitoring', 'Premium rewards', 'Governance rights']
  },
  {
    id: 'creator',
    name: 'Creator Support Pool',
    description: 'Support content creators and earn from successful IP registrations',
    apy: 8.7,
    totalStaked: BigInt('67000000000000000000000'), // 67,000 tokens
    minStake: BigInt('50000000000000000000'), // 50 tokens
    maxStake: BigInt('5000000000000000000000'), // 5,000 tokens
    participants: 1234,
    isActive: true,
    lockPeriod: 14,
    rewards: ['Creator incentives', 'Registration rewards', 'Platform growth']
  }
]

// Helper function to format ether with specific decimal places
const formatEtherWithDecimals = (value: bigint, decimals: number = 2): string => {
  const etherValue = formatEther(value)
  const num = parseFloat(etherValue)
  return num.toFixed(decimals)
}

// Helper function to format ether as integer
const formatEtherAsInteger = (value: bigint): string => {
  const etherValue = formatEther(value)
  const num = parseFloat(etherValue)
  return Math.floor(num).toString()
}

export default function Staking() {
  const { address, isConnected } = useAccount()
  const { user } = useAppStore()
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showUnstakeModal, setShowUnstakeModal] = useState(false)

  // Mock user staking data
  const userStakingData = {
    totalStaked: BigInt('2500000000000000000000'), // 2,500 tokens
    totalRewards: BigInt('187500000000000000000'), // 187.5 tokens
    stakingHistory: [
      { pool: 'Validator Pool', amount: BigInt('1000000000000000000000'), date: new Date('2024-01-15'), type: 'stake' },
      { pool: 'Guardian Pool', amount: BigInt('1500000000000000000000'), date: new Date('2024-02-10'), type: 'stake' },
      { pool: 'Validator Pool', amount: BigInt('75000000000000000000'), date: new Date('2024-03-05'), type: 'reward' },
    ]
  }

  const handleStake = async (pool: StakingPool) => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const amount = parseEther(stakeAmount)
      if (amount < pool.minStake) {
        toast.error(`Minimum stake is ${formatEther(pool.minStake)} tokens`)
        return
      }
      if (amount > pool.maxStake) {
        toast.error(`Maximum stake is ${formatEther(pool.maxStake)} tokens`)
        return
      }

      // In a real app, this would call the staking contract
      console.log('Staking', stakeAmount, 'tokens in', pool.name)
      toast.success(`Successfully staked ${stakeAmount} tokens!`)
      setShowStakeModal(false)
      setStakeAmount('')
    } catch (error) {
      console.error('Staking failed:', error)
      toast.error('Failed to stake tokens')
    }
  }

  const handleUnstake = async (pool: StakingPool) => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      // In a real app, this would call the unstaking contract
      console.log('Unstaking', unstakeAmount, 'tokens from', pool.name)
      toast.success(`Successfully unstaked ${unstakeAmount} tokens!`)
      setShowUnstakeModal(false)
      setUnstakeAmount('')
    } catch (error) {
      console.error('Unstaking failed:', error)
      toast.error('Failed to unstake tokens')
    }
  }

  const calculateRewards = (amount: string, apy: number) => {
    if (!amount) return '0'
    const amountNum = parseFloat(amount)
    const dailyReward = (amountNum * apy / 100) / 365
    return dailyReward.toFixed(4)
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to start staking and earning rewards.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4">Staking Pools</h1>
        <p className="text-muted-foreground">
          Stake your tokens to secure the network and earn rewards
        </p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Total Staked</p>
              <p className="text-2xl font-bold text-foreground">
                {formatEtherAsInteger(userStakingData.totalStaked)}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Coins className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+15.2%</span>
            <span className="text-muted-foreground ml-1">this month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Rewards</p>
              <p className="text-2xl font-bold text-foreground">
                {formatEtherWithDecimals(userStakingData.totalRewards, 2)}
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <Award className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <DollarSign className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+12.5</span>
            <span className="text-muted-foreground ml-1">tokens this week</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average APY</p>
              <p className="text-2xl font-bold text-foreground">13.1%</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <Target className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Activity className="h-4 w-4 text-warning-500 mr-1" />
            <span className="text-warning-600 font-medium">3 pools</span>
            <span className="text-muted-foreground ml-1">active</span>
          </div>
        </div>
      </motion.div>

      {/* Staking Pools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-semibold mb-6">Available Pools</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {stakingPools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{pool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pool.description}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pool.isActive ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                }`}>
                  {pool.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">APY</span>
                  <span className="text-sm font-medium text-success-600">{pool.apy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Staked</span>
                  <span className="text-sm font-medium">{formatNumber(Number(formatEtherAsInteger(pool.totalStaked)))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Participants</span>
                  <span className="text-sm font-medium">{formatNumber(pool.participants)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lock Period</span>
                  <span className="text-sm font-medium">{pool.lockPeriod} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Min/Max Stake</span>
                  <span className="text-sm font-medium">
                    {formatNumber(Number(formatEtherAsInteger(pool.minStake)))} - {formatNumber(Number(formatEtherAsInteger(pool.maxStake)))}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Rewards Include:</h4>
                <div className="space-y-1">
                  {pool.rewards.map((reward, idx) => (
                    <div key={idx} className="flex items-center text-xs text-muted-foreground">
                      <Zap className="h-3 w-3 mr-2 text-primary" />
                      {reward}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedPool(pool)
                    setShowStakeModal(true)
                  }}
                  className="btn btn-default btn-sm flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Stake
                </button>
                <button
                  onClick={() => {
                    setSelectedPool(pool)
                    setShowUnstakeModal(true)
                  }}
                  className="btn btn-outline btn-sm flex-1"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Unstake
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Staking History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-xl font-semibold mb-6">Staking History</h2>
        <div className="card p-6">
          <div className="space-y-4">
            {userStakingData.stakingHistory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'stake' ? 'bg-primary/10' : 'bg-success-100'
                  }`}>
                    {item.type === 'stake' ? (
                      <Plus className="h-4 w-4 text-primary" />
                    ) : (
                      <Award className="h-4 w-4 text-success-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {item.type === 'stake' ? 'Staked' : 'Reward'} in {item.pool}
                    </p>
                    <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    item.type === 'stake' ? 'text-foreground' : 'text-success-600'
                  }`}>
                    {item.type === 'stake' ? '' : '+'}{formatEtherWithDecimals(item.amount, 2)} tokens
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stake Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Stake in {selectedPool.name}</h2>
              <button
                onClick={() => setShowStakeModal(false)}
                className="btn btn-ghost btn-sm"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Amount to Stake</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="input w-full"
                  placeholder="Enter amount"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Min: {formatEther(selectedPool.minStake)} tokens</span>
                  <span>Max: {formatEther(selectedPool.maxStake)} tokens</span>
                </div>
              </div>

              {stakeAmount && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Estimated Rewards</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Daily:</span>
                      <span>{calculateRewards(stakeAmount, selectedPool.apy)} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly:</span>
                      <span>{(parseFloat(calculateRewards(stakeAmount, selectedPool.apy)) * 30).toFixed(4)} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>APY:</span>
                      <span className="text-success-600">{selectedPool.apy}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowStakeModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStake(selectedPool)}
                  disabled={!stakeAmount}
                  className="btn btn-default"
                >
                  Stake Tokens
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Unstake Modal */}
      {showUnstakeModal && selectedPool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Unstake from {selectedPool.name}</h2>
              <button
                onClick={() => setShowUnstakeModal(false)}
                className="btn btn-ghost btn-sm"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-warning-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-warning-800">Lock Period Notice</h4>
                    <p className="text-sm text-warning-700">
                      Unstaking may be subject to a {selectedPool.lockPeriod}-day lock period.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Amount to Unstake</label>
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="input w-full"
                  placeholder="Enter amount"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available: 1,000 tokens staked
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowUnstakeModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUnstake(selectedPool)}
                  disabled={!unstakeAmount}
                  className="btn btn-destructive"
                >
                  Unstake Tokens
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}