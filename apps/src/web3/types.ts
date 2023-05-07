// EVM ecosystem web3 address
export type Web3Address = `0x${string}`

export type TxConfig = {
  // contract address to call
  address: Web3Address,
  // array of contract interfaces objects
  abi: any, // FIXME
  // method to call in the contract
  functionName: string,
  // method arguments
  args: Array<string | number>
}
