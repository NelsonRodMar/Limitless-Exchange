import { defaultChain } from '@/constants'
import { HistoryPosition, useHistory, useTradingService } from '@/services'
import { NumberUtil } from '@/utils'
import {
  Box,
  Divider,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Market } from '@/types'
import ChartIcon from '@/resources/icons/chart-icon.svg'
import ChevronDownIcon from '@/resources/icons/chevron-down-icon.svg'
import PositionCard from '@/app/markets/[address]/components/position-card'

interface MarketPositionsProps {
  market: Market | null
}

export const MarketPositions = ({ market }: MarketPositionsProps) => {
  const { positions: allMarketsPositions } = useHistory()

  const positions = useMemo(
    () =>
      allMarketsPositions?.filter(
        (position) =>
          position.market.id.toLowerCase() === market?.address[defaultChain.id].toLowerCase()
      ),
    [allMarketsPositions, market]
  )

  console.log(positions)

  return Number(positions?.length) > 0 ? (
    <>
      <Flex mt='24px' justifyContent='space-between' mb='8px'>
        <HStack color='black' gap='4px'>
          <ChartIcon width='16px' height='16px' />
          <Text fontWeight={700}>Portfolio</Text>
        </HStack>
        <HStack color='black' gap='4px'>
          <Text fontWeight={700}>{market?.tokenTicker[defaultChain.id]}</Text>
          <ChevronDownIcon width='16px' height='16px' />
        </HStack>
      </Flex>
      <VStack gap='8px' flexDir='column' w='full'>
        {positions?.map((position, index) => (
          <PositionCard position={position} key={index} market={market} />
        ))}
      </VStack>
    </>
  ) : (
    <></>
  )
}
