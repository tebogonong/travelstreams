'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createBaseAccountSDK, pay, getPaymentStatus } from '@base-org/account'

interface BaseAccountContextType {
  isConnected: boolean
  userAddress: string | null
  isConnecting: boolean
  signIn: () => Promise<void>
  signOut: () => void
  payWithBase: (amount: string, to: string, testnet?: boolean) => Promise<any>
  checkPaymentStatus: (paymentId: string, testnet?: boolean) => Promise<any>
}

const BaseAccountContext = createContext<BaseAccountContextType | undefined>(undefined)

interface BaseAccountProviderProps {
  children: ReactNode
}

export function BaseAccountProvider({ children }: BaseAccountProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<any>(null)

  useEffect(() => {
    // Initialize Base Account SDK
    const sdk = createBaseAccountSDK({
      appName: 'TravelStream',
      appLogoUrl: '/logo.svg',
    })
    setProvider(sdk.getProvider())
  }, [])

  const generateNonce = () => {
    return crypto.randomUUID().replace(/-/g, '')
  }

  const signIn = async () => {
    if (!provider) return
    
    try {
      setIsConnecting(true)
      
      // Generate a fresh nonce
      const nonce = generateNonce()
      
      // Connect and authenticate using wallet_connect method
      const { accounts } = await provider.request({
        method: 'wallet_connect',
        params: [{
          version: '1',
          capabilities: {
            signInWithEthereum: {
              nonce,
              chainId: '0x2105' // Base Mainnet - 8453
            }
          }
        }]
      })
      
      const { address } = accounts[0]
      const { message, signature } = accounts[0].capabilities.signInWithEthereum
      
      setUserAddress(address)
      setIsConnected(true)
      
      // In a real app, you would send the message and signature to your backend for verification
      console.log('Authentication data:', { address, message, signature })
      
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const signOut = () => {
    setIsConnected(false)
    setUserAddress(null)
  }

  const payWithBase = async (amount: string, to: string, testnet: boolean = true) => {
    try {
      const payment = await pay({
        amount,
        to,
        testnet
      })
      return payment
    } catch (error) {
      console.error('Payment failed:', error)
      throw error
    }
  }

  const checkPaymentStatus = async (paymentId: string, testnet: boolean = true) => {
    try {
      const status = await getPaymentStatus({
        id: paymentId,
        testnet
      })
      return status
    } catch (error) {
      console.error('Failed to check payment status:', error)
      throw error
    }
  }

  const value: BaseAccountContextType = {
    isConnected,
    userAddress,
    isConnecting,
    signIn,
    signOut,
    payWithBase,
    checkPaymentStatus
  }

  return (
    <BaseAccountContext.Provider value={value}>
      {children}
    </BaseAccountContext.Provider>
  )
}

export function useBaseAccount() {
  const context = useContext(BaseAccountContext)
  if (context === undefined) {
    throw new Error('useBaseAccount must be used within a BaseAccountProvider')
  }
  return context
}