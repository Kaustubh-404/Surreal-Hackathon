import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConnectModal, useAccountModal } from '@tomo-inc/tomo-evm-kit'
import { 
  Shield, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Wallet,
  ChevronDown,
  Menu,
  X,
  Coins
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { useStory } from '../hooks/useStory'
import { useDeBridge } from '../hooks/useDeBridge'
import { formatAddress } from '../utils/formatters'
import NotificationDropdown from './NotificationDropdown'

// You'll need to import useAccount from the correct package
// This might be from wagmi, ethers, or another Web3 library
// For example: import { useAccount } from 'wagmi'
// Or create a custom hook if needed

// Temporary interface - replace with actual type from your Web3 library
interface AccountHook {
  address?: `0x${string}`
  isConnected: boolean
}

// Replace this with your actual useAccount hook
const useAccount = (): AccountHook => {
  // This is a placeholder - implement based on your Web3 setup
  return {
    address: undefined,
    isConnected: false
  }
}

export default function Header() {
  const { connectModalOpen, openConnectModal } = useConnectModal()
  const { accountModalOpen, openAccountModal } = useAccountModal()
  const { address, isConnected } = useAccount()
  const { user, rewards } = useAppStore()
  const { isInitialized: storyInitialized } = useStory()
  const { isInitialized: deBridgeInitialized } = useDeBridge()
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const unreadRewards = rewards.filter(r => !r.claimedAt).length

  const handleConnect = () => {
    if (openConnectModal) {
      openConnectModal()
    }
  }

  const handleAccountClick = () => {
    if (isConnected && openAccountModal) {
      openAccountModal()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  IP Guardian
                </h1>
                <p className="text-xs text-gray-500">Protect • Verify • Earn</p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Service Status Indicators */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${storyInitialized ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-600">Story</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${deBridgeInitialized ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-600">deBridge</span>
              </div>
            </div>

            {isConnected ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadRewards > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadRewards > 9 ? '9+' : unreadRewards}
                      </span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showNotifications && (
                      <NotificationDropdown
                        onClose={() => setShowNotifications(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* User Balance */}
                {user && (
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg px-3 py-2">
                    <Coins className="h-4 w-4 text-accent-600" />
                    <span className="text-sm font-medium text-accent-700">
                      {(Number(user.stakedTokens) / 1e18).toFixed(2)} Staked
                    </span>
                  </div>
                )}

                {/* User Menu */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.username || (address ? formatAddress(address) : 'Unknown')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rep: {user?.reputation || 0}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                      >
                        <button
                          onClick={handleAccountClick}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Wallet className="h-4 w-4" />
                          <span>Wallet</span>
                        </button>
                        <button
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            // Handle logout
                            setShowUserMenu(false)
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Disconnect</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConnect}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
              >
                Connect Wallet
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-3">
                {isConnected ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.username || (address ? formatAddress(address) : 'Unknown')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Reputation: {user?.reputation || 0}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleAccountClick}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Wallet</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}