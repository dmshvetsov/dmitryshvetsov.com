import { TxConfig, Web3Address } from '../types'

/**
 * Partial ERC20 ABI
 */
// TODO: check openzepplin ABI for ERC20
// or rainbow-me/rainbowkit
const ERC20_ABI = [
  {
    name: 'approve',
    stateMutability: 'nonpayable' as const,
    type: 'function' as const,
    payable: false,
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
]

export type RevokeTransactionConfig = {
  assetContractAddress: Web3Address
  spenderAddress: Web3Address
}

export function revokeTxConfig(config: RevokeTransactionConfig): TxConfig {
  return {
    address: config.assetContractAddress,
    abi: ERC20_ABI,
    functionName: 'approve',
    // args: [spender, value]
    args: [config.spenderAddress, 0],
  }
}
