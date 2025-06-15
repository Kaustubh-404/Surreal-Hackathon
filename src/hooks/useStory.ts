import { useState, useEffect, useCallback } from 'react'
import { useWalletClient, useAccount } from 'wagmi'
import { StoryService } from '../services/storyService'
import { storyClientManager } from '../config/storyClient'
import { useAppStore } from '../store/appStore'
import { CONTRACT_ADDRESSES } from '../config/env'
import toast from 'react-hot-toast'

export function useStory() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [storyService, setStoryService] = useState<StoryService | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { setLoading, setError } = useAppStore()

  // Initialize Story client when wallet is connected
  useEffect(() => {
    async function initializeStory() {
      if (!walletClient || !isConnected) {
        setIsInitialized(false)
        return
      }

      try {
        setLoading(true)
        await storyClientManager.initializeWithWallet(walletClient)
        setStoryService(new StoryService())
        setIsInitialized(true)
        setError(null)
      } catch (error) {
        console.error('Failed to initialize Story client:', error)
        setError('Failed to initialize Story client')
        toast.error('Failed to connect to Story Protocol')
      } finally {
        setLoading(false)
      }
    }

    initializeStory()
  }, [walletClient, isConnected, setLoading, setError])

  // Register new IP Asset
  const registerIP = useCallback(async (params: {
    title: string
    description: string
    imageUrl: string
    category: string
    tags: string[]
    commercialUse?: boolean
    commercialRevShare?: number
    derivativesAllowed?: boolean
    transferable?: boolean
    mintingFee?: bigint
  }) => {
    if (!storyService || !isInitialized) {
      throw new Error('Story service not initialized')
    }

    try {
      setLoading(true)

      // First, register the IP asset
      const result = await storyService.registerIPAsset({
        spgNftContract: CONTRACT_ADDRESSES.aeneid.SPG_NFT_IMPL,
        title: params.title,
        description: params.description,
        imageUrl: params.imageUrl,
        category: params.category,
        tags: params.tags,
      })

      // Then create and attach license terms if specified
      if (params.commercialUse !== undefined || params.derivativesAllowed !== undefined) {
        await storyService.createAndAttachLicenseTerms({
          ipId: result.ipId,
          commercialUse: params.commercialUse || false,
          commercialRevShare: params.commercialRevShare || 0,
          derivativesAllowed: params.derivativesAllowed || false,
          transferable: params.transferable || true,
          mintingFee: params.mintingFee,
        })
      }

      toast.success('IP Asset registered successfully!')
      return result
    } catch (error) {
      console.error('Failed to register IP:', error)
      toast.error('Failed to register IP Asset')
      throw error
    } finally {
      setLoading(false)
    }
  }, [storyService, isInitialized, setLoading])

  // Register derivative IP
  const registerDerivative = useCallback(async (params: {
    parentIpIds: string[]
    licenseTermsIds: string[]
    title: string
    description: string
    imageUrl: string
    category: string
    tags: string[]
  }) => {
    if (!storyService || !isInitialized) {
      throw new Error('Story service not initialized')
    }

    try {
      setLoading(true)

      const result = await storyService.registerDerivative({
        spgNftContract: CONTRACT_ADDRESSES.aeneid.SPG_NFT_IMPL,
        parentIpIds: params.parentIpIds,
        licenseTermsIds: params.licenseTermsIds,
        title: params.title,
        description: params.description,
        imageUrl: params.imageUrl,
        category: params.category,
        tags: params.tags,
      })

      toast.success('Derivative IP registered successfully!')
      return result
    } catch (error) {
      console.error('Failed to register derivative:', error)
      toast.error('Failed to register derivative IP')
      throw error
    } finally {
      setLoading(false)
    }
  }, [storyService, isInitialized, setLoading])

  // Mint license token
  const mintLicense = useCallback(async (params: {
    licenseTermsId: string
    licensorIpId: string
    amount: number
    maxMintingFee?: bigint
  }) => {
    if (!storyService || !isInitialized || !address) {
      throw new Error('Story service not initialized or wallet not connected')
    }

    try {
      setLoading(true)

      const result = await storyService.mintLicenseToken({
        licenseTermsId: params.licenseTermsId,
        licensorIpId: params.licensorIpId,
        receiver: address,
        amount: params.amount,
        maxMintingFee: params.maxMintingFee,
      })

      toast.success(`Minted ${params.amount} license token(s)!`)
      return result
    } catch (error) {
      console.error('Failed to mint license:', error)
      toast.error('Failed to mint license token')
      throw error
    } finally {
      setLoading(false)
    }
  }, [storyService, isInitialized, address, setLoading])

  // Pay royalty
  const payRoyalty = useCallback(async (params: {
    receiverIpId: string
    amount: bigint
    payerIpId?: string
  }) => {
    if (!storyService || !isInitialized) {
      throw new Error('Story service not initialized')
    }

    try {
      setLoading(true)

      const result = await storyService.payRoyalty({
        receiverIpId: params.receiverIpId,
        payerIpId: params.payerIpId,
        amount: params.amount,
      })

      toast.success('Royalty payment sent successfully!')
      return result
    } catch (error) {
      console.error('Failed to pay royalty:', error)
      toast.error('Failed to send royalty payment')
      throw error
    } finally {
      setLoading(false)
    }
  }, [storyService, isInitialized, setLoading])

  // Claim revenue
  const claimRevenue = useCallback(async (params: {
    ancestorIpId: string
    childIpIds?: string[]
  }) => {
    if (!storyService || !isInitialized || !address) {
      throw new Error('Story service not initialized or wallet not connected')
    }

    try {
      setLoading(true)

      const result = await storyService.claimRevenue({
        ancestorIpId: params.ancestorIpId,
        claimer: address,
        childIpIds: params.childIpIds,
      })

      toast.success('Revenue claimed successfully!')
      return result
    } catch (error) {
      console.error('Failed to claim revenue:', error)
      toast.error('Failed to claim revenue')
      throw error
    } finally {
      setLoading(false)
    }
  }, [storyService, isInitialized, address, setLoading])

  // Raise dispute
  const raiseDispute = useCallback(async (params: {
    targetIpId: string
    targetTag: 'IMPROPER_REGISTRATION' | 'COPYRIGHT_INFRINGEMENT' | 'TRADEMARK_INFRINGEMENT' | 'OTHER'
  }) => {
    if (!storyService || !isInitialized) {
      throw new Error('Story service not initialized')
    }

    try {
      setLoading(true)

      const result = await storyService.raiseDispute({
        targetIpId: params.targetIpId,
        targetTag: params.targetTag,
      })

      toast.success('Dispute raised successfully!')
      return result
    } catch (error) {
      console.error('Failed to raise dispute:', error)
      toast.error('Failed to raise dispute')
      throw error
    } finally {
      setLoading(false)
    }
  }, [storyService, isInitialized, setLoading])

  // Create NFT collection
  const createNFTCollection = useCallback(async (params: {
    name: string
    symbol: string
    isPublicMinting: boolean
  }) => {
    if (!storyService || !isInitialized) {
      throw new Error('Story service not initialized')
    }

    try {
      setLoading(true)

      const result = await storyService.createNFTCollection(params)

      toast.success('NFT Collection created successfully!')
      return result
    } catch (error) {
      console.error('Failed to create NFT collection:', error)
      toast.error('Failed to create NFT collection')
      throw error
    } finally {
      setLoading(false)
    }
  }, [storyService, isInitialized, setLoading])

  return {
    isInitialized,
    isConnected,
    address,
    registerIP,
    registerDerivative,
    mintLicense,
    payRoyalty,
    claimRevenue,
    raiseDispute,
    createNFTCollection,
  }
}