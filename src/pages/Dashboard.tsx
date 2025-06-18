import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Coins,
  Award,
  Eye,
  ArrowUpRight,
  Globe,
  Zap
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useAppStore } from '../store/appStore'
import { useStory } from '../hooks/useStory'
import { useDeBridge } from '../hooks/useDeBridge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { formatNumber, formatEther, formatAddress } from '../utils/formatters'

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 1200, reports: 45 },
  { month: 'Feb', revenue: 1900, reports: 62 },
  { month: 'Mar', revenue: 2100, reports: 78 },
  { month: 'Apr', revenue: 2400, reports: 89 },
  { month: 'May', revenue: 2800, reports: 105 },
  { month: 'Jun', revenue: 3200, reports: 123 },
]

const violationTypes = [
  { name: 'Copyright Infringement', value: 35, color: '#ef4444' },
  { name: 'Plagiarism', value: 25, color: '#f97316' },
  { name: 'Unauthorized Use', value: 20, color: '#eab308' },
  { name: 'AI Generated Fraud', value: 15, color: '#22c55e' },
  { name: 'Other', value: 5, color: '#6366f1' },
]

const recentActivity = [
  {
    id: '1',
    type: 'report',
    title: 'New IP violation reported',
    description: 'Unauthorized use of artwork detected',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: '2',
    type: 'reward',
    title: 'Voting reward earned',
    description: 'Earned 50 tokens for accurate voting',
    time: '4 hours ago',
    status: 'completed',
  },
  {
    id: '3',
    type: 'license',
    title: 'License minted',
    description: 'Commercial license purchased for IP #1234',
    time: '6 hours ago',
    status: 'completed',
  },
]

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { user, stats, ipAssets, reports } = useAppStore()
  const { isInitialized: storyInitialized } = useStory()
  const { isInitialized: deBridgeInitialized, crossChainPayments } = useDeBridge()
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')

  // Mock stats when no real data
  const mockStats = {
    totalIPAssets: 1247,
    totalReports: 389,
    resolvedReports: 342,
    totalStaked: BigInt('12456780000000000000000'), // 12,456.78 tokens
    totalRewarded: BigInt('3847230000000000000000'), // 3,847.23 tokens
    activeUsers: 8942,
    crossChainTransactions: 156,
  }

  const currentStats = stats.totalIPAssets > 0 ? stats : mockStats

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={cardVariants} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Welcome to IP Guardian
            </h1>
            <p className="text-blue-100 text-lg mb-4">
              {isConnected 
                ? `Welcome back, ${user?.username || formatAddress(address)}!`
                : 'Connect your wallet to start protecting your intellectual property'
              }
            </p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${storyInitialized ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm text-white font-medium">Story Protocol</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${deBridgeInitialized ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm text-white font-medium">deBridge Network</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Shield className="h-24 w-24 text-white/20" />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={cardVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total IP Assets</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(currentStats.totalIPAssets)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reports Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(currentStats.resolvedReports)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Resolution rate: </span>
            <span className="text-green-600 font-medium ml-1">
              {Math.round((currentStats.resolvedReports / currentStats.totalReports) * 100)}%
            </span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staked</p>
              <p className="text-2xl font-bold text-gray-900">{formatEther(currentStats.totalStaked, 0)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+8.2%</span>
            <span className="text-gray-500 ml-1">APY</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cross-Chain Txs</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(currentStats.crossChainTransactions)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Zap className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-blue-600 font-medium">Avg 2.3s</span>
            <span className="text-gray-500 ml-1">finality</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <motion.div variants={cardVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue & Reports</h3>
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="reports" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Violation Types Chart */}
        <motion.div variants={cardVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Violation Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={violationTypes}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {violationTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div variants={cardVariants} className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'report' ? 'bg-red-100' :
                  activity.type === 'reward' ? 'bg-green-100' :
                  'bg-blue-100'
                }`}>
                  {activity.type === 'report' ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : activity.type === 'reward' ? (
                    <Award className="h-5 w-5 text-green-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={cardVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-left">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <div>
                  <div className="font-medium">Register New IP</div>
                  <div className="text-sm text-primary-100">Protect your intellectual property</div>
                </div>
              </div>
            </button>

            <button className="w-full bg-white border-2 border-gray-200 hover:border-primary-300 p-4 rounded-lg transition-all duration-200 text-left">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <div className="font-medium text-gray-900">Report Violation</div>
                  <div className="text-sm text-gray-500">Submit a new IP violation report</div>
                </div>
              </div>
            </button>

            <button className="w-full bg-white border-2 border-gray-200 hover:border-primary-300 p-4 rounded-lg transition-all duration-200 text-left">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <div>
                  <div className="font-medium text-gray-900">Stake Tokens</div>
                  <div className="text-sm text-gray-500">Earn rewards by staking</div>
                </div>
              </div>
            </button>

            <button className="w-full bg-white border-2 border-gray-200 hover:border-primary-300 p-4 rounded-lg transition-all duration-200 text-left">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium text-gray-900">Cross-Chain Transfer</div>
                  <div className="text-sm text-gray-500">Send payments across chains</div>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}