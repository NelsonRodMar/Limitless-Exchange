'use client'

import * as React from 'react'
import { TokenFilterProvider } from '@/contexts/TokenFilterContext'
import { QueryProvider, PriceOracleProvider, ThemeProvider } from '@/providers'
import PrivyAuthProvider from '@/providers/Privy'
import {
  AccountProvider,
  AmplitudeProvider,
  BalanceServiceProvider,
  HistoryServiceProvider,
  LimitlessApiProvider,
  TradingServiceProvider,
  CommentServiceProvider,
} from '@/services'
import { AxiosProvider } from '@/services/AxiosPrivateClient'

export const Providers = ({ children }: React.PropsWithChildren) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    mounted && (
      <ThemeProvider>
        <QueryProvider>
          <PrivyAuthProvider>
            <AmplitudeProvider>
              <LimitlessApiProvider>
                <AxiosProvider>
                  <AccountProvider>
                    <PriceOracleProvider>
                      <BalanceServiceProvider>
                        <HistoryServiceProvider>
                          <TokenFilterProvider>
                            <CommentServiceProvider>
                              <TradingServiceProvider>{children}</TradingServiceProvider>
                            </CommentServiceProvider>
                          </TokenFilterProvider>
                        </HistoryServiceProvider>
                      </BalanceServiceProvider>
                    </PriceOracleProvider>
                  </AccountProvider>
                </AxiosProvider>
              </LimitlessApiProvider>
            </AmplitudeProvider>
          </PrivyAuthProvider>
        </QueryProvider>
      </ThemeProvider>
    )
  )
}
