import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import Script from 'next/script'
import { PropsWithChildren } from 'react'
import { Providers } from '@/app/providers'
import '../../public/fonts.css'

export const metadata: Metadata = {
  title: 'Limitless',
  icons: [{ url: '/assets/images/logo.svg' }],
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang='en'>
      <head>
        <Script
          id='gtm-script'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KTR8QTJ7');`,
          }}
        />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='apple-mobile-web-app-title' content='Limitless' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='google' content='notranslate' />
        <meta name='description' content='Daily prediction markets on Base' />
        <meta
          name='fc:frame'
          content={JSON.stringify({
            version: 'next',
            imageUrl: 'https://nelson-limitless.vercel.app/farcaster-frame.png', // TODO:  Replace image => Image must be 3:2 aspect ratio and less than 10 MB. + Change URL
            button: {
              title: 'Forecast the future on Limitless',
              action: {
                type: 'launch_frame',
                name: 'Limitless',
                url: 'https://nelson-limitless.vercel.app/', // TODO Change with true URL
                splashImageUrl: 'https://limitless.exchange/assets/images/logo.svg',
                splashBackgroundColor: '#000000',
              },
            },
          })}
          data-rh='true'
        />
      </head>
      <body>
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-KTR8QTJ7'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
          {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </Providers>
      </body>
    </html>
  )
}
export default RootLayout
