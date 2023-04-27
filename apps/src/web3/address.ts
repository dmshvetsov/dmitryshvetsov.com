// import { JsonRpcProvider } from 'ethers'
import Web3 from 'web3'
import { Log } from 'web3-core'
import { getRpcUrl } from '../config'
type Web3Address = string

const APPROVAL_TOPIC =
  '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'

class AppInternalError extends Error { }

export function toDataFormat(input: string): string {
  let preparedInput = input.slice(0)
  if (input.startsWith('0x')) {
    preparedInput = input.slice(2)
  }

  const pad = new Array(64 - preparedInput.length).fill(0).join('')
  const res = '0x' + pad + preparedInput
  if (res.length !== 66) {
    throw new AppInternalError(
      `resulted data input argument length should be 64 chars, got ${res.length}, resulted data \`${res}\``
    )
  }

  return res
}

export function toAddressFormat(input: string): string {
  let address = ''
  if (input.slice(0, 2) === '0x') {
    address += input.slice(2)
  }
  while (address.slice(0, 2) === '00') {
    address = address.slice(2)
  }
  return Web3.utils.toChecksumAddress('0x' + address)
}

/**
 * Get all transacton of an address
 */
export async function getLogs(address: Web3Address) {
  const provider = new Web3(getRpcUrl())
  // const blocksToFetch = 250
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
    console.log('cursor:', cursorBlock, 'step:', step, 'total tx:', totalNumTx, 'currentBlock:', currentBlock)
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
    topics: [APPROVAL_TOPIC, toDataFormat(address)],
    toBlock: 'latest',
    fromBlock: foundLowerBlock,
  })
}

type GetApprovedSenderFromLogsOptions = {
  format?: 'hex' | 'utf8'
}

export function getApprovedSpenderFromLog(log: Log, opts: GetApprovedSenderFromLogsOptions): string {
  const formatAs = opts.format ?? 'hex';
  if (log.topics[0] !== APPROVAL_TOPIC) {
    throw new Error('not ERC20 approval log')
  }
  if (typeof log.topics[2] === 'undefined') {
    throw new Error('unexpected empty 3rd topic in ERC20 approval log')
  }

  if (formatAs === 'utf8') {
    return toAddressFormat(log.topics[2])
  }

  return log.topics[2]
}

// approval fn emit Approval(owner, spender, amount);
