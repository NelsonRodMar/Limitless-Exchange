import { Flex, HStack, Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { PositionCard } from '@/app/(markets)/markets/[address]/components'
import ChartIcon from '@/resources/icons/chart-icon.svg'
import { useHistory } from '@/services'
import { paragraphMedium } from '@/styles/fonts/fonts.styles'
import { Market } from '@/types'

interface MarketPositionsProps {
  market: Market | null
}

export const MarketPositions = ({ market }: MarketPositionsProps) => {
  const { positions: allMarketsPositions } = useHistory()

  const positions = useMemo(
    () =>
      allMarketsPositions?.filter(
        (position) => position.market.id.toLowerCase() === market?.address.toLowerCase()
      ),
    [allMarketsPositions, market]
  )

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
            symbol={market?.collateralToken.symbol || ''}
            marketPrices={market?.prices || [50, 50]}
          />
        ))}
      </VStack>
    </>
  ) : (
    <></>
  )
}
