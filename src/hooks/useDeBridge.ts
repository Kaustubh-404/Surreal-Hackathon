import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'
import { DeBridgeService, type DeBridgeChain, type DeBridgeQuote, type DeBridgeSwapParams } from '../services/deBridgeService'
import { useAppStore } from '../store/appStore'
import { PaymentStatus } from '../types/global'
import toast from 'react-hot-toast'

export function useDeBridge() {
  const { address, isConnected } = useAccount()
  const [deBridgeService] = useState(() => new DeBridgeService())
  const [supportedChains, setSupportedChains] = useState<DeBridgeChain[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const { 
    setLoading, 
    setError, 
    crossChainPayments, 
    addCrossChainPayment, 
    updateCrossChainPayment 
  } = useAppStore()

  // Initialize deBridge service
  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true)
        setInitError(null)
        
        const chains = await deBridgeService.getSupportedChains()
        setSupportedChains(chains)
        setIsInitialized(true)
        setError(null)
      } catch (error) {
        console.error('Failed to initialize deBridge:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize cross-chain service'
        setInitError(errorMessage)
        setError(errorMessage)
        
        // Set basic initialization even if API fails
        setSupportedChains([
          { id: 1, name: 'Ethereum', symbol: 'ETH', nativeToken: '0x0000000000000000000000000000000000000000', supported: true },
          { id: 137, name: 'Polygon', symbol: 'MATIC', nativeToken: '0x0000000000000000000000000000000000000000', supported: true },
          { id: 56, name: 'BSC', symbol: 'BNB', nativeToken: '0x0000000000000000000000000000000000000000', supported: true },
          { id: 1315, name: 'Story Aeneid', symbol: 'IP', nativeToken: '0x0000000000000000000000000000000000000000', supported: true },
        ])
        setIsInitialized(true) // Allow basic functionality even with errors
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [deBridgeService, setLoading, setError])

  // Get quote for cross-chain transfer
  const getQuote = useCallback(async (params: {
    srcChainId: number
    dstChainId: number
    srcTokenAddress: Address
    dstTokenAddress: Address
    amount: string
  }): Promise<DeBridgeQuote | null> => {
    if (!isInitialized) {
      const errorMsg = initError || 'deBridge service not initialized'
      toast.error(errorMsg)
      throw new Error(errorMsg)
    }

    try {
      const quote = await deBridgeService.getQuote(params)
      return quote
    } catch (error) {
      console.error('Failed to get quote:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to get cross-chain quote'
      toast.error(errorMessage)
      return null
    }
  }, [deBridgeService, isInitialized, initError])

  // Open deBridge interface for cross-chain swap
  const openDeBridgeSwap = useCallback((params: DeBridgeSwapParams) => {
    if (!isInitialized) {
      const errorMsg = initError || 'deBridge service not initialized'
      toast.error(errorMsg)
      return
    }

    try {
      // Create a payment record for tracking
      const paymentRecord = deBridgeService.createPaymentRecord(params)
      addCrossChainPayment(paymentRecord)
      
      // Open deBridge interface
      deBridgeService.openDeBridge(params)
      
      toast.success('Opening deBridge interface...')
    } catch (error) {
      console.error('Failed to open deBridge:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to open deBridge interface'
      toast.error(errorMessage)
    }
  }, [deBridgeService, isInitialized, addCrossChainPayment, initError])

  // Claim rewards with deBridge
  const claimWithDeBridge = useCallback((params: {
    fromChain: number
    toChain: number
    fromToken: string
    toToken: string
    amount: string
    userAddress: string
  }) => {
    if (!isInitialized) {
      const errorMsg = initError || 'deBridge service not initialized'
      toast.error(errorMsg)
      return
    }

    const swapParams: DeBridgeSwapParams = {
      inputChain: params.fromChain,
      inputCurrency: params.fromToken,
      outputChain: params.toChain,
      outputCurrency: params.toToken,
      address: params.userAddress,
      amount: params.amount,
    }

    openDeBridgeSwap(swapParams)
  }, [openDeBridgeSwap, isInitialized, initError])

  // Pay AI agent service with cross-chain
  const payAIAgentService = useCallback(async (params: {
    agentAddress: Address
    serviceId: string
    amount: bigint
    token: Address
    sourceChain: number
    targetChain: number
    metadata: any
  }) => {
    if (!isInitialized) {
      const errorMsg = initError || 'deBridge service not initialized'
      toast.error(errorMsg)
      throw new Error(errorMsg)
    }

    if (!isConnected || !address) {
      toast.error('Please connect your wallet')
      throw new Error('Wallet not connected')
    }

    try {
      // Create cross-chain payment for AI service
      const swapParams: DeBridgeSwapParams = {
        inputChain: params.sourceChain,
        inputCurrency: params.token,
        outputChain: params.targetChain,
        outputCurrency: params.token,
        address: params.agentAddress,
        amount: params.amount.toString(),
      }

      // Track the payment
      const paymentRecord = deBridgeService.createPaymentRecord(swapParams)
      paymentRecord.metadata = params.metadata
      addCrossChainPayment(paymentRecord)

      // Open deBridge for payment
      deBridgeService.openDeBridge(swapParams)
      
      toast.success('Processing AI agent payment...')
    } catch (error) {
      console.error('Failed to pay AI agent:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to process AI agent payment'
      toast.error(errorMessage)
      throw error
    }
  }, [deBridgeService, isInitialized, isConnected, address, addCrossChainPayment, initError])

  // Get token address for a chain and symbol
  const getTokenAddress = useCallback((chainId: number, symbol: string): string => {
    try {
      return deBridgeService.getTokenAddress(chainId, symbol)
    } catch (error) {
      console.warn('Failed to get token address:', error)
      return '0x0000000000000000000000000000000000000000'
    }
  }, [deBridgeService])

  // Get popular tokens for a chain
  const getPopularTokens = useCallback((chainId: number) => {
    try {
      return deBridgeService.getPopularTokens(chainId)
    } catch (error) {
      console.warn('Failed to get popular tokens:', error)
      return [{ symbol: 'NATIVE', address: '0x0000000000000000000000000000000000000000', name: 'Native Token' }]
    }
  }, [deBridgeService])

  // Check if chain/token is supported
  const isSupported = useCallback((chainId: number, tokenAddress?: string): boolean => {
    try {
      return deBridgeService.isSupported(chainId, tokenAddress)
    } catch (error) {
      console.warn('Failed to check support:', error)
      return supportedChains.some(chain => chain.id === chainId)
    }
  }, [deBridgeService, supportedChains])

  // Format amount for deBridge
  const formatAmount = useCallback((amount: string, decimals: number = 18): string => {
    try {
      return deBridgeService.formatAmount(amount, decimals)
    } catch (error) {
      console.warn('Failed to format amount:', error)
      const num = parseFloat(amount)
      return (num * Math.pow(10, decimals)).toString()
    }
  }, [deBridgeService])

  // Parse amount from wei
  const parseAmount = useCallback((amount: string, decimals: number = 18): string => {
    try {
      return deBridgeService.parseAmount(amount, decimals)
    } catch (error) {
      console.warn('Failed to parse amount:', error)
      const num = parseFloat(amount)
      return (num / Math.pow(10, decimals)).toFixed(6)
    }
  }, [deBridgeService])

  // Get chain name
  const getChainName = useCallback((chainId: number): string => {
    try {
      return deBridgeService.getChainName(chainId)
    } catch (error) {
      const chain = supportedChains.find(c => c.id === chainId)
      return chain?.name || `Chain ${chainId}`
    }
  }, [deBridgeService, supportedChains])

  // Build deBridge URL (for preview or sharing)
  const buildDeBridgeUrl = useCallback((params: DeBridgeSwapParams): string => {
    try {
      return deBridgeService.buildDeBridgeUrl(params)
    } catch (error) {
      console.warn('Failed to build URL:', error)
      return `https://app.debridge.finance/deswap?inputChain=${params.inputChain}&outputChain=${params.outputChain}`
    }
  }, [deBridgeService])

  // Update payment status (manual update since we don't have API)
  const updatePaymentStatus = useCallback((txHash: string, status: PaymentStatus) => {
    try {
      updateCrossChainPayment(txHash, { status })
      
      const statusMessage = {
        [PaymentStatus.CONFIRMED]: 'Transaction confirmed!',
        [PaymentStatus.FAILED]: 'Transaction failed',
        [PaymentStatus.CANCELLED]: 'Transaction cancelled',
        [PaymentStatus.PENDING]: 'Transaction pending...',
      }[status]

      if (statusMessage && status !== PaymentStatus.PENDING) {
        if (status === PaymentStatus.CONFIRMED) {
          toast.success(statusMessage)
        } else {
          toast.error(statusMessage)
        }
      }
    } catch (error) {
      console.error('Failed to update payment status:', error)
    }
  }, [updateCrossChainPayment])

  return {
    isInitialized,
    isConnected,
    initError,
    supportedChains,
    crossChainPayments,
    getQuote,
    openDeBridgeSwap,
    claimWithDeBridge,
    payAIAgentService,
    getTokenAddress,
    getPopularTokens,
    isSupported,
    formatAmount,
    parseAmount,
    getChainName,
    buildDeBridgeUrl,
    updatePaymentStatus,
  }
}