import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Home,
  Shield,
  Search,
  FileText,
  TrendingUp,
  Users,
  Settings,
  HelpCircle,
  Zap,
  Globe,
  Award,
  Bot
} from 'lucide-react'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Home,
    description: 'Overview and stats'
  },
  { 
    name: 'Discover IP', 
    href: '/discover', 
    icon: Search,
    description: 'Find and explore IP assets'
  },
  { 
    name: 'Register IP', 
    href: '/register', 
    icon: Shield,
    description: 'Protect your intellectual property'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: FileText,
    description: 'Submit and review violation reports'
  },
  { 
    name: 'My Portfolio', 
    href: '/portfolio', 
    icon: Award,
    description: 'Your IP assets and licenses'
  },
  { 
    name: 'Staking', 
    href: '/staking', 
    icon: TrendingUp,
    description: 'Stake tokens and earn rewards'
  },
  { 
    name: 'Cross-Chain', 
    href: '/cross-chain', 
    icon: Globe,
    description: 'Multi-chain payments and royalties'
  },
  { 
    name: 'AI Agents', 
    href: '/ai-agents', 
    icon: Bot,
    description: 'AI-powered IP detection and services'
  },
]

const secondaryNavigation = [
  { 
    name: 'Community', 
    href: '/community', 
    icon: Users,
    description: 'Connect with other creators'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: TrendingUp,
    description: 'Platform insights and metrics'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    description: 'Account and preferences'
  },
  { 
    name: 'Help', 
    href: '/help', 
    icon: HelpCircle,
    description: 'Support and documentation'
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="h-screen flex flex-col bg-white shadow-lg border-r border-gray-200">
      {/* Scrollable Navigation Container */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-6 space-y-2">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              MAIN
            </h2>
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <motion.button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-2 ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div className={`font-medium ${active ? 'text-white' : 'text-gray-900'}`}>
                      {item.name}
                    </div>
                    <div className={`text-xs ${
                      active ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto"
                    >
                      <Zap className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>

          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              MORE
            </h2>
            {secondaryNavigation.map((item) => {
              const active = isActive(item.href)
              return (
                <motion.button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-4 w-4 flex-shrink-0 ${
                      active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                  <span className={`${active ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 bg-white">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Protection Active
              </p>
              <p className="text-xs text-green-600">
                Your IP is being monitored
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}