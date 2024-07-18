import Image from 'next/image'
import {
  Button,
  Flex,
  HStack,
  Text,
  Image as ChakraImage,
  useDisclosure,
  Slide,
  Box,
  VStack,
} from '@chakra-ui/react'
import { NumberUtil, truncateEthAddress } from '@/utils'

import React from 'react'
import { useAccount as useWagmiAccount } from 'wagmi'
import {
  ClickEvent,
  CreateMarketClickedMetadata,
  ProfileBurgerMenuClickedMetadata,
  useAccount,
  useAmplitude,
  useBalanceService,
  useHistory,
} from '@/services'
import { useWalletAddress } from '@/hooks/use-wallet-address'
import PortfolioIcon from '@/resources/icons/portfolio-icon.svg'
import ArrowRightIcon from '@/resources/icons/arrow-right-icon.svg'
import WalletIcon from '@/resources/icons/wallet-icon.svg'
import { usePathname, useRouter } from 'next/navigation'
import WalletPage from '@/components/layouts/wallet-page'
import { useWeb3Service } from '@/services/Web3Service'
import TokenFilterMobile from '@/components/common/token-filter-mobile'
import { isMobile } from 'react-device-detect'
import '@/app/style.css'
import { LoginButton } from '@/components/common/login-button'
import useDisconnectAccount from '@/hooks/use-disconnect'
import { cutUsername } from '@/utils/string'
import { paragraphMedium } from '@/styles/fonts/fonts.styles'

export default function MobileHeader() {
  const { isConnected } = useWagmiAccount()
  const { overallBalanceUsd } = useBalanceService()
  const { userInfo } = useAccount()
  const address = useWalletAddress()
  const { balanceInvested } = useHistory()
  const router = useRouter()
  const { disconnectFromPlatform } = useDisconnectAccount()
  const { trackClicked } = useAmplitude()
  const { client } = useWeb3Service()
  const pathname = usePathname()

  const { isOpen: isOpenUserMenu, onToggle: onToggleUserMenu } = useDisclosure()
  const { isOpen: isWalletModalOpen, onToggle: onToggleWalletModal } = useDisclosure()

  const handleNavigateToPortfolioPage = () => {
    onToggleUserMenu()
    router.push('/portfolio')
  }

  return (
    <>
      <Box p='16px' pb={0}>
        <HStack justifyContent='space-between' alignItems='center'>
          <Button variant='transparent' onClick={() => router.push('/')}>
            <Image src={'/logo-black.svg'} height={32} width={156} alt='calendar' />
          </Button>
          <HStack gap='4px'>
            {isConnected ? (
              <>
                <Button variant='transparent' onClick={onToggleUserMenu}>
                  <Text fontWeight={500} fontSize='16px'>
                    {NumberUtil.formatThousands(overallBalanceUsd, 2)} USD
                  </Text>
                  {userInfo?.profileImage?.includes('http') ? (
                    <ChakraImage
                      src={userInfo.profileImage}
                      borderRadius={'2px'}
                      h={'32px'}
                      w={'32px'}
                    />
                  ) : (
                    <Flex
                      borderRadius={'2px'}
                      h={'32px'}
                      w={'32px'}
                      bg='grey.300'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Text {...paragraphMedium}>{userInfo?.name?.[0].toUpperCase()}</Text>
                    </Flex>
                  )}
                </Button>
                {isOpenUserMenu && (
                  <Box
                    position='fixed'
                    top={0}
                    left={0}
                    bottom={0}
                    w='full'
                    zIndex={100}
                    bg='rgba(0, 0, 0, 0.3)'
                    mt='20px'
                    animation='fadeIn 0.5s'
                  ></Box>
                )}
                <Slide
                  direction='right'
                  in={isOpenUserMenu}
                  style={{ zIndex: 100, marginTop: '20px', transition: '0.1s' }}
                  onClick={onToggleUserMenu}
                >
                  <VStack
                    ml='40px'
                    bg='grey.100'
                    h='full'
                    p='16px'
                    justifyContent='space-between'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Box w='full'>
                      <HStack gap='8px'>
                        {userInfo?.profileImage?.includes('http') ? (
                          <ChakraImage
                            src={userInfo.profileImage}
                            borderRadius={'2px'}
                            h={'24px'}
                            w={'24px'}
                          />
                        ) : (
                          <Flex
                            borderRadius={'2px'}
                            h={'24px'}
                            w={'24px'}
                            bg='grey.300'
                            alignItems='center'
                            justifyContent='center'
                          >
                            <Text fontWeight={500} fontSize='18px'>
                              {userInfo?.name?.[0].toUpperCase()}
                            </Text>
                          </Flex>
                        )}
                        <Text {...paragraphMedium}>
                          {userInfo?.name
                            ? cutUsername(userInfo.name, 60)
                            : truncateEthAddress(address)}
                        </Text>
                      </HStack>
                      <VStack my='24px' gap='8px'>
                        <Button
                          variant='transparent'
                          px={0}
                          w='full'
                          onClick={handleNavigateToPortfolioPage}
                        >
                          <HStack justifyContent='space-between' w='full'>
                            <HStack color='grey.500' gap='4px'>
                              <PortfolioIcon width={16} height={16} />
                              <Text fontWeight={500} fontSize='16px'>
                                Portfolio
                              </Text>
                            </HStack>

                            <HStack gap='8px'>
                              <Text fontWeight={500}>
                                {NumberUtil.formatThousands(balanceInvested, 2)} USD
                              </Text>
                              <Box color='grey.500'>
                                <ArrowRightIcon width={16} height={16} />
                              </Box>
                            </HStack>
                          </HStack>
                        </Button>
                        {client !== 'eoa' && (
                          <Button
                            variant='transparent'
                            w='full'
                            mt='8px'
                            px={0}
                            onClick={() => {
                              onToggleWalletModal()
                              onToggleUserMenu()
                            }}
                          >
                            <HStack justifyContent='space-between' w='full'>
                              <HStack color='grey.500' gap='4px'>
                                <WalletIcon width={16} height={16} />
                                <Text fontWeight={500} fontSize='16px'>
                                  Wallet
                                </Text>
                              </HStack>

                              <HStack gap='8px'>
                                <Text fontWeight={500}>
                                  {NumberUtil.formatThousands(overallBalanceUsd, 2)} USD
                                </Text>
                                <Box color='grey.500'>
                                  <ArrowRightIcon width={16} height={16} />
                                </Box>
                              </HStack>
                            </HStack>
                          </Button>
                        )}
                      </VStack>
                      {client !== 'eoa' && (
                        <Button
                          variant='contained'
                          w='full'
                          h='32px'
                          onClick={() => {
                            onToggleWalletModal()
                            onToggleUserMenu()
                          }}
                        >
                          Top Up
                        </Button>
                      )}
                      <Button
                        variant='grey'
                        w='full'
                        mt='24px'
                        h='32px'
                        onClick={() => {
                          trackClicked<CreateMarketClickedMetadata>(
                            ClickEvent.CreateMarketClicked,
                            {
                              page: 'Explore Markets',
                            }
                          )
                          window.open(
                            'https://limitlesslabs.notion.site/Limitless-Creators-101-fbbde33a51104fcb83c57f6ce9d69d2a?pvs=4',
                            '_blank',
                            'noopener'
                          )
                        }}
                      >
                        Create Market
                      </Button>
                    </Box>
                    <Button
                      variant='grey'
                      w='full'
                      mt='24px'
                      h='32px'
                      onClick={() => {
                        trackClicked<ProfileBurgerMenuClickedMetadata>(
                          ClickEvent.ProfileBurgerMenuClicked,
                          {
                            option: 'Sign Out',
                          }
                        )
                        disconnectFromPlatform()
                      }}
                    >
                      Log Out
                    </Button>
                  </VStack>
                </Slide>
              </>
            ) : (
              <LoginButton />
            )}
          </HStack>
          {isWalletModalOpen && (
            <Box
              position='fixed'
              top={0}
              left={0}
              bottom={0}
              w='full'
              zIndex={100}
              bg='rgba(0, 0, 0, 0.3)'
              mt='20px'
              animation='fadeIn 0.5s'
            ></Box>
          )}
          <Slide
            direction='bottom'
            in={isWalletModalOpen}
            style={{
              zIndex: 150,
              paddingTop: isWalletModalOpen ? '60px' : 0,
              top: isWalletModalOpen ? 0 : '60px',
              height: '100%',
              transition: '0.1s',
              animation: 'fadeIn 0.5s',
            }}
            onClick={() => {
              onToggleWalletModal()
            }}
          >
            <WalletPage onClose={onToggleWalletModal} />
          </Slide>
        </HStack>
      </Box>
      {isMobile && pathname === '/' && <TokenFilterMobile />}
    </>
  )
}
