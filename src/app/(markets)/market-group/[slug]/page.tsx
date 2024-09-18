'use client'
import { MainLayout } from '@/components'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react'
import { isMobile } from 'react-device-detect'
import {
  ClickEvent,
  createMarketShareUrls,
  OpenEvent,
  PageOpenedMetadata,
  ShareClickedMetadata,
  useAmplitude,
  useTradingService,
} from '@/services'
import ArrowLeftIcon from '@/resources/icons/arrow-left-icon.svg'
import ShareIcon from '@/resources/icons/share-icon.svg'
import {
  h1Regular,
  paragraphBold,
  paragraphMedium,
  paragraphRegular,
} from '@/styles/fonts/fonts.styles'
import WarpcastIcon from '@/resources/icons/Farcaster.svg'
import TwitterIcon from '@/resources/icons/X.svg'
import TextWithPixels from '@/components/common/text-with-pixels'
import { Image as ChakraImage } from '@chakra-ui/react'
import {
  MarketClaimingForm,
  MarketMetadata,
  MarketPriceChart,
  MarketTradingForm,
  MobileTradeButton,
} from '@/app/(markets)/markets/[address]/components'
import PredictionsIcon from '@/resources/icons/predictions-icon.svg'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWinningIndex } from '@/services/MarketsService'
import ApproveModal from '@/components/common/modals/approve-modal'
import MarketPrediction from '@/app/(markets)/market-group/[slug]/components/market-prediction'
import useMarketGroup from '@/hooks/use-market-group'
import BigNumber from 'bignumber.js'
import MarketGroupPositions from '@/app/(markets)/market-group/[slug]/components/market-group-positions'
import { Address } from 'viem'
import { Market, MarketStatus } from '@/types'
import MobileDrawer from '@/components/common/drawer'
import ResolutionIcon from '@/resources/icons/resolution-icon.svg'
import NextLink from 'next/link'

export default function MarketGroupPage({ params }: { params: { slug: string } }) {
  const { data: marketGroup, isLoading: marketGroupLoading } = useMarketGroup(params.slug)

  const { trackClicked, trackOpened } = useAmplitude()
  const router = useRouter()
  const { approveBuy, strategy, approveSell, market, setMarket, resetQuotes } = useTradingService()
  const [isShareMenuOpen, setShareMenuOpen] = useState(false)

  const { tweetURI, castURI } = createMarketShareUrls(
    market,
    market?.prices,
    marketGroup?.creator.name
  )
  const { data: winningIndex } = useWinningIndex(market?.address as string)

  const resolved = winningIndex === 0 || winningIndex === 1

  const isCollateralLoading = false

  const handleBackClicked = () => {
    if (window.history.length > 2) {
      return router.back()
    }
    return router.push('/')
  }

  const volume =
    marketGroup?.markets.reduce((a, b) => {
      return new BigNumber(a).plus(new BigNumber(b.volumeFormatted)).toString()
    }, '0') || '0'

  const liquidity =
    marketGroup?.markets.reduce((a, b) => {
      return new BigNumber(a).plus(new BigNumber(b.liquidityFormatted)).toString()
    }, '0') || '0'

  const marketActionForm = useMemo(() => {
    if (market) {
      return market.expired ? (
        <MarketClaimingForm market={market} />
      ) : (
        <MarketTradingForm
          market={market}
          setSelectedMarket={setMarket}
          marketGroup={marketGroup}
          outcomeTokensPercent={market.prices}
        />
      )
    }
    return null
  }, [market, marketGroup])

  const marketsAboveOnePercent = marketGroup?.markets.filter((market) => market.prices[0] >= 1)

  const marketsLowerOnePercent = marketGroup?.markets.filter((market) => market.prices[0] < 1)

  const mobileTradeButton = useMemo(() => {
    return market?.expired ? (
      <MobileTradeButton market={market} />
    ) : (
      <MobileDrawer
        trigger={
          <Button
            variant='contained'
            w='full'
            h='48px'
            mt='32px'
            color='white'
            onClick={() => {
              trackClicked(ClickEvent.TradeButtonClicked, {
                platform: 'mobile',
                address: market?.address,
              })
            }}
          >
            Trade
          </Button>
        }
        title={`${marketGroup?.title}: ${market?.title}`}
        variant='blue'
      >
        <MarketTradingForm
          market={market as Market}
          setSelectedMarket={setMarket}
          marketGroup={marketGroup}
          outcomeTokensPercent={market?.prices}
        />
      </MobileDrawer>
    )
  }, [market])

  const handleApproveMarket = async () => {
    return strategy === 'Buy' ? approveBuy() : approveSell()
  }

  const parseTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Link key={index} href={part} color='teal.500' isExternal>
            {part}
          </Link>
        )
      }
      return part
    })
  }

  useEffect(() => {
    if (marketGroup) {
      setMarket(marketGroup.markets[0])
    }
  }, [marketGroup])

  useEffect(() => {
    trackOpened<PageOpenedMetadata>(OpenEvent.PageOpened, {
      page: 'Market Page',
      market: params.slug,
      marketType: 'group',
    })
  }, [])

  useEffect(() => {
    resetQuotes()
  }, [])

  return (
    <MainLayout isLoading={isCollateralLoading || marketGroupLoading || !market}>
      {!marketGroup ? (
        <>Market group not found</>
      ) : (
        <>
          <HStack gap='40px' alignItems='flex-start' mb={isMobile ? '84px' : 0}>
            <Box w={isMobile ? 'full' : '664px'}>
              <Divider bg='grey.800' orientation='horizontal' h='3px' />
              <HStack justifyContent='space-between' mt='10px' mb='24px'>
                <Button
                  variant='grey'
                  onClick={() => {
                    trackClicked(ClickEvent.BackClicked, {
                      address: market?.address || '0x',
                    })
                    handleBackClicked()
                  }}
                >
                  <ArrowLeftIcon width={16} height={16} />
                  Back
                </Button>
                <Menu isOpen={isShareMenuOpen} onClose={() => setShareMenuOpen(false)}>
                  <MenuButton
                    onClick={() => {
                      trackClicked(ClickEvent.ShareMenuClicked, {
                        address: market?.address || '0x',
                        marketType: 'group',
                      })
                      setShareMenuOpen(true)
                    }}
                  >
                    <HStack gap='4px'>
                      <ShareIcon width={16} height={16} />
                      <Text {...paragraphMedium}>Share</Text>
                    </HStack>
                  </MenuButton>
                  <MenuList borderRadius='2px' w={isMobile ? '160px' : '122px'} zIndex={2}>
                    <MenuItem
                      onClick={() => {
                        trackClicked<ShareClickedMetadata>(ClickEvent.ShareItemClicked, {
                          type: 'Farcaster',
                          address: market?.address,
                          marketType: 'group',
                        })
                        window.open(castURI, '_blank', 'noopener')
                      }}
                    >
                      <HStack gap='4px'>
                        <WarpcastIcon />
                        <Text {...paragraphMedium}>On Warpcast</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        trackClicked<ShareClickedMetadata>(ClickEvent.ShareItemClicked, {
                          type: 'X/Twitter',
                          address: market?.address,
                          marketType: 'group',
                        })
                        window.open(tweetURI, '_blank', 'noopener')
                      }}
                    >
                      <HStack gap='4px'>
                        <TwitterIcon />
                        <Text {...paragraphMedium}>On X</Text>
                      </HStack>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
              <Box>
                <TextWithPixels
                  text={marketGroup?.title || ''}
                  {...(isMobile ? { ...h1Regular } : {})}
                  fontSize='32px'
                  userSelect='text'
                />
              </Box>
              <HStack gap={isMobile ? '4px' : '16px'} mt='16px' mb='24px'>
                <HStack gap='8px' flexWrap='wrap'>
                  <ChakraImage
                    width={6}
                    height={6}
                    src={marketGroup?.creator.imageURI ?? '/assets/images/logo.svg'}
                    alt='creator'
                    borderRadius={'2px'}
                  />
                  <Link href={marketGroup?.creator.link} _hover={{ borderColor: 'unset' }}>
                    <Text color='grey.500'>{marketGroup?.creator.name}</Text>
                  </Link>
                  {market?.tags?.map((tag) => (
                    <Text color='grey.500' key={tag}>
                      #{tag}
                    </Text>
                  ))}
                </HStack>
              </HStack>
              <MarketMetadata
                market={market}
                winningIndex={winningIndex}
                resolved={resolved}
                outcomeTokensPercent={market?.prices}
                volume={volume}
                liquidity={liquidity}
              />
              <MarketPriceChart
                winningIndex={winningIndex}
                resolved={resolved}
                outcomeTokensPercent={market?.prices}
                marketGroup={marketGroup}
                setSelectedMarket={setMarket}
                marketAddr={market?.address as Address}
              />
              <VStack gap='8px' alignItems='flex-start'>
                <HStack gap='4px'>
                  <PredictionsIcon />
                  <Text {...paragraphBold}>Predictions</Text>
                </HStack>
                {marketsAboveOnePercent?.map((market) => (
                  <MarketPrediction
                    key={market.address}
                    market={market}
                    setSelectedMarket={setMarket}
                  />
                ))}
                {!!marketsLowerOnePercent?.length && (
                  <Accordion allowToggle>
                    <AccordionItem>
                      <h2>
                        <AccordionButton w='fit-content' gap='4px' color='grey.500'>
                          <Text {...paragraphMedium} color='grey.500'>
                            Predictions with less than a 1% chance
                          </Text>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel>
                        <VStack gap='8px'>
                          {marketsLowerOnePercent.map((market) => (
                            <MarketPrediction
                              key={market.address}
                              market={market}
                              setSelectedMarket={setMarket}
                            />
                          ))}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                )}
              </VStack>
              {marketGroup && <MarketGroupPositions marketGroup={marketGroup} />}
              <HStack
                w='full'
                justifyContent='space-between'
                alignItems={isMobile ? 'flex-start' : 'center'}
                marginTop='24px'
                mb='8px'
                flexDirection={isMobile ? 'column' : 'row'}
              >
                <HStack gap='4px'>
                  <ResolutionIcon width='16px' height='16px' />
                  <Text {...paragraphBold}>
                    Resolution {market?.status !== MarketStatus.RESOLVED ? 'rules' : 'results'}
                  </Text>
                </HStack>
                <Box w={isMobile ? 'full' : 'fit-content'}>
                  <NextLink
                    href='https://www.notion.so/limitlesslabs/Limitless-Docs-0e59399dd44b492f8d494050969a1567?pvs=4#5dd6f962c66044eaa00e28d2c61b92bb'
                    target='_blank'
                    rel='noopener'
                    passHref
                  >
                    <Link variant='textLink' {...paragraphRegular} color='grey.500' isExternal>
                      Resolution is centralised
                    </Link>
                  </NextLink>
                  <Text {...paragraphRegular} color='grey.500' as='span'>
                    {' '}
                    and made by the Limitless team
                  </Text>
                </Box>
              </HStack>
              <Text {...paragraphRegular} userSelect='text'>
                {parseTextWithLinks(market?.description ?? '')}
              </Text>
            </Box>
            {!isMobile && marketActionForm}
          </HStack>
          {isMobile && (
            <Box position='fixed' bottom='76px' w='calc(100% - 32px)'>
              {mobileTradeButton}
            </Box>
          )}
          <ApproveModal onApprove={handleApproveMarket} />
        </>
      )}
    </MainLayout>
  )
}
