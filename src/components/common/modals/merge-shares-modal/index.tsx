import { Box, HStack, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { sleep } from '@etherspot/prime-sdk/dist/sdk/common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import React, { useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Address, formatUnits, parseUnits } from 'viem'
import ButtonWithStates from '@/components/common/button-with-states'
import { Modal } from '@/components/common/modals/modal'
import useClobMarketShares from '@/hooks/use-clob-market-shares'
import { useAccount, useTradingService } from '@/services'
import { useWeb3Service } from '@/services/Web3Service'
import { paragraphBold, paragraphMedium, paragraphRegular } from '@/styles/fonts/fonts.styles'

interface MergeSharesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MergeSharesModal({ isOpen, onClose }: MergeSharesModalProps) {
  const [displayAmount, setDisplayAmount] = useState('')
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const { market } = useTradingService()
  const { checkAllowanceForAll, client, approveAllowanceForAll, mergeShares } = useWeb3Service()
  const { account } = useAccount()
  const { data: sharesOwned } = useClobMarketShares(market?.slug, market?.tokens)
  const queryClient = useQueryClient()

  const sharesAvailableBalance = useMemo(() => {
    if (!sharesOwned) {
      return '0'
    }
    return new BigNumber(sharesOwned[0].toString()).isGreaterThanOrEqualTo(
      new BigNumber(sharesOwned[1].toString())
    )
      ? formatUnits(sharesOwned[1], market?.collateralToken.decimals || 6)
      : formatUnits(sharesOwned[0], market?.collateralToken.decimals || 6)
  }, [sharesOwned, market?.collateralToken.decimals])

  const isExceedsBalance = useMemo(() => {
    if (+displayAmount && sharesAvailableBalance) {
      return +displayAmount > +sharesAvailableBalance
    }
    return false
  }, [displayAmount, sharesAvailableBalance])

  const handleAmountChange = (value: string) => {
    setDisplayAmount(value)
  }

  const handleMergeClicked = async () => {
    await mergeSharesMutation.mutateAsync({
      amount: displayAmount,
      decimals: market?.collateralToken.decimals || 6,
      conditionId: market?.conditionId as string,
      contractAddress: market?.collateralToken.address as Address,
    })
  }

  const checkMergeAllowance = async () => {
    const isApproved = await checkAllowanceForAll(
      market?.collateralToken.address as Address,
      process.env.NEXT_PUBLIC_CTF_CONTRACT as Address
    )
    setIsApproved(isApproved)
  }

  const onResetAfterMerge = async () => {
    await sleep(2)
    await queryClient.refetchQueries({
      queryKey: ['market-shares', market?.slug, market?.tokens],
    })
    mergeSharesMutation.reset()
  }

  const mergeSharesMutation = useMutation({
    mutationFn: async ({
      amount,
      decimals,
      conditionId,
      contractAddress,
    }: {
      amount: string
      decimals: number
      contractAddress: Address
      conditionId: string
    }) => {
      try {
        const value = parseUnits(amount, decimals)
        await mergeShares(contractAddress, conditionId, value)
      } catch (e) {
        // @ts-ignore
        throw new Error(e)
      }
    },
  })

  const approveContractMutation = useMutation({
    mutationFn: async () => {
      await approveAllowanceForAll(
        market?.collateralToken.address as Address,
        process.env.NEXT_PUBLIC_CTF_CONTRACT as Address
      )
      await sleep(3)
      await checkMergeAllowance()
    },
  })

  const actionButton = useMemo(() => {
    if (client === 'etherspot') {
      return (
        <ButtonWithStates
          variant='contained'
          w={isMobile ? 'full' : '94px'}
          isDisabled={!+displayAmount || isExceedsBalance}
          onClick={handleMergeClicked}
          status={mergeSharesMutation.status}
          onReset={onResetAfterMerge}
        >
          Merge
        </ButtonWithStates>
      )
    }
    if (!isApproved) {
      return (
        <ButtonWithStates
          variant='contained'
          w={isMobile ? 'full' : '94px'}
          isDisabled={!+displayAmount || isExceedsBalance}
          onClick={() => approveContractMutation.mutateAsync()}
          status={approveContractMutation.status}
        >
          Approve
        </ButtonWithStates>
      )
    }
    return (
      <ButtonWithStates
        variant='contained'
        w={isMobile ? 'full' : '94px'}
        isDisabled={!+displayAmount || isExceedsBalance}
        onClick={handleMergeClicked}
        status={mergeSharesMutation.status}
        onReset={onResetAfterMerge}
      >
        Merge
      </ButtonWithStates>
    )
  }, [
    isApproved,
    approveContractMutation,
    client,
    displayAmount,
    isExceedsBalance,
    market?.collateralToken.decimals,
    mergeSharesMutation.status,
    onResetAfterMerge,
  ])

  useEffect(() => {
    if (market && account) {
      checkMergeAllowance()
    }
  }, [market, account])

  const modalContent = (
    <Box>
      <Text {...paragraphBold} mt='24px'>
        Combine equal amounts of &quot;Yes&quot; and &quot;No&quot; shares to reclaim USDC.
      </Text>
      <Text {...paragraphRegular} mt='8px'>
        Use this to simplify your holdings and reduce costs when closing a position.
      </Text>
      <InputGroup display='block' mt='16px'>
        <HStack justifyContent='space-between' mb='8px'>
          <Text {...paragraphMedium}>Enter Amount</Text>
          <Text {...paragraphRegular} color='grey.500'>
            Available: {sharesAvailableBalance}
          </Text>
        </HStack>
        <Input
          isInvalid={isExceedsBalance}
          variant='grey'
          errorBorderColor='red.500'
          value={displayAmount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder='0'
          type='number'
        />
        <InputRightElement
          h='16px'
          top={isMobile ? '32px' : '32px'}
          right={isMobile ? '12px' : '8px'}
          justifyContent='flex-end'
        >
          <Text {...paragraphMedium}>Contracts</Text>
        </InputRightElement>
      </InputGroup>
      <HStack
        mt={isMobile ? '32px' : '24px'}
        gap={isMobile ? '16px' : '8px'}
        flexDir={isMobile ? 'column' : 'row'}
      >
        {actionButton}
        {!+displayAmount && mergeSharesMutation.status === 'idle' && (
          <Text {...paragraphRegular} color='grey.500'>
            Enter amount
          </Text>
        )}
        {mergeSharesMutation.isPending && (
          <Text {...paragraphRegular} color='grey.500'>
            Processing transaction...
          </Text>
        )}
      </HStack>
    </Box>
  )

  return isMobile ? (
    modalContent
  ) : (
    <Modal isOpen={isOpen} onClose={onClose} title='Merge Contracts' h={'unset'} mt={'auto'}>
      {modalContent}
    </Modal>
  )
}
