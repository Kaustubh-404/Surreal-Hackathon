import { aeneid, mainnet, StoryClient, type StoryConfig } from '@story-protocol/core-sdk'
import { type Chain, createPublicClient, createWalletClient, http, type WalletClient } from 'viem'
import { privateKeyToAccount, type Address, type Account } from 'viem/accounts'
import { ENV } from '../config/env'

// Network configuration types
type NetworkType = 'aeneid' | 'mainnet'

interface NetworkConfig {
    rpcProviderUrl: string
    blockExplorer: string
    protocolExplorer: string
    defaultNFTContractAddress: Address | null
    defaultSPGNFTContractAddress: Address | null
    chain: Chain
}

// Network configurations
const networkConfigs: Record<NetworkType, NetworkConfig> = {
    aeneid: {
        rpcProviderUrl: 'https://aeneid.storyrpc.io',
        blockExplorer: 'https://aeneid.storyscan.io',
        protocolExplorer: 'https://aeneid.explorer.story.foundation',
        defaultNFTContractAddress: '0x937bef10ba6fb941ed84b8d249abc76031429a9a' as Address,
        defaultSPGNFTContractAddress: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc' as Address,
        chain: aeneid,
    },
    mainnet: {
        rpcProviderUrl: 'https://mainnet.storyrpc.io',
        blockExplorer: 'https://storyscan.io',
        protocolExplorer: 'https://explorer.story.foundation',
        defaultNFTContractAddress: null,
        defaultSPGNFTContractAddress: '0x98971c660ac20880b60F86Cc3113eBd979eb3aAE' as Address,
        chain: mainnet,
    },
} as const

const getNetwork = (): NetworkType => {
    const network = ENV.STORY_CHAIN_ID as NetworkType
    if (network && !(network in networkConfigs)) {
        throw new Error(`Invalid network: ${network}. Must be one of: ${Object.keys(networkConfigs).join(', ')}`)
    }
    return network || 'aeneid'
}

// Initialize client configuration
export const network = getNetwork()

export const networkInfo = {
    ...networkConfigs[network],
    rpcProviderUrl: ENV.RPC_PROVIDER_URL || networkConfigs[network].rpcProviderUrl,
}

export const account: Account = privateKeyToAccount(`0x${ENV.WALLET_PRIVATE_KEY}` as Address)

const config: StoryConfig = {
    account,
    transport: http(networkInfo.rpcProviderUrl),
    chainId: network,
}

export const client = StoryClient.newClient(config)

const baseConfig = {
    chain: networkInfo.chain,
    transport: http(networkInfo.rpcProviderUrl),
} as const
export const publicClient = createPublicClient(baseConfig)
export const walletClient = createWalletClient({
    ...baseConfig,
    account,
}) as WalletClient
