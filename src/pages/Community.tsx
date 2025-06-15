import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  MessageCircle, 
  Trophy,
  Heart,
  Share2,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  ExternalLink,
  User,
  Crown,
  Target
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { formatDate, formatNumber } from '../utils/formatters'

interface CommunityMember {
  id: string
  username: string
  avatar?: string
  address: string
  reputation: number
  joinDate: Date
  contributions: {
    reports: number
    votes: number
    ipsRegistered: number
  }
  badges: string[]
  isOnline: boolean
}

interface CommunityPost {
  id: string
  author: CommunityMember
  content: string
  type: 'discussion' | 'announcement' | 'help' | 'showcase'
  timestamp: Date
  likes: number
  comments: number
  isLiked: boolean
  tags: string[]
}

const topMembers: CommunityMember[] = [
  {
    id: '1',
    username: 'IPDefender',
    address: '0x1234567890123456789012345678901234567890',
    reputation: 2847,
    joinDate: new Date('2023-08-15'),
    contributions: { reports: 156, votes: 892, ipsRegistered: 23 },
    badges: ['Early Adopter', 'Top Validator', 'Community Helper'],
    isOnline: true
  },
  {
    id: '2',
    username: 'CreativeGuard',
    address: '0x2345678901234567890123456789012345678901',
    reputation: 2156,
    joinDate: new Date('2023-09-22'),
    contributions: { reports: 89, votes: 654, ipsRegistered: 45 },
    badges: ['Content Creator', 'Accuracy Expert'],
    isOnline: false
  },
  {
    id: '3',
    username: 'DigitalSheriff',
    address: '0x3456789012345678901234567890123456789012',
    reputation: 1934,
    joinDate: new Date('2023-10-10'),
    contributions: { reports: 234, votes: 423, ipsRegistered: 12 },
    badges: ['Report Master', 'Fast Responder'],
    isOnline: true
  }
]

const communityPosts: CommunityPost[] = [
  {
    id: '1',
    author: topMembers[0],
    content: 'Just discovered a new AI tool that can detect deepfakes with 98% accuracy! This could be a game-changer for IP protection. Has anyone tried integrating similar tools with the platform?',
    type: 'discussion',
    timestamp: new Date('2024-03-21T10:30:00Z'),
    likes: 24,
    comments: 8,
    isLiked: false,
    tags: ['AI', 'deepfakes', 'detection']
  },
  {
    id: '2',
    author: topMembers[1],
    content: 'Excited to share that my digital art collection just hit 1,000 views! Thank you to everyone who helped validate my IP registrations. The community support here is amazing! 🎨',
    type: 'showcase',
    timestamp: new Date('2024-03-21T08:15:00Z'),
    likes: 156,
    comments: 23,
    isLiked: true,
    tags: ['milestone', 'digital-art', 'community']
  },
  {
    id: '3',
    author: topMembers[2],
    content: 'Heads up! There seems to be a coordinated effort to plagiarize content from our platform on social media. I\'ve submitted several reports. Keep an eye out and report anything suspicious!',
    type: 'announcement',
    timestamp: new Date('2024-03-20T16:45:00Z'),
    likes: 67,
    comments: 12,
    isLiked: true,
    tags: ['alert', 'plagiarism', 'security']
  }
]

export default function Community() {
  const { address, isConnected } = useAccount()
  const [selectedTab, setSelectedTab] = useState<'feed' | 'members' | 'leaderboard'>('feed')
  const [newPost, setNewPost] = useState('')
  const [selectedPostType, setSelectedPostType] = useState<'discussion' | 'announcement' | 'help' | 'showcase'>('discussion')

  const handleLike = (postId: string) => {
    // In a real app, this would update the backend
    console.log('Liked post:', postId)
  }

  const handleShare = (postId: string) => {
    // In a real app, this would open share options
    console.log('Shared post:', postId)
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return
    
    // In a real app, this would submit to backend
    console.log('Creating post:', { content: newPost, type: selectedPostType })
    setNewPost('')
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Join the Community</h3>
        <p className="text-muted-foreground">
          Connect your wallet to participate in the IP Guardian community.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4">Community Hub</h1>
        <p className="text-muted-foreground">
          Connect with fellow creators, share insights, and build a stronger IP protection ecosystem
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="card p-6 text-center">
          <Users className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-2xl font-bold">8,942</h3>
          <p className="text-sm text-muted-foreground">Active Members</p>
        </div>
        <div className="card p-6 text-center">
          <MessageCircle className="h-8 w-8 text-success-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">1,234</h3>
          <p className="text-sm text-muted-foreground">Discussions</p>
        </div>
        <div className="card p-6 text-center">
          <Trophy className="h-8 w-8 text-warning-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">567</h3>
          <p className="text-sm text-muted-foreground">Reports Resolved</p>
        </div>
        <div className="card p-6 text-center">
          <Award className="h-8 w-8 text-secondary mx-auto mb-3" />
          <h3 className="text-2xl font-bold">89%</h3>
          <p className="text-sm text-muted-foreground">Accuracy Rate</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-b border-border mb-6"
      >
        <nav className="flex space-x-8">
          {[
            { id: 'feed', label: 'Community Feed', icon: MessageCircle },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
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
        {selectedTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Share with the community</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    {(['discussion', 'announcement', 'help', 'showcase'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedPostType(type)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          selectedPostType === type
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="textarea w-full"
                    rows={3}
                    placeholder="What's on your mind?"
                  />
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="btn btn-default btn-sm"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-6">
                {communityPosts.map((post) => (
                  <div key={post.id} className="card p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                        {post.author.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{post.author.username}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.type === 'discussion' ? 'bg-primary/10 text-primary' :
                            post.type === 'announcement' ? 'bg-warning-100 text-warning-800' :
                            post.type === 'help' ? 'bg-error-100 text-error-800' :
                            'bg-success-100 text-success-800'
                          }`}>
                            {post.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(post.timestamp)}
                          </span>
                        </div>
                        <p className="text-foreground mb-3">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                              post.isLiked ? 'text-error-500' : 'text-muted-foreground hover:text-error-500'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </button>
                          <button
                            onClick={() => handleShare(post.id)}
                            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
                          >
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Contributors */}
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {topMembers.slice(0, 3).map((member, index) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                        {index === 0 && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-warning-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatNumber(member.reputation)} reputation
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Events */}
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium text-sm">IP Protection Workshop</h4>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>March 25, 2024</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>Virtual Event</span>
                    </div>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-medium text-sm">Community AMA</h4>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>March 30, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'members' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMembers.map((member) => (
              <div key={member.id} className="card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(member.reputation)} reputation
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Reports</span>
                    <span className="font-medium">{member.contributions.reports}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Votes</span>
                    <span className="font-medium">{member.contributions.votes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IPs Registered</span>
                    <span className="font-medium">{member.contributions.ipsRegistered}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Badges</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.badges.map((badge) => (
                      <span key={badge} className="text-xs bg-warning-100 text-warning-800 px-2 py-1 rounded">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="btn btn-outline btn-sm w-full">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="text-2xl font-bold">Top Reporters</h3>
                <p className="text-sm text-muted-foreground">Most accurate violation reports</p>
              </div>
              <div className="card p-6 text-center">
                <Award className="h-8 w-8 text-success-500 mx-auto mb-3" />
                <h3 className="text-2xl font-bold">Best Validators</h3>
                <p className="text-sm text-muted-foreground">Highest voting accuracy</p>
              </div>
              <div className="card p-6 text-center">
                <TrendingUp className="h-8 w-8 text-warning-500 mx-auto mb-3" />
                <h3 className="text-2xl font-bold">Rising Stars</h3>
                <p className="text-sm text-muted-foreground">Fast-growing contributors</p>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6">Community Leaderboard</h2>
              <div className="space-y-4">
                {topMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-warning-500 text-warning-foreground' :
                        index === 1 ? 'bg-muted text-muted-foreground' :
                        index === 2 ? 'bg-warning-200 text-warning-800' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                        {index === 0 && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-warning-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          Joined {formatDate(member.joinDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatNumber(member.reputation)}</p>
                      <p className="text-sm text-muted-foreground">Reputation</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}