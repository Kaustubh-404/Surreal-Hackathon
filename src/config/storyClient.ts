// src/config/storyClient.ts - Fixed version
import { StoryClient, type StoryConfig } from '@story-protocol/core-sdk'
import { custom, http, createPublicClient } from 'viem'
import { ENV } from './env'
import type { WalletClient } from 'viem'

export class StoryClientManager {
  private static instance: StoryClientManager
  private client: StoryClient | null = null

  private constructor() {}

  public static getInstance(): StoryClientManager {
    if (!StoryClientManager.instance) {
      StoryClientManager.instance = new StoryClientManager()
    }
    return StoryClientManager.instance
  }

  public async initializeWithWallet(walletClient: WalletClient): Promise<StoryClient> {
    if (!walletClient) {
      throw new Error('Wallet client is required to initialize Story client')
    }

    try {
      const config: StoryConfig = {
        wallet: walletClient,
        transport: custom(walletClient.transport),
        chainId: ENV.STORY_CHAIN_ID as 'aeneid',
      }

      this.client = StoryClient.newClient(config)
      return this.client
    } catch (error) {
      console.error('Failed to initialize Story client:', error)
      throw new Error('Failed to initialize Story client')
    }
  }

  // Simplified HTTP initialization - for read-only operations only
  public async initializeWithHttp(): Promise<StoryClient> {
    try {
      // Don't initialize with HTTP for now to avoid the layout error
      // The SDK seems to have issues with HTTP-only mode
      console.warn('HTTP-only mode disabled due to SDK compatibility issues')
      throw new Error('HTTP-only mode not supported - wallet required')
    } catch (error) {
      console.error('Failed to initialize Story client with HTTP:', error)
      throw new Error('Failed to initialize Story client')
    }
  }

  public getClient(): StoryClient | null {
    return this.client
  }

  public reset(): void {
    this.client = null
  }
}

export const storyClientManager = StoryClientManager.getInstance()