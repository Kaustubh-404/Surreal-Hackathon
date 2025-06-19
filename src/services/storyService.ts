// src/services/storyService.ts - Fixed implementation
import { StoryClient, type IpMetadata, type LicenseTerms, DisputeTargetTag } from '@story-protocol/core-sdk'
import { type Address, parseEther, keccak256, toBytes } from 'viem'
import { storyClientManager } from '../config/storyClient'
import { CONTRACT_ADDRESSES } from '../config/env'
import { uploadJSONToIPFS, uploadTextToIPFS } from '../utils/uploadToIpfs'

export class StoryService {
  private client: StoryClient | null = null
  
  constructor() {
    this.client = storyClientManager.getClient()
  }

  private async ensureClient(): Promise<StoryClient> {
    if (!this.client) {
      throw new Error('Story client not initialized. Please connect your wallet first.')
    }
    return this.client
  }

  async createNFTCollection(params: {
    name: string
    symbol: string
    isPublicMinting: boolean
  }): Promise<{ spgNftContract: Address; txHash: string }> {
    const client = await this.ensureClient()

    try {
      const response = await client.nftClient.createNFTCollection({
        name: params.name,
        symbol: params.symbol,
        isPublicMinting: params.isPublicMinting,
        mintOpen: true,
        mintFeeRecipient: '0x0000000000000000000000000000000000000000',
        contractURI: '',
      })

      return {
        spgNftContract: response.spgNftContract as Address,
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to create NFT collection:', error)
      throw new Error('Failed to create NFT collection')
    }
  }

  async registerIPAsset(params: {
    spgNftContract: Address
    title: string
    description: string
    imageUrl: string
    category: string
    tags: string[]
    recipient?: Address
  }): Promise<{ ipId: string; tokenId: string; txHash: string }> {
    const client = await this.ensureClient()

    try {
      // Create metadata for IP and NFT
      const ipMetadata: IpMetadata = {
        title: params.title,
        description: params.description,
        image: params.imageUrl,
        mediaUrl: params.imageUrl,
        mediaType: 'image/jpeg',
        creators: [],
        attributes: [
          { trait_type: 'Category', value: params.category },
          { trait_type: 'Tags', value: params.tags.join(', ') },
          { trait_type: 'Created', value: new Date().toISOString() },
        ],
      }

      const nftMetadata = {
        name: params.title,
        description: params.description,
        image: params.imageUrl,
        attributes: [
          { trait_type: 'Category', value: params.category },
          { trait_type: 'Tags', value: params.tags.join(', ') },
        ],
      }

      // Upload metadata to IPFS
      console.log('Uploading IP metadata to IPFS...')
      const ipMetadataHash = await uploadJSONToIPFS(ipMetadata)
      const nftMetadataHash = await uploadJSONToIPFS(nftMetadata)

      console.log('IP Metadata IPFS Hash:', ipMetadataHash)
      console.log('NFT Metadata IPFS Hash:', nftMetadataHash)

      // Create hash for metadata verification
      const ipMetadataHashBytes = keccak256(toBytes(JSON.stringify(ipMetadata)))
      const nftMetadataHashBytes = keccak256(toBytes(JSON.stringify(nftMetadata)))

      console.log('Registering IP Asset on Story Protocol...')
      
      // FIXED: Use provided recipient or remove it to use default
      const requestParams: any = {
        spgNftContract: params.spgNftContract,
        ipMetadata: {
          ipMetadataURI: `https://gateway.pinata.cloud/ipfs/${ipMetadataHash}`,
          ipMetadataHash: ipMetadataHashBytes,
          nftMetadataURI: `https://gateway.pinata.cloud/ipfs/${nftMetadataHash}`,
          nftMetadataHash: nftMetadataHashBytes,
        },
      }

      // Add recipient if provided
      if (params.recipient) {
        requestParams.recipient = params.recipient
      }

      const response = await client.ipAsset.mintAndRegisterIp(requestParams)

      console.log('IP Asset registered successfully!')
      return {
        ipId: response.ipId || '',
        tokenId: response.tokenId?.toString() || '',
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to register IP asset:', error)
      throw new Error(`Failed to register IP asset: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createAndAttachLicenseTerms(params: {
    ipId: string
    commercialUse: boolean
    commercialRevShare: number
    derivativesAllowed: boolean
    transferable: boolean
    mintingFee?: bigint
  }): Promise<{ licenseTermsId: string; txHash: string }> {
    const client = await this.ensureClient()

    try {
      console.log('Creating license terms...')
      const licenseTerms: LicenseTerms = {
        defaultMintingFee: params.mintingFee || 0n,
        currency: CONTRACT_ADDRESSES.aeneid.WIP_TOKEN,
        royaltyPolicy: CONTRACT_ADDRESSES.aeneid.ROYALTY_POLICY_LAP,
        transferable: params.transferable,
        expiration: 0n,
        commercialUse: params.commercialUse,
        commercialAttribution: params.commercialUse,
        commercializerChecker: '0x0000000000000000000000000000000000000000',
        commercializerCheckerData: '0x',
        commercialRevShare: params.commercialRevShare,
        commercialRevCeiling: 0n,
        derivativesAllowed: params.derivativesAllowed,
        derivativesAttribution: params.derivativesAllowed,
        derivativesApproval: false,
        derivativesReciprocal: false,
        derivativeRevCeiling: 0n,
        uri: '',
      }

      // Register license terms
      console.log('Registering PIL terms...')
      const termsResponse = await client.license.registerPILTerms({
        ...licenseTerms,
      })

      console.log('PIL terms registered, attaching to IP...')
      // Attach terms to IP
      const attachResponse = await client.license.attachLicenseTerms({
        licenseTermsId: termsResponse.licenseTermsId!,
        ipId: params.ipId as `0x${string}`,
      })

      console.log('License terms attached successfully!')
      return {
        licenseTermsId: termsResponse.licenseTermsId?.toString() || '',
        txHash: attachResponse.txHash || termsResponse.txHash || '',
      }
    } catch (error) {
      console.error('Failed to create and attach license terms:', error)
      throw new Error(`Failed to create and attach license terms: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async mintLicenseToken(params: {
    licenseTermsId: string
    licensorIpId: string
    receiver: Address
    amount: number
    maxMintingFee?: bigint
  }): Promise<{ licenseTokenIds: string[]; txHash: string }> {
    const client = await this.ensureClient()

    try {
      console.log('Minting license tokens...')
      const response = await client.license.mintLicenseTokens({
        licenseTermsId: params.licenseTermsId,
        licensorIpId: params.licensorIpId as `0x${string}`,
        receiver: params.receiver,
        amount: params.amount,
        maxMintingFee: params.maxMintingFee || 0n,
        maxRevenueShare: 100,
      })

      console.log('License tokens minted successfully!')
      return {
        licenseTokenIds: response.licenseTokenIds?.map(id => id.toString()) || [],
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to mint license token:', error)
      throw new Error(`Failed to mint license token: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async payRoyalty(params: {
    receiverIpId: string
    payerIpId?: string
    amount: bigint
    token?: Address
  }): Promise<{ txHash: string }> {
    const client = await this.ensureClient()

    try {
      console.log('Paying royalty...')
      const response = await client.royalty.payRoyaltyOnBehalf({
        receiverIpId: params.receiverIpId as `0x${string}`,
        payerIpId: (params.payerIpId || '0x0000000000000000000000000000000000000000') as `0x${string}`,
        token: params.token || CONTRACT_ADDRESSES.aeneid.WIP_TOKEN,
        amount: params.amount,
      })

      console.log('Royalty paid successfully!')
      return { txHash: response.txHash || '' }
    } catch (error) {
      console.error('Failed to pay royalty:', error)
      throw new Error(`Failed to pay royalty: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async claimRevenue(params: {
    ancestorIpId: string
    claimer: Address
    childIpIds?: string[]
  }): Promise<{ claimedTokens: any; txHash: string }> {
    const client = await this.ensureClient()

    try {
      console.log('Claiming revenue...')
      const response = await client.royalty.claimAllRevenue({
        ancestorIpId: params.ancestorIpId as `0x${string}`,
        claimer: params.claimer,
        currencyTokens: [CONTRACT_ADDRESSES.aeneid.WIP_TOKEN],
        childIpIds: (params.childIpIds || []) as `0x${string}`[],
        royaltyPolicies: [CONTRACT_ADDRESSES.aeneid.ROYALTY_POLICY_LAP],
        claimOptions: {
          autoTransferAllClaimedTokensFromIp: true,
          autoUnwrapIpTokens: true,
        },
      })

      console.log('Revenue claimed successfully!')
      return {
        claimedTokens: response.claimedTokens,
        txHash: response.txHashes?.[0] || '',
      }
    } catch (error) {
      console.error('Failed to claim revenue:', error)
      throw new Error(`Failed to claim revenue: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async raiseDispute(params: {
    targetIpId: string
    evidence: string
    targetTag: DisputeTargetTag
    bond?: string
  }): Promise<{ disputeId: string; txHash: string }> {
    const client = await this.ensureClient()

    try {
      console.log('Uploading dispute evidence to IPFS...')
      const evidenceHash = await uploadTextToIPFS(params.evidence)
      console.log('Evidence uploaded to IPFS:', evidenceHash)

      console.log('Raising dispute on Story Protocol...')
      const response = await client.dispute.raiseDispute({
        targetIpId: params.targetIpId as `0x${string}`,
        cid: evidenceHash,
        targetTag: params.targetTag,
        bond: parseEther(params.bond || '0.1'), // Default minimum bond
        liveness: 2592000, // 30 days
      })

      console.log('Dispute raised successfully!')
      return {
        disputeId: response.disputeId?.toString() || '',
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to raise dispute:', error)
      throw new Error(`Failed to raise dispute: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async registerDerivative(params: {
    spgNftContract: Address
    parentIpIds: string[]
    licenseTermsIds: string[]
    title: string
    description: string
    imageUrl: string
    category: string
    tags: string[]
    recipient?: Address
  }): Promise<{ ipId: string; tokenId: string; txHash: string }> {
    const client = await this.ensureClient()

    try {
      console.log('Creating derivative IP metadata...')
      const ipMetadata: IpMetadata = {
        title: params.title,
        description: params.description,
        image: params.imageUrl,
        mediaUrl: params.imageUrl,
        mediaType: 'image/jpeg',
        creators: [],
        attributes: [
          { trait_type: 'Category', value: params.category },
          { trait_type: 'Tags', value: params.tags.join(', ') },
          { trait_type: 'Type', value: 'Derivative' },
          { trait_type: 'Parents', value: params.parentIpIds.join(', ') },
        ],
      }

      const nftMetadata = {
        name: params.title,
        description: params.description,
        image: params.imageUrl,
        attributes: [
          { trait_type: 'Category', value: params.category },
          { trait_type: 'Type', value: 'Derivative' },
        ],
      }

      // Upload metadata to IPFS
      const ipMetadataHash = await uploadJSONToIPFS(ipMetadata)
      const nftMetadataHash = await uploadJSONToIPFS(nftMetadata)

      const ipMetadataHashBytes = keccak256(toBytes(JSON.stringify(ipMetadata)))
      const nftMetadataHashBytes = keccak256(toBytes(JSON.stringify(nftMetadata)))

      console.log('Registering derivative IP on Story Protocol...')
      
      // FIXED: Use provided recipient or remove it to use default
      const requestParams: any = {
        spgNftContract: params.spgNftContract,
        derivData: {
          parentIpIds: params.parentIpIds as `0x${string}`[],
          licenseTermsIds: params.licenseTermsIds,
        },
        ipMetadata: {
          ipMetadataURI: `https://gateway.pinata.cloud/ipfs/${ipMetadataHash}`,
          ipMetadataHash: ipMetadataHashBytes,
          nftMetadataURI: `https://gateway.pinata.cloud/ipfs/${nftMetadataHash}`,
          nftMetadataHash: nftMetadataHashBytes,
        },
      }

      // Add recipient if provided
      if (params.recipient) {
        requestParams.recipient = params.recipient
      }

      const response = await client.ipAsset.mintAndRegisterIpAndMakeDerivative(requestParams)

      console.log('Derivative IP registered successfully!')
      return {
        ipId: response.ipId || '',
        tokenId: response.tokenId?.toString() || '',
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to register derivative:', error)
      throw new Error(`Failed to register derivative: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
