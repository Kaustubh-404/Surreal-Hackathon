import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Shield,
  Globe,
  Activity,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { formatNumber, formatEther } from '../utils/formatters'

// Mock data for charts
const platformGrowthData = [
  { month: 'Jan', users: 1200, ipAssets: 890, reports: 45, resolved: 42 },
  { month: 'Feb', users: 1850, ipAssets: 1340, reports: 62, resolved: 58 },
  { month: 'Mar', users: 2400, ipAssets: 1890, reports: 78, resolved: 72 },
  { month: 'Apr', users: 3200, ipAssets: 2456, reports: 89, resolved: 85 },
  { month: 'May', users: 4100, ipAssets: 3123, reports: 105, resolved: 98 },
  { month: 'Jun', users: 5800, ipAssets: 4234, reports: 123, resolved: 119 },
]

const categoryData = [
  { name: 'Art & Design', value: 35, color: '#3b82f6' },
  { name: 'Music & Audio', value: 25, color: '#ef4444' },
  { name: 'Photography', value: 20, color: '#22c55e' },
  { name: 'Software & Code', value: 12, color: '#f59e0b' },
  { name: 'Writing', value: 8, color: '#8b5cf6' },
]

const revenueData = [
  { month: 'Jan', revenue: 12500, fees: 2100, royalties: 8900 },
  { month: 'Feb', revenue: 18900, fees: 3200, royalties: 13400 },
  { month: 'Mar', revenue: 24600, fees: 4100, royalties: 17800 },
  { month: 'Apr', revenue: 32100, fees: 5400, royalties: 23900 },
  { month: 'May', revenue: 41200, fees: 6800, royalties: 31200 },
  { month: 'Jun', revenue: 52800, fees: 8600, royalties: 39800 },
]

const crossChainData = [
  { chain: 'Ethereum', transactions: 1547, volume: 892000 },
  { chain: 'Polygon', transactions: 2341, volume: 456000 },
  { chain: 'BSC', transactions: 1892, volume: 234000 },
  { chain: 'Story', transactions: 3456, volume: 1234000 },
  { chain: 'Avalanche', transactions: 987, volume: 123000 },
]

export default function Analytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  const totalStats = {
    totalUsers: 8942,
    totalIPAssets: 4234,
    totalReports: 502,
    resolutionRate: 96.8,
    totalRevenue: BigInt('52800000000000000000000'), // 52,800 tokens
    crossChainTransactions: 10223,
    averageResponseTime: 23, // seconds
    platformGrowth: 24.5 // percentage
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-4">Platform Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into IP Guardian platform performance and metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="input"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="btn btn-outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(totalStats.totalUsers)}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+{totalStats.platformGrowth}%</span>
            <span className="text-muted-foreground ml-1">growth</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">IP Assets</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(totalStats.totalIPAssets)}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <Shield className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+18.7%</span>
            <span className="text-muted-foreground ml-1">this month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(Number(formatEther(totalStats.totalRevenue, 0)))}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+28.1%</span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
              <p className="text-2xl font-bold text-foreground">{totalStats.resolutionRate}%</p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Target className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600 font-medium">+2.1%</span>
            <span className="text-muted-foreground ml-1">improvement</span>
          </div>
        </div>
      </motion.div>

      {/* Main Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
      >
        {/* Platform Growth */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Platform Growth</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedMetric('users')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  selectedMetric === 'users' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setSelectedMetric('assets')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  selectedMetric === 'assets' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                Assets
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={platformGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={selectedMetric === 'users' ? 'users' : 'ipAssets'}
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Analysis */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="fees" stackId="a" fill="hsl(var(--primary))" />
              <Bar dataKey="royalties" stackId="a" fill="hsl(var(--secondary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Additional Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
      >
        {/* Category Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">IP Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cross-Chain Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Cross-Chain Activity</h3>
          <div className="space-y-4">
            {crossChainData.map((chain) => (
              <div key={chain.chain} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{chain.chain}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(chain.transactions)} transactions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${formatNumber(chain.volume)}</p>
                  <div className="w-16 bg-muted rounded-full h-2 mt-1">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(chain.volume / 1234000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Performance Metrics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Report Accuracy</span>
                <span className="text-sm font-bold">94.8%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '94.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm font-bold">23s avg</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '77%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">User Satisfaction</span>
                <span className="text-sm font-bold">4.7/5</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning-500 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Platform Uptime</span>
                <span className="text-sm font-bold">99.9%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{ width: '99.9%' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reports and Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-8"
      >
        <h2 className="text-xl font-semibold mb-6">Key Insights & Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
            <TrendingUp className="h-6 w-6 text-success-600 mb-3" />
            <h3 className="font-semibold text-success-800 mb-2">Growing Adoption</h3>
            <p className="text-sm text-success-700">
              Platform user growth has accelerated by 45% this quarter, with particularly strong adoption in the creative industries.
            </p>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <Shield className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-primary mb-2">Improved Protection</h3>
            <p className="text-sm text-primary/80">
              AI-powered detection systems have increased violation detection accuracy by 23% while reducing false positives.
            </p>
          </div>

          <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <Globe className="h-6 w-6 text-warning-600 mb-3" />
            <h3 className="font-semibold text-warning-800 mb-2">Cross-Chain Expansion</h3>
            <p className="text-sm text-warning-700">
              Multi-chain support has led to 156% increase in cross-chain transactions and broader platform accessibility.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}