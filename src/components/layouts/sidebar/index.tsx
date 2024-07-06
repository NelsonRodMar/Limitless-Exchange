import {
  Box,
  Divider,
  useTheme,
  VStack,
  Text,
  Button,
  HStack,
  Image as ChakraImage,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useDisclosure,
  Slide,
} from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import { useAccount as useWagmiAccount } from 'wagmi'
import { LogInButton } from '@/components'
import {
  ClickEvent,
  CreateMarketClickedMetadata,
  useAmplitude,
  useBalanceService,
  useHistory,
  useAccount,
  ProfileBurgerMenuClickedMetadata,
  useAuth,
} from '@/services'
import WalletIcon from '@/resources/icons/wallet-icon.svg'
import PortfolioIcon from '@/resources/icons/portfolio-icon.svg'
import { NumberUtil, truncateEthAddress } from '@/utils'
import { useWalletAddress } from '@/hooks/use-wallet-address'
import { cutUsername } from '@/utils/string'
import { useRouter } from 'next/navigation'
import WalletPage from '@/components/layouts/wallet-page'
import TokenFilter from '@/components/common/TokenFilter'

export default function Sidebar() {
  const theme = useTheme()

  const { isConnected } = useWagmiAccount()
  const { trackClicked } = useAmplitude()

  const { overallBalanceUsd } = useBalanceService()
  const { balanceInvested } = useHistory()
  const { userInfo } = useAccount()
  const address = useWalletAddress()
  const router = useRouter()
  const { signOut } = useAuth()

  const { isOpen: isOpenWalletPage, onToggle: onToggleWalletPage } = useDisclosure()

  return (
    <>
      <VStack
        padding='16px'
        borderRight={`1px solid ${theme.colors.grey['200']}`}
        h='full'
        minW={'188px'}
        minH={'100vh'}
        zIndex={10}
      >
        <Button variant='transparent' onClick={() => router.push('/')}>
          <Image src={'/logo-black.svg'} height={32} width={156} alt='calendar' />
        </Button>
        {isConnected && (
          <VStack my='16px' w='full' gap='16px'>
            <Button variant='transparent' onClick={onToggleWalletPage} w='full'>
              <HStack w='full'>
                <WalletIcon width={16} height={16} />
                <Text fontWeight={500} fontSize='14px'>
                  {NumberUtil.formatThousands(overallBalanceUsd, 2)} USD
                </Text>
              </HStack>
            </Button>
            <Button variant='transparent' onClick={() => router.push('/portfolio')} w='full'>
              <HStack w='full'>
                <PortfolioIcon width={16} height={16} />
                <Text fontWeight={500} fontSize='14px'>
                  {NumberUtil.formatThousands(balanceInvested, 2)} USD
                </Text>
              </HStack>
            </Button>
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <HStack gap='8px'>
                      {userInfo?.profileImage?.includes('http') ? (
                        <ChakraImage
                          src={userInfo.profileImage}
                          borderRadius={'2px'}
                          h={'16px'}
                          w={'16px'}
                        />
                      ) : (
                        <Flex
                          borderRadius={'2px'}
                          h={'16px'}
                          w={'16px'}
                          bg='grey.300'
                          alignItems='center'
                          justifyContent='center'
                        >
                          <Text fontWeight={500}>{userInfo?.name?.[0].toUpperCase()}</Text>
                        </Flex>
                      )}
                      <Text fontWeight={500}>
                        {userInfo?.name ? cutUsername(userInfo.name) : truncateEthAddress(address)}
                      </Text>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel p={0}>
                  <Button
                    variant='grey'
                    w='full'
                    mt='8px'
                    onClick={() => {
                      trackClicked<ProfileBurgerMenuClickedMetadata>(
                        ClickEvent.ProfileBurgerMenuClicked,
                        {
                          option: 'Sign Out',
                        }
                      )
                      signOut()
                    }}
                  >
                    Log Out
                  </Button>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        )}
        {isConnected ? (
          <Button
            variant='contained'
            bg='grey.300'
            color='black'
            w='full'
            h='unset'
            py='4px'
            onClick={() => {
              trackClicked<CreateMarketClickedMetadata>(ClickEvent.CreateMarketClicked, {
                page: 'Explore Markets',
              })
              window.open(
                'https://limitlesslabs.notion.site/Limitless-Creators-101-fbbde33a51104fcb83c57f6ce9d69d2a?pvs=4',
                '_blank',
                'noopener'
              )
            }}
          >
            Create Market
          </Button>
        ) : (
          <LogInButton />
        )}
        <Divider />
        <TokenFilter />
      </VStack>
      <Slide
        direction='left'
        in={isOpenWalletPage}
        style={{
          zIndex: 100,
          background: 'rgba(0, 0, 0, 0.3)',
          marginTop: '20px',
          marginLeft: isOpenWalletPage ? '188px' : 0,
        }}
        onClick={onToggleWalletPage}
      >
        <WalletPage onClose={onToggleWalletPage} />
      </Slide>
    </>
  )
}
