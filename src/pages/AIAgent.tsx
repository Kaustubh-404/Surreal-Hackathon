import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Zap, 
  Shield,
  Search,
  Eye,
  Brain,
  Activity,
  DollarSign,
  Star,
  Play,
  Settings,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useDeBridge } from '../hooks/useDeBridge'
import { formatEther, formatNumber } from '../utils/formatters'
import toast from 'react-hot-toast'

interface AIAgent {
  id: string
  name: string
  description: string
  category: string
  pricing: {
    model: 'per_use' | 'subscription' | 'pay_per_result'
    amount: bigint
    currency: string
  }
  capabilities: string[]
  reputation: number
  totalUses: number
  accuracy: number
  responseTime: number // in seconds
  supportedChains: number[]
  isActive: boolean
  developer: string
}

const aiAgents: AIAgent[] = [
  {
    id: 'ip-detector',
    name: 'IP Violation Detective',
    description: 'Advanced AI that scans the internet for potential IP violations using computer vision and NLP',
    category: 'Detection',
    pricing: {
      model: 'per_use',
      amount: BigInt('100000000000000000'), // 0.1 tokens
      currency: 'tokens'
    },
    capabilities: ['Image similarity detection', 'Text plagiarism', 'Video analysis', 'Real-time monitoring'],
    reputation: 4.8,
    totalUses: 12847,
    accuracy: 94.5,
    responseTime: 30,
    supportedChains: [1, 137, 1315],
    isActive: true,
    developer: 'DeepScan AI'
  },
  {
    id: 'authenticity-verifier',
    name: 'Authenticity Verifier',
    description: 'Verifies the authenticity of digital content and detects AI-generated or manipulated media',
    category: 'Verification',
    pricing: {
      model: 'per_use',
      amount: BigInt('50000000000000000'), // 0.05 tokens
      currency: 'tokens'
    },
    capabilities: ['Deepfake detection', 'AI-generated content analysis', 'Metadata verification', 'Blockchain provenance'],
    reputation: 4.6,
    totalUses: 8934,
    accuracy: 91.2,
    responseTime: 15,
    supportedChains: [1, 137, 1315],
    isActive: true,
    developer: 'TruthAI Labs'
  },
  {
    id: 'royalty-calculator',
    name: 'Smart Royalty Calculator',
    description: 'Automatically calculates and distributes royalties based on complex licensing agreements',
    category: 'Finance',
    pricing: {
      model: 'pay_per_result',
      amount: BigInt('200000000000000000'), // 0.2 tokens
      currency: 'tokens'
    },
    capabilities: ['Complex royalty calculations', 'Multi-chain distribution', 'License term analysis', 'Revenue optimization'],
    reputation: 4.9,
    totalUses: 5672,
    accuracy: 99.1,
    responseTime: 45,
    supportedChains: [1, 137, 56, 1315],
    isActive: true,
    developer: 'FinanceBot Inc'
  },
  {
    id: 'content-moderator',
    name: 'Content Guardian',
    description: 'AI-powered content moderation that identifies inappropriate or infringing content in real-time',
    category: 'Moderation',
    pricing: {
      model: 'subscription',
      amount: BigInt('1000000000000000000'), // 1 token per month
      currency: 'tokens'
    },
    capabilities: ['NSFW detection', 'Hate speech identification', 'Copyright infringement', 'Community guidelines'],
    reputation: 4.7,
    totalUses: 25641,
    accuracy: 96.8,
    responseTime: 5,
    supportedChains: [1, 137, 1315],
    isActive: true,
    developer: 'SafeSpace AI'
  }
]

export default function AIAgents() {
  const { address, isConnected } = useAccount()
  const { payAIAgentService, isInitialized } = useDeBridge()
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedChain, setSelectedChain] = useState<number>(1315)
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Detection', 'Verification', 'Finance', 'Moderation']

  const filteredAgents = aiAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUseAgent = async (agent: AIAgent) => {
    if (!isConnected || !isInitialized) {
      toast.error('Please connect your wallet')
      return
    }

    setSelectedAgent(agent)
    setShowPaymentModal(true)
  }

  const handlePayment = async () => {
    if (!selectedAgent || !isConnected) return

    setIsProcessing(true)
    try {
      await payAIAgentService({
        agentAddress: '0x1234567890123456789012345678901234567890' as `0x${string}`, // Mock agent address
        serviceId: selectedAgent.id,
        amount: selectedAgent.pricing.amount,
        token: '0x1514000000000000000000000000000000000000' as `0x${string}`, // WIP token
        sourceChain: 1315, // Story chain
        targetChain: selectedChain,
        metadata: {
          agentId: selectedAgent.id,
          service: selectedAgent.name,
          timestamp: Date.now()
        }
      })

      toast.success(`Successfully paid for ${selectedAgent.name} service!`)
      setShowPaymentModal(false)
      setSelectedAgent(null)
      
      // In a real app, this would trigger the AI service
      setTimeout(() => {
        toast.success('AI service completed successfully!')
      }, 3000)
      
    } catch (error) {
      console.error('Payment failed:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to access AI agent services.
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
        <h1 className="text-3xl font-bold gradient-text mb-4">AI Agent Marketplace</h1>
        <p className="text-muted-foreground">
          Discover and use AI agents for IP detection, verification, and protection
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search AI agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* AI Agents Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <span className="text-xs text-muted-foreground">{agent.category}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  agent.isActive ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                }`}>
                  {agent.isActive ? 'Active' : 'Offline'}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{agent.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reputation</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-warning-500 fill-current" />
                    <span className="font-medium">{agent.reputation}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-medium">{agent.accuracy}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">{agent.responseTime}s</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Uses</span>
                  <span className="font-medium">{formatNumber(agent.totalUses)}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map((capability, idx) => (
                    <span key={idx} className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                      {capability}
                    </span>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{agent.capabilities.length - 3}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold">
                    {formatEther(agent.pricing.amount, 3)} {agent.pricing.currency}
                    <span className="text-xs text-muted-foreground ml-1">
                      /{agent.pricing.model.replace('_', ' ')}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Developer</p>
                  <p className="text-sm font-medium">{agent.developer}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleUseAgent(agent)}
                  disabled={!agent.isActive}
                  className="btn btn-default btn-sm flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Use Agent
                </button>
                <button className="btn btn-outline btn-sm">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="card p-6 text-center">
          <Bot className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-2xl font-bold">{aiAgents.length}</h3>
          <p className="text-sm text-muted-foreground">Available Agents</p>
        </div>
        <div className="card p-6 text-center">
          <Activity className="h-8 w-8 text-success-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">52K+</h3>
          <p className="text-sm text-muted-foreground">Total Executions</p>
        </div>
        <div className="card p-6 text-center">
          <Shield className="h-8 w-8 text-warning-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">94.2%</h3>
          <p className="text-sm text-muted-foreground">Average Accuracy</p>
        </div>
        <div className="card p-6 text-center">
          <Zap className="h-8 w-8 text-secondary mx-auto mb-3" />
          <h3 className="text-2xl font-bold">23s</h3>
          <p className="text-sm text-muted-foreground">Avg Response Time</p>
        </div>
      </motion.div>

      {/* Payment Modal */}
      {showPaymentModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Use AI Agent</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn btn-ghost btn-sm"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedAgent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAgent.category}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service Cost</span>
                  <span className="font-medium">
                    {formatEther(selectedAgent.pricing.amount, 3)} {selectedAgent.pricing.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Model</span>
                  <span className="font-medium capitalize">
                    {selectedAgent.pricing.model.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expected Response</span>
                  <span className="font-medium">{selectedAgent.responseTime} seconds</span>
                </div>
              </div>

              <div>
                <label className="label mb-2">Target Chain</label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(Number(e.target.value))}
                  className="input w-full"
                >
                  {selectedAgent.supportedChains.map((chainId) => (
                    <option key={chainId} value={chainId}>
                      {chainId === 1 ? 'Ethereum' : 
                       chainId === 137 ? 'Polygon' : 
                       chainId === 1315 ? 'Story Aeneid' : 
                       `Chain ${chainId}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">AI Service</h4>
                    <p className="text-sm text-primary/80 mt-1">
                      This AI agent will process your request and provide results based on its trained models.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn btn-default"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>Pay & Execute</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* My AI Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">My AI Service History</h2>
          <button className="btn btn-outline btn-sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </button>
        </div>

        <div className="space-y-4">
          {/* Mock service history */}
          {[
            {
              agent: 'IP Violation Detective',
              service: 'Image similarity scan',
              cost: '0.1 tokens',
              status: 'completed',
              time: '2 hours ago',
              result: 'No violations found'
            },
            {
              agent: 'Authenticity Verifier',
              service: 'Content verification',
              cost: '0.05 tokens',
              status: 'processing',
              time: '1 hour ago',
              result: 'Processing...'
            },
            {
              agent: 'Smart Royalty Calculator',
              service: 'Revenue distribution',
              cost: '0.2 tokens',
              status: 'completed',
              time: '3 hours ago',
              result: 'Distributed to 5 recipients'
            }
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {service.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-success-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{service.agent}</p>
                  <p className="text-sm text-muted-foreground">{service.service}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{service.cost}</p>
                <p className="text-sm text-muted-foreground">{service.time}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  service.status === 'completed' ? 'text-success-600' : 'text-warning-600'
                }`}>
                  {service.result}
                </p>
                <button className="text-xs text-primary hover:text-primary/80">
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}