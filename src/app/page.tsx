'use client'

import { HStack, Text, VStack, Box } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from '@/components/common/loader'
import DashboardSection from '@/components/common/markets/dashboard-section'
import { MarketCategoryHeader } from '@/components/common/markets/market-category-header'
import MarketsSection from '@/components/common/markets/markets-section'
import TopMarkets from '@/components/common/markets/top-markets'
import { sortAtom } from '@/atoms/market-sort'
import { MainLayout } from '@/components'
import { useTokenFilter } from '@/contexts/TokenFilterContext'
import { usePriceOracle } from '@/providers'
import {
  OpenEvent,
  PageOpenedMetadata,
  DashboardName,
  useAmplitude,
  useCategories,
  useTradingService,
} from '@/services'
import { useBanneredMarkets, useMarket, useMarkets } from '@/services/MarketsService'
import { paragraphRegular } from '@/styles/fonts/fonts.styles'
import { Dashboard, Market, MarketType, Sort, SortStorageName } from '@/types'
import { sortMarkets } from '@/utils/market-sorting'

const MainPage = () => {
  const searchParams = useSearchParams()
  const { data: categories } = useCategories()
  const {
    onCloseMarketPage,
    onOpenMarketPage,
    market: selectedMarket,
    groupMarket,
  } = useTradingService()
  const { trackOpened } = useAmplitude()
  const category = searchParams.get('category')
  const market = searchParams.get('market')
  const dashboardSearch = searchParams.get('dashboard')
  const { data: marketData } = useMarket(market ?? undefined)
  const { data: banneredMarkets, isFetching: isBanneredLoading } = useBanneredMarkets(null)
  const { selectedCategory, handleCategory, dashboard, handleDashboard } = useTokenFilter()
  const [selectedSort, setSelectedSort] = useAtom(sortAtom)
  const { convertTokenAmountToUsd } = usePriceOracle()
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useMarkets(null)

  useEffect(() => {
    if (marketData) {
      if (
        marketData.marketType === ('single' as MarketType) &&
        selectedMarket?.slug !== marketData.slug
      ) {
        onOpenMarketPage(marketData)
        return
      }
      if (
        marketData.marketType === ('group' as MarketType) &&
        groupMarket?.slug !== marketData.slug
      ) {
        onOpenMarketPage(marketData)
        return
      }
    }
  }, [marketData])

  useEffect(() => {
    const dashboardNameMapping: Record<string, string> = {
      marketcrash: DashboardName.MarketCrash,
    }

    const analyticData: PageOpenedMetadata = {
      page: 'Explore Markets',
      ...(selectedCategory && { category: [selectedCategory.name.toLowerCase()] }),
      ...(dashboard && { dashboard: dashboardNameMapping[dashboard.toLowerCase()] || dashboard }),
    }
    trackOpened(OpenEvent.PageOpened, analyticData)
  }, [selectedCategory?.name, dashboard])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSort = window.localStorage.getItem(SortStorageName.SORT)
      if (storedSort) {
        try {
          const parsedSort = JSON.parse(storedSort) as Sort
          setSelectedSort({ sort: parsedSort })
        } catch (error) {
          console.error('Error parsing stored sort:', error)
          setSelectedSort({ sort: Sort.DEFAULT })
        }
      }
    }
  }, [])

  const handleSelectSort = (options: Sort, name: SortStorageName) => {
    window.localStorage.setItem(name, JSON.stringify(options))
    setSelectedSort({ sort: options ?? Sort.DEFAULT })
  }

  useEffect(() => {
    if (category && categories) {
      const categoryFromUrl = categories.find(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      )
      if (categoryFromUrl) {
        handleCategory(categoryFromUrl)
      }
    }
  }, [category, categories])

  useEffect(() => {
    if (dashboardSearch) {
      handleDashboard(dashboardSearch as Dashboard)
    }
  }, [dashboardSearch])

  const totalAmount = useMemo(() => data?.pages[0]?.data.totalAmount ?? 0, [data?.pages])

  const markets: Market[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.markets) || []
  }, [data?.pages])

  const filteredAllMarkets = useMemo(() => {
    if (!markets) return []
    if (!selectedCategory) return markets
    if (selectedCategory) {
      setSelectedSort({ sort: Sort.DEFAULT })
      window.localStorage.setItem(SortStorageName.SORT, JSON.stringify(Sort.DEFAULT))
      return markets.filter((market) =>
        market.categories.some(
          (category) => category.toLowerCase() === selectedCategory.name.toLowerCase()
        )
      )
    }

    return markets
  }, [markets, selectedCategory])

  const sortedAllMarkets = useMemo(() => {
    return sortMarkets(
      filteredAllMarkets,
      selectedSort?.sort || Sort.DEFAULT,
      convertTokenAmountToUsd
    )
  }, [filteredAllMarkets, selectedSort, convertTokenAmountToUsd])

  useEffect(() => {
    return () => {
      onCloseMarketPage()
    }
  }, [])

  const headerContent = useMemo(() => {
    if (selectedCategory) {
      return (
        <Box
          w='full'
          overflowX='scroll'
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            '-ms-overflow-style': 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <MarketCategoryHeader name={selectedCategory.name} />
        </Box>
      )
    }
    return <TopMarkets markets={banneredMarkets as Market[]} isLoading={isBanneredLoading} />
  }, [selectedCategory, banneredMarkets, isBanneredLoading])

  return (
    <MainLayout layoutPadding={'0px'}>
      <HStack className='w-full' alignItems='flex-start' w='full' justifyContent='center'>
        <VStack w='full' justifyContent='center'>
          <>
            {dashboard ? (
              <DashboardSection
                dashboardName={dashboard}
                handleSelectSort={handleSelectSort}
                sort={selectedSort.sort}
              />
            ) : (
              <>
                {headerContent}
                <Box className='full-container'>
                  <InfiniteScroll
                    className='scroll'
                    dataLength={markets?.length ?? 0}
                    next={fetchNextPage}
                    hasMore={hasNextPage}
                    style={{ width: '100%' }}
                    loader={
                      markets.length > 0 && markets.length < totalAmount ? (
                        <HStack w='full' gap='8px' justifyContent='center' mt='8px' mb='24px'>
                          <Loader />
                          <Text {...paragraphRegular}>Loading more markets</Text>
                        </HStack>
                      ) : null
                    }
                  >
                    <MarketsSection
                      markets={sortedAllMarkets as Market[]}
                      handleSelectSort={handleSelectSort}
                      isLoading={isFetching && !isFetchingNextPage}
                      sort={selectedSort.sort}
                    />
                  </InfiniteScroll>
                </Box>
              </>
            )}
          </>
        </VStack>
      </HStack>
    </MainLayout>
  )
}

export default MainPage
