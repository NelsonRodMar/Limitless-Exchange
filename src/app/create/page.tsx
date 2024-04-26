'use client'

import { Input, MainLayout } from '@/components'
import {
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Textarea,
  FormControl,
  FormHelperText,
  FormLabel,
  Box,
  Button,
  ButtonGroup,
} from '@chakra-ui/react'
import { borderRadius, colors } from '@/styles'
import { CgInfo } from 'react-icons/cg'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import React, { useState } from 'react'

interface FormFieldProps {
  label: string
  children: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
  <Box mt={4}>
    <FormLabel>
      <strong>{label}</strong>
    </FormLabel>
    {children}
  </Box>
)

const CreateOwnMarketPage = () => {
  const [date, setDate] = useState(new Date())
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <MainLayout>
      <Flex justifyContent={'center'}>
        <VStack w='360px' spacing={4}>
          <Heading>Create Market</Heading>
          <FormControl>
            <FormField label='Title'>
              <Input
                placeholder='Bitcoin ATH in May 2024?'
                size='lg'
                onChange={(e) => setTitle(e.target.value)}
              />
              <FormHelperText textAlign='end' style={{ fontSize: '10px', color: 'spacegray' }}>
                {title?.length}/70 characters
              </FormHelperText>
              <FormHelperText
                h='fit-content'
                p={4}
                bg='bgLight'
                border={`1px solid ${colors.border}`}
                borderRadius={borderRadius}
                textAlign='start'
                color='#747675'
                display='flex'
              >
                <Box display='inline-flex' flexShrink={0}>
                  <CgInfo />
                </Box>
                <Box flex={1} ml={2}>
                  Imagine people only have a second to understand your market. It&apos;s important
                  to create a clear and concise title so that everyone in the community can
                  understand it, or at least become interested.
                </Box>
              </FormHelperText>
            </FormField>

            <FormField label='Description'>
              <Textarea
                placeholder='Bitcoin is the first decentralized cryptocurrency. Nodes in the peer-to-peer bitcoin network verify transactions through cryptography and record them in a public distributed ledger, called a blockchain, without central oversig.'
                resize='none'
                rows={7}
                overflow='hidden'
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormHelperText textAlign='end' style={{ fontSize: '10px', color: 'spacegray' }}>
                {description?.length}/320 characters
              </FormHelperText>
            </FormField>

            <FormField label='Deadline'>
              <SingleDatepicker
                id='input'
                triggerVariant='input'
                propsConfigs={{
                  inputProps: {
                    size: 'md',
                    width: 'full',
                    isReadOnly: true,
                  },
                  dayOfMonthBtnProps: {
                    todayBtnProps: {
                      background: 'teal.200',
                    },
                  },
                }}
                name='date-input'
                date={date}
                usePortal={true}
                onDateChange={setDate}
              />
            </FormField>

            <FormField label='Market Logo'>
              <HStack>
                <Input type='file' id='fileUpload' name='fileUpload' display='none' />
                <Button colorScheme='gray'>Choose file</Button>
                <Text>
                  <strong>No file chosen.</strong>
                </Text>
              </HStack>
            </FormField>

            <ButtonGroup spacing='6' mt={5}>
              <Button
                colorScheme='blue'
                size='lg'
                variant='outline'
                width='168px'
                height='52px'
                disabled
              >
                Cancel
              </Button>
              <Button colorScheme='blue' size='lg' width='168px' height='52px'>
                Create
              </Button>
            </ButtonGroup>
          </FormControl>
        </VStack>
      </Flex>
    </MainLayout>
  )
}

export default CreateOwnMarketPage
