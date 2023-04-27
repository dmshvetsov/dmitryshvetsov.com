import { ChangeEvent, useCallback, useState } from 'react'
import {
  ERC20_APPROVAL_TOPIC,
  getApprovedSpenderFromLog,
  getAddressLogs,
  isValidAddress,
  getAssetOwnerFromLog,
  getAmountApprovedSpendFromLog,
} from './web3/address'
import { getLogs } from './web3/logs'
import { ETHEREUM_HACKED_CONTRACTS, getNameAlias } from './web3/addresses'
import { Log } from 'web3-core'
import { Web3Address } from './web3/types'

function isHackedContractLog(log: Log): boolean {
  return (
    log.removed !== true &&
    ETHEREUM_HACKED_CONTRACTS.includes(
      getApprovedSpenderFromLog(log, { format: 'utf8' })
    )
  )
}

// FIXME: name wanted
type What = {
  transactionHash: string
  hackedContract: string
  hackedContractAddress: string
  asset: string
  assetAddress: string
  blockNumber: number
  owner: string
  // number in string representation
  amountApprovedSpend: string
}

// FIXME: name wanted
function toWhat(input: Log): What {
  const hackedContractAddress = getApprovedSpenderFromLog(input, {
    format: 'utf8',
  })
  return {
    transactionHash: input.transactionHash,
    hackedContract: getNameAlias('ethereum', hackedContractAddress),
    hackedContractAddress,
    asset: getNameAlias('ethereum', input.address),
    assetAddress: input.address,
    amountApprovedSpend: getAmountApprovedSpendFromLog(input),
    owner: getAssetOwnerFromLog(input, { format: 'utf8' }),
    blockNumber: input.blockNumber,
  }
}

function collectCurrentAllowance(acc: Map<string, What>, item: What) {
  const key = `${item.hackedContract}:${item.asset}`
  const previous = acc.get(key)
  if (previous && previous.blockNumber < item.blockNumber) {
    acc.set(key, item)
  } else {
    acc.set(key, item)
  }
  return acc
}

function App() {
  const [addressToCheck, setAddressToCheck] = useState('')
  const [addressesAtRisk, setAddressesAtRisk] = useState<string[]>([])
  // FIXME: name wanted
  const [whatList, setWhatList] = useState<What[]>([])
  const [logs, setLogs] = useState<any>(null)
  const [errors, setErrors] = useState<Error[]>([])
  // TODO add router and move wallet check app to /apps/is-my-wallet-safe URL
  const handleAddressCheck = useCallback(
    async (address: Web3Address) => {
      if (!isValidAddress(address)) {
        return
      }

      const logs = await getAddressLogs(address)
      const allowanceMap = logs
        .filter(isHackedContractLog)
        .map(toWhat)
        .reduce(collectCurrentAllowance, new Map())
      console.log(Array.from(allowanceMap.values()))
      setWhatList(Array.from(allowanceMap.values()))
    },
    [addressToCheck]
  )

  const handleGetLogs = useCallback(async () => {
    if (!isValidAddress(addressToCheck)) {
      return
    }

    try {
      const res = await getAddressLogs(addressToCheck)
      setLogs(res)
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        setErrors([...errors, err])
      }
      setLogs(null)
    }
  }, [setLogs])

  const handleAddressInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setAddressToCheck(event.target?.value ?? ''),
    []
  )

  const handleGetApprovalsForHackedContracts = useCallback(async () => {
    const logs = await getLogs({
      topics: [ERC20_APPROVAL_TOPIC, null, ETHEREUM_HACKED_CONTRACTS[0]],
    })
    console.log(logs.map(toWhat))
    setAddressesAtRisk(
      Array.from(new Set(logs.map(toWhat).map((item) => item.owner)))
    )
  }, [])

  return (
    <section>
      <p>
        example of affected address 0x78b90b4F409764b7f3b2940fb30e32a024c4a07D{' '}
        <button
          onClick={() =>
            handleAddressCheck('0x78b90b4F409764b7f3b2940fb30e32a024c4a07D')
          }
        >
          check
        </button>
      </p>
      {errors.length > 0 &&
        errors.map((err, idx) => (
          <pre key={idx} className="d12v-error">
            {err.message}
          </pre>
        ))}
      <div>
        <input
          type="text"
          value={addressToCheck}
          onChange={handleAddressInputChange}
        />
      </div>
      <button onClick={() => handleAddressCheck(addressToCheck)}>
        check address
      </button>
      {logs === null ? (
        <button onClick={handleGetLogs}>show on-chain logs</button>
      ) : (
        <pre className="d12v-logs">{JSON.stringify(logs, null, 2)}</pre>
      )}
      <button onClick={handleGetApprovalsForHackedContracts}>
        list of wallets at risk
      </button>
      <ul>
        {whatList.map((item) => (
          <li key={item.transactionHash}>
            {item.amountApprovedSpend}{' '}
            <a href={`https://etherscan.io/address/${item.assetAddress}`}>
              {item.asset}
            </a>{' '}
            token at risk in conract{' '}
            <a
              href={`https://etherscan.io/address/${item.hackedContractAddress}`}
            >
              {item.hackedContract}
            </a>{' '}
            (
            <a href={`https://etherscan.io/tx/${item.transactionHash}`}>
              approval transaction
            </a>
            )
          </li>
        ))}
      </ul>
      <ul>
        {addressesAtRisk.map((address) => (
          <li key={address}>
            <button onClick={() => handleAddressCheck(address)}>
              check {address}
            </button>
          </li>
        ))}
      </ul>
      <p className="read-the-docs">
        here will be a utility applications for crypto, web3, and interactine
        with blockchains
      </p>
    </section>
  )
}

export default App
