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
        const chains = await deBridgeService.getSupportedChains()
        setSupportedChains(chains)
        setIsInitialized(true)
        setError(null)
      } catch (error) {
        console.error('Failed to initialize deBridge:', error)
        setError('Failed to initialize cross-chain service')
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
      throw new Error('deBridge service not initialized')
    }

    try {
      const quote = await deBridgeService.getQuote(params)
      return quote
    } catch (error) {
      console.error('Failed to get quote:', error)
      toast.error('Failed to get cross-chain quote')
      return null
    }
  }, [deBridgeService, isInitialized])

  // Open deBridge interface for cross-chain swap
  const openDeBridgeSwap = useCallback((params: DeBridgeSwapParams) => {
    if (!isInitialized) {
      toast.error('deBridge service not initialized')
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
      toast.error('Failed to open deBridge interface')
    }
  }, [deBridgeService, isInitialized, addCrossChainPayment])

  // Claim rewards with deBridge
  const claimWithDeBridge = useCallback((params: {
    fromChain: number
    toChain: number
    fromToken: string
    toToken: string
    amount: string
    userAddress: string
  }) => {
    const swapParams: DeBridgeSwapParams = {
      inputChain: params.fromChain,
      inputCurrency: params.fromToken,
      outputChain: params.toChain,
      outputCurrency: params.toToken,
      address: params.userAddress,
      amount: params.amount,
    }

    openDeBridgeSwap(swapParams)
  }, [openDeBridgeSwap])

  // Get token address for a chain and symbol
  const getTokenAddress = useCallback((chainId: number, symbol: string): string => {
    return deBridgeService.getTokenAddress(chainId, symbol)
  }, [deBridgeService])

  // Get popular tokens for a chain
  const getPopularTokens = useCallback((chainId: number) => {
    return deBridgeService.getPopularTokens(chainId)
  }, [deBridgeService])

  // Check if chain/token is supported
  const isSupported = useCallback((chainId: number, tokenAddress?: string): boolean => {
    return deBridgeService.isSupported(chainId, tokenAddress)
  }, [deBridgeService])

  // Format amount for deBridge
  const formatAmount = useCallback((amount: string, decimals: number = 18): string => {
    return deBridgeService.formatAmount(amount, decimals)
  }, [deBridgeService])

  // Parse amount from wei
  const parseAmount = useCallback((amount: string, decimals: number = 18): string => {
    return deBridgeService.parseAmount(amount, decimals)
  }, [deBridgeService])

  // Get chain name
  const getChainName = useCallback((chainId: number): string => {
    return deBridgeService.getChainName(chainId)
  }, [deBridgeService])

  // Build deBridge URL (for preview or sharing)
  const buildDeBridgeUrl = useCallback((params: DeBridgeSwapParams): string => {
    return deBridgeService.buildDeBridgeUrl(params)
  }, [deBridgeService])

  // Update payment status (manual update since we don't have API)
  const updatePaymentStatus = useCallback((txHash: string, status: PaymentStatus) => {
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
  }, [updateCrossChainPayment])

  return {
    isInitialized,
    isConnected,
    supportedChains,
    crossChainPayments,
    getQuote,
    openDeBridgeSwap,
    claimWithDeBridge,
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