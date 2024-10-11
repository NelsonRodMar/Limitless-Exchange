import { Box, HStack, Text } from '@chakra-ui/react'
import { paragraphMedium } from '@/styles/fonts/fonts.styles'
import LiquidityIcon from '@/resources/icons/liquidity-icon.svg'
import { NumberUtil } from '@/utils'
import VolumeIcon from '@/resources/icons/volume-icon.svg'
import DailyMarketTimer from '@/components/common/markets/market-cards/daily-market-timer'
import React, { useState } from 'react'
import { Market } from '@/types'
import MobileDrawer from '@/components/common/drawer'
import { useTradingService } from '@/services'
import MarketPage from '@/components/common/markets/market-page'

interface DailyMarketCardMobileProps {
  market: Market
  dailyIndex: number
}

const defaultColors = {
  main: 'var(--chakra-colors-grey-800)',
  secondary: 'var(--chakra-colors-grey-500)',
  chartBg: 'var(--chakra-colors-grey-300)',
}

export default function DailyMarketCardMobile({ market }: DailyMarketCardMobileProps) {
  const [colors] = useState(defaultColors)

  const { setMarket } = useTradingService()

  const content = (
    <Box
      border='1px'
      borderColor='grey.800'
      cursor='pointer'
      py='10px'
      px='8px'
      w='full'
      onClick={() => setMarket(market)}
    >
      <HStack w='full' justifyContent='space-between'>
        <HStack color={colors.main} gap='4px'>
          <LiquidityIcon width={16} height={16} />
          <Text {...paragraphMedium} color={colors.main}>
            {NumberUtil.formatThousands(market.liquidityFormatted, 6) +
              ' ' +
              market.collateralToken.symbol}
          </Text>
        </HStack>
        <HStack color={colors.main} gap='4px'>
          <VolumeIcon width={16} height={16} />
          <Text {...paragraphMedium} color={colors.main}>
            {NumberUtil.formatThousands(market.volumeFormatted, 6)} {market.collateralToken.symbol}
          </Text>
        </HStack>
      </HStack>
      <HStack w='full' justifyContent='center' px='8px'>
        <Text {...paragraphMedium} color={colors.main} my='48px' textAlign='center'>
          {market.proxyTitle ?? market.title ?? 'Noname market'}
        </Text>
      </HStack>
      <HStack justifyContent='space-between' alignItems='flex-end'>
        <DailyMarketTimer deadline={market.expirationTimestamp} color={colors.main} />
        <HStack gap={1} color={colors.main}>
          <Text {...paragraphMedium} color={colors.main}>
            {market.prices[0]}%
          </Text>
          <Box w='16px' h='16px' display='flex' alignItems='center' justifyContent='center'>
            <Box
              h='100%'
              w='100%'
              borderRadius='100%'
              bg={`conic-gradient(${colors.main} ${market.prices[0]}% 10%, ${colors.chartBg} ${market.prices[0]}% 100%)`}
            />
          </Box>
        </HStack>
      </HStack>
    </Box>
  )

  return (
    <MobileDrawer trigger={content} variant='black' title={market.title}>
      <MarketPage />
    </MobileDrawer>
  )
}
