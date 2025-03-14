import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { Address } from 'viem'
import ClobLimitTradeForm from '@/components/common/markets/clob-widget/clob-limit-trade-form'
import ClobMarketTradeForm from '@/components/common/markets/clob-widget/clob-market-trade-form'
import { useClobWidget } from '@/components/common/markets/clob-widget/context'
import SharesActionsClob from '@/components/common/markets/clob-widget/shares-actions-clob'
import TradeStepperMenu from '@/components/common/markets/clob-widget/trade-stepper-menu'
import OutcomeButtonsClob from '@/components/common/markets/outcome-buttons/outcome-buttons-clob'
import { Overlay } from '@/components/common/overlay'
import Paper from '@/components/common/paper'
import ChevronDownIcon from '@/resources/icons/chevron-down-icon.svg'
import { ChangeEvent, StrategyChangedMetadata, useAmplitude, useTradingService } from '@/services'
import { PendingTradeData } from '@/services/PendingTradeService'
import { headLineLarge, paragraphMedium, paragraphRegular } from '@/styles/fonts/fonts.styles'
import { MarketOrderType } from '@/types'

export default function ClobWidget() {
  const { trackChanged } = useAmplitude()
  const {
    clobOutcome: outcome,
    setStrategy,
    market,
    groupMarket,
    strategy,
    setClobOutcome: setOutcome,
  } = useTradingService()
  const {
    isOpen: orderTypeMenuOpen,
    onOpen: onOpenOrderTypeMenu,
    onClose: onCloseOrderTypeMenu,
  } = useDisclosure()

  const {
    isBalanceNotEnough,
    orderType,
    setOrderType,
    tradeStepperOpen,
    onToggleTradeStepper,
    yesPrice,
    noPrice,
    setSharesAmount,
    setPrice,
    price,
    sharesAmount,
  } = useClobWidget()

  const handlePendingTradeData = () => {
    const pendingTradeData = localStorage.getItem('pendingTrade')

    if (!pendingTradeData) return

    try {
      const parsedData: PendingTradeData = JSON.parse(pendingTradeData)
      const { price, strategy, outcome, orderType, marketSlug } = parsedData

      if (marketSlug === market?.slug) {
        setPrice(price)
        setOrderType(orderType)
        setOutcome(outcome)
        setStrategy(strategy)
        localStorage.removeItem('pendingTrade')
      }
    } catch (error) {
      console.error('Error processing pending trade data:', error)
      localStorage.removeItem('pendingTrade')
    }
  }

  useEffect(() => {
    handlePendingTradeData()
  }, [market?.slug, setPrice, setOrderType, setOutcome, setStrategy])

  const handleOrderTypeChanged = (order: MarketOrderType) => {
    setOrderType(order)
    if (order === MarketOrderType.MARKET) {
      setPrice(sharesAmount)
      setSharesAmount('')
    } else {
      const selectedPrice = outcome ? 100 - yesPrice : 100 - noPrice
      setPrice(selectedPrice === 0 ? '' : String(selectedPrice))
      setSharesAmount(price)
    }
    trackChanged(ChangeEvent.ClobWidgetModeChanged, {
      mode: order === MarketOrderType.MARKET ? 'amm on' : 'clob on',
    })
    onCloseOrderTypeMenu()
  }

  const tabs = [
    {
      title: 'Buy',
    },
    {
      title: 'Sell',
    },
  ]

  const handleTabChanged = (tab: 'Buy' | 'Sell') => {
    trackChanged<StrategyChangedMetadata>(ChangeEvent.StrategyChanged, {
      type: `${tab} selected`,
      marketAddress: market?.slug as Address,
      marketMarketType: 'CLOB',
    })
    setStrategy(tab)
  }

  useEffect(() => {
    setStrategy(strategy)
  }, [strategy])

  return (
    <Box>
      <Box position='relative' borderRadius='8px' overflow='hidden'>
        <Overlay show={tradeStepperOpen} onClose={onToggleTradeStepper} />
        {tradeStepperOpen && <TradeStepperMenu />}
        <Paper bg='grey.100' borderRadius='8px' p='8px' position='relative'>
          {groupMarket && (
            <>
              <Text {...headLineLarge} mb='8px'>
                {market?.proxyTitle || market?.title}
              </Text>
              <Text {...paragraphRegular} color='grey.500' mb='24px'>
                {groupMarket.proxyTitle || groupMarket.title}
              </Text>
            </>
          )}
          <HStack w='full' justifyContent='space-between' gap={0} mb='24px'>
            <Tabs
              position='relative'
              variant='common'
              minW={isMobile ? '104px' : '120px'}
              index={strategy === 'Buy' ? 0 : 1}
            >
              <TabList borderBottom={isMobile ? 'unset' : '1px solid'} borderColor='grey.500'>
                {tabs.map((tab) => (
                  <Tab
                    key={tab.title}
                    onClick={() => handleTabChanged(tab.title as 'Buy' | 'Sell')}
                    minW='52px'
                  >
                    <HStack gap={isMobile ? '8px' : '4px'} w='fit-content'>
                      <>{tab.title}</>
                    </HStack>
                  </Tab>
                ))}
              </TabList>
              <TabIndicator
                mt='-1px'
                height='2px'
                bg='grey.800'
                transitionDuration='200ms !important'
              />
            </Tabs>
            <HStack
              w='full'
              borderBottom='1px solid'
              borderColor='grey.500'
              justifyContent='flex-end'
              paddingBottom={isMobile ? '8px' : 0}
            >
              <Menu isOpen={orderTypeMenuOpen} onClose={onCloseOrderTypeMenu} variant='transparent'>
                <MenuButton
                  as={Button}
                  onMouseEnter={onOpenOrderTypeMenu}
                  onMouseLeave={onCloseOrderTypeMenu}
                  onClick={() =>
                    handleOrderTypeChanged(
                      orderType === MarketOrderType.MARKET
                        ? MarketOrderType.LIMIT
                        : MarketOrderType.MARKET
                    )
                  }
                  rightIcon={<ChevronDownIcon width='16px' height='16px' />}
                  h='24px'
                  px='8px'
                  w='fit'
                  _active={{
                    bg: 'grey.100',
                  }}
                  _hover={{
                    bg: 'grey.100',
                  }}
                  gap={0}
                >
                  <Text
                    {...paragraphMedium}
                    className={'amp-mask'}
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    maxW='112px'
                  >
                    {orderType === MarketOrderType.MARKET ? 'Market' : 'Limit'}
                  </Text>
                </MenuButton>

                <MenuList
                  borderRadius='8px'
                  w='180px'
                  zIndex={2}
                  boxShadow='0px 1px 4px 0px rgba(2, 6, 23, 0.05)'
                  border='1px solid'
                  borderColor='grey.200'
                >
                  <Button
                    variant='transparent'
                    w='full'
                    onClick={() => handleOrderTypeChanged(MarketOrderType.MARKET)}
                    justifyContent='flex-start'
                  >
                    Market
                  </Button>
                  <Button
                    variant='transparent'
                    w='full'
                    justifyContent='flex-start'
                    onClick={() => handleOrderTypeChanged(MarketOrderType.LIMIT)}
                  >
                    Limit
                  </Button>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
          <OutcomeButtonsClob />
          {orderType === MarketOrderType.MARKET ? <ClobMarketTradeForm /> : <ClobLimitTradeForm />}
          {isBalanceNotEnough && (
            <Text my='8px' {...paragraphRegular} color='grey.500' textAlign={'center'}>
              Not enough funds
            </Text>
          )}
        </Paper>
      </Box>

      <SharesActionsClob />
    </Box>
  )
}
