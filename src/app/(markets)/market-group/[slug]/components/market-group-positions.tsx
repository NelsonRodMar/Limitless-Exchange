import { Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { Address } from 'viem'
import { PositionCard } from '@/app/(markets)/markets/[address]/components'
import ChartIcon from '@/resources/icons/chart-icon.svg'
import { usePosition } from '@/services'
import { paragraphMedium } from '@/styles/fonts/fonts.styles'
import { MarketGroup } from '@/types'

interface MarketGroupPositionsProps {
  marketGroup: MarketGroup
  isSideMarketPage?: boolean
}

export default function MarketGroupPositions({
  marketGroup,
  isSideMarketPage,
}: MarketGroupPositionsProps) {
  const { data: allMarketsPositions } = usePosition()

  const positions = useMemo(
    () =>
      allMarketsPositions?.filter((position) =>
        marketGroup.markets.some(
          (market) => position.market.id.toLowerCase() === market?.address.toLowerCase()
        )
      ),
    [allMarketsPositions, marketGroup.markets]
  )

  const getMarketPrices = (address: Address) => {
    return marketGroup.markets.find(
      (market) => market.address.toLowerCase() === address.toLowerCase()
    )?.prices
  }

  const getMarketTitle = (address: Address) => {
    return marketGroup.markets.find(
      (market) => market.address.toLowerCase() === address.toLowerCase()
    )?.title
  }

  return Number(positions?.length) > 0 ? (
    <>
      <Flex mt='24px' justifyContent='space-between' mb='8px'>
        <HStack color='grey.800' gap='4px'>
          <ChartIcon width='16px' height='16px' />
          <Text {...paragraphMedium}>Portfolio</Text>
        </HStack>
      </Flex>
      <VStack gap='8px' flexDir='column' w='full'>
        {positions?.map((position, index) => (
          <PositionCard
            position={position}
            key={index}
            symbol={marketGroup.collateralToken.symbol}
            marketPrices={getMarketPrices(position.market.id) || [50, 50]}
            title={getMarketTitle(position.market.id)}
            isSideMarketPage={isSideMarketPage}
          />
        ))}
      </VStack>
    </>
  ) : (
    <></>
  )
}
