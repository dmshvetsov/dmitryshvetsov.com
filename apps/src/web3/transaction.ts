export function formatTx(transactionHash: string, _format: 'short'): string {
  return `${transactionHash.slice(0, 8)}...`
}
