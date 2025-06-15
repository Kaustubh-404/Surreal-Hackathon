import { StoryClient, type IpMetadata, type LicenseTerms } from '@story-protocol/core-sdk'
import { type Address, toHex } from 'viem'
import { storyClientManager } from '../config/storyClient'
import { CONTRACT_ADDRESSES } from '../config/env'

export class StoryService {
  private client: StoryClient | null = null

  constructor() {
    this.client = storyClientManager.getClient()
  }

  private async ensureClient(): Promise<StoryClient> {
    if (!this.client) {
      this.client = await storyClientManager.initializeWithHttp()
    }
    return this.client
  }

  async registerIPAsset(params: {
    spgNftContract: Address
    title: string
    description: string
    imageUrl: string
    category: string
    tags: string[]
    ipMetadataURI?: string
    nftMetadataURI?: string
  }): Promise<{ ipId: string; tokenId: string; txHash: string }> {
    const client = await this.ensureClient()

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

    // Create metadata hashes
    const ipMetadataHash = toHex(JSON.stringify(ipMetadata), { size: 32 })
    const nftMetadataHash = toHex(JSON.stringify(nftMetadata), { size: 32 })

    try {
      const response = await client.ipAsset.mintAndRegisterIp({
        spgNftContract: params.spgNftContract,
        ipMetadata: {
          ipMetadataURI: params.ipMetadataURI || '',
          ipMetadataHash,
          nftMetadataURI: params.nftMetadataURI || '',
          nftMetadataHash,
        },
      })

      return {
        ipId: response.ipId || '',
        tokenId: response.tokenId?.toString() || '',
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to register IP asset:', error)
      throw new Error('Failed to register IP asset')
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

    try {
      // Register license terms
      const termsResponse = await client.license.registerPILTerms(licenseTerms)
      
      // Attach terms to IP
      const attachResponse = await client.license.attachLicenseTerms({
        licenseTermsId: termsResponse.licenseTermsId!,
        ipId: params.ipId as `0x${string}`,
      })

      return {
        licenseTermsId: termsResponse.licenseTermsId?.toString() || '',
        txHash: attachResponse.txHash || termsResponse.txHash || '',
      }
    } catch (error) {
      console.error('Failed to create and attach license terms:', error)
      throw new Error('Failed to create and attach license terms')
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
      const response = await client.license.mintLicenseTokens({
        licenseTermsId: params.licenseTermsId,
        licensorIpId: params.licensorIpId as `0x${string}`,
        receiver: params.receiver,
        amount: params.amount,
        maxMintingFee: params.maxMintingFee || 0n,
        maxRevenueShare: 100,
      })

      return {
        licenseTokenIds: response.licenseTokenIds?.map(id => id.toString()) || [],
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to mint license token:', error)
      throw new Error('Failed to mint license token')
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
  }): Promise<{ ipId: string; tokenId: string; txHash: string }> {
    const client = await this.ensureClient()

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
      ],
    }

    const nftMetadata = {
      name: params.title,
      description: params.description,
      image: params.imageUrl,
    }

    const ipMetadataHash = toHex(JSON.stringify(ipMetadata), { size: 32 })
    const nftMetadataHash = toHex(JSON.stringify(nftMetadata), { size: 32 })

    try {
      const response = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        spgNftContract: params.spgNftContract,
        derivData: {
          parentIpIds: params.parentIpIds as `0x${string}`[],
          licenseTermsIds: params.licenseTermsIds,
        },
        ipMetadata: {
          ipMetadataURI: '',
          ipMetadataHash,
          nftMetadataURI: '',
          nftMetadataHash,
        },
      })

      return {
        ipId: response.ipId || '',
        tokenId: response.tokenId?.toString() || '',
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to register derivative:', error)
      throw new Error('Failed to register derivative')
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
      const response = await client.royalty.payRoyaltyOnBehalf({
        receiverIpId: params.receiverIpId as `0x${string}`,
        payerIpId: (params.payerIpId || '0x0000000000000000000000000000000000000000') as `0x${string}`,
        token: params.token || CONTRACT_ADDRESSES.aeneid.WIP_TOKEN,
        amount: params.amount,
      })

      return { txHash: response.txHash || '' }
    } catch (error) {
      console.error('Failed to pay royalty:', error)
      throw new Error('Failed to pay royalty')
    }
  }

  async claimRevenue(params: {
    ancestorIpId: string
    claimer: Address
    childIpIds?: string[]
  }): Promise<{ claimedTokens: any; txHash: string }> {
    const client = await this.ensureClient()

    try {
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

      return {
        claimedTokens: response.claimedTokens,
        txHash: response.txHashes?.[0] || '',
      }
    } catch (error) {
      console.error('Failed to claim revenue:', error)
      throw new Error('Failed to claim revenue')
    }
  }

  async raiseDispute(params: {
    targetIpId: string
    targetTag: 'IMPROPER_REGISTRATION' | 'COPYRIGHT_INFRINGEMENT' | 'TRADEMARK_INFRINGEMENT' | 'OTHER'
  }): Promise<{ disputeId: string; txHash: string }> {
    const client = await this.ensureClient()

    try {
      const response = await client.dispute.raiseDispute({
          targetIpId: params.targetIpId as `0x${string}`,
          targetTag: params.targetTag as any,
          cid: '',
          liveness: ''
      })

      return {
        disputeId: response.disputeId?.toString() || '',
        txHash: response.txHash || '',
      }
    } catch (error) {
      console.error('Failed to raise dispute:', error)
      throw new Error('Failed to raise dispute')
    }
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
}