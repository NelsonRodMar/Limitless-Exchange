import { Button, IModal, InfoIcon, Input, Modal, Tooltip } from '@/components'
import { collateralTokensArray, defaultChain, higher, weth } from '@/constants'
import { useBalanceService } from '@/services'
import { NumberUtil, truncateEthAddress } from '@/utils'
import {
  HStack,
  Heading,
  InputGroup,
  Stack,
  Switch,
  Text,
  useDisclosure,
  IconButton,
  Box,
} from '@chakra-ui/react'
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { Address, zeroAddress } from 'viem'
import SelectTokenField from '@/components/common/SelectTokenField'

type WithdrawModalProps = Omit<IModal, 'children'> & {
  selectedToken: Address
  setSelectedToken: Dispatch<SetStateAction<Address>>
}

export const WithdrawModal = ({
  onClose,
  isOpen,
  selectedToken,
  setSelectedToken,
  ...props
}: WithdrawModalProps) => {
  const {
    balanceOfSmartWallet,
    amount,
    setAmount,
    addressToWithdraw,
    setAddressToWithdraw,
    unwrap,
    setUnwrap,
    withdraw,
    status,
  } = useBalanceService()

  const disclosure = useDisclosure()

  const tokenName = useMemo(() => {
    return (
      collateralTokensArray.find(
        (collateralToken) => collateralToken.address[defaultChain.id] === selectedToken
      )?.symbol || higher.symbol
    )
  }, [selectedToken])

  const balanceItem = useMemo(() => {
    if (balanceOfSmartWallet) {
      return balanceOfSmartWallet.find((balance) => balance.contractAddress === selectedToken)
    }
  }, [balanceOfSmartWallet, selectedToken])

  useEffect(() => {
    setAmount('')
    setAddressToWithdraw('')
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setUnwrap(false)
      return
    }
  }, [isOpen])

  return (
    <Modal
      size={'md'}
      title={`Withdraw ${tokenName} Base`}
      isOpen={isOpen}
      onClose={onClose}
      {...props}
    >
      <Box mb='24px' overflowX='scroll'>
        <SelectTokenField
          token={selectedToken ? selectedToken : higher.address[defaultChain.id]}
          setToken={setSelectedToken}
          defaultValue={selectedToken ? selectedToken : higher.address[defaultChain.id]}
        />
      </Box>
      <Stack w={'full'} spacing={4}>
        <Stack w={'full'}>
          <Heading fontSize={'15px'}>Address on {defaultChain.name} network</Heading>

          <Input
            fontSize={{ sm: '12px', md: '14px' }}
            pr={0}
            placeholder={truncateEthAddress(zeroAddress)}
            value={addressToWithdraw}
            onChange={(e) => setAddressToWithdraw(e.target.value)}
          />
        </Stack>

        <Stack w={'full'}>
          <HStack w={'full'} justifyContent={'space-between'}>
            <Heading fontSize={'15px'}>Amount</Heading>
            <HStack>
              <Button
                h={'24px'}
                px={2}
                fontSize={'12px'}
                onClick={() => setAmount(balanceItem ? balanceItem.formatted : '')}
              >
                {`Balance: ${NumberUtil.toFixed(
                  balanceItem ? balanceItem.formatted : '',
                  6
                )} ${tokenName}`}
              </Button>
            </HStack>
          </HStack>

          <InputGroup>
            {/* <InputLeftElement h={'full'} pointerEvents='none'>
              <FaDollarSign fill={colors.fontLight} />
            </InputLeftElement> */}
            <Input
              type={'number'}
              fontWeight={'bold'}
              placeholder={'0'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </InputGroup>
        </Stack>
        {selectedToken === weth.address[defaultChain.id] && (
          <HStack fontWeight={'bold'}>
            <Text color={unwrap ? 'fontLight' : 'font'}>WETH</Text>
            <Switch
              isChecked={unwrap}
              onChange={(e) => setUnwrap(e.target.checked)}
              isDisabled={status == 'Loading'}
            />
            <Text color={unwrap ? 'font' : 'fontLight'}>ETH</Text>
            <Tooltip
              isOpen={disclosure.isOpen}
              label={`Select WETH if you want to transfer wrapped ether (ERC20) tokens to your external wallet.\nSelect ETH if you want to unwrap it and transfer ether to your external wallet or exchange.`}
            >
              <IconButton
                variant='unstyled'
                minW='none'
                minHeight='auto'
                height='auto'
                aria-label='info'
                onMouseEnter={disclosure.onOpen}
                onMouseLeave={disclosure.onClose}
                onClick={disclosure.onToggle}
                icon={<InfoIcon fontSize={'9px'} p={'3px'} />}
              />
            </Tooltip>
          </HStack>
        )}

        <Button
          colorScheme={'brand'}
          w={'full'}
          isLoading={status == 'Loading'}
          isDisabled={status != 'ReadyToFund'}
          onClick={async () => {
            await withdraw()
            onClose()
          }}
        >
          Withdraw
        </Button>
      </Stack>
    </Modal>
  )
}
