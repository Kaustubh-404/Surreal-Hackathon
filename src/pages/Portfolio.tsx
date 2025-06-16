import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  TrendingUp, 
  Coins, 
  Award,
  Eye,
  Edit,
  Download,
  Share2,
  Calendar,
  ExternalLink,
  Plus,
  DollarSign,
  Activity,
  Users,
  Globe
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useAppStore } from '../store/appStore'
import { formatDate, formatEther, formatNumber } from '../utils/formatters'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import DeBridgeClaimModal from '../components/deBridgeModal'

// Mock data for demonstration
const mockPortfolioData = {
  totalAssets: 12,
  totalEarnings: BigInt('8750000000000000000'), // 8.75 tokens
  totalStaked: BigInt('5000000000000000000'), // 5 tokens
  reputation: 847,
  totalLicenses: 28,
  activeDisputes: 2,
  pendingRewards: BigInt('2500000000000000000'), // 2.5 tokens available to claim
}

const mockAssets = [
  {
    id: '1',
    title: 'Digital Art Collection #1',
    category: 'Art & Design',
    imageUrl: 'https://picsum.photos/300/200?random=1',
    registrationDate: new Date('2024-01-15'),
    earnings: BigInt('2500000000000000000'), // 2.5 tokens
    licenses: 8,
    views: 1247,
    status: 'active',
  },
  {
    id: '2',
    title: 'AI Music Composition',
    category: 'Music & Audio',
    imageUrl: 'https://picsum.photos/300/200?random=2',
    registrationDate: new Date('2024-02-10'),
    earnings: BigInt('1800000000000000000'), // 1.8 tokens
    licenses: 5,
    views: 892,
    status: 'active',
  },
  {
    id: '3',
    title: 'Photography Series',
    category: 'Photography',
    imageUrl: 'https://picsum.photos/300/200?random=3',
    registrationDate: new Date('2024-03-05'),
    earnings: BigInt('1200000000000000000'), // 1.2 tokens
    licenses: 3,
    views: 634,
    status: 'active',
  },
]

const earningsData = [
  { month: 'Jan', earnings: 0, licenses: 0 },
  { month: 'Feb', earnings: 2.5, licenses: 8 },
  { month: 'Mar', earnings: 4.3, licenses: 13 },
  { month: 'Apr', earnings: 6.8, licenses: 21 },
  { month: 'May', earnings: 7.9, licenses: 25 },
  { month: 'Jun', earnings: 8.75, licenses: 28 },
]

const categoryDistribution = [
  { name: 'Art & Design', value: 45, color: '#3b82f6' },
  { name: 'Music & Audio', value: 25, color: '#ef4444' },
  { name: 'Photography', value: 20, color: '#22c55e' },
  { name: 'Software & Code', value: 10, color: '#f59e0b' },
]

export default function Portfolio() {
  const { address, isConnected } = useAccount()
  const { user } = useAppStore()
  const [selectedTab, setSelectedTab] = useState<'assets' | 'earnings' | 'analytics'>('assets')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDeBridgeModal, setShowDeBridgeModal] = useState(false)

  const handleClaimRewards = () => {
    // Traditional claim logic here
    console.log('Claiming rewards normally...')
  }

  const handleClaimWithDeBridge = () => {
    setShowDeBridgeModal(true)
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to view your IP portfolio.
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
        <h1 className="text-3xl font-bold gradient-text mb-4">My IP Portfolio</h1>
        <p className="text-muted-foreground">
          Manage and monitor your intellectual property assets and earnings
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
              <p className="text-2xl font-bold text-foreground">{mockPortfolioData.totalAssets}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+2</span>
            <span className="text-muted-foreground ml-1">this month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground">
                {parseFloat(formatEther(mockPortfolioData.totalEarnings)).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+12.5%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Licenses</p>
              <p className="text-2xl font-bold text-foreground">{mockPortfolioData.totalLicenses}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <Award className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+3</span>
            <span className="text-muted-foreground ml-1">this week</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reputation</p>
              <p className="text-2xl font-bold text-foreground">{mockPortfolioData.reputation}</p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Users className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+45</span>
            <span className="text-muted-foreground ml-1">this month</span>
          </div>
        </div>
      </motion.div>

      {/* Rewards Section with deBridge Option */}
      {mockPortfolioData.pendingRewards > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Coins className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending Rewards</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {parseFloat(formatEther(mockPortfolioData.pendingRewards)).toFixed(2)} tokens
                </p>
                <p className="text-sm text-gray-600">Available to claim from your IP activities</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClaimRewards}
                className="btn btn-outline px-6 py-3"
              >
                <Award className="h-4 w-4 mr-2" />
                Claim Rewards
              </button>
              <button
                onClick={handleClaimWithDeBridge}
                className="btn btn-default px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Globe className="h-4 w-4 mr-2" />
                Claim with deBridge
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-b border-border mb-6"
      >
        <nav className="flex space-x-8">
          {[
            { id: 'assets', label: 'My Assets', icon: Shield },
            { id: 'earnings', label: 'Earnings', icon: TrendingUp },
            { id: 'analytics', label: 'Analytics', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {selectedTab === 'assets' && (
          <div>
            {/* Assets Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">IP Assets ({mockAssets.length})</h2>
              <div className="flex items-center space-x-2">
                <button className="btn btn-outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Register New IP
                </button>
              </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={asset.imageUrl}
                      alt={asset.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="badge badge-secondary">
                        {asset.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button className="btn btn-default btn-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="btn btn-default btn-sm">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{asset.title}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                        <p className="font-medium text-success-600">
                          {parseFloat(formatEther(asset.earnings)).toFixed(2)} tokens
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Licenses</p>
                        <p className="font-medium">{asset.licenses}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(asset.registrationDate)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {formatNumber(asset.views)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="btn btn-ghost btn-sm">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        asset.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-muted text-muted-foreground'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'earnings' && (
          <div className="space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-6">Earnings Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Earnings (tokens)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-4">
                  {[
                    { type: 'License Purchase', amount: '+0.5', date: '2024-03-21', from: 'Creative Agency' },
                    { type: 'Royalty Payment', amount: '+0.25', date: '2024-03-20', from: 'Derivative Work' },
                    { type: 'License Purchase', amount: '+1.0', date: '2024-03-19', from: 'Tech Startup' },
                  ].map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{tx.type}</p>
                        <p className="text-xs text-muted-foreground">from {tx.from}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-success-600">{tx.amount} tokens</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Earnings by Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Total Views</h3>
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">12,847</p>
                <p className="text-sm text-success-600 mt-2">+8.3% from last month</p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">License Conversion</h3>
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">2.18%</p>
                <p className="text-sm text-success-600 mt-2">+0.4% from last month</p>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Avg. License Value</h3>
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">0.31 tokens</p>
                <p className="text-sm text-error-600 mt-2">-5.2% from last month</p>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-6">Performance Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-success-50 border border-success-200 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-success-800">Growing Interest</h4>
                    <p className="text-sm text-success-700">
                      Your digital art pieces are seeing increased engagement this month.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                  <Activity className="h-5 w-5 text-warning-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-warning-800">Optimization Opportunity</h4>
                    <p className="text-sm text-warning-700">
                      Consider adjusting license terms for your photography series to increase conversion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Protection Status</h4>
                    <p className="text-sm text-primary/80">
                      All your IP assets are properly protected and monitored for violations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Cross-Chain Opportunities</h4>
                    <p className="text-sm text-blue-700">
                      Your rewards can be claimed across multiple blockchains using deBridge for better liquidity and trading options.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* deBridge Claim Modal */}
      <DeBridgeClaimModal
        isOpen={showDeBridgeModal}
        onClose={() => setShowDeBridgeModal(false)}
        rewardAmount={mockPortfolioData.pendingRewards}
        rewardToken="IP"
        title="Claim Rewards with deBridge"
      />
    </div>
  )
}