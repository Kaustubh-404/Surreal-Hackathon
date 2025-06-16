import type { Address } from 'viem'
import { PaymentStatus, type CrossChainPayment } from '../types/global'

export interface DeBridgeChain {
  id: number
  name: string
  symbol: string
  nativeToken: string
  supported: boolean
  rpcUrl?: string
}

export interface DeBridgeSwapParams {
  inputChain: number
  inputCurrency: string
  outputChain: number
  outputCurrency: string
  address: string
  amount: string
  r?: string // referral code
}

export interface DeBridgeQuote {
  estimatedAmount: string
  fee: string
  estimatedTime: number
  priceImpact: number
}

export class DeBridgeService {
  private readonly DEBRIDGE_BASE_URL = 'https://app.debridge.finance/deswap'
  private readonly referralCode = '111' // You can customize this

  // Supported chains for deBridge
  private supportedChains: DeBridgeChain[] = [
    {
      id: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      nativeToken: '0x0000000000000000000000000000000000000000',
      supported: true,
    },
    {
      id: 56,
      name: 'BSC',
      symbol: 'BNB', 
      nativeToken: '0x0000000000000000000000000000000000000000',
      supported: true,
    },
    {
      id: 137,
      name: 'Polygon',
      symbol: 'MATIC',
      nativeToken: '0x0000000000000000000000000000000000000000',
      supported: true,
    },
    {
      id: 43114,
      name: 'Avalanche',
      symbol: 'AVAX',
      nativeToken: '0x0000000000000000000000000000000000000000',
      supported: true,
    },
    {
      id: 42161,
      name: 'Arbitrum',
      symbol: 'ETH',
      nativeToken: '0x0000000000000000000000000000000000000000',
      supported: true,
    },
    {
      id: 10,
      name: 'Optimism',
      symbol: 'ETH',
      nativeToken: '0x0000000000000000000000000000000000000000',
      supported: true,
    }
  ]

  // Common token addresses for each chain
  private tokenAddresses: Record<number, Record<string, string>> = {
    1: { // Ethereum
      'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
      'USDC': '0xa0b86a33e6e6b57ff7e4f7de6f44896c1e92b89e',
      'ETH': '0x0000000000000000000000000000000000000000',
    },
    56: { // BSC
      'USDT': '0x55d398326f99059ff775485246999027b3197955',
      'USDC': '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      'BNB': '0x0000000000000000000000000000000000000000',
    },
    137: { // Polygon
      'USDT': '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      'USDC': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      'MATIC': '0x0000000000000000000000000000000000000000',
    },
    43114: { // Avalanche
      'USDT': '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
      'USDC': '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
      'AVAX': '0x0000000000000000000000000000000000000000',
    },
    42161: { // Arbitrum
      'USDT': '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      'USDC': '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      'ETH': '0x0000000000000000000000000000000000000000',
    },
    10: { // Optimism
      'USDT': '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      'USDC': '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      'ETH': '0x0000000000000000000000000000000000000000',
    }
  }

  constructor() {
    // No API key needed for public interface
  }

  async getSupportedChains(): Promise<DeBridgeChain[]> {
    return this.supportedChains.filter(chain => chain.supported)
  }

  getTokenAddress(chainId: number, symbol: string): string {
    return this.tokenAddresses[chainId]?.[symbol] || '0x0000000000000000000000000000000000000000'
  }

  buildDeBridgeUrl(params: DeBridgeSwapParams): string {
    const urlParams = new URLSearchParams({
      inputChain: params.inputChain.toString(),
      inputCurrency: params.inputCurrency,
      outputChain: params.outputChain.toString(),
      outputCurrency: params.outputCurrency,
      address: params.address,
      amount: params.amount,
      r: params.r || this.referralCode,
    })

    return `${this.DEBRIDGE_BASE_URL}?${urlParams.toString()}`
  }

  // Mock quote estimation (since we don't have API access)
  async getQuote(params: {
    srcChainId: number
    dstChainId: number
    srcTokenAddress: Address
    dstTokenAddress: Address
    amount: string
  }): Promise<DeBridgeQuote | null> {
    try {
      // Mock estimation based on amount and cross-chain complexity
      const baseAmount = parseFloat(params.amount)
      const fee = baseAmount * 0.003 // 0.3% estimated fee
      const estimatedAmount = baseAmount - fee
      
      // Estimate time based on chain combination
      let estimatedTime = 300 // 5 minutes base
      if (params.srcChainId === 1 || params.dstChainId === 1) {
        estimatedTime = 600 // 10 minutes for Ethereum
      }
      
      return {
        estimatedAmount: estimatedAmount.toString(),
        fee: fee.toString(),
        estimatedTime,
        priceImpact: 0.1, // 0.1% estimated price impact
      }
    } catch (error) {
      console.error('Failed to get quote:', error)
      return null
    }
  }

  // Open deBridge interface in new tab
  openDeBridge(params: DeBridgeSwapParams): void {
    const url = this.buildDeBridgeUrl(params)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Create a mock transaction record for tracking
  createPaymentRecord(params: DeBridgeSwapParams): CrossChainPayment {
    const mockTxHash = `debridge_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    return {
      txHash: mockTxHash,
      sourceChain: params.inputChain.toString(),
      targetChain: params.outputChain.toString(),
      amount: BigInt(params.amount),
      token: params.inputCurrency as Address,
      recipient: params.address as Address,
      status: PaymentStatus.PENDING,
    }
  }

  // Helper to get chain name by ID
  getChainName(chainId: number): string {
    const chain = this.supportedChains.find(c => c.id === chainId)
    return chain?.name || `Chain ${chainId}`
  }

  // Helper to get popular token symbols for a chain
  getPopularTokens(chainId: number): Array<{symbol: string, address: string, name: string}> {
    const tokens = this.tokenAddresses[chainId] || {}
    const chainInfo = this.supportedChains.find(c => c.id === chainId)
    
    return Object.entries(tokens).map(([symbol, address]) => ({
      symbol,
      address,
      name: symbol === chainInfo?.symbol ? `${symbol} (Native)` : symbol
    }))
  }

  // Validate if a chain and token combination is supported
  isSupported(chainId: number, tokenAddress?: string): boolean {
    const chain = this.supportedChains.find(c => c.id === chainId)
    if (!chain?.supported) return false
    
    if (tokenAddress) {
      const tokens = this.tokenAddresses[chainId] || {}
      return Object.values(tokens).includes(tokenAddress) || 
             tokenAddress === '0x0000000000000000000000000000000000000000'
    }
    
    return true
  }

  // Format amount for deBridge (18 decimals)
  formatAmount(amount: string, decimals: number = 18): string {
    const num = parseFloat(amount)
    return (num * Math.pow(10, decimals)).toString()
  }

  // Parse amount from wei to human readable
  parseAmount(amount: string, decimals: number = 18): string {
    const num = parseFloat(amount)
    return (num / Math.pow(10, decimals)).toFixed(6)
  }

  // Helper to format ether values consistently
  formatEtherValue(value: bigint, decimals: number = 4): string {
    const etherValue = Number(value) / 1e18
    return etherValue.toFixed(decimals)
  }
}