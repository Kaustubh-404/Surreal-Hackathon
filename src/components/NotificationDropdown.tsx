import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import { 
  Gift, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Clock,
  Coins
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { formatEther } from 'viem'

interface NotificationDropdownProps {
  onClose: () => void
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { rewards, addReward } = useAppStore()

  // Sample notifications for demo
  const notifications = [
    ...rewards.slice(0, 5).map(reward => ({
      id: reward.id,
      type: 'reward' as const,
      title: getRewardTitle(reward.type),
      description: reward.description,
      amount: reward.amount,
      time: reward.createdAt,
      read: !!reward.claimedAt,
    })),
    {
      id: 'sample-1',
      type: 'info' as const,
      title: 'New IP Report Submitted',
      description: 'A new report has been submitted for review',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
    },
    {
      id: 'sample-2',
      type: 'success' as const,
      title: 'Dispute Resolved',
      description: 'Your dispute #1234 has been resolved in your favor',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
    },
  ]

  function getRewardTitle(type: string): string {
    switch (type) {
      case 'report_reward':
        return 'Report Reward Earned'
      case 'vote_reward':
        return 'Voting Reward Earned'
      case 'staking_reward':
        return 'Staking Reward Earned'
      case 'referral_reward':
        return 'Referral Bonus Earned'
      default:
        return 'Reward Earned'
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case 'reward':
        return <Gift className="h-5 w-5 text-accent-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className={`p-4 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className={`text-sm ${
                      notification.read ? 'text-gray-500' : 'text-gray-600'
                    } mt-1`}>
                      {notification.description}
                    </p>
                    
                    {notification.type === 'reward' && 'amount' in notification && (
                      <div className="flex items-center space-x-1 mt-2">
                        <Coins className="h-4 w-4 text-accent-500" />
                        <span className="text-sm font-medium text-accent-600">
                          +{formatEther(notification.amount)} tokens
                        </span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDistanceToNow(notification.time, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-1"
          >
            <span>View all notifications</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  )
}