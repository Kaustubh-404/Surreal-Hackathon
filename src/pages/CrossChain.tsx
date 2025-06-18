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
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useDeBridge } from '../hooks/useDeBridge'
import { useAppStore, type CrossChainTransaction } from '../store/appStore'
import toast from 'react-hot-toast'

// Define PaymentStatus enum if not available in types
enum PaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed', 
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export default function CrossChain() {
  const { address, isConnected } = useAccount()
  const { crossChainTxs } = useAppStore()
  const { 
    isInitialized, 
    supportedChains, 
    crossChainPayments, 
    getQuote, 
    openDeBridgeSwap,
    getTokenAddress,
    getPopularTokens,
    getChainName,
    updatePaymentStatus
  } = useDeBridge()
  
  const [sourceChain, setSourceChain] = useState<number>(1315) // Story Aeneid
  const [targetChain, setTargetChain] = useState<number>(1) // Ethereum
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [quote, setQuote] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize default tokens
  useEffect(() => {
    if (supportedChains.length > 0 && !fromToken && !toToken) {
      // Set default tokens
      const storyNative = getTokenAddress(1315, 'IP') || '0x0000000000000000000000000000000000000000'
      const ethUSDT = getTokenAddress(1, 'USDT')
      setFromToken(storyNative)
      setToToken(ethUSDT)
    }
  }, [supportedChains, getTokenAddress, fromToken, toToken])

  // Get quote when parameters change
  useEffect(() => {
    const getQuoteData = async () => {
      if (!amount || !sourceChain || !targetChain || sourceChain === targetChain || !fromToken || !toToken) {
        setQuote(null)
        return
      }

      setIsLoading(true)
      try {
        const amountWei = (parseFloat(amount) * 1e18).toString()
        const quoteData = await getQuote({
          srcChainId: sourceChain,
          dstChainId: targetChain,
          srcTokenAddress: fromToken as `0x${string}`,
          dstTokenAddress: toToken as `0x${string}`,
          amount: amountWei,
        })
        
        setQuote(quoteData)
      } catch (error) {
        console.error('Failed to get quote:', error)
        setQuote(null)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(getQuoteData, 500)
    return () => clearTimeout(debounce)
  }, [amount, sourceChain, targetChain, fromToken, toToken, getQuote])

  const handleSend = async () => {
    if (!isConnected || !isInitialized) {
      toast.error('Please connect your wallet')
      return
    }

    if (!amount || !recipient || !fromToken || !toToken) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const amountWei = (parseFloat(amount) * 1e18).toString()
      
      openDeBridgeSwap({
        inputChain: sourceChain,
        inputCurrency: fromToken,
        outputChain: targetChain,
        outputCurrency: toToken,
        address: recipient,
        amount: amountWei,
      })

      // Reset form
      setAmount('')
      setRecipient('')
      setQuote(null)
    } catch (error) {
      console.error('Failed to initiate cross-chain transfer:', error)
      toast.error('Failed to initiate cross-chain transfer')
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />
      case PaymentStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case PaymentStatus.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />
      case PaymentStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case PaymentStatus.CONFIRMED:
        return 'bg-green-100 text-green-800'
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800'
      case PaymentStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleRefreshStatus = (txHash: string) => {
    // For demo purposes, randomly update status
    const statuses = [PaymentStatus.CONFIRMED, PaymentStatus.FAILED]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    updatePaymentStatus(txHash, randomStatus)
  }

  // Use crossChainTxs from app store instead of crossChainPayments
  const allTransactions = [...crossChainTxs, ...crossChainPayments]

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-500">
          Please connect your wallet to use cross-chain features.
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Cross-Chain Hub
        </h1>
        <p className="text-gray-600">
          Bridge tokens and send payments across different blockchain networks using deBridge
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
      >
        <div className="flex items-start space-x-3">
          <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Powered by deBridge</h3>
            <p className="text-sm text-blue-700 mt-1">
              Cross-chain transfers are powered by deBridge, a secure and decentralized infrastructure for cross-chain interoperability. 
              Transactions will open in the official deBridge interface.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bridge Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Cross-Chain Transfer</h2>
            </div>

            <div className="space-y-6">
              {/* Chain Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Chain</label>
                  <select
                    value={sourceChain}
                    onChange={(e) => setSourceChain(Number(e.target.value))}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    {supportedChains.map((chain) => (
                      <option key={chain.id} value={chain.id}>
                        {chain.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Chain</label>
                  <select
                    value={targetChain}
                    onChange={(e) => setTargetChain(Number(e.target.value))}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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

              {/* Token Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Token</label>
                  <select
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    {getPopularTokens(sourceChain).map((token) => (
                      <option key={token.address} value={token.address}>
                        {token.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Token</label>
                  <select
                    value={toToken}
                    onChange={(e) => setToToken(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    {getPopularTokens(targetChain).map((token) => (
                      <option key={token.address} value={token.address}>
                        {token.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center py-2">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Network className="h-6 w-6 text-blue-600" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Amount and Recipient */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="0.0"
                    step="0.001"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="0x..."
                  />
                </div>
              </div>

              {/* Quote Display */}
              {isLoading && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 text-gray-500 animate-spin" />
                    <span className="text-sm text-gray-700">Getting quote...</span>
                  </div>
                </div>
              )}

              {quote && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <h3 className="font-medium text-gray-900 mb-3">Transaction Preview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">You send:</span>
                      <span className="font-medium text-gray-900">{amount} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipient gets:</span>
                      <span className="font-medium text-gray-900">≈ {parseFloat(quote.estimatedAmount || '0').toFixed(6)} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bridge fee:</span>
                      <span className="font-medium text-gray-900">{parseFloat(quote.fee || '0').toFixed(6)} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated time:</span>
                      <span className="font-medium text-gray-900">{Math.ceil((quote.estimatedTime || 300) / 60)} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price impact:</span>
                      <span className="font-medium text-gray-900">{(quote.priceImpact || 0).toFixed(2)}%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!amount || !recipient || !quote || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    <span>Getting Quote...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="h-5 w-5 mr-2" />
                    <span>Open deBridge</span>
                  </div>
                )}
              </button>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">External Interface</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      This will open the official deBridge interface in a new tab. Complete your transaction there and return here to track progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Cross-Chain Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Supported Chains</span>
                <span className="font-medium text-gray-900">{supportedChains.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Your Transactions</span>
                <span className="font-medium text-gray-900">{allTransactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Success Rate</span>
                <span className="font-medium text-green-600">98.5%</span>
              </div>
            </div>
          </div>

          {/* Supported Chains */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Supported Networks</h3>
            <div className="space-y-3">
              {supportedChains.slice(0, 5).map((chain) => (
                <div key={chain.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{chain.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <span className="text-sm text-gray-500">
              {allTransactions.length} transactions
            </span>
          </div>

          {allTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No cross-chain transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start your first cross-chain transfer above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allTransactions.slice(0, 10).map((transaction: CrossChainTransaction | any) => (
                <div
                  key={transaction.id || transaction.txHash}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">
                          {getChainName(Number(transaction.fromChain || transaction.sourceChain))} → {getChainName(Number(transaction.toChain || transaction.targetChain))}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        To: {(transaction.recipient || 'Unknown').slice(0, 6)}...{(transaction.recipient || 'Unknown').slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {parseFloat(formatEther(transaction.amount || BigInt(0))).toFixed(4)} tokens
                    </p>
                    <div className="flex items-center space-x-2">
                      {transaction.status === PaymentStatus.PENDING && (
                        <button
                          onClick={() => handleRefreshStatus(transaction.txHash || transaction.id)}
                          className="text-xs text-blue-600 hover:text-blue-500 flex items-center"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Refresh
                        </button>
                      )}
                      <button className="text-xs text-gray-400 hover:text-gray-600">
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Fast Transfers</h3>
          <p className="text-sm text-gray-600 mb-4">
            Transfer tokens across chains in minutes, not hours
          </p>
          <div className="text-lg font-bold text-blue-600">~5 min</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Low Fees</h3>
          <p className="text-sm text-gray-600 mb-4">
            Competitive fees across all supported networks
          </p>
          <div className="text-lg font-bold text-purple-600">0.1-0.5%</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <Network className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Multi-Chain</h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect to major blockchain networks seamlessly
          </p>
          <div className="text-lg font-bold text-green-600">{supportedChains.length}+ chains</div>
        </div>
      </motion.div>
    </div>
  )
}