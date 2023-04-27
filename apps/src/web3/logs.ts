import Web3 from "web3"
// import { AppInternalError } from "../errors"
import { getRpcUrl } from "../config"

// FIXME: remove duplication
export function toDataFormat(input: string): string {
  return new Web3().eth.abi.encodeParameter('address', input)
  // let preparedInput = input.slice(0)
  // if (input.startsWith('0x')) {
  //   preparedInput = input.slice(2)
  // }

  // const pad = new Array(64 - preparedInput.length).fill(0).join('')
  // const res = '0x' + pad + preparedInput
  // if (res.length !== 66) {
  //   throw new AppInternalError(
  //     `resulted data input argument length should be 64 chars, got ${res.length}, resulted data \`${res}\``
  //   )
  // }

  // return res
}

type TopicFilter =
  | [string | null]
  | [string | null, string | null]
  | [string | null, string | null, string | null]

type GetLogFilter = {
  topics: TopicFilter,
  fromBlock?: number,
}

const ETHEREUM_AVERAGE_BLOCKS_PER_DAY = 7_000

export async function getLogs(filter: GetLogFilter) {
  const provider = new Web3(getRpcUrl())

  let fromBlock = filter.fromBlock
  if (typeof fromBlock === 'undefined') {
    const defaultBackBlockLookup = ETHEREUM_AVERAGE_BLOCKS_PER_DAY * 30
    fromBlock = Math.max(0, (await provider.eth.getBlockNumber()) - defaultBackBlockLookup)
  }

  const topics = filter.topics.map((address) => {
    if (address !== null && address.length < 66) {
      return toDataFormat(address)
    }
    return address
  }) as TopicFilter

  return provider.eth.getPastLogs({
    topics,
    toBlock: 'latest',
    fromBlock,
  })
}
