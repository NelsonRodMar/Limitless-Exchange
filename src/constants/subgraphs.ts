import { base, baseSepolia } from 'viem/chains'

export const newSubgraphURI = {
  [base.id]:
    process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? 'https://indexer.bigdevenergy.link/da7c4d3/v1/graphql',
  [baseSepolia.id]:
    process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? 'https://indexer.bigdevenergy.link/e46ec4a/v1/graphql',
}
