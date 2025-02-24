import { Address } from 'viem'
import { MarketStatus, MarketTradeType, MarketType } from '@/types'

export const mockGroup = {
  id: 985,
  address: null,
  conditionId: '0xa5c2fe00de27364d66a2f354c38f57dcc41910efc3e2bb295a6593e7f5770b51',
  description: 'asd',
  collateralToken: {
    address: '0xD7788FfC73C9AE39CE24dfc1098b375792dD42Ac' as Address,
    decimals: 6,
    symbol: 'USDC',
  },
  title: 'Clob market group',
  proxyTitle: null,
  ogImageURI: 'https://storage.googleapis.com/limitless-exchange-assets/markets/985/og.jpg',
  expirationDate: 'Feb 16, 2025',
  expirationTimestamp: 1739732400000,
  createdAt: '2025-02-10T12:32:52.486Z',
  category: 'Crypto',
  winningOutcomeIndex: null,
  status: MarketStatus.FUNDED,
  expired: false,
  creator: {
    name: 'Limitless',
    imageURI: null,
    link: null,
  },
  tags: ['Daily'],
  openInterest: '0',
  openInterestFormatted: '0.000000',
  volume: '57900000',
  volumeFormatted: '57.900000',
  liquidity: '0',
  liquidityFormatted: '0.000000',
  tokens: {
    yes: '84661882095626577585766369619647938602148218553540964234856186294125162715823',
    no: '27284820174735778255935768042771666097423170975154386462041324080343833433529',
  },
  prices: [0.56, 0.43999999999999995],
  isRewardable: false,
  slug: 'clob-market-tarapata-mon-1739190772481',
  tradeType: 'clob' as MarketTradeType,
  marketType: 'group' as MarketType,
  priorityIndex: 0,
  metadata: null,
  markets: [
    {
      id: 1063,
      address: null,
      conditionId: '0xd848f788e36a45a09982b539dc2772948e09d0e39b8201cacc53d4edd444e6d3',
      description: '<p>Group 1</p>',
      collateralToken: {
        address: '0xD7788FfC73C9AE39CE24dfc1098b375792dD42Ac',
        decimals: 6,
        symbol: 'USDC',
      },
      title: 'Group 1',
      proxyTitle: null,
      ogImageURI: 'https://storage.googleapis.com/limitless-exchange-assets/markets/1063/og.jpg',
      expirationDate: 'Feb 23, 2025',
      expirationTimestamp: 1740336028000,
      createdAt: '2025-02-19T12:40:49.258Z',
      category: 'Crypto',
      winningOutcomeIndex: null,
      status: 'FUNDED',
      expired: false,
      creator: {
        name: 'Limitless',
        imageURI: null,
        link: null,
      },
      tags: ['Daily'],
      openInterestFormatted: '0.000000',
      volume: 0,
      volumeFormatted: '0.000000',
      liquidityFormatted: '0.000000',
      tokens: {
        yes: '79155579139149271049869984867088407962720702985397042726614448208225623966287',
        no: '77111670593333298752751399738041031361438301262054985635724451190414097752227',
      },
      prices: [0.5, 0.5],
      slug: 'group-1-1739968932013',
      tradeType: 'clob',
      marketType: 'single',
      priorityIndex: 0,
      metadata: {
        isBannered: false,
      },
    },
    {
      id: 1064,
      address: null,
      conditionId: '0xd470351e1ef11f9ceaf9e0524ef13a275ba55e8119064e99ffa96ad9b25c0d87',
      description: '<p>Group 2</p>',
      collateralToken: {
        address: '0xD7788FfC73C9AE39CE24dfc1098b375792dD42Ac',
        decimals: 6,
        symbol: 'USDC',
      },
      title: 'Group 2',
      proxyTitle: null,
      ogImageURI: 'https://storage.googleapis.com/limitless-exchange-assets/markets/1064/og.jpg',
      expirationDate: 'Feb 23, 2025',
      expirationTimestamp: 1740332428000,
      createdAt: '2025-02-19T12:41:06.656Z',
      category: 'Crypto',
      winningOutcomeIndex: null,
      status: 'FUNDED',
      expired: false,
      creator: {
        name: 'Limitless',
        imageURI: null,
        link: null,
      },
      tags: ['Daily'],
      openInterestFormatted: '0.000000',
      volume: 0,
      volumeFormatted: '0.000000',
      liquidityFormatted: '0.000000',
      tokens: {
        yes: '85457698221898208751342994237165784844882899025302092538804967527745604257980',
        no: '73830177787219595595743905653446804136980491786238760042702207065873843495034',
      },
      prices: [0.5, 0.5],
      slug: 'group-2-1739968944618',
      tradeType: 'clob',
      marketType: 'single',
      priorityIndex: 0,
      metadata: {
        isBannered: false,
      },
    },
    {
      id: 1065,
      address: null,
      conditionId: '0x3a7b77b3e882a3a7c2ce53f16db145dcc282af99385e9baf8d990b5e5afde97a',
      description: '<p>Group 3</p>',
      collateralToken: {
        address: '0xD7788FfC73C9AE39CE24dfc1098b375792dD42Ac',
        decimals: 6,
        symbol: 'USDC',
      },
      title: 'Group 3',
      proxyTitle: null,
      ogImageURI: 'https://storage.googleapis.com/limitless-exchange-assets/markets/1065/og.jpg',
      expirationDate: 'Feb 23, 2025',
      expirationTimestamp: 1740332428000,
      createdAt: '2025-02-19T12:41:16.837Z',
      category: 'Crypto',
      winningOutcomeIndex: null,
      status: 'FUNDED',
      expired: false,
      creator: {
        name: 'Limitless',
        imageURI: null,
        link: null,
      },
      tags: ['Daily'],
      openInterestFormatted: '0.000000',
      volume: 0,
      volumeFormatted: '0.000000',
      liquidityFormatted: '0.000000',
      tokens: {
        yes: '22389259646376115132075997213972923413013329259344317426640154634185556666395',
        no: '104416198872706359159493213032473723050763756796869757548654735352926311497135',
      },
      prices: [0.5, 0.5],
      slug: 'group-3-1739968959248',
      tradeType: 'clob',
      marketType: 'single',
      priorityIndex: 0,
      metadata: {
        isBannered: false,
      },
    },
    {
      id: 1067,
      address: null,
      conditionId: '0xd6b63fb03cdca2d7f32a1260ca80204622101335bcb52afe98cbf4b2de88b25e',
      description: '<p>Group 4</p>',
      collateralToken: {
        address: '0xD7788FfC73C9AE39CE24dfc1098b375792dD42Ac',
        decimals: 6,
        symbol: 'USDC',
      },
      title: 'Group 4',
      proxyTitle: null,
      ogImageURI: 'https://storage.googleapis.com/limitless-exchange-assets/markets/1067/og.jpg',
      expirationDate: 'Feb 23, 2025',
      expirationTimestamp: 1740332428000,
      createdAt: '2025-02-19T12:41:36.676Z',
      category: 'Crypto',
      winningOutcomeIndex: null,
      status: 'FUNDED',
      expired: false,
      creator: {
        name: 'Limitless',
        imageURI: null,
        link: null,
      },
      tags: ['Daily'],
      openInterestFormatted: '0.000000',
      volume: 0,
      volumeFormatted: '0.000000',
      liquidityFormatted: '0.000000',
      tokens: {
        yes: '56076246258722445910108427226652208020834469433871229887082578789684861502745',
        no: '2386337489554493655653663140486487558189090406239686246348555208454985488342',
      },
      prices: [0.5, 0.5],
      slug: 'group-4-1739968972378',
      tradeType: 'clob',
      marketType: 'single',
      priorityIndex: 0,
      metadata: {
        isBannered: false,
      },
    },
    {
      id: 1068,
      address: null,
      conditionId: '0x574c8cdf49036d4400c2042dc589695f5489bb181c4c275c42b70479a686d87f',
      description: '<p>Group 5</p>',
      collateralToken: {
        address: '0xD7788FfC73C9AE39CE24dfc1098b375792dD42Ac',
        decimals: 6,
        symbol: 'USDC',
      },
      title: 'Group 5',
      proxyTitle: null,
      ogImageURI: 'https://storage.googleapis.com/limitless-exchange-assets/markets/1068/og.jpg',
      expirationDate: 'Feb 23, 2025',
      expirationTimestamp: 1740332428000,
      createdAt: '2025-02-19T12:41:48.200Z',
      category: 'Crypto',
      winningOutcomeIndex: null,
      status: 'FUNDED',
      expired: false,
      creator: {
        name: 'Limitless',
        imageURI: null,
        link: null,
      },
      tags: ['Daily'],
      openInterestFormatted: '0.000000',
      volume: 0,
      volumeFormatted: '0.000000',
      liquidityFormatted: '0.000000',
      tokens: {
        yes: '44016172002212996680191198562053599906063071684405697525481938615159254095023',
        no: '107174678570204207636358441824734045877805923697412480314145180965163851525130',
      },
      prices: [0.5, 0.5],
      slug: 'group-5-1739968985478',
      tradeType: 'clob',
      marketType: 'single',
      priorityIndex: 0,
      metadata: {
        isBannered: false,
      },
    },
  ],
}
