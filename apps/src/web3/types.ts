// EVM ecosystem web3 address
export type Web3Address = `0x${string}`

export type TxConfig = {
  address: Web3Address,
  abi: any, // FIXME
  functionName: string,
  args: Array<string | number>
}
