import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useAppStore } from '../store/appStore'
import { formatAddress } from '../utils/formatters'
import toast from 'react-hot-toast'

// Define local notification settings interface
interface NotificationSettings {
  email: boolean
  inApp: boolean
  discord: boolean
  telegram: boolean
  reportUpdates: boolean
  voteUpdates: boolean
  rewardUpdates: boolean
  systemUpdates: boolean
}

export default function Settings() {
  const { address, isConnected } = useAccount()
  const { user, updateSettings } = useAppStore()
  const [selectedTab, setSelectedTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Local notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    inApp: true,
    discord: false,
    telegram: false,
    reportUpdates: true,
    voteUpdates: true,
    rewardUpdates: true,
    systemUpdates: false,
  })

  // Profile settings
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.profile?.bio || 'IP protection enthusiast and digital creator',
    website: user?.profile?.website || '',
    twitter: user?.profile?.twitter || '',
    discord: user?.profile?.discord || '',
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailVerification: true,
    apiAccess: true,
    signatureRequests: true,
  })

  // Theme and preferences
  const [preferences, setPreferences] = useState({
    theme: (user?.preferences?.theme || 'light') as 'light' | 'dark' | 'system',
    language: user?.preferences?.language || 'en',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would update the backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update app store settings
      updateSettings({
        theme: preferences.theme as 'light' | 'dark' | 'system',
        language: preferences.language,
        notifications: notifications.email,
        autoConnect: true,
      })
      
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    // In a real app, this would generate and download user data
    toast.success('Data export initiated. Download will begin shortly.')
  }

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation modal
    toast.error('Account deletion requires additional verification')
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600">
          Please connect your wallet to access settings.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your account preferences and platform settings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'preferences', label: 'Preferences', icon: Palette },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          {selectedTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      rows={3}
                      placeholder="Tell us about yourself"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                      <input
                        type="text"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                    <div className="block w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed">
                      {formatAddress(address as `0x${string}`)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This is your connected wallet address and cannot be changed
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Delivery Methods</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'email' as keyof NotificationSettings, label: 'Email Notifications', description: 'Receive notifications via email' },
                        { key: 'inApp' as keyof NotificationSettings, label: 'In-App Notifications', description: 'Show notifications in the platform' },
                        { key: 'discord' as keyof NotificationSettings, label: 'Discord Notifications', description: 'Send notifications to Discord' },
                        { key: 'telegram' as keyof NotificationSettings, label: 'Telegram Notifications', description: 'Send notifications to Telegram' },
                      ].map((method) => (
                        <div key={method.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{method.label}</h4>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[method.key]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                [method.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Notification Types</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'reportUpdates' as keyof NotificationSettings, label: 'Report Updates', description: 'Updates on your violation reports' },
                        { key: 'voteUpdates' as keyof NotificationSettings, label: 'Voting Updates', description: 'Results from community voting' },
                        { key: 'rewardUpdates' as keyof NotificationSettings, label: 'Reward Updates', description: 'Notifications about earned rewards' },
                        { key: 'systemUpdates' as keyof NotificationSettings, label: 'System Updates', description: 'Platform updates and announcements' },
                      ].map((type) => (
                        <div key={type.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{type.label}</h4>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[type.key]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                [type.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { 
                        key: 'twoFactorAuth' as keyof typeof securitySettings, 
                        label: 'Two-Factor Authentication', 
                        description: 'Add an extra layer of security to your account',
                        recommended: true
                      },
                      { 
                        key: 'emailVerification' as keyof typeof securitySettings, 
                        label: 'Email Verification', 
                        description: 'Verify your identity via email for sensitive actions' 
                      },
                      { 
                        key: 'apiAccess' as keyof typeof securitySettings, 
                        label: 'API Access', 
                        description: 'Allow third-party applications to access your account' 
                      },
                      { 
                        key: 'signatureRequests' as keyof typeof securitySettings, 
                        label: 'Transaction Signatures', 
                        description: 'Require wallet signatures for all transactions' 
                      },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{setting.label}</h4>
                            {setting.recommended && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings[setting.key]}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              [setting.key]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">API Key Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type={showApiKey ? 'text' : 'password'}
                              value="sk_live_1234567890abcdef1234567890abcdef"
                              readOnly
                              className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-20 bg-gray-50"
                            />
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                            >
                              {showApiKey ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        <button className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
                          <Key className="h-4 w-4 mr-2" />
                          Regenerate
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use this API key to integrate with third-party applications. Keep it secure and never share it publicly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'preferences' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Preferences</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' | 'system' })}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="ETH">ETH</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Export Your Data</h4>
                      <p className="text-sm text-gray-600">
                        Download a copy of all your data including IP assets, reports, and activity
                      </p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-800">Delete Account</h4>
                      <p className="text-sm text-gray-600">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}