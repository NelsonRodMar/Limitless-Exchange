'use client'

import { PrivyClientConfig, PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { PropsWithChildren } from 'react'
import { createPublicClient, Transport } from 'viem'
import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { defaultChain } from '@/constants'
import { useThemeProvider } from '@/providers/Chakra'
import { QueryProvider } from '@/providers/ReactQuery'

export const publicClient = createPublicClient({
  chain: defaultChain,
  transport: http(),
})

export const configureChainsConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [defaultChain.id]: http(),
  } as Record<8453 | 84532, Transport>,
})

export default function PrivyAuthProvider({ children }: PropsWithChildren) {
  const { mode } = useThemeProvider()
  const privvyConfig: PrivyClientConfig = {
    // Customize Privy's appearance in your app
    appearance: {
      theme: mode,
      logo: 'https://limitless-web.vercel.app/assets/images/logo.svg',
    },
    // Create embedded wallets for users who don't have a wallet
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      showWalletUIs: false,
    },
    defaultChain: defaultChain,
    supportedChains: [baseSepolia, base],
    loginMethods: ['email', 'wallet', 'google', 'farcaster', 'discord'],
  }
  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string} config={privvyConfig}>
      <QueryProvider>
        <WagmiProvider config={configureChainsConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryProvider>
    </PrivyProvider>
  )
}
