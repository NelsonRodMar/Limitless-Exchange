'use client'

import FrameSDK from '@farcaster/frame-sdk'
import { PrivyClientConfig, PrivyProvider } from '@privy-io/react-auth'
import { PropsWithChildren, useEffect, useState } from 'react'
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
          },
          defaultChain: defaultChain,
          supportedChains: [baseSepolia, base],
          loginMethods: ['wallet'],
        }
        setPrivyConfig(config)
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

      // Hide splash screen after UI renders.
      setTimeout(() => {
        FrameSDK.actions.ready()
      }, 500)
    }
    init()
  }, [])
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
