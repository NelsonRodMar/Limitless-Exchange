'use client'

import { MainLayout } from '@/components'
import { useIsMobile } from '@/hooks'
import { OpenEvent, PageOpenedMetadata, useAmplitude, useCategories } from '@/services'
import { Box, Spinner, HStack } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { MarketGroupCardResponse, MarketSingleCardResponse, Sort } from '@/types'
import { getAddress } from 'viem'
import { useDailyMarkets, useMarkets } from '@/services/MarketsService'
import { usePriceOracle } from '@/providers'
import { useTokenFilter } from '@/contexts/TokenFilterContext'
import { useSearchParams } from 'next/navigation'
import DailyMarketsSection from '@/components/common/markets/daily-markets'
import AllMarkets from '@/components/common/markets/all-markets'

const MainPage = () => {
  const searchParams = useSearchParams()
  const { data: categories } = useCategories()
  /**
   * ANALYTICS
   */
  const { trackOpened } = useAmplitude()
  const category = searchParams.get('category')

  useEffect(() => {
    const analyticData: PageOpenedMetadata = {
      page: 'Explore Markets',
      ...(category && { category }),
    }

    trackOpened(OpenEvent.PageOpened, analyticData)
  }, [])

  const categoryEntity = useMemo(() => {
    return (
      categories?.find(
        (categoryEntity) => categoryEntity.name.toLowerCase() === category?.toLowerCase()
      ) || null
    )
  }, [categories, category])

  /**
   * UI
   */
  const isMobile = useIsMobile()

  const [selectedSort, setSelectedSort] = useState<Sort>(
    (window.localStorage.getItem('SORT') as Sort) ?? Sort.BASE
  )
  const handleSelectSort = (options: Sort) => {
    window.localStorage.setItem('SORT', options)
    setSelectedSort(options)
  }

  const { selectedFilterTokens, selectedCategory } = useTokenFilter()

  const { convertTokenAmountToUsd } = usePriceOracle()
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useMarkets(categoryEntity)

  const {
    data: dailyMarkets,
    isLoading: isFetchingDailyMarkets,
    fetchNextPage: fetchDailyNextPage,
    fetchPreviousPage: fetchDailyPrevPage,
  } = useDailyMarkets(categoryEntity)

  const dataLength = data?.pages.reduce((counter, page) => {
    return counter + page.data.markets.length
  }, 0)

  const markets: (MarketGroupCardResponse | MarketSingleCardResponse)[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.markets) || []
  }, [data?.pages, category])

  const filteredAllMarkets = useMemo(() => {
    const tokenFilteredMarkets = markets?.filter((market) =>
      selectedFilterTokens.length > 0
        ? selectedFilterTokens.some(
            (filterToken) =>
              getAddress(filterToken.address) === getAddress(market.collateralToken.address)
          )
        : true
    )

    if (selectedCategory) {
      return tokenFilteredMarkets.filter((market) => market.category === selectedCategory?.name)
    }

    return tokenFilteredMarkets
  }, [markets, selectedFilterTokens, selectedCategory])

  const sortedMarkets = useMemo(() => {
    if (!filteredAllMarkets) return []
    switch (selectedSort) {
      case Sort.NEWEST:
        return [...filteredAllMarkets].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
      case Sort.HIGHEST_VOLUME:
        return [...filteredAllMarkets].sort((a, b) => {
          // @ts-ignore
          const volumeA = a?.slug
            ? // @ts-ignore
              a.markets.reduce((a, b) => a + +b.volumeFormatted, 0)
            : // @ts-ignore
              +a.volumeFormatted
          // @ts-ignore
          const volumeB = b?.slug
            ? // @ts-ignore
              b.markets.reduce((a, b) => a + +b.volumeFormatted, 0)
            : // @ts-ignore
              +b.volumeFormatted

          return (
            convertTokenAmountToUsd(b.collateralToken.symbol, volumeB) -
            convertTokenAmountToUsd(a.collateralToken.symbol, volumeA)
          )
        })
      case Sort.HIGHEST_LIQUIDITY:
        return [...filteredAllMarkets].sort((a, b) => {
          // @ts-ignore
          const liquidityA = a?.slug
            ? // @ts-ignore
              a.markets.reduce((a, b) => a + +b.liquidityFormatted, 0)
            : // @ts-ignore
              +a.liquidityFormatted
          // @ts-ignore
          const liquidityB = b?.slug
            ? // @ts-ignore
              b.markets.reduce((a, b) => a + +b.liquidityFormatted, 0)
            : // @ts-ignore
              +b.liquidityFormatted

          return (
            convertTokenAmountToUsd(b.collateralToken.symbol, liquidityB) -
            convertTokenAmountToUsd(a.collateralToken.symbol, liquidityA)
          )
        })
      case Sort.ENDING_SOON:
        return [...filteredAllMarkets].sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        )
      default:
        return filteredAllMarkets
    }
  }, [markets, filteredAllMarkets, selectedSort])

  return (
    <MainLayout layoutPadding={isMobile ? '0' : '16px'}>
      <Box w={isMobile ? 'full' : '664px'} ml={isMobile ? 'auto' : '200px'}>
        {(isFetching || isFetchingDailyMarkets) && !isFetchingNextPage ? (
          <HStack w={'full'} justifyContent={'center'} alignItems={'center'}>
            <Spinner />
          </HStack>
        ) : (
          <>
            {dailyMarkets && (
              <DailyMarketsSection
                markets={
                  dailyMarkets.pages[
                    (dailyMarkets.pageParams[dailyMarkets.pageParams.length - 1] as number) - 1
                  ].data.markets
                }
                totalAmount={
                  dailyMarkets.pages[
                    (dailyMarkets.pageParams[dailyMarkets.pageParams.length - 1] as number) - 1
                  ].data.totalAmount
                }
                onClickNextPage={() => fetchDailyNextPage()}
                onClickPrevPage={() => fetchDailyPrevPage()}
              />
            )}
            <AllMarkets
              dataLength={dataLength ?? 0}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              markets={sortedMarkets}
              handleSelectSort={handleSelectSort}
              totalAmount={data?.pages?.[0].data.totalAmount}
            />
          </>
        )}
      </Box>
    </MainLayout>
  )
}

export default MainPage
