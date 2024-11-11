import { Button, HStack } from '@chakra-ui/react'
import { isNumber } from '@chakra-ui/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { PropsWithChildren, ReactNode, useEffect, useMemo, useRef } from 'react'
import { Drawer } from 'vaul'
import ArrowLeftIcon from '@/resources/icons/arrow-left-icon.svg'
import ArrowRightIcon from '@/resources/icons/arrow-right-icon.svg'
import { useTradingService } from '@/services'
import { h1Regular, headline } from '@/styles/fonts/fonts.styles'
import { Market } from '@/types'

type MobileDrawerProps = {
  trigger: ReactNode
  title?: string
  variant: 'blue' | 'common' | 'black'
  onClose?: () => void
  id?: string
}

export default function MobileDrawer({
  trigger,
  title,
  children,
  variant,
  onClose,
  id,
}: PropsWithChildren<MobileDrawerProps>) {
  const searchParams = useSearchParams()
  const drawerRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const ref = useRef(false)

  const { market: selectedMarket, onOpenMarketPage, markets } = useTradingService()

  useEffect(() => {
    if (ref.current) return
    const market = searchParams.get('market')
    const slug = searchParams.get('slug')
    if ((market === id || slug === id) && drawerRef.current) {
      drawerRef.current.click()
      ref.current = true
    }
  }, [id])

  const removeMarketQuery = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('market')) {
      params.delete('market')
    }
    if (params.has('slug')) {
      params.delete('slug')
    }
    const newQuery = params.toString()
    router.replace(newQuery ? `${pathname}/?${newQuery}` : pathname)
  }

  const close = () => {
    if (onClose) {
      onClose()
      removeMarketQuery()
    }
  }

  const indexInArray = markets
    ? markets.findIndex((marketInArray) => selectedMarket?.address === marketInArray.address)
    : undefined

  const onClickPrevious =
    isNumber(indexInArray) && indexInArray > 0 && markets
      ? () => onOpenMarketPage(markets[indexInArray - 1], 'Big Banner')
      : undefined

  const onClickNext =
    isNumber(indexInArray) && markets && indexInArray < markets.length - 1
      ? () => onOpenMarketPage(markets[indexInArray + 1], 'Big Banner')
      : undefined

  const bgColor = useMemo(() => {
    if (variant === 'black') {
      return 'var(--chakra-colors-grey-50)'
    }
    return variant === 'blue' ? 'var(--chakra-colors-blue-500)' : 'var(--chakra-colors-grey-100)'
  }, [variant])

  const grabberBgColor =
    variant === 'blue' ? 'var(--chakra-colors-blue-400)' : 'var(--chakra-colors-grey-300)'

  const titleColor = variant === 'blue' ? 'white' : 'var(--chakra-colors-grey.800)'

  return (
    <Drawer.Root shouldScaleBackground onClose={close}>
      <Drawer.Trigger asChild>
        <button style={{ width: '100%' }} ref={drawerRef}>
          {trigger}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 400,
          }}
        />
        <Drawer.Content
          style={{
            background: bgColor,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100dvh - 36px)',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 500,
            outline: 'none',
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            <div
              style={{
                margin: '8px auto',
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                background: grabberBgColor,
              }}
            />
            {!!onClickPrevious || !!onClickNext ? (
              <HStack w='full' justifyContent='space-between'>
                {onClickPrevious ? (
                  <Button variant='transparentGrey' onClick={onClickPrevious}>
                    <ArrowLeftIcon width={24} height={24} />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}
                {onClickNext ? (
                  <Button variant='transparentGrey' onClick={onClickNext}>
                    Next
                    <ArrowRightIcon width={24} height={24} />
                  </Button>
                ) : (
                  <div />
                )}
              </HStack>
            ) : null}
            <div
              style={{
                margin: '0 auto',
                maxHeight: 'calc(100dvh - 68px)',
                overflowY: 'auto',
              }}
            >
              <>
                {title && (
                  <Drawer.Title
                    style={{
                      marginBottom: '32px',
                      marginTop: '28px',
                      padding: '0 16px',
                      ...(variant === 'blue' ? { ...headline } : { ...h1Regular }),
                      color: titleColor,
                    }}
                  >
                    <>{title}</>
                  </Drawer.Title>
                )}
              </>
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
