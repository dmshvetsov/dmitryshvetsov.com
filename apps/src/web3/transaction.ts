export function formatTx(transactionHash: string, format: 'short'): string {
  return `${transactionHash.slice(0, 8)}...`
}

