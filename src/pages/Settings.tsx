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

export default function Settings() {
  const { address, isConnected } = useAccount()
  const { user, notifications, setNotifications } = useAppStore()
  const [selectedTab, setSelectedTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: 'IP protection enthusiast and digital creator',
    website: '',
    twitter: '',
    discord: '',
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
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would update the backend
      await new Promise(resolve => setTimeout(resolve, 1000))
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
        <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
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
        <h1 className="text-3xl font-bold gradient-text mb-4">Settings</h1>
        <p className="text-muted-foreground">
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
          <div className="card p-6">
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
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
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
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Username</label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="input w-full"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input w-full"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="textarea w-full"
                      rows={3}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Website</label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="input w-full"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="label">Twitter</label>
                      <input
                        type="text"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                        className="input w-full"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Wallet Address</label>
                    <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                      {formatAddress(address)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is your connected wallet address and cannot be changed
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="btn btn-default"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="loading-spinner mr-2" />
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
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Delivery Methods</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                        { key: 'inApp', label: 'In-App Notifications', description: 'Show notifications in the platform' },
                        { key: 'discord', label: 'Discord Notifications', description: 'Send notifications to Discord' },
                        { key: 'telegram', label: 'Telegram Notifications', description: 'Send notifications to Telegram' },
                      ].map((method) => (
                        <div key={method.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">{method.label}</h4>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[method.key as keyof typeof notifications]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                [method.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Notification Types</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'reportUpdates', label: 'Report Updates', description: 'Updates on your violation reports' },
                        { key: 'voteUpdates', label: 'Voting Updates', description: 'Results from community voting' },
                        { key: 'rewardUpdates', label: 'Reward Updates', description: 'Notifications about earned rewards' },
                        { key: 'systemUpdates', label: 'System Updates', description: 'Platform updates and announcements' },
                      ].map((type) => (
                        <div key={type.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">{type.label}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[type.key as keyof typeof notifications]}
                              onChange={(e) => setNotifications({
                                ...notifications,
                                [type.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
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
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { 
                        key: 'twoFactorAuth', 
                        label: 'Two-Factor Authentication', 
                        description: 'Add an extra layer of security to your account',
                        recommended: true
                      },
                      { 
                        key: 'emailVerification', 
                        label: 'Email Verification', 
                        description: 'Verify your identity via email for sensitive actions' 
                      },
                      { 
                        key: 'apiAccess', 
                        label: 'API Access', 
                        description: 'Allow third-party applications to access your account' 
                      },
                      { 
                        key: 'signatureRequests', 
                        label: 'Transaction Signatures', 
                        description: 'Require wallet signatures for all transactions' 
                      },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{setting.label}</h4>
                            {setting.recommended && (
                              <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings[setting.key as keyof typeof securitySettings]}
                            onChange={(e) => setSecuritySettings({
                              ...securitySettings,
                              [setting.key]: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-medium mb-4">API Key Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type={showApiKey ? 'text' : 'password'}
                              value="sk_live_1234567890abcdef1234567890abcdef"
                              readOnly
                              className="input w-full pr-20"
                            />
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded"
                            >
                              {showApiKey ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>
                        <button className="btn btn-outline">
                          <Key className="h-4 w-4 mr-2" />
                          Regenerate
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
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
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Platform Preferences</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Theme</label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                        className="input w-full"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="input w-full"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Timezone</label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                        className="input w-full"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Currency</label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                        className="input w-full"
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
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-6">Data Management</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Export Your Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of all your data including IP assets, reports, and activity
                      </p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="btn btn-outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="btn btn-destructive"
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