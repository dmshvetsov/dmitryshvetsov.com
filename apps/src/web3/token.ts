import { TokenMetadata } from '../clients/token-client'
import { utils } from 'ethers'

export function formatAmount(
  amount: string,
  tokenMetadata: TokenMetadata,
  opts: { aprox?: 4 } = {}
): string {
  const formattedStr = utils.formatUnits(amount, tokenMetadata.decimals)
  if (typeof opts.aprox === 'number') {
    const dotIdx = formattedStr.indexOf('.')
    if (dotIdx === -1) {
      return formattedStr
    }
    return formattedStr.slice(0, dotIdx + 1 + opts.aprox)
  }
  return formattedStr
}
