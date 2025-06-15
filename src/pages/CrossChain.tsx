import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  ArrowRight, 
  Send,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Zap,
  DollarSign,
  Network,
  Activity
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useDeBridge } from '../hooks/useDeBridge'
import { PaymentStatus } from '../types/global'
import toast from 'react-hot-toast'

// Helper function to format ether with specific decimal places
const formatEtherWithDecimals = (value: bigint, decimals: number = 2): string => {
  const etherValue = formatEther(value)
  const num = parseFloat(etherValue)
  return num.toFixed(decimals)
}

export default function CrossChain() {
  const { isConnected } = useAccount()
  const { 
    isInitialized, 
    supportedChains, 
    crossChainPayments, 
    getQuote, 
    sendDeTip,
    trackPayment 
  } = useDeBridge()
  
  const [sourceChain, setSourceChain] = useState<number>(1315) // Story Aeneid
  const [targetChain, setTargetChain] = useState<number>(1)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quote, setQuote] = useState<any>(null)

  // Get quote when parameters change
  useEffect(() => {
    const getQuoteData = async () => {
      if (!amount || !sourceChain || !targetChain || sourceChain === targetChain) {
        setQuote(null)
        return
      }

      try {
        const sourceChainData = supportedChains.find(c => c.id === sourceChain)
        const targetChainData = supportedChains.find(c => c.id === targetChain)
        
        if (!sourceChainData || !targetChainData) return

        const quoteData = await getQuote({
          srcChainId: sourceChain,
          dstChainId: targetChain,
          srcTokenAddress: sourceChainData.tokenAddress,
          dstTokenAddress: targetChainData.tokenAddress,
          amount: parseEther(amount).toString(),
        })
        
        setQuote(quoteData)
      } catch (error) {
        console.error('Failed to get quote:', error)
        setQuote(null)
      }
    }

    const debounce = setTimeout(getQuoteData, 500)
    return () => clearTimeout(debounce)
  }, [amount, sourceChain, targetChain, supportedChains, getQuote])

  const handleSend = async () => {
    if (!isConnected || !isInitialized) {
      toast.error('Please connect your wallet')
      return
    }

    if (!amount || !recipient) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      const sourceChainData = supportedChains.find(c => c.id === sourceChain)
      if (!sourceChainData) throw new Error('Source chain not found')

      await sendDeTip({
        amount: parseEther(amount),
        token: sourceChainData.tokenAddress,
        recipient: recipient as `0x${string}`,
        sourceChain,
        targetChain,
        message: 'Cross-chain payment via IP Guardian',
      })

      setAmount('')
      setRecipient('')
      setQuote(null)
    } catch (error) {
      console.error('Failed to send payment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Clock className="h-4 w-4 text-warning-500" />
      case PaymentStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4 text-success-500" />
      case PaymentStatus.FAILED:
        return <XCircle className="h-4 w-4 text-error-500" />
      case PaymentStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4 text-warning-500" />
    }
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'bg-warning-100 text-warning-800'
      case PaymentStatus.CONFIRMED:
        return 'bg-success-100 text-success-800'
      case PaymentStatus.FAILED:
        return 'bg-error-100 text-error-800'
      case PaymentStatus.CANCELLED:
        return 'bg-muted text-muted-foreground'
      default:
        return 'bg-warning-100 text-warning-800'
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground">
          Please connect your wallet to use cross-chain features.
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
        <h1 className="text-3xl font-bold gradient-text mb-4">Cross-Chain Hub</h1>
        <p className="text-muted-foreground">
          Send payments and royalties across different blockchain networks
        </p>
      </motion.div>

      {/* Bridge Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-8 mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Send className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Send Cross-Chain Payment</h2>
        </div>

        <div className="space-y-6">
          {/* Chain Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label mb-2">From Chain</label>
              <select
                value={sourceChain}
                onChange={(e) => setSourceChain(Number(e.target.value))}
                className="input w-full"
              >
                {supportedChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label mb-2">To Chain</label>
              <select
                value={targetChain}
                onChange={(e) => setTargetChain(Number(e.target.value))}
                className="input w-full"
              >
                {supportedChains
                  .filter(chain => chain.id !== sourceChain)
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>

          {/* Amount and Recipient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input w-full"
                placeholder="0.0"
                step="0.001"
                min="0"
              />
            </div>

            <div>
              <label className="label mb-2">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="input w-full"
                placeholder="0x..."
              />
            </div>
          </div>

          {/* Quote Display */}
          {quote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-muted/50 rounded-lg p-4"
            >
              <h3 className="font-medium mb-3">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>You send:</span>
                  <span className="font-medium">{amount} tokens</span>
                </div>
                <div className="flex justify-between">
                  <span>Recipient gets:</span>
                  <span className="font-medium">{formatEtherWithDecimals(BigInt(quote.estimatedAmount || '0'), 4)} tokens</span>
                </div>
                <div className="flex justify-between">
                  <span>Bridge fee:</span>
                  <span className="font-medium">{formatEtherWithDecimals(BigInt(quote.fee || '0'), 4)} tokens</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated time:</span>
                  <span className="font-medium">{Math.ceil(quote.estimatedTime / 60)} minutes</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isLoading || !amount || !recipient || !quote}
            className="btn btn-default w-full btn-lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="loading-spinner mr-2" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="h-5 w-5 mr-2" />
                <span>Send Cross-Chain Payment</span>
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <span className="text-sm text-muted-foreground">
            {crossChainPayments.length} transactions
          </span>
        </div>

        {crossChainPayments.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No cross-chain transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {crossChainPayments.slice(0, 10).map((payment) => (
              <div
                key={payment.txHash}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">
                        {payment.sourceChain} → {payment.targetChain}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      To: {payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatEtherWithDecimals(payment.amount, 4)} tokens</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => trackPayment(payment.txHash)}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      Track
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6 text-center">
          <DollarSign className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Distribute Royalties</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Automatically distribute IP royalties across multiple chains
          </p>
          <button className="btn btn-outline btn-sm">
            Set Up Distribution
          </button>
        </div>

        <div className="card p-6 text-center">
          <Zap className="h-8 w-8 text-secondary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">AI Agent Payments</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Pay for AI services across different blockchain networks
          </p>
          <button className="btn btn-outline btn-sm">
            Explore Services
          </button>
        </div>

        <div className="card p-6 text-center">
          <Network className="h-8 w-8 text-accent mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Bridge Analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">
            View detailed analytics of your cross-chain activity
          </p>
          <button className="btn btn-outline btn-sm">
            View Analytics
          </button>
        </div>
      </motion.div>
    </div>
  )
}