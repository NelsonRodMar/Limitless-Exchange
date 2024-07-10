import { defaultChain } from '@/constants'
import { Flex, HStack, Text, Box } from '@chakra-ui/react'
import ThumbsUpIcon from '@/resources/icons/thumbs-up-icon.svg'
import ThumbsDownIcon from '@/resources/icons/thumbs-down-icon.svg'
import LiquidityIcon from '@/resources/icons/liquidity-icon.svg'
import VolumeIcon from '@/resources/icons/volume-icon.svg'
import CalendarIcon from '@/resources/icons/calendar-icon.svg'
import { Market } from '@/types'
import { isMobile } from 'react-device-detect'
import { useMarketData } from '@/hooks'
import { useLimitlessApi } from '@/services'
import { NumberUtil } from '@/utils'

interface MarketMetadataProps {
  market: Market | null
}

export const MarketMetadata = ({ market }: MarketMetadataProps) => {
  const { supportedTokens } = useLimitlessApi()
  const { outcomeTokensBuyPrice: outcomeTokensBuyPriceCurrent } = useMarketData({
    marketAddress: market?.address[defaultChain.id],
    collateralToken: supportedTokens?.find(
      (token) => token.address === market?.collateralToken[defaultChain.id]
    ),
  })
  const stats = [
    {
      title: 'Liquidity',
      icon: <LiquidityIcon width={16} height={16} />,
      value: `${NumberUtil.formatThousands(market?.liquidityFormatted, 6)} ${
        market?.tokenTicker[defaultChain.id]
      }`,
      border: true,
    },
    {
      title: 'Volume',
      icon: <VolumeIcon width={16} height={16} />,
      value: `${NumberUtil.formatThousands(market?.volumeFormatted, 6)} ${
        market?.tokenTicker[defaultChain.id]
      }`,
      border: !isMobile,
    },
    {
      title: 'Deadline',
      icon: <CalendarIcon width={16} height={16} />,
      value: market?.expirationDate,
      border: false,
    },
  ]

  return (
    <Box>
      <Flex w='full' pb='10px' borderBottom='1px solid' borderColor='black'>
        <HStack gap='24px'>
          <HStack gap={'4px'} color='green.500'>
            <ThumbsUpIcon width={16} height={16} />
            <Text fontWeight={500}>
              {NumberUtil.toFixed((outcomeTokensBuyPriceCurrent?.[0] || 0) * 100, 0)}%
            </Text>
            <Text fontWeight={500}>Yes</Text>
          </HStack>
          <HStack gap={'4px'} color='red.500'>
            <ThumbsDownIcon width={16} height={16} />
            <Text fontWeight={500}>
              {NumberUtil.toFixed((outcomeTokensBuyPriceCurrent?.[1] || 0) * 100, 0)}%
            </Text>
            <Text fontWeight={500}>No</Text>
          </HStack>
        </HStack>
      </Flex>
      <Flex borderBottom={isMobile ? '1px solid' : 'unset'} borderColor='black'>
        {!isMobile &&
          stats.map((stat, index) => (
            <Box
              pt='7px'
              pb='11px'
              key={stat.title}
              flex={1}
              borderRight={stat.border ? '1px solid' : 'unset'}
              borderColor='black'
              pl={index ? '8px' : 0}
            >
              <Text fontWeight={500}>{stat.value}</Text>
              <HStack gap='4px' color='grey.500'>
                {stat.icon}
                <Text fontWeight={500}>{stat.title}</Text>
              </HStack>
            </Box>
          ))}
        {isMobile &&
          [0, 1].map((index) => (
            <Box
              pt='7px'
              pb='11px'
              key={stats[index].title}
              flex={1}
              borderRight={stats[index].border ? '1px solid' : 'unset'}
              borderColor='black'
              pl={index ? '8px' : 0}
            >
              <Text fontWeight={500}>{stats[index].value}</Text>
              <HStack gap='4px' color='grey.500'>
                {stats[index].icon}
                <Text fontWeight={500}>{stats[index].title}</Text>
              </HStack>
            </Box>
          ))}
      </Flex>
      {isMobile && (
        <Box
          pt='7px'
          pb='11px'
          key={stats[2].title}
          flex={1}
          borderRight={stats[2].border ? '1px solid' : 'unset'}
          borderColor='black'
          pl={0}
        >
          <Text fontWeight={500}>{stats[2].value}</Text>
          <HStack gap='4px' color='grey.500'>
            {stats[2].icon}
            <Text fontWeight={500}>{stats[2].title}</Text>
          </HStack>
        </Box>
      )}
    </Box>
  )
}
