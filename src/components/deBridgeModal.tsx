import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  ArrowRight, 
  ExternalLink,
  Coins,
  Calculator,
  Clock,
  AlertCircle,
  X
} from 'lucide-react'
import { useAccount } from 'wagmi'
import { useDeBridge } from '../hooks/useDeBridge'
import { formatEther } from 'viem'

interface DeBridgeClaimModalProps {
  isOpen: boolean
  onClose: () => void
  rewardAmount: bigint
  rewardToken: string
  title?: string
}

export default function DeBridgeClaimModal({ 
  isOpen, 
  onClose, 
  rewardAmount, 
  rewardToken,
  title = "Claim Rewards with deBridge"
}: DeBridgeClaimModalProps) {
  const { address } = useAccount()
  const { 
    supportedChains, 
    getQuote, 
    claimWithDeBridge, 
    getTokenAddress, 
    getPopularTokens,
    getChainName,
    buildDeBridgeUrl
  } = useDeBridge()

  const [fromChain, setFromChain] = useState<number>(1315) // Story chain default
  const [toChain, setToChain] = useState<number>(1) // Ethereum default
  const [fromToken, setFromToken] = useState<string>('')
  const [toToken, setToToken] = useState<string>('')
  const [quote, setQuote] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  // Initialize default tokens
  useEffect(() => {
    if (supportedChains.length > 0) {
      // Set default from token (Story native or first available)
      const storyChain = supportedChains.find(c => c.id === 1315)
      if (storyChain) {
        setFromToken(storyChain.nativeToken)
      }
      
      // Set default to token (USDT on destination chain)
      const ethChain = supportedChains.find(c => c.id === 1)
      if (ethChain) {
        const usdtAddress = getTokenAddress(1, 'USDT')
        setToToken(usdtAddress)
      }
    }
  }, [supportedChains, getTokenAddress])

  // Get quote when parameters change
  useEffect(() => {
    const fetchQuote = async () => {
      if (!fromChain || !toChain || !fromToken || !toToken || fromChain === toChain) {
        setQuote(null)
        return
      }

      setIsLoading(true)
      try {
        const amount = parseFloat(formatEther(rewardAmount)).toString()
        const quoteResult = await getQuote({
          srcChainId: fromChain,
          dstChainId: toChain,
          srcTokenAddress: fromToken as `0x${string}`,
          dstTokenAddress: toToken as `0x${string}`,
          amount: (parseFloat(amount) * 1e18).toString(),
        })
        setQuote(quoteResult)
      } catch (error) {
        console.error('Failed to get quote:', error)
        setQuote(null)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchQuote, 500)
    return () => clearTimeout(debounce)
  }, [fromChain, toChain, fromToken, toToken, rewardAmount, getQuote])

  // Update preview URL
  useEffect(() => {
    if (address && fromChain && toChain && fromToken && toToken) {
      const amount = (parseFloat(formatEther(rewardAmount)) * 1e18).toString()
      const url = buildDeBridgeUrl({
        inputChain: fromChain,
        inputCurrency: fromToken,
        outputChain: toChain,
        outputCurrency: toToken,
        address: address,
        amount,
      })
      setPreviewUrl(url)
    }
  }, [address, fromChain, toChain, fromToken, toToken, rewardAmount, buildDeBridgeUrl])

  const handleClaim = () => {
    if (!address) return

    const amount = (parseFloat(formatEther(rewardAmount)) * 1e18).toString()
    
    claimWithDeBridge({
      fromChain,
      toChain,
      fromToken,
      toToken,
      amount,
      userAddress: address,
    })

    onClose()
  }

  const getTokenOptions = (chainId: number) => {
    return getPopularTokens(chainId)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reward Amount */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Coins className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Reward Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {parseFloat(formatEther(rewardAmount)).toFixed(4)} {rewardToken}
              </p>
            </div>
          </div>
        </div>

        {/* Chain Selection */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Chain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Chain
              </label>
              <select
                value={fromChain}
                onChange={(e) => setFromChain(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {supportedChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>

            {/* To Chain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Chain
              </label>
              <select
                value={toChain}
                onChange={(e) => setToChain(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {supportedChains
                  .filter(chain => chain.id !== fromChain)
                  .map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{getChainName(fromChain)}</span>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">{getChainName(toChain)}</span>
            </div>
          </div>

          {/* Token Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Token
              </label>
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getTokenOptions(fromChain).map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.name}
                  </option>
                ))}
              </select>
            </div>

            {/* To Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Token
              </label>
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getTokenOptions(toChain).map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quote Display */}
        {isLoading && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-gray-400 animate-spin" />
              <span className="text-sm text-gray-600">Getting quote...</span>
            </div>
          </div>
        )}

        {quote && !isLoading && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Exchange Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">You'll receive:</span>
                <span className="font-medium">≈ {parseFloat(quote.estimatedAmount).toFixed(4)} tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bridge fee:</span>
                <span className="font-medium">{parseFloat(quote.fee).toFixed(4)} tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated time:</span>
                <span className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.ceil(quote.estimatedTime / 60)} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price impact:</span>
                <span className="font-medium">{quote.priceImpact.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800">Important Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This will open the deBridge interface in a new tab. Please complete the transaction there and return to track your progress.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          {previewUrl && (
            <button
              onClick={() => window.open(previewUrl, '_blank')}
              className="px-4 py-3 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Preview</span>
            </button>
          )}
          
          <button
            onClick={handleClaim}
            disabled={!quote || isLoading || !address}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            <Globe className="h-4 w-4" />
            <span>Claim with deBridge</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}