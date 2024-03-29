import axios from 'axios'

export type TokenMetadata = {
  symbol: string
  name: string
  address: string
  decimals: number
}

export function isTokenMetadata(input: unknown): input is TokenMetadata {
  if (input == null) {
    return false
  }
  const assume = input as TokenMetadata
  return (
    'symbol' in assume &&
    'name' in assume &&
    'address' in assume &&
    'decimals' in assume
  )
}

function getClient() {
  return axios.create({
    baseURL:
      'https://raw.githubusercontent.com/ethereum-lists/tokens/master/tokens',
    headers: {
      accept: 'application/json',
    },
    timeout: 15000,
  })
}

export async function getTokenMetadata(
  chain: 'eth' | 'arb',
  tokenAddress: string
): Promise<TokenMetadata | null> {
  const res = await getClient().get(`/${chain}/${tokenAddress}.json`)
  if (isTokenMetadata(res.data)) {
    return res.data
  }
  return null
}
