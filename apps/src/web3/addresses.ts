export type Network = 'ethereum'

// sushiswap hacked contracts RouterProcessor2
// source https://www.theblock.co/post/225473/sushiswap-hack and https://gist.github.com/0xngmi/40c530a6dc219e62939ed911b5d5ac70
// arbitrum nova 0x1c5771e96C9d5524fb6e606f5B356d08C40Eb194
// arbitrum 0xA7caC4207579A179c1069435d032ee0F9F150e5c
// avax 0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F
// boba 0x2f686751b19a9d91cc3d57d90150bc767f050066
// bsc 0xD75F5369724b513b497101fb15211160c1d96550
// ethereum 0x044b75f554b886A065b9567891e45c79542d7357
// fantom 0x3e603C14aF37EBdaD31709C4f848Fc6aD5BEc715
// fuse 0x2f686751b19a9d91cc3d57d90150Bc767f050066
// gnosis 0x145d82bCa93cCa2AE057D1c6f26245d1b9522E6F
// moonbeam 0x1838b053E0223F05FB768fa79aA07Df3f0f27480
// moonriver 0x3d2f8ae0344d38525d2ae96ab750b83480c0844f
// optimism 0xF0cBce1942A68BEB3d1b73F0dd86C8DCc363eF49
// polygon 0x5097CBB61D3C75907656DC4e3bbA892Ff136649a
// polygon zkevm 0x93395129bd3fcf49d95730D3C2737c17990fF328

export const ETHEREUM_HACKED_CONTRACTS = Object.freeze([
  // '0x044b75f554b886a065b9567891e45c79542d7357', // arbitrum demo
  // '0x74c764D41B77DBbb4fe771daB1939B00b146894A', // arbitrum demo
  '0x044b75f554b886A065b9567891e45c79542d7357',
  '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // FIXME remove goerli sushiswap, not hacked, for demo
  '0x1111111254eeb25477b68fb85ed929f73a960582', // FIXME remove arbiturm 1inch, not hacked, for demo
  '0x1111111254EEB25477B68fb85Ed929f73A960582'
])

type ContractMetadata = {
  name: string
}

const ETHEREUM_CONTRACTS_METADATA: Record<string, ContractMetadata> = Object.freeze({
  '0x044b75f554b886A065b9567891e45c79542d7357': {
    name: 'SushiSwap: Route Processor 2'
  }
})

export function getContractAlias(_network: Network, address: string): string {
  const found = ETHEREUM_CONTRACTS_METADATA[address]
  return found?.name ?? address
}

// import { Web3Address } from './types'

// type Contract = {
//   name: string
//   address: Web3Address
// }

// export function getHackedContractsList(_network: Network): Contract[] {
//   axios client.get('https://raw.githubusercontent.com/dmshvetsov/hacked-smart-contracts/main/evm-1.json')
// }
