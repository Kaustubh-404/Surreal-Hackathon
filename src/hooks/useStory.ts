// src/hooks/useStory.ts - Fixed implementation with correct DisputeTargetTag
import { useState, useEffect, useCallback } from 'react'
import { useWalletClient, useAccount } from 'wagmi'
import { StoryService } from '../services/storyService'
import { storyClientManager } from '../config/storyClient'
import { useAppStore } from '../store/appStore'
import { CONTRACT_ADDRESSES } from '../config/env'
import { DisputeTargetTag } from '@story-protocol/core-sdk' // Import the correct type
import toast from 'react-hot-toast'

export function useStory() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [storyService, setStoryService] = useState<StoryService | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setLoading: setGlobalLoading, setError, addIPAsset, addReport } = useAppStore()

  // Initialize Story client when wallet is connected
  useEffect(() => {
    async function initializeStory() {
      try {
        setIsLoading(true)
        setError(null)

        if (walletClient && isConnected && address) {
          console.log('Initializing Story client with wallet...')
          await storyClientManager.initializeWithWallet(walletClient)
          const service = new StoryService()
          setStoryService(service)
          setIsInitialized(true)
          console.log('Story client initialized successfully')
        } else {
          // Reset when wallet disconnected
          storyClientManager.reset()
          setStoryService(null)
          setIsInitialized(false)
          console.log('Story client reset - wallet required')
        }
      } catch (error) {
        console.error('Failed to initialize Story client:', error)
        setError('Failed to initialize Story client')
        setIsInitialized(false)
        storyClientManager.reset()
        setStoryService(null)
        toast.error('Failed to initialize Story client')
      } finally {
        setIsLoading(false)
      }
    }

    initializeStory()
  }, [walletClient, isConnected, address, setError])

  // Create NFT Collection
  const createNFTCollection = useCallback(async (params: {
    name: string
    symbol: string
    isPublicMinting: boolean
  }) => {
    if (!storyService || !isInitialized) {
      throw new Error('Story service not initialized')
    }

    try {
      setGlobalLoading(true)
      const result = await storyService.createNFTCollection(params)
      toast.success('NFT Collection created successfully!')
      return result
    } catch (error) {
      console.error('Failed to create NFT collection:', error)
      toast.error('Failed to create NFT collection')
      throw error
    } finally {
      setGlobalLoading(false)
    }
  }, [storyService, isInitialized, setGlobalLoading])

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
    spgNftContract?: string
  }) => {
    if (!storyService || !isInitialized || !isConnected) {
      throw new Error('Story service not initialized or wallet not connected')
    }

    try {
      setGlobalLoading(true)
      
      // Use provided SPG contract or default one
      const spgContract = params.spgNftContract || CONTRACT_ADDRESSES.aeneid.SPG_NFT_IMPL

      // First, register the IP asset
      console.log('Starting IP registration process...')
      const result = await storyService.registerIPAsset({
        spgNftContract: spgContract as `0x${string}`,
        title: params.title,
        description: params.description,
        imageUrl: params.imageUrl,
        category: params.category,
        tags: params.tags,
      })

      // Add to app store
      addIPAsset({
        id: result.ipId,
        tokenId: result.tokenId,
        title: params.title,
        description: params.description,
        category: params.category as any,
        ipfsHash: '',
        metadataURI: '',
        owner: address!,
        creator: address!,
        licenseTerms: {
          commercial: params.commercialUse || false,
          derivatives: params.derivativesAllowed || false,
          attribution: true,
          shareAlike: false,
        },
        royaltyPolicy: CONTRACT_ADDRESSES.aeneid.ROYALTY_POLICY_LAP,
        registeredAt: new Date(),
        lastUpdated: new Date(),
        status: 'active',
        tags: params.tags,
        earnings: BigInt(0),
        views: 0,
        likes: 0,
      })

      // Then create and attach license terms if specified
      if (params.commercialUse !== undefined || params.derivativesAllowed !== undefined) {
        console.log('Creating and attaching license terms...')
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
      setGlobalLoading(false)
    }
  }, [storyService, isInitialized, isConnected, address, setGlobalLoading, addIPAsset])

  // Register derivative IP
  const registerDerivative = useCallback(async (params: {
    parentIpIds: string[]
    licenseTermsIds: string[]
    title: string
    description: string
    imageUrl: string
    category: string
    tags: string[]
    spgNftContract?: string
  }) => {
    if (!storyService || !isInitialized) {
      throw new Error('Story service not initialized')
    }

    try {
      setGlobalLoading(true)
      
      const spgContract = params.spgNftContract || CONTRACT_ADDRESSES.aeneid.SPG_NFT_IMPL

      const result = await storyService.registerDerivative({
        spgNftContract: spgContract as `0x${string}`,
        parentIpIds: params.parentIpIds,
        licenseTermsIds: params.licenseTermsIds,
        title: params.title,
        description: params.description,
        imageUrl: params.imageUrl,
        category: params.category,
        tags: params.tags,
      })

      // Add to app store
      addIPAsset({
        id: result.ipId,
        tokenId: result.tokenId,
        title: params.title,
        description: params.description,
        category: params.category as any,
        ipfsHash: '',
        metadataURI: '',
        owner: address!,
        creator: address!,
        licenseTerms: {
          commercial: false,
          derivatives: true,
          attribution: true,
          shareAlike: false,
        },
        royaltyPolicy: CONTRACT_ADDRESSES.aeneid.ROYALTY_POLICY_LAP,
        registeredAt: new Date(),
        lastUpdated: new Date(),
        status: 'active',
        tags: params.tags,
        earnings: BigInt(0),
        views: 0,
        likes: 0,
      })

      toast.success('Derivative IP registered successfully!')
      return result
    } catch (error) {
      console.error('Failed to register derivative:', error)
      toast.error('Failed to register derivative IP')
      throw error
    } finally {
      setGlobalLoading(false)
    }
  }, [storyService, isInitialized, address, setGlobalLoading, addIPAsset])

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
      setGlobalLoading(true)

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
      setGlobalLoading(false)
    }
  }, [storyService, isInitialized, address, setGlobalLoading])

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
      setGlobalLoading(true)

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
      setGlobalLoading(false)
    }
  }, [storyService, isInitialized, setGlobalLoading])

  // Claim revenue
  const claimRevenue = useCallback(async (params: {
    ancestorIpId: string
    childIpIds?: string[]
  }) => {
    if (!storyService || !isInitialized || !address) {
      throw new Error('Story service not initialized or wallet not connected')
    }

    try {
      setGlobalLoading(true)

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
      setGlobalLoading(false)
    }
  }, [storyService, isInitialized, address, setGlobalLoading])

  // Raise dispute - FIXED: Now uses the correct DisputeTargetTag type
  const raiseDispute = useCallback(async (params: {
    targetIpId: string
    evidence: string
    targetTag: DisputeTargetTag // Now uses the correct imported type
    bond?: string
  }) => {
    if (!storyService || !isInitialized) {
      throw new Error('Story service not initialized')
    }

    try {
      setGlobalLoading(true)

      const result = await storyService.raiseDispute({
        targetIpId: params.targetIpId,
        evidence: params.evidence,
        targetTag: params.targetTag,
        bond: params.bond,
      })

      // Helper function to convert DisputeTargetTag to violation type string
      const getViolationType = (tag: DisputeTargetTag): string => {
        // Convert enum to lowercase string for app store
        return tag.toString().toLowerCase().replace('_', '')
      }

      // Add to reports in app store
      addReport({
        id: result.disputeId,
        reporterAddress: address!,
        targetIPAsset: params.targetIpId,
        violationType: getViolationType(params.targetTag) as any,
        description: params.evidence,
        evidence: {
          urls: [],
          screenshots: [],
          documents: [],
          metadata: { disputeId: result.disputeId, txHash: result.txHash }
        },
        submittedAt: new Date(),
        status: 'pending',
        priority: 'medium',
        votes: [],
        rewards: {
          reporter: BigInt(0),
          validators: BigInt(0),
        }
      })

      toast.success('Dispute raised successfully!')
      return result
    } catch (error) {
      console.error('Failed to raise dispute:', error)
      toast.error('Failed to raise dispute')
      throw error
    } finally {
      setGlobalLoading(false)
    }
  }, [storyService, isInitialized, address, setGlobalLoading, addReport])

  return {
    isInitialized,
    isConnected,
    isLoading,
    address,
    createNFTCollection,
    registerIP,
    registerDerivative,
    mintLicense,
    payRoyalty,
    claimRevenue,
    raiseDispute,
  }
}

// Export the DisputeTargetTag for use in components
export { DisputeTargetTag }