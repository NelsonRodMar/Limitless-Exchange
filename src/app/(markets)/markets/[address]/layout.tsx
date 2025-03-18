import axios from 'axios'
import { getFrameMetadata } from 'frog'
import { Metadata } from 'next'
import { Market } from '@/types'
import { convertHtmlToText } from '@/utils/html-utils'

type Props = {
  params: { address: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await axios.get<Market>(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/markets/${params.address}`
    )
    const frameMetadata = await getFrameMetadata(
      `${process.env.NEXT_PUBLIC_FRAME_URL}/markets/frames/initial/${params.address}`
    )
    const market = response.data

    console.log(params.address)

    return {
      title: market?.proxyTitle ?? market?.title ?? 'Noname market',
      openGraph: {
        title: market?.proxyTitle ?? market?.title ?? 'Noname market',
        description: convertHtmlToText(market?.description),
        images: [
          {
            url: `/api/og/market/${params.address}`,
            width: 1200,
            height: 630,
          },
        ],
      },
      //@ts-ignore
      other: frameMetadata,
    }
  } catch (error) {
    console.error(`Error fetching market`, error)

    return {}
  }
}

const Layout = ({ children }: React.PropsWithChildren) => {
  return <>{children}</>
}

export default Layout
