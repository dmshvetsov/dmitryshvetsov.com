import { useCallback, useState } from 'react'
import { getApprovedSpenderFromLog, getLogs } from './web3/address'
import { ETHEREUM_HACKED_CONTRACTS, getNameAlias } from './web3/addresses'

function App() {
  const [logs, setLogs] = useState<any>(null)
  const [errors, setErrors] = useState<Error[]>([])
  // TODO add router and move wallet check app to /apps/is-my-wallet-safe URL
  const addressToCheck = '0xa2560A4D1B44bc7Af0b43E26dbfe44627950920d'
  const handleAddressCheck = useCallback(async () => {
    console.log('click')
    const logs = await getLogs(addressToCheck)
    const tmp = logs.filter((log) =>
      ETHEREUM_HACKED_CONTRACTS.includes(
        getApprovedSpenderFromLog(log, { format: 'utf8' })
      )
    )
    console.log(tmp)
    if (tmp.length === 0) {
      console.log('wallet is safe')
    }

    tmp.forEach((log) => {
      const displayAddress = getNameAlias('ethereum', log.address)
      const approvedSpending = parseInt(log.data, 10)
      const spender = getApprovedSpenderFromLog(log, { format: 'utf8' })
      console.log(
        approvedSpending,
        displayAddress,
        ' at risk in hacked contract ',
        spender
      )
    })
  }, [addressToCheck])

  const handleGetLogs = useCallback(async () => {
    try {
      const res = await getLogs(addressToCheck)
      setLogs(res)
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        setErrors([...errors, err])
      }
      setLogs(null)
    }
  }, [setLogs])

  return (
    <>
      {errors.length > 0 &&
        errors.map((err, idx) => (
          <pre key={idx} className="d12v-error">
            {err.message}
          </pre>
        ))}
      <p>address: {addressToCheck}</p>
      <button onClick={handleAddressCheck}>check address</button>
      {logs === null ? (
        <button onClick={handleGetLogs}>show on-chain logs</button>
      ) : (
        <pre className="d12v-logs">{JSON.stringify(logs, null, 2)}</pre>
      )}
      <p className="read-the-docs">
        here will be a utility applications for crypto, web3, and interactine
        with blockchains
      </p>
    </>
  )
}

export default App
