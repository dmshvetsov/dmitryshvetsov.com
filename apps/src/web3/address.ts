// import { JsonRpcProvider } from 'ethers'
import Web3 from 'web3'
import { Log } from 'web3-core'
import { getRpcUrl } from '../config'
import { Web3Address } from './types'
// import { AppInternalError } from '../errors'

export const ERC20_APPROVAL_TOPIC =
  '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'

export function toDataFormat(input: string): string {
  return new Web3().eth.abi.encodeParameter('address', input)
}

/**
 * Get all transacton of an address
 */
export async function getAddressLogs(address: Web3Address) {
  const provider = new Web3(getRpcUrl())
  const currentBlock = await provider.eth.getBlockNumber()
  let cursorBlock = Math.round(currentBlock / 2)
  const totalNumTx = await provider.eth.getTransactionCount(address)
  if (totalNumTx === 0) {
    return []
  }

  // find closest block to first tx
  let foundLowerBlock = 0
  let step = cursorBlock
  while (true) {
    if (cursorBlock < 0) {
      throw new Error('reached below 0 block')
    }
    if (cursorBlock > currentBlock) {
      throw new Error('reached above current block')
    }
    if (step < 2) {
      // young wallet
      foundLowerBlock = currentBlock
      break
    }
    const numTx = await provider.eth.getTransactionCount(address, cursorBlock)
    step = Math.round(step / 2)
    if (numTx === 0) {
      foundLowerBlock = cursorBlock
      cursorBlock = cursorBlock + Math.round(step)
    } else if (foundLowerBlock && numTx < totalNumTx) {
      break
    } else if (numTx === totalNumTx) {
      cursorBlock = cursorBlock - Math.round(step)
    } else if (numTx < totalNumTx) {
      cursorBlock = cursorBlock - Math.round(step)
    }
  }

  return provider.eth.getPastLogs({
    topics: [ERC20_APPROVAL_TOPIC, toDataFormat(address)],
    toBlock: 'latest',
    fromBlock: foundLowerBlock,
  })
}

type FromLogsOptions = {
  format?: 'hex' | 'utf8'
}

export function getAssetOwnerFromLog(log: Log, opts: FromLogsOptions): string {
  const formatAs = opts.format ?? 'hex'
  if (log.topics[0] !== ERC20_APPROVAL_TOPIC) {
    throw new Error('not ERC20 approval log')
  }
  if (log.topics[1] == null) {
    throw new Error('unexpected empty 3rd topic in ERC20 approval log')
  }

  if (formatAs === 'utf8') {
    return new Web3().eth.abi.decodeParameter(
      'address',
      log.topics[1]
    ) as unknown as string
  }

  return log.topics[1]
}

/**
 * @returns string of a number allowed to spend or 'unlimited' string
 */
export function getAmountApprovedSpendFromLog(log: Log): string {
  if (log.topics[0] !== ERC20_APPROVAL_TOPIC) {
    throw new Error('not ERC20 approval log')
  }
  if (
    log.data ===
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  ) {
    return 'unlimited'
  }
  return Web3.utils.hexToNumber(log.data, true).toString()
}

export function getApprovedSpenderFromLog(
  log: Log,
  opts: FromLogsOptions
): string {
  const formatAs = opts.format ?? 'hex'
  if (log.topics[0] !== ERC20_APPROVAL_TOPIC) {
    throw new Error('not ERC20 approval log')
  }
  if (log.topics[2] == null) {
    throw new Error('unexpected empty 3rd topic in ERC20 approval log')
  }

  if (formatAs === 'utf8') {
    return new Web3().eth.abi.decodeParameter(
      'address',
      log.topics[2]
    ) as unknown as string
  }

  return log.topics[2]
}

export function isValidAddress(input: unknown): boolean {
  if (typeof input !== 'string') {
    return false
  }
  return Web3.utils.isAddress(input)
}
