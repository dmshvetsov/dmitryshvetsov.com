import { useCallback, useState } from 'react'
import { useQuery } from 'react-query'
import {
  ERC20_APPROVAL_TOPIC,
  getApprovedSpenderFromLog,
  getAddressLogs,
  isValidAddress,
  getAssetOwnerFromLog,
  getAmountApprovedSpendFromLog,
  formatAddress,
} from './web3/address'
import { getLogs } from './web3/logs'
import { ETHEREUM_HACKED_CONTRACTS, getNameAlias } from './web3/addresses'
import { Log } from 'web3-core'
import { Web3Address } from './web3/types'
import { Card, Col, Form, Input, Layout, Row, Table, Typography } from 'antd'
import { formatTx } from './web3/transaction'
import { isEnv } from './config'

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

// does not takin into account the number of ERC20 token decimals
function simpleTopAmountFirstSort(item: What) {
  return (
    (item.amountApprovedSpend.length - item.amountApprovedSpend.length) * -1
  )
}

function useAddressSpendApprovalQuery(address: string) {
  return useQuery(
    ['provider', 'getLogs', address],
    async () => {
      const logs = await getAddressLogs(address)
      const allowanceMap = logs
        .filter(isHackedContractLog)
        .map(toWhat)
        .reduce(collectCurrentAllowance, new Map())
      return Array.from(allowanceMap.values()).sort(simpleTopAmountFirstSort)
    },
    {
      enabled: isValidAddress(address),
    }
  )
}

function App() {
  // FIXME: name wanted
  const [whatList, setWhatList] = useState<What[]>([])
  const [addressToCheck, setAddressToCheck] = useState('')
  // const [logs, setLogs] = useState<any>(null)
  const [errors, setErrors] = useState<Error[]>([])
  // TODO add router and move wallet check app to /apps/is-my-wallet-safe URL
  const handleAddressCheck = useCallback(async (address: Web3Address) => {
    if (!isValidAddress(address)) {
      console.debug('invalid address in search input:', address)
      return
    }

    try {
      const logs = await getAddressLogs(address)
      const allowanceMap = logs
        .filter(isHackedContractLog)
        .map(toWhat)
        .reduce(collectCurrentAllowance, new Map())
      setWhatList(
        Array.from(allowanceMap.values()).sort(simpleTopAmountFirstSort)
      )
    } catch (err) {
      console.debug(err)
      if (err instanceof Error) {
        setErrors([...errors, err])
      }
    }
  }, [])

  const spendApprovalQuery = useAddressSpendApprovalQuery(addressToCheck)

  const handleGetApprovalsForHackedContracts = useCallback(async () => {
    try {
      const logs = await getLogs({
        topics: [ERC20_APPROVAL_TOPIC, null, ETHEREUM_HACKED_CONTRACTS[0]],
      })
      console.log(
        Array.from(new Set(logs.map(toWhat).map((item) => item.owner)))
      )
    } catch (err) {
      console.debug(err)
      if (err instanceof Error) {
        setErrors([...errors, err])
      }
    }
  }, [])

  return (
    <Layout className="d12v-layout">
      <Layout.Content>
        <Row>
          <Typography.Title>Is my crypto wallet safe?</Typography.Title>
        </Row>
        <Row className="d12v-layout--row">
          <Col span={12} sm={24}>
            <div>
              <Form.Item
                extra={
                  addressToCheck !== '' && !isValidAddress(addressToCheck) ? (
                    <Typography.Text type="danger">
                      invalid wallet address
                    </Typography.Text>
                  ) : undefined
                }
              >
                <Input.Search
                  placeholder="input wallet address to check"
                  enterButton="Check"
                  size="large"
                  // onSearch={handleAddressCheck}
                  onSearch={setAddressToCheck}
                  loading={spendApprovalQuery.isLoading}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        {errors.length > 0 && (
          <Row className="d12v-layout--row">
            <Col span={24}>
              <Card>
                {errors.map((err, idx) => (
                  <pre key={idx}>
                    <Typography.Text type="warning">
                      {err.message}
                    </Typography.Text>
                  </pre>
                ))}
              </Card>
            </Col>
          </Row>
        )}

        {spendApprovalQuery.data && (
          <Row className="d12v-layout--row">
            <Col span={24}>
              <Card>
                {spendApprovalQuery.data.length > 0 && (
                  <p>
                    <Typography.Text>
                      List of known hacked smart contracts where wallet{' '}
                      {formatAddress(addressToCheck)} has approved funds to
                      spend, below funds may be at risk
                    </Typography.Text>
                  </p>
                )}
                {spendApprovalQuery.data.length === 0 && (
                  <>
                    <p>
                      <Typography.Text>
                        There is no approved funds to spend in known hacked
                        smart contracts.
                      </Typography.Text>
                    </p>
                    <p>
                      <Typography.Text type="secondary">
                        This tool does do it best but does not gurantee to find
                        all possible treats to funds in the wallet, there are
                        many more ways to lose assets using wallets, be
                        responsible and do your own research on how to mitigate
                        above and other risks.
                      </Typography.Text>
                    </p>
                  </>
                )}
                <Table
                  showHeader={false}
                  pagination={whatList.length > 25 ? undefined : false}
                  footer={() => (
                    <>
                      <p>
                        <Typography.Text type="secondary">
                          This tool does not gurantee to find all spending
                          approvals some tools may still behave unrespondintly
                          or maliciously.
                        </Typography.Text>
                      </p>
                      <p>
                        <Typography.Text type="secondary">
                          This tool does do it best but does not gurantee to
                          find all possible treats to funds in the wallet, there
                          are many more ways to lose assets using wallets, be
                          responsible and do your own research on how to
                          mitigate above and other risks.
                        </Typography.Text>
                      </p>
                    </>
                  )}
                  columns={[
                    {
                      title: '',
                      dataIndex: 'amountApprovedSpend',
                      key: 'ammountApprovedSpend',
                      render: (ammountApprovedSpend) => (
                        <span>
                          {ammountApprovedSpend === '0'
                            ? 'zero'
                            : ammountApprovedSpend}{' '}
                          amount
                        </span>
                      ),
                    },
                    {
                      title: '',
                      dataIndex: 'asset',
                      key: 'asset',
                      render: (asset, item) => (
                        <span>
                          of{' '}
                          <a
                            href={`https://etherscan.io/address/${item.assetAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {asset}
                          </a>
                        </span>
                      ),
                    },
                    {
                      title: '',
                      dataIndex: 'hackedContract',
                      key: 'hackedContract',
                      render: (hackedContract, item) => (
                        <span>
                          {item.amountApprovedSpend === '0'
                            ? 'is approved to spend'
                            : 'is at risk in'}{' '}
                          <a
                            href={`https://etherscan.io/address/${item.hackedContractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {hackedContract}
                          </a>
                        </span>
                      ),
                    },
                    {
                      title: '',
                      dataIndex: 'transactionHash',
                      key: 'transactionHash',
                      render: (transactionHash) => (
                        <a
                          href={`https://etherscan.io/tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          approval transaction{' '}
                          {formatTx(transactionHash, 'short')}
                        </a>
                      ),
                    },
                  ]}
                  dataSource={spendApprovalQuery.data}
                />
                {isEnv('development') && (
                  <ul>
                    {whatList.map((item) => (
                      <li key={item.transactionHash}>
                        {item.amountApprovedSpend}{' '}
                        <a
                          href={`https://etherscan.io/address/${item.assetAddress}`}
                        >
                          {item.asset}
                        </a>{' '}
                        token at risk in conract{' '}
                        <a
                          href={`https://etherscan.io/address/${item.hackedContractAddress}`}
                        >
                          {item.hackedContract}
                        </a>{' '}
                        (
                        <a
                          href={`https://etherscan.io/tx/${item.transactionHash}`}
                        >
                          approval transaction
                        </a>
                        )
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </Col>
          </Row>
        )}

        {isEnv('development') && (
          <div>
            <p>
              example of affected address
              0x78b90b4F409764b7f3b2940fb30e32a024c4a07D{' '}
              <button
                className="btn"
                onClick={() =>
                  handleAddressCheck(
                    '0x198C624C960d128C2B9982131Eef2B9494D8e532'
                  )
                }
              >
                check
              </button>
            </p>
            <button
              className="btn"
              onClick={handleGetApprovalsForHackedContracts}
            >
              console log addresses at risk
            </button>
          </div>
        )}
      </Layout.Content>
      <Layout.Footer>
        Dmitry Shvetsov ©2023{' '}
        <a href="https://twitter.com/dmshvetsov">contact me on twitter</a>
      </Layout.Footer>
    </Layout>
  )
}

export default App
