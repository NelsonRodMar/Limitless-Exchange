import {
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  Textarea,
  FormControl,
  FormHelperText,
} from '@chakra-ui/react'
import DOMPurify from 'dompurify'
import { useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useAccount, useTradingService } from '@/services'
import { useCommentService } from '@/services/CommentService'
import { captionRegular, paragraphRegular } from '@/styles/fonts/fonts.styles'
import Avatar from '../avatar'
import Loader from '../loader'

export default function CommentTextarea() {
  const { profileData, account } = useAccount()
  const [comment, setComment] = useState<string>('')
  const { market } = useTradingService()
  const { createComment, isPostCommentLoading } = useCommentService()

  //by default, DOMPurify treat any < symbol as a part of html tag
  const sanitizeInput = (input: string) => {
    const sanitized = DOMPurify.sanitize(input, {
      FORBID_TAGS: [
        'script',
        'style',
        'iframe',
        'object',
        'embed',
        'applet',
        'form',
        'link',
        'meta',
        'base',
        'svg',
        'math',
      ],
      FORBID_ATTR: ['on*', 'src', 'href', 'style', 'data', 'action', 'formaction', 'xlink:href'],
    })
    return sanitized.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFocus = () => {
    textareaRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }

  const submit = async () => {
    await createComment({ content: comment, marketAddress: market?.address as string }).then(() => {
      setComment('')
    })
  }

  return (
    <FormControl>
      <VStack w='full' mt='16px'>
        <Flex
          border={!isMobile ? '1px solid var(--chakra-colors-grey-300)' : 'unset'}
          borderRadius='2px'
          w='full'
          p={!isMobile ? '8px' : ''}
          flexDirection={isMobile ? 'row-reverse' : 'column'}
          gap={isMobile ? '8px' : 'unset'}
          alignItems={isMobile ? 'center' : 'unset'}
        >
          <Flex justifyContent={isMobile ? 'flex-end' : 'space-between'}>
            {!isMobile ? (
              <HStack gap='4px'>
                <Avatar account={account as string} avatarUrl={profileData?.pfpUrl} />
                <Text {...captionRegular}>{profileData?.displayName ?? profileData?.username}</Text>
              </HStack>
            ) : null}
            <Button
              variant='grey'
              minW='58px'
              onClick={submit}
              disabled={isPostCommentLoading || comment.length === 0}
            >
              {isPostCommentLoading ? <Loader /> : isMobile ? 'Post' : 'Add'}
            </Button>
          </Flex>
          <Textarea
            value={comment}
            placeholder='Share an opinion or stfo...'
            maxLength={140}
            contentEditable={true}
            ref={textareaRef}
            onFocus={handleFocus}
            resize='none'
            whiteSpace='pre-wrap'
            wordBreak='break-word'
            overflow='auto'
            wrap='soft'
            onChange={(e) => setComment(sanitizeInput(e.target.value))}
            rows={isMobile ? 1 : 2}
            w='full'
            p={isMobile ? '5px 12px' : '0 0 0 20px'}
            variant='unstyled'
            focusBorderColor={isMobile ? 'var(--chakra-colors-grey-300)' : 'transparent'}
            border={isMobile ? '1px solid var(--chakra-colors-grey-300)' : 'unset'}
            borderRadius='2px'
            {...paragraphRegular}
            _hover={{ borderColor: isMobile ? 'var(--chakra-colors-grey-300)' : 'transparent' }}
            _focusVisible={{ outline: 'none' }}
            _placeholder={{ ...paragraphRegular, color: 'grey.500' }}
          />
          {!isMobile ? (
            <FormHelperText textAlign='end' style={{ fontSize: '10px', color: 'spacegray' }}>
              {comment.length}/140
            </FormHelperText>
          ) : null}
        </Flex>
      </VStack>
    </FormControl>
  )
}
