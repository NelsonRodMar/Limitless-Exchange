import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys)

const blueModal = definePartsStyle({
  dialogContainer: {
    bg: 'blue.500',
    p: '0',
    overflowX: 'hidden',
    overflowY: 'scroll',
    webkitOverflowScrolling: 'touch',
  },
  dialog: {
    bg: 'blue.500',
    boxShadow: 'none',
  },
  body: {
    p: 0,
    mt: '16px',
  },
  header: {
    color: 'white',
    p: '0px 16px',
    mt: '32px',
  },
  closeButton: {
    color: 'white',
    top: 1,
    right: 1,
  },
})

const commonModal = definePartsStyle({
  dialog: {
    borderRadius: '2px',
    bg: 'grey.100',
    p: '16px',
  },
})

const baseStyle = definePartsStyle({
  overlay: {
    bg: 'rgba(0, 0, 0, 0.5)', //change the background
  },
})

export const modalTheme = defineMultiStyleConfig({
  variants: { blueModal, commonModal },
  baseStyle,
})
