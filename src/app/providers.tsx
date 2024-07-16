'use client'

import * as React from 'react'
import {
  ChakraProvider,
  QueryProvider,
  WagmiProvider,
  Web3AuthProvider,
  PriceOracleProvider,
} from '@/providers'
import {
  AccountProvider,
  AmplitudeProvider,
  BalanceServiceProvider,
  EtherspotProvider,
  HistoryServiceProvider,
  LimitlessApiProvider,
  TradingServiceProvider,
} from '@/services'
import { TokenFilterProvider } from '@/contexts/TokenFilterContext'
import { UserValidationProvider } from '@/providers/UserValidation'

export const Providers = ({ children }: React.PropsWithChildren) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    mounted && (
      <AmplitudeProvider>
        <ChakraProvider>
          <WagmiProvider>
            <Web3AuthProvider>
              <QueryProvider>
                <LimitlessApiProvider>
                  <EtherspotProvider>
                    <AccountProvider>
                      <PriceOracleProvider>
                        <BalanceServiceProvider>
                          <HistoryServiceProvider>
                            <UserValidationProvider>
                              <TokenFilterProvider>
                                <TradingServiceProvider>{children}</TradingServiceProvider>
                              </TokenFilterProvider>
                            </UserValidationProvider>
                          </HistoryServiceProvider>
                        </BalanceServiceProvider>
                      </PriceOracleProvider>
                    </AccountProvider>
                  </EtherspotProvider>
                </LimitlessApiProvider>
              </QueryProvider>
            </Web3AuthProvider>
          </WagmiProvider>
        </ChakraProvider>
      </AmplitudeProvider>
    )
  )
}
