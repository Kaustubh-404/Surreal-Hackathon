import type { Address } from 'viem'
import { ENV, API_ENDPOINTS } from '../config/env'
import { PaymentStatus, type CrossChainPayment } from '../types/global'

export interface DeBridgeChain {
  id: number
  name: string
  symbol: string
  tokenAddress: Address
  supported: boolean
}

export interface DeBridgeQuote {
  estimatedAmount: string
  fee: string
  estimatedTime: number
  route: any[]
}

export interface DeTipPayment {
  amount: bigint
  token: Address
  recipient: Address
  sourceChain: number
  targetChain: number
  message?: string
}

export class DeBridgeService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = ENV.DEBRIDGE_API_KEY || ''
    this.baseUrl = API_ENDPOINTS.DEBRIDGE_API
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`DeBridge API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getSupportedChains(): Promise<DeBridgeChain[]> {
    try {
      const response = await this.makeRequest('/chains')
      
      // Filter for commonly used chains and add Story when supported
      const supportedChains: DeBridgeChain[] = [
        {
          id: 1,
          name: 'Ethereum',
          symbol: 'ETH',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          supported: true,
        },
        {
          id: 137,
          name: 'Polygon',
          symbol: 'MATIC',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          supported: true,
        },
        {
          id: 56,
          name: 'BSC',
          symbol: 'BNB',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          supported: true,
        },
        {
          id: 43114,
          name: 'Avalanche',
          symbol: 'AVAX',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          supported: true,
        },
        {
          id: 1315, // Story Aeneid Testnet
          name: 'Story Aeneid',
          symbol: 'IP',
          tokenAddress: '0x1514000000000000000000000000000000000000',
          supported: true,
        },
      ]

      return supportedChains
    } catch (error) {
      console.error('Failed to get supported chains:', error)
      return []
    }
  }

  async getQuote(params: {
    srcChainId: number
    dstChainId: number
    srcTokenAddress: Address
    dstTokenAddress: Address
    amount: string
  }): Promise<DeBridgeQuote | null> {
    try {
      const queryParams = new URLSearchParams({
        srcChainId: params.srcChainId.toString(),
        dstChainId: params.dstChainId.toString(),
        srcTokenAddress: params.srcTokenAddress,
        dstTokenAddress: params.dstTokenAddress,
        amount: params.amount,
      })

      const response = await this.makeRequest(`/quote?${queryParams}`)
      
      return {
        estimatedAmount: response.estimatedDstTokenAmount || '0',
        fee: response.fixedNativeFeeAmount || '0',
        estimatedTime: response.estimatedTime || 300, // 5 minutes default
        route: response.route || [],
      }
    } catch (error) {
      console.error('Failed to get quote:', error)
      return null
    }
  }

  async createDeTipTransaction(payment: DeTipPayment): Promise<{
    orderId: string
    txData: any
    recipient: Address
  }> {
    try {
      // Create deTip transaction data
      const orderData = {
        srcChainId: payment.sourceChain,
        dstChainId: payment.targetChain,
        srcTokenAddress: payment.token,
        amount: payment.amount.toString(),
        recipient: payment.recipient,
        message: payment.message || '',
        metadata: {
          type: 'ai_agent_payment',
          platform: 'ip_guardian',
          timestamp: Date.now(),
        },
      }

      const response = await this.makeRequest('/order', {
        method: 'POST',
        body: JSON.stringify(orderData),
      })

      return {
        orderId: response.orderId,
        txData: response.txData,
        recipient: payment.recipient,
      }
    } catch (error) {
      console.error('Failed to create deTip transaction:', error)
      throw new Error('Failed to create cross-chain payment')
    }
  }

  async trackPayment(orderId: string): Promise<CrossChainPayment | null> {
    try {
      const response = await this.makeRequest(`/order/${orderId}`)
      
      const status: PaymentStatus = this.mapOrderStatus(response.status)
      
      return {
        txHash: response.srcTxHash || orderId,
        sourceChain: response.srcChainId?.toString() || 'unknown',
        targetChain: response.dstChainId?.toString() || 'unknown',
        amount: BigInt(response.amount || '0'),
        token: response.srcTokenAddress as Address,
        recipient: response.recipient as Address,
        status,
      }
    } catch (error) {
      console.error('Failed to track payment:', error)
      return null
    }
  }

  private mapOrderStatus(status: string): PaymentStatus {
    switch (status?.toLowerCase()) {
      case 'created':
      case 'pending':
        return PaymentStatus.PENDING
      case 'fulfilled':
      case 'completed':
        return PaymentStatus.CONFIRMED
      case 'cancelled':
        return PaymentStatus.CANCELLED
      case 'failed':
        return PaymentStatus.FAILED
      default:
        return PaymentStatus.PENDING
    }
  }

  async estimateGas(params: {
    srcChainId: number
    dstChainId: number
    amount: string
  }): Promise<{ gasEstimate: string; gasPrice: string }> {
    try {
      const response = await this.makeRequest('/gas-estimate', {
        method: 'POST',
        body: JSON.stringify(params),
      })

      return {
        gasEstimate: response.gasEstimate || '21000',
        gasPrice: response.gasPrice || '20000000000', // 20 gwei default
      }
    } catch (error) {
      console.error('Failed to estimate gas:', error)
      return {
        gasEstimate: '21000',
        gasPrice: '20000000000',
      }
    }
  }

  // Cross-chain royalty distribution
  async distributeRoyalties(params: {
    totalAmount: bigint
    token: Address
    recipients: Array<{
      address: Address
      percentage: number
      chainId: number
    }>
    sourceChain: number
  }): Promise<{ orderIds: string[]; totalFees: bigint }> {
    try {
      const distributions = []
      let totalFees = 0n

      for (const recipient of params.recipients) {
        const amount = (params.totalAmount * BigInt(recipient.percentage)) / 100n
        
        if (recipient.chainId === params.sourceChain) {
          // Same chain - direct transfer (would need to implement)
          continue
        }

        // Cross-chain transfer
        const order = await this.createDeTipTransaction({
          amount,
          token: params.token,
          recipient: recipient.address,
          sourceChain: params.sourceChain,
          targetChain: recipient.chainId,
          message: `Royalty payment - ${recipient.percentage}%`,
        })

        distributions.push(order.orderId)

        // Add estimated fees (simplified)
        totalFees += BigInt('1000000000000000') // 0.001 ETH estimated fee
      }

      return {
        orderIds: distributions,
        totalFees,
      }
    } catch (error) {
      console.error('Failed to distribute royalties:', error)
      throw new Error('Failed to distribute cross-chain royalties')
    }
  }

  // AI Agent Service Payments
  async payAIAgentService(params: {
    agentAddress: Address
    serviceId: string
    amount: bigint
    token: Address
    sourceChain: number
    targetChain: number
    metadata?: any
  }): Promise<{ orderId: string; estimatedTime: number }> {
    try {
      const payment: DeTipPayment = {
        amount: params.amount,
        token: params.token,
        recipient: params.agentAddress,
        sourceChain: params.sourceChain,
        targetChain: params.targetChain,
        message: `AI Agent Service Payment - ${params.serviceId}`,
      }

      const result = await this.createDeTipTransaction(payment)

      return {
        orderId: result.orderId,
        estimatedTime: 300, // 5 minutes estimated
      }
    } catch (error) {
      console.error('Failed to pay AI agent service:', error)
      throw new Error('Failed to process AI agent payment')
    }
  }

  // Plugin interface for AI Agents
  createAIAgentPlugin() {
    return {
      name: 'deBridge-crosschain',
      version: '1.0.0',
      description: 'Cross-chain payment plugin for AI agents',
      
      actions: {
        payService: this.payAIAgentService.bind(this),
        trackPayment: this.trackPayment.bind(this),
        getSupportedChains: this.getSupportedChains.bind(this),
        getQuote: this.getQuote.bind(this),
      },
      
      config: {
        supportedChains: [1, 137, 56, 43114, 1315], // Ethereum, Polygon, BSC, Avalanche, Story
        defaultToken: '0x0000000000000000000000000000000000000000', // Native token
        maxAmount: '1000000000000000000000', // 1000 tokens
        minAmount: '1000000000000000', // 0.001 tokens
      },
    }
  }
}