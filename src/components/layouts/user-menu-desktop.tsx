import {
  Box,
  Button,
  Divider,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { setTimeout } from '@wry/context'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Avatar from '@/components/common/avatar'
import WrapModal from '@/components/common/modals/wrap-modal'
import Skeleton from '@/components/common/skeleton'
import SocialsFooter from '@/components/common/socials-footer'
import ThemeSwitcher from '@/components/layouts/theme-switcher'
import BaseWhiteIcon from '@/resources/icons/base-icon-white.svg'
import CheckedIcon from '@/resources/icons/checked-icon.svg'
import ChevronDownIcon from '@/resources/icons/chevron-down-icon.svg'
import CopyIcon from '@/resources/icons/copy-icon.svg'
import LogoutIcon from '@/resources/icons/log-out-icon.svg'
import SwapIcon from '@/resources/icons/swap-icon.svg'
import UserIcon from '@/resources/icons/user-icon.svg'
import WalletIcon from '@/resources/icons/wallet-icon.svg'
import {
  ClickEvent,
  ProfileBurgerMenuClickedMetadata,
  useAccount,
  useAmplitude,
  useBalanceQuery,
  useBalanceService,
} from '@/services'
import { h2Regular, paragraphMedium, paragraphRegular } from '@/styles/fonts/fonts.styles'
import { NumberUtil, truncateEthAddress } from '@/utils'

interface UserMenuDesktopProps {
  handleOpenWalletPage: () => void
  handleOpenProfile: () => void
}

export default function UserMenuDesktop({
  handleOpenWalletPage,
  handleOpenProfile,
}: UserMenuDesktopProps) {
  const { trackClicked } = useAmplitude()
  const { disconnectFromPlatform, profileData, profileLoading, account, web3Client } = useAccount()
  const {
    isOpen: isOpenAuthMenu,
    onToggle: onToggleAuthMenu,
    onClose: onCloseAuthMenu,
  } = useDisclosure()
  const { overallBalanceUsd } = useBalanceService()
  const { balanceOfSmartWallet } = useBalanceQuery()
  const {
    isOpen: isWrapModalOpen,
    onOpen: onOpenWrapModal,
    onClose: onCloseWrapModal,
  } = useDisclosure()

  const handleOpenWrapModal = useCallback(() => onOpenWrapModal(), [])

  const [copied, setCopied] = useState(false)

  const onClickCopy = () => {
    trackClicked(ClickEvent.CopyAddressClicked, {
      // @ts-ignore
      from: 'Header',
    })
    setCopied(true)
  }

  useEffect(() => {
    const hideCopiedMessage = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => clearTimeout(hideCopiedMessage)
  }, [copied])

  const walletTypeActionButton = useMemo(() => {
    return web3Client !== 'eoa' ? (
      <Button
        variant='transparent'
        onClick={() => {
          trackClicked<ProfileBurgerMenuClickedMetadata>(ClickEvent.ProfileBurgerMenuClicked, {
            option: 'Wallet',
          })
          onCloseAuthMenu()
          handleOpenWalletPage()
        }}
      >
        <HStack w='full'>
          <WalletIcon width={16} height={16} />
          <Text fontWeight={500} fontSize='14px'>
            {NumberUtil.formatThousands(overallBalanceUsd, 2)} USD
          </Text>
        </HStack>
      </Button>
    ) : (
      <Button
        variant='transparent'
        onClick={() => {
          trackClicked(ClickEvent.WithdrawClicked)
          handleOpenWrapModal()
        }}
      >
        <HStack w='full'>
          <SwapIcon width={16} height={16} />
          <Text fontWeight={500} fontSize='14px'>
            Wrap ETH
          </Text>
        </HStack>
      </Button>
    )
  }, [web3Client, overallBalanceUsd])

  return (
    <>
      <Menu isOpen={isOpenAuthMenu} onClose={onToggleAuthMenu} variant='transparent'>
        {profileLoading ? (
          <Box w='144px'>
            <Skeleton height={24} />
          </Box>
        ) : (
          <MenuButton
            as={Button}
            onClick={onToggleAuthMenu}
            leftIcon={
              <Box transform={`rotate(${isOpenAuthMenu ? '180deg' : 0})`} transition='0.5s'>
                <ChevronDownIcon width='16px' height='16px' />
              </Box>
            }
            bg={isOpenAuthMenu ? 'grey.100' : 'unset'}
            h='24px'
            w='full'
            _active={{
              bg: 'grey.200',
            }}
            _hover={{
              bg: 'grey.200',
            }}
            sx={{
              '& > span:first-of-type': {
                marginRight: '2px',
              },
              px: '8px',
            }}
          >
            <HStack gap='8px'>
              {!balanceOfSmartWallet ? (
                <Box w='90px'>
                  <Skeleton height={20} />
                </Box>
              ) : (
                <Text {...paragraphMedium}>
                  {NumberUtil.convertWithDenomination(overallBalanceUsd, 2)} USD
                </Text>
              )}

              <Avatar account={account as string} avatarUrl={profileData?.pfpUrl} />
            </HStack>
          </MenuButton>
        )}
        <MenuList minW='254px' px='4px'>
          <Box px='8px'>
            <HStack justifyContent='space-between'>
              <HStack gap='4px'>
                <WalletIcon width='16px' height='16px' />
                <Text {...paragraphMedium}>Estimated balance</Text>
              </HStack>
              <HStack gap='4px'>
                <BaseWhiteIcon />
                <Text {...paragraphMedium}>BASE</Text>
              </HStack>
            </HStack>
            <Text mt='12px' mb='24px' {...h2Regular}>
              ~{NumberUtil.formatThousands(overallBalanceUsd, 2)} USD
            </Text>
            <HStack justifyContent='space-between'>
              <Text {...paragraphMedium}>Address</Text>
              {/*//@ts-ignore*/}
              <CopyToClipboard text={account as string} onCopy={onClickCopy}>
                <HStack gap='4px' cursor='pointer'>
                  <Text {...paragraphRegular}>{truncateEthAddress(account)}</Text>
                  {copied ? (
                    <CheckedIcon width={16} height={16} />
                  ) : (
                    <CopyIcon width='16px' height='16px' />
                  )}
                </HStack>
              </CopyToClipboard>
            </HStack>
            <Divider my='16px' />
          </Box>
          <VStack gap='12px' alignItems='flex-start'>
            {walletTypeActionButton}
            <Button
              variant='transparent'
              onClick={() => {
                handleOpenProfile()
                onCloseAuthMenu()
              }}
              justifyContent='flex-start'
            >
              <UserIcon width={16} height={16} />
              Profile
            </Button>
            <ThemeSwitcher />
            <Button
              variant='transparent'
              onClick={() => {
                trackClicked(ClickEvent.SignOutClicked, {
                  option: 'Sign Out',
                })
                disconnectFromPlatform()
                onToggleAuthMenu()
                onCloseAuthMenu()
              }}
              justifyContent='flex-start'
            >
              <LogoutIcon width={16} height={16} />
              Log Out
            </Button>
            <SocialsFooter />
          </VStack>
        </MenuList>
      </Menu>
      {isWrapModalOpen && <WrapModal isOpen={isWrapModalOpen} onClose={onCloseWrapModal} />}
    </>
  )
}
