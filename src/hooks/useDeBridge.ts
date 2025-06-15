import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'
import { DeBridgeService, type DeBridgeChain, type DeBridgeQuote, type DeTipPayment } from '../services/deBridgeService'
import { useAppStore } from '../store/appStore'
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

  // Create deTip payment for AI agent services
  const payAIAgentService = useCallback(async (params: {
    agentAddress: Address
    serviceId: string
    amount: bigint
    token: Address
    sourceChain: number
    targetChain: number
    metadata?: any
  }) => {
    if (!isInitialized || !isConnected) {
      throw new Error('deBridge service not initialized or wallet not connected')
    }

    try {
      setLoading(true)

      const result = await deBridgeService.payAIAgentService(params)
      
      // Track the payment in our store
      const payment = {
        txHash: result.orderId,
        sourceChain: params.sourceChain.toString(),
        targetChain: params.targetChain.toString(),
        amount: params.amount,
        token: params.token,
        recipient: params.agentAddress,
        status: 'pending' as const,
      }
      
      addCrossChainPayment(payment)
      toast.success('AI Agent payment initiated!')
      
      return result
    } catch (error) {
      console.error('Failed to pay AI agent:', error)
      toast.error('Failed to process AI agent payment')
      throw error
    } finally {
      setLoading(false)
    }
  }, [deBridgeService, isInitialized, isConnected, setLoading, addCrossChainPayment])

  // Send deTip payment
  const sendDeTip = useCallback(async (payment: DeTipPayment) => {
    if (!isInitialized || !isConnected) {
      throw new Error('deBridge service not initialized or wallet not connected')
    }

    try {
      setLoading(true)

      const result = await deBridgeService.createDeTipTransaction(payment)
      
      // Track the payment
      const crossChainPayment = {
        txHash: result.orderId,
        sourceChain: payment.sourceChain.toString(),
        targetChain: payment.targetChain.toString(),
        amount: payment.amount,
        token: payment.token,
        recipient: payment.recipient,
        status: 'pending' as const,
      }
      
      addCrossChainPayment(crossChainPayment)
      toast.success('Cross-chain payment initiated!')
      
      return result
    } catch (error) {
      console.error('Failed to send deTip:', error)
      toast.error('Failed to send cross-chain payment')
      throw error
    } finally {
      setLoading(false)
    }
  }, [deBridgeService, isInitialized, isConnected, setLoading, addCrossChainPayment])

  // Track payment status
  const trackPayment = useCallback(async (orderId: string) => {
    if (!isInitialized) {
      throw new Error('deBridge service not initialized')
    }

    try {
      const payment = await deBridgeService.trackPayment(orderId)
      
      if (payment) {
        updateCrossChainPayment(orderId, payment)
      }
      
      return payment
    } catch (error) {
      console.error('Failed to track payment:', error)
      return null
    }
  }, [deBridgeService, isInitialized, updateCrossChainPayment])

  // Distribute royalties across chains
  const distributeRoyalties = useCallback(async (params: {
    totalAmount: bigint
    token: Address
    recipients: Array<{
      address: Address
      percentage: number
      chainId: number
    }>
    sourceChain: number
  }) => {
    if (!isInitialized || !isConnected) {
      throw new Error('deBridge service not initialized or wallet not connected')
    }

    try {
      setLoading(true)

      const result = await deBridgeService.distributeRoyalties(params)
      
      // Track all payments
      for (const orderId of result.orderIds) {
        const payment = {
          txHash: orderId,
          sourceChain: params.sourceChain.toString(),
          targetChain: 'multiple',
          amount: params.totalAmount,
          token: params.token,
          recipient: '0x0000000000000000000000000000000000000000' as Address, // Multiple recipients
          status: 'pending' as const,
        }
        
        addCrossChainPayment(payment)
      }

      toast.success('Cross-chain royalty distribution initiated!')
      return result
    } catch (error) {
      console.error('Failed to distribute royalties:', error)
      toast.error('Failed to distribute cross-chain royalties')
      throw error
    } finally {
      setLoading(false)
    }
  }, [deBridgeService, isInitialized, isConnected, setLoading, addCrossChainPayment])

  // Estimate gas for cross-chain transaction
  const estimateGas = useCallback(async (params: {
    srcChainId: number
    dstChainId: number
    amount: string
  }) => {
    if (!isInitialized) {
      throw new Error('deBridge service not initialized')
    }

    try {
      const estimate = await deBridgeService.estimateGas(params)
      return estimate
    } catch (error) {
      console.error('Failed to estimate gas:', error)
      return null
    }
  }, [deBridgeService, isInitialized])

  // Get AI Agent plugin interface
  const getAIAgentPlugin = useCallback(() => {
    return deBridgeService.createAIAgentPlugin()
  }, [deBridgeService])

  // Monitor pending payments
  useEffect(() => {
    if (!isInitialized) return

    const interval = setInterval(async () => {
      const pendingPayments = crossChainPayments.filter(p => p.status === 'pending')
      
      for (const payment of pendingPayments) {
        try {
          await trackPayment(payment.txHash)
        } catch (error) {
          console.error('Failed to track payment:', payment.txHash, error)
        }
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isInitialized, crossChainPayments, trackPayment])

  return {
    isInitialized,
    isConnected,
    supportedChains,
    crossChainPayments,
    getQuote,
    sendDeTip,
    payAIAgentService,
    trackPayment,
    distributeRoyalties,
    estimateGas,
    getAIAgentPlugin,
  }
}