#!/usr/bin/env ./node_modules/.bin/ts-node-esm -r dotenv/config

import assert from "assert"
import Web3 from "web3"

type TopicFilter =
  | [string | null]
  | [string | null, string | null]
  | [string | null, string | null, string | null]

type GetLogFilter = {
  topics: TopicFilter,
  blockAgo: number,
}

export async function getLogs(filter: GetLogFilter) {
  assert(process.env.VITE_RPC_URL, 'VITE_RPC_URL env var is required')
  const provider = new Web3(process.env.VITE_RPC_URL)

  const fromBlock = Math.max(0, (await provider.eth.getBlockNumber()) - filter.blockAgo)

  const topics = filter.topics.map((address) => {
    if (address !== null && address.length < 66) {
      return provider.eth.abi.encodeParameter('address', address)
    }
    return address
  }) as TopicFilter

  return provider.eth.getPastLogs({
    topics,
    toBlock: 'latest',
    fromBlock,
  })
}
export const ERC20_APPROVAL_TOPIC =
  '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'

async function main() {
    try {
      const logs = await getLogs({
        topics: [ERC20_APPROVAL_TOPIC, null, '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'],
        blockAgo: 1000
      })
      console.log(logs)
    } catch (err) {
      console.error(err)
    }
}

main().then(() => {
  process.exit()
}).catch(err => {
  console.error(err)
  process.exit()
})
