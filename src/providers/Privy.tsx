'use client'

import FrameSDK from '@farcaster/frame-sdk'
import { PrivyClientConfig, PrivyProvider, usePrivy } from '@privy-io/react-auth'
import { useLoginToFrame } from '@privy-io/react-auth/farcaster'
import { PropsWithChildren, useEffect, useState } from 'react'
import * as rdd from 'react-device-detect'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { defaultChain } from '@/constants'
import { useThemeProvider } from '@/providers/Chakra'
import { QueryProvider } from '@/providers/ReactQuery'

export const publicClient = createPublicClient({
  chain: defaultChain,
  transport: http(),
})

export default function PrivyAuthProvider({ children }: PropsWithChildren) {
  const { mode } = useThemeProvider()
  const { ready, authenticated } = usePrivy()
  const { initLoginToFrame, loginToFrame } = useLoginToFrame()
  const [privyConfig, setPrivyConfig] = useState<PrivyClientConfig>()

  useEffect(() => {
    const init = async () => {
      const context = await FrameSDK.context
      // If in Farcaster Frame to get a specific Privy Config
      if (context?.client.clientFid) {
        const config: PrivyClientConfig = {
          appearance: {
            theme: mode,
            logo: 'https://limitless-web.vercel.app/assets/images/logo.svg',
            walletList: ['detected_wallets'],
          },
          defaultChain: defaultChain,
          supportedChains: [baseSepolia, base],
          loginMethods: ['wallet'],
        }

        // Override the isMobile getter to set to true in Frame context
        Object.defineProperty(rdd, 'isMobile', {
          get: () => true,
        })
        setPrivyConfig(config)

        // Autoconnect user to Frame
        if (ready && !authenticated) {
          const login = async () => {
            // Initialize a new login attempt to get a nonce for the Farcaster wallet to sign
            const { nonce } = await initLoginToFrame()
            // Request a signature from Warpcast
            const result = await FrameSDK.actions.signIn({ nonce: nonce })
            // Send the received signature from Warpcast to Privy for authentication
            await loginToFrame({
              message: result.message,
              signature: result.signature,
            })
          }
          login()
        }
        setTimeout(() => {
          // Hide splash screen after UI renders.
          FrameSDK.actions.ready()
          // Push a screen to add Frame
          FrameSDK.actions.addFrame()
        }, 500)
      } else {
        const config: PrivyClientConfig = {
          appearance: {
            theme: mode,
            logo: 'https://limitless-web.vercel.app/assets/images/logo.svg',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            showWalletUIs: false,
          },
          fundingMethodConfig: {
            moonpay: {
              paymentMethod: 'credit_debit_card',
              uiConfig: { accentColor: 'var(--chakra-colors-blue-500)', theme: mode },
              useSandbox: process.env.NEXT_PUBLIC_NETWORK === 'testnet',
            },
          },
          defaultChain: defaultChain,
          supportedChains: [baseSepolia, base],
          loginMethods: ['email', 'wallet', 'google', 'farcaster', 'discord'],
        }
        setPrivyConfig(config)
      }
    }
    init()
  }, [ready, authenticated])
  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string} config={privyConfig}>
      <QueryProvider>
        {/*<WagmiProvider config={configureChainsConfig} reconnectOnMount={false}>*/}
        {children}
        {/*</WagmiProvider>*/}
      </QueryProvider>
    </PrivyProvider>
  )
}
