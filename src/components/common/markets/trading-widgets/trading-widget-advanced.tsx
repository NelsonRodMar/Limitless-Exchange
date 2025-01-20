import {
  Box,
  Button,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import React, { useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Address, formatUnits, parseUnits } from 'viem'
import ButtonWithStates from '@/components/common/button-with-states'
import ClobLimitTradeForm from '@/components/common/markets/clob-widget/clob-limit-trade-form'
import ClobMarketTradeForm from '@/components/common/markets/clob-widget/clob-market-trade-form'
import ClobWidget from '@/components/common/markets/clob-widget/clob-widget'
import { ClobWidgetProvider } from '@/components/common/markets/clob-widget/context'
import OutcomeButtonsClob from '@/components/common/markets/outcome-buttons/outcome-buttons-clob'
import SplitSharesModal from '@/components/common/modals/split-shares-modal'
import Paper from '@/components/common/paper'
import useClobMarketShares from '@/hooks/use-clob-market-shares'
import useMarketLockedBalance from '@/hooks/use-market-locked-balance'
import { useOrderBook } from '@/hooks/use-order-book'
import SettingsIcon from '@/resources/icons/setting-icon.svg'
import {
  ChangeEvent,
  StrategyChangedMetadata,
  useAccount,
  useAmplitude,
  useBalanceQuery,
  useTradingService,
} from '@/services'
import { useAxiosPrivateClient } from '@/services/AxiosPrivateClient'
import { useWeb3Service } from '@/services/Web3Service'
import { MarketOrderType } from '@/types'

export default function TradingWidgetAdvanced() {
  const { strategy, market } = useTradingService()
  const { data: lockedBalance } = useMarketLockedBalance(market?.slug)
  const { data: sharesOwned } = useClobMarketShares(market?.slug, market?.tokens)
  const privateClient = useAxiosPrivateClient()
  const { profileData, account } = useAccount()
  const queryClient = useQueryClient()
  const {
    checkAllowance,
    approveContract,
    placeLimitOrder,
    placeMarketOrder,
    approveAllowanceForAll,
    checkAllowanceForAll,
  } = useWeb3Service()

  console.log(sharesOwned)
  // const { data: conditionalTokensAddress } = useConditionalTokensAddr({
  //   marketAddr: !market ? undefined : getAddress(market.address),
  // })
  const { balanceOfSmartWallet } = useBalanceQuery()
  const { data: orderBook } = useOrderBook(market?.slug)
  // const { data: ownedShares } = useClobMarketShares(account, [
  //   market?.tokens.yes as string,
  //   market?.tokens.no as string,
  // ])
  //
  // console.log(ownedShares)

  const [orderType, setOrderType] = useState<MarketOrderType>(MarketOrderType.MARKET)
  const [outcome, setOutcome] = useState(0)
  const [price, setPrice] = useState('')
  const [sharesAmount, setSharesAmount] = useState('')
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [isApprovedForSell, setIsApprovedForSell] = useState(false)

  const sharesPrice = useMemo(() => {
    if (orderType === MarketOrderType.LIMIT) {
      if (price && sharesAmount) {
        return new BigNumber(price).dividedBy(100).multipliedBy(sharesAmount).toString()
      }
      return '0'
    }
    if (price) {
      return price.toString()
    }
    return '0'
  }, [orderType, price, sharesAmount])

  const { yesPrice, noPrice } = useMemo(() => {
    if (orderBook) {
      if (strategy === 'Buy') {
        const yesPrice = orderBook?.asks.sort((a, b) => a.price - b.price)[0]?.price * 100
        const noPrice = (1 - orderBook?.bids.sort((a, b) => b.price - a.price)[0]?.price) * 100
        return {
          yesPrice: isNaN(yesPrice) ? 0 : +yesPrice.toFixed(),
          noPrice: isNaN(noPrice) ? 0 : +noPrice.toFixed(),
        }
      }
      const yesPrice = orderBook?.bids.sort((a, b) => b.price - a.price)[0]?.price * 100
      const noPrice = (1 - orderBook?.asks.sort((a, b) => b.price - a.price)[0]?.price) * 100
      return {
        yesPrice: isNaN(yesPrice) ? 0 : +yesPrice.toFixed(),
        noPrice: isNaN(noPrice) ? 0 : +noPrice.toFixed(),
      }
    }
    return {
      yesPrice: 0,
      noPrice: 0,
    }
  }, [strategy, orderBook])

  const balance = useMemo(() => {
    if (balanceOfSmartWallet) {
      return (
        balanceOfSmartWallet.find(
          (balanceItem) => balanceItem.contractAddress === market?.collateralToken.address
        )?.formatted || ''
      )
    }
    return ''
  }, [balanceOfSmartWallet, strategy, market])

  const isBalanceNotEnough = useMemo(() => {
    if (orderType === MarketOrderType.LIMIT) {
      const amount = new BigNumber(price || '0').dividedBy(100).multipliedBy(sharesAmount)
      console.log(amount.toString())
      const lockedBalanceFormatted = formatUnits(
        BigInt(lockedBalance),
        market?.collateralToken.decimals || 6
      )
      console.log(lockedBalanceFormatted)
      const balanceLeft = new BigNumber(balance).minus(lockedBalanceFormatted)
      console.log(balanceLeft.toString())
      return amount.isGreaterThan(balanceLeft)
    }
    if (orderType === MarketOrderType.MARKET) {
      if (strategy === 'Buy') {
        return new BigNumber(price).isGreaterThan(balance)
      }
    }
  }, [
    balance,
    lockedBalance,
    market?.collateralToken.decimals,
    orderType,
    price,
    sharesAmount,
    strategy,
  ])

  console.log(isBalanceNotEnough)

  const approveMutation = useMutation({
    mutationKey: ['approve', market?.address],
    mutationFn: async () => {
      if (market) {
        await approveContract(
          process.env.NEXT_PUBLIC_CTF_EXCHANGE_ADDR as Address,
          market.collateralToken.address,
          parseUnits(sharesPrice, market.collateralToken.decimals)
        )
      }
    },
    onSuccess: async () => {
      await checkMarketAllowance()
    },
  })

  const approveForSellMutation = useMutation({
    mutationKey: ['approve-nft', market?.address],
    mutationFn: async () => {
      if (market) {
        await approveAllowanceForAll(
          process.env.NEXT_PUBLIC_CTF_EXCHANGE_ADDR as Address,
          process.env.NEXT_PUBLIC_CTF_CONTRACT as Address
        )
      }
    },
  })

  const placeMarketOrderMutation = useMutation({
    mutationKey: ['market-order', market?.address, price],
    mutationFn: async () => {
      if (market) {
        const tokenId = outcome === 1 ? market.tokens.no : market.tokens.yes
        const side = strategy === 'Buy' ? 0 : 1
        const signedOrder = await placeMarketOrder(
          tokenId,
          market.collateralToken.decimals,
          outcome === 0 ? yesPrice.toString() : noPrice.toString(),
          side,
          price
        )
        const data = {
          order: {
            ...signedOrder,
            salt: +signedOrder.salt,
            price:
              orderType === MarketOrderType.LIMIT
                ? new BigNumber(price).dividedBy(100).toNumber()
                : undefined,
            makerAmount:
              orderType === MarketOrderType.LIMIT
                ? +signedOrder.makerAmount
                : +parseUnits(price, market.collateralToken.decimals).toString(),
            takerAmount: +signedOrder.takerAmount,
            nonce: +signedOrder.nonce,
            feeRateBps: +signedOrder.feeRateBps,
          },
          ownerId: profileData?.id,
          orderType: 'FOK',
          marketSlug: market.slug,
        }
        return privateClient.post('/orders', data)
      }
    },
    onSuccess: async () =>
      queryClient.refetchQueries({
        queryKey: ['user-orders', market?.slug],
      }),
  })

  const handleOrderTypeChanged = (order: MarketOrderType) => {
    setOrderType(order)
    setSharesAmount('')
  }

  const placeLimitOrderMutation = useMutation({
    mutationKey: ['limit-order', market?.address, price],
    mutationFn: async () => {
      if (market) {
        const tokenId = outcome === 1 ? market.tokens.no : market.tokens.yes
        const side = strategy === 'Buy' ? 0 : 1
        const signedOrder = await placeLimitOrder(
          tokenId,
          market.collateralToken.decimals,
          price,
          sharesAmount,
          side
        )
        const data = {
          order: {
            ...signedOrder,
            salt: +signedOrder.salt,
            price:
              orderType === MarketOrderType.LIMIT
                ? new BigNumber(price).dividedBy(100).toNumber()
                : undefined,
            makerAmount:
              orderType === MarketOrderType.LIMIT
                ? +signedOrder.makerAmount
                : +parseUnits(price, market.collateralToken.decimals).toString(),
            takerAmount: +signedOrder.takerAmount,
            nonce: +signedOrder.nonce,
            feeRateBps: +signedOrder.feeRateBps,
          },
          ownerId: profileData?.id,
          orderType: 'GTC',
          marketSlug: market.slug,
        }
        return privateClient.post('/orders', data)
      }
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['user-orders', market?.slug],
      })
      await queryClient.refetchQueries({
        queryKey: ['locked-balance', market?.slug],
      })
    },
  })

  const checkMarketAllowance = async () => {
    const allowance = await checkAllowance(
      process.env.NEXT_PUBLIC_CTF_EXCHANGE_ADDR as Address,
      market?.collateralToken.address as Address
    )
    const isApprovedNFT = await checkAllowanceForAll(
      process.env.NEXT_PUBLIC_CTF_EXCHANGE_ADDR as Address,
      process.env.NEXT_PUBLIC_CTF_CONTRACT as Address
    )
    setAllowance(allowance)
    setIsApprovedForSell(isApprovedNFT)
  }

  const onApprove = async () => {
    await approveMutation.mutateAsync()
  }

  const onApproveSell = async () => {
    await approveForSellMutation.mutateAsync()
  }

  const onClickBuy = async () => {
    return orderType === MarketOrderType.LIMIT
      ? await placeLimitOrderMutation.mutateAsync()
      : await placeMarketOrderMutation.mutateAsync()
  }

  const handleChangePrice = (value: string) => {
    if (orderType === MarketOrderType.LIMIT) {
      if (/^-?\d*$/.test(value)) {
        setPrice(value)
        return
      }
      return
    }
    if (market?.collateralToken?.symbol === 'USDC') {
      const decimals = value.split('.')[1]
      if (decimals && decimals.length > 1) {
        return
      }
      setPrice(value)
      return
    }
    setPrice(value)
  }

  const resetFormFields = () => {
    setPrice('')
    setSharesAmount('')
  }

  const priceTitle = useMemo(() => {
    if (orderType === MarketOrderType.MARKET) {
      return strategy === 'Buy' ? 'Amount' : 'Shares'
    }
    return 'Limit price'
  }, [strategy, orderType])

  const isSharePriceValid = useMemo(() => {
    if (!!price) {
      if (orderType === MarketOrderType.LIMIT) {
        return +price > 0 && +price < 100
      }
    }
    return true
  }, [orderType, price])

  const actionButton = useMemo(() => {
    if (strategy === 'Buy') {
      if (!!+sharesPrice && market) {
        const isApprovalNeeded = new BigNumber(allowance.toString()).isLessThan(
          parseUnits(sharesPrice, market.collateralToken.decimals).toString()
        )
        return (
          <ButtonWithStates
            status={approveMutation.status}
            variant='contained'
            w='full'
            mt='24px'
            onClick={isApprovalNeeded ? onApprove : onClickBuy}
            isDisabled={!+sharesPrice || !isSharePriceValid || isBalanceNotEnough}
            onReset={async () => {
              approveMutation.reset()
              await checkMarketAllowance()
            }}
          >
            {isApprovalNeeded ? 'Approve' : strategy}
          </ButtonWithStates>
        )
      }
    }
    if (!!+sharesPrice && market) {
      return (
        <ButtonWithStates
          status={approveForSellMutation.status}
          variant='contained'
          w='full'
          mt='24px'
          onClick={!isApprovedForSell ? onApproveSell : onClickBuy}
          isDisabled={!+sharesPrice || !isSharePriceValid}
          onReset={async () => {
            approveForSellMutation.reset()
            await checkMarketAllowance()
          }}
        >
          {!isApprovedForSell ? 'Approve Sell' : strategy}
        </ButtonWithStates>
      )
    }

    return <Box mt='24px' />
  }, [
    allowance,
    market,
    sharesPrice,
    strategy,
    approveMutation.status,
    isApprovedForSell,
    isSharePriceValid,
  ])

  return (
    <ClobWidgetProvider>
      <ClobWidget />
    </ClobWidgetProvider>
  )
}
