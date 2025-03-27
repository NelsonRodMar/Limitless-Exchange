import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Slide,
  SlideFade,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useFundWallet } from '@privy-io/react-auth'
import Image from 'next/image'
import NextLink from 'next/link'
import React, { useMemo } from 'react'
import UserMenuDesktop from '@/components/layouts/user-menu-desktop'
import { Profile } from '@/components'
import { useTokenFilter } from '@/contexts/TokenFilterContext'
import useClient from '@/hooks/use-client'
import usePageName from '@/hooks/use-page-name'
import { useThemeProvider } from '@/providers'
import DepositIcon from '@/resources/icons/deposit-icon.svg'
import FeedIcon from '@/resources/icons/sidebar/Feed.svg'
import GridIcon from '@/resources/icons/sidebar/Markets.svg'
import PortfolioIcon from '@/resources/icons/sidebar/Portfolio.svg'
import SidebarIcon from '@/resources/icons/sidebar/crone-icon.svg'
import DashboardIcon from '@/resources/icons/sidebar/dashboard.svg'
import {
  ClickEvent,
  ProfileBurgerMenuClickedMetadata,
  useAccount,
  useAmplitude,
  usePosition,
} from '@/services'
import { useMarkets } from '@/services/MarketsService'
import { paragraphMedium } from '@/styles/fonts/fonts.styles'
import { MarketStatus } from '@/types'

export default function Header() {
  const { setLightTheme, setDarkTheme, mode } = useThemeProvider()
  const { isFetching } = useMarkets(null)
  const { dashboard, handleDashboard } = useTokenFilter()
  const pageName = usePageName()
  const { trackClicked } = useAmplitude()
  const { isLoggedToPlatform } = useClient()
  const { fundWallet } = useFundWallet()
  const { data: positions } = usePosition()
  const {
    isOpen: isOpenWalletPage,
    onToggle: onToggleWalletPage,
    onClose: onCloseWalletPage,
  } = useDisclosure()
  const { isOpen: isOpenProfile, onToggle: onToggleProfile } = useDisclosure()
  const {
    disconnectFromPlatform,
    displayName,
    profileData,
    profileLoading,
    account,
    web3Client,
    loginToPlatform,
  } = useAccount()
  const handleBuyCryptoClicked = async () => {
    trackClicked<ProfileBurgerMenuClickedMetadata>(ClickEvent.BuyCryptoClicked)
    await fundWallet(account as string)
  }

  const handleOpenWalletPage = () => {
    onToggleWalletPage()
  }

  const handleOpenProfile = () => {
    onToggleProfile()
  }

  const hasWinningPosition = useMemo(() => {
    return positions?.some((position) => {
      if (position.type === 'amm') {
        return position.market.closed
      }
      return position.market.status === MarketStatus.RESOLVED
    })
  }, [positions])

  return (
    <HStack
      w='full'
      justifyContent='space-between'
      p='16px'
      borderBottom='1px solid'
      borderColor='grey.100'
    >
      <HStack gap='32px'>
        <Image
          src={mode === 'dark' ? '/logo-white.svg' : '/logo-black.svg'}
          height={32}
          width={156}
          alt='logo'
        />
        <HStack gap='16px'>
          <NextLink href={`/`} passHref>
            <Link
              variant='transparent'
              bg={pageName === 'Home' ? 'grey.100' : 'unset'}
              rounded='8px'
              onClick={() => {
                trackClicked<ProfileBurgerMenuClickedMetadata>(
                  ClickEvent.ProfileBurgerMenuClicked,
                  {
                    option: 'Home',
                  }
                )
              }}
            >
              <HStack w='full' whiteSpace='nowrap' gap='4px'>
                <GridIcon width={16} height={16} />
                <Text {...paragraphMedium} fontWeight={500}>
                  Markets
                </Text>
              </HStack>
            </Link>
          </NextLink>
          <NextLink href={`/?dashboard=marketcrash`} passHref>
            <Link
              variant='transparent'
              bg={dashboard === 'marketcrash' ? 'grey.100' : 'unset'}
              rounded='8px'
              onClick={() => {
                trackClicked<ProfileBurgerMenuClickedMetadata>(
                  ClickEvent.ProfileBurgerMenuClicked,
                  {
                    option: 'Market Crash',
                  }
                )
              }}
            >
              <HStack w='full' gap='4px'>
                <DashboardIcon width={16} height={16} color='#FF9200' />
                <Text fontWeight={500} fontSize='14px'>
                  Market crash
                </Text>
              </HStack>
            </Link>
          </NextLink>
          <NextLink href='/leaderboard' passHref>
            <Link
              onClick={() => {
                trackClicked<ProfileBurgerMenuClickedMetadata>(
                  ClickEvent.ProfileBurgerMenuClicked,
                  {
                    option: 'Leaderboard',
                  }
                )
              }}
              variant='transparent'
              w='full'
              bg={pageName === 'Leaderboard' ? 'grey.100' : 'unset'}
              rounded='8px'
            >
              <HStack w='full' gap='4px'>
                <SidebarIcon width={16} height={16} />
                <Text fontWeight={500} fontSize='14px'>
                  Leaderboard
                </Text>
              </HStack>
            </Link>
          </NextLink>
          <NextLink href='/feed' passHref>
            <Link
              onClick={() => {
                trackClicked<ProfileBurgerMenuClickedMetadata>(
                  ClickEvent.ProfileBurgerMenuClicked,
                  {
                    option: 'Feed',
                  }
                )
              }}
              variant='transparent'
              w='full'
              bg={pageName === 'Feed' ? 'grey.100' : 'unset'}
              rounded='8px'
            >
              <HStack w='full' gap='4px'>
                <FeedIcon width={16} height={16} />
                <Text fontWeight={500} fontSize='14px'>
                  Feed
                </Text>
              </HStack>
            </Link>
          </NextLink>
        </HStack>
      </HStack>
      {isLoggedToPlatform ? (
        <HStack gap='16px'>
          <Button variant='contained' onClick={handleBuyCryptoClicked} minW='98px'>
            <DepositIcon />
            Deposit
          </Button>
          <NextLink href='/portfolio' passHref>
            <Link
              onClick={() => {
                trackClicked<ProfileBurgerMenuClickedMetadata>(
                  ClickEvent.ProfileBurgerMenuClicked,
                  {
                    option: 'Portfolio',
                  }
                )
              }}
              variant='transparent'
              bg={pageName === 'Portfolio' ? 'grey.100' : 'unset'}
              rounded='8px'
            >
              <HStack w='full' gap='0'>
                <PortfolioIcon width={16} height={16} />
                <Text fontWeight={500} fontSize='14px' marginLeft='8px'>
                  Portfolio
                </Text>
                {hasWinningPosition ? (
                  <Flex
                    bg='red.500'
                    h='8px'
                    w='8px'
                    borderRadius='10px'
                    marginLeft='3px'
                    alignSelf='start'
                  />
                ) : null}
              </HStack>
            </Link>
          </NextLink>
          <UserMenuDesktop
            handleOpenWalletPage={handleOpenWalletPage}
            handleOpenProfile={handleOpenProfile}
          />
          {isOpenProfile && (
            <Box
              position='fixed'
              top={0}
              left={0}
              bottom={0}
              w='full'
              zIndex={100}
              bg='rgba(0, 0, 0, 0.3)'
              mt='20px'
              ml='188px'
              animation='fadeIn 0.5s'
            ></Box>
          )}
          <Slide
            in={isOpenProfile}
            style={{
              zIndex: 100,
              marginLeft: '197px',
              transition: '0.1s',
            }}
            onClick={() => {
              trackClicked(ClickEvent.ProfileBurgerMenuClicked, {
                page: pageName,
              })
              onToggleProfile()
            }}
          >
            <Profile isOpen={isOpenProfile} />
          </Slide>
        </HStack>
      ) : (
        <Box />
      )}
    </HStack>
  )
}
