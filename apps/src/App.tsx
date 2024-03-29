import { useCallback, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
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
import { ETHEREUM_HACKED_CONTRACTS, getContractAlias } from './web3/addresses'
import { Log } from 'web3-core'
import { Web3Address } from './web3/types'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import { formatTx } from './web3/transaction'
import { isEnv } from './config'
import {
  TokenMetadata,
  getTokenMetadata,
  isTokenMetadata,
} from './clients/token-client'
import {
  WalletButton,
  WalletModal,
  WalletProvider,
  useAccount,
  useSendTx,
} from './web3/wallet'
import { revokeTxConfig } from './web3/abi/erc20'
import { formatAmount } from './web3/token'

function isHackedContractLog(log: Log): boolean {
  return (
    log.removed !== true &&
    ETHEREUM_HACKED_CONTRACTS.includes(
      getApprovedSpenderFromLog(log, { format: 'utf8' })
    )
  )
}

type SpendAllowance = {
  transactionHash: string
  hackedContractAddress: Web3Address
  hackedContractAlias: string
  assetAddress: Web3Address
  blockNumber: number
  owner: string
  // number in string representation
  amountApprovedSpend: string
}

function nameAlias(
  tokensMetadata: TokenMetadata[],
  assetAddress: Web3Address
): string {
  const foundMetadata = tokensMetadata.find(
    (data) => data.address.toLowerCase() === assetAddress.toLowerCase()
  )
  if (foundMetadata && foundMetadata.symbol) {
    return foundMetadata.symbol
  }
  return formatAddress(assetAddress)
}

function spendAllowanceFrom(input: Log): SpendAllowance {
  const hackedContractAddress = getApprovedSpenderFromLog(input, {
    format: 'utf8',
  })
  return {
    transactionHash: input.transactionHash,
    hackedContractAddress,
    hackedContractAlias:
      getContractAlias('ethereum', hackedContractAddress) ??
      formatAddress(hackedContractAddress),
    assetAddress: input.address as Web3Address,
    amountApprovedSpend: getAmountApprovedSpendFromLog(input),
    owner: getAssetOwnerFromLog(input, { format: 'utf8' }),
    blockNumber: input.blockNumber,
  }
}

function collectCurrentAllowance(
  acc: Map<string, SpendAllowance>,
  item: SpendAllowance
) {
  const key = `${item.hackedContractAddress}:${item.assetAddress}`
  const previous = acc.get(key)
  if (previous && previous.blockNumber < item.blockNumber) {
    acc.set(key, item)
  } else {
    acc.set(key, item)
  }
  return acc
}

// does not takin into account the number of ERC20 token decimals
function simpleTopAmountFirstSort(l: SpendAllowance, r: SpendAllowance) {
  return (l.amountApprovedSpend.length - r.amountApprovedSpend.length) * -1
}

function useTokenMetadataQuery(tokenAddress: Web3Address[]) {
  return useQueries({
    queries: tokenAddress.map((address) => ({
      queryKey: ['token-client', 'metadata', address],
      queryFn: () => getTokenMetadata('eth', address),
      retry: false,
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  })
}

function useTokenMetadata(tokenAddresses: Web3Address[]) {
  const query = useTokenMetadataQuery(tokenAddresses)
  const dataList = query.map((q) => q.data).filter(isTokenMetadata)
  const forAddress = useCallback(
    (assetAddress: Web3Address) => {
      const foundMetadata = dataList.find(
        (item) => item.address.toLowerCase() === assetAddress.toLowerCase()
      )
      return foundMetadata ?? null
    },
    [dataList]
  )

  return { forAddress }
}

function useAddressSpendApprovalQuery(address: Web3Address) {
  return useQuery(
    ['provider', 'getLogs', address],
    async () => {
      const logs = await getAddressLogs(address)
      const allowanceMap = logs
        .filter(isHackedContractLog)
        .map(spendAllowanceFrom)
        .reduce(collectCurrentAllowance, new Map())
      return Array.from(allowanceMap.values()).sort(simpleTopAmountFirstSort)
    },
    {
      enabled: isValidAddress(address),
      retry: 3,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )
}

type RevokeButtonProps = {
  spendAllowance: SpendAllowance
}

function RevokeButton(props: RevokeButtonProps) {
  const walletAccount = useAccount()

  const isDisabled =
    walletAccount.isConnected !== true ||
    walletAccount.address !== props.spendAllowance.owner

  const revokeQuery = useSendTx(
    revokeTxConfig({
      assetContractAddress: props.spendAllowance.assetAddress,
      spenderAddress: props.spendAllowance.hackedContractAddress,
    })
  )

  if (revokeQuery.isWaitingForTxApproval) {
    return (
      <Button loading disabled={isDisabled}>
        Approve In Wallet
      </Button>
    )
  }
  if (revokeQuery.isWaitingForComfirmation) {
    return (
      <Button loading disabled={isDisabled}>
        In Progress
      </Button>
    )
  }
  if (revokeQuery.isTxConfirmed) {
    if (revokeQuery.txData?.hash) {
      return (
        <a href={`https://etherscan.io/tx/${revokeQuery.txData.hash}`}>
          revoke transaction {formatTx(revokeQuery.txData.hash, 'short')}
        </a>
      )
    }
    return <span>successfuly revoked</span>
  }

  let tooltipHint =
    'connect wallet to revoke access to your funds from the contract'
  if (walletAccount.isConnected) {
    tooltipHint =
      'click revoke and sing a transaction to revoke access to your funds'
  }
  if (walletAccount.address !== props.spendAllowance.owner) {
    tooltipHint =
      'you can only revoke spend allowance to funds of the connected wallet'
  }
  return (
    <Tooltip title={tooltipHint}>
      <Button
        loading={revokeQuery.isWaitingForTxApproval}
        disabled={isDisabled}
        onClick={revokeQuery.send}
      >
        Revoke
      </Button>
    </Tooltip>
  )
}

function ChainSelect() {
  return (
    <Select defaultValue="mainnet">
      <Select.Option value="mainnet">Ethereum</Select.Option>
      <Select.Option value="arbitrum" disabled>
        Arbitrum (comming soon)
      </Select.Option>
      <Select.Option value="bsc" disabled>
        Binance SC (comming soon)
      </Select.Option>
      <Select.Option value="polygon" disabled>
        Polygon (comming soon)
      </Select.Option>
    </Select>
  )
}

function App() {
  // state

  const [spendApprovals, setSpendApprovals] = useState<SpendAllowance[]>([])
  const [addressToCheck, setAddressToCheck] = useState('')
  const [errors, setErrors] = useState<Error[]>([])

  // handlers

  // TODO: add router and move wallet check app to /apps/is-my-wallet-safe URL
  const handleAddressCheck = useCallback(
    async (address: Web3Address) => {
      if (!isValidAddress(address)) {
        console.debug('invalid address in search input:', address)
        return
      }

      try {
        const logs = await getAddressLogs(address)
        const allowanceMap = logs
          .filter(isHackedContractLog)
          .map(spendAllowanceFrom)
          .reduce(collectCurrentAllowance, new Map())
        setSpendApprovals(
          Array.from(allowanceMap.values()).sort(simpleTopAmountFirstSort)
        )
      } catch (err) {
        console.debug(err)
        if (err instanceof Error) {
          setErrors([...errors, err])
        }
      }
    },
    [errors]
  )

  // data queries

  const spendApprovalQuery = useAddressSpendApprovalQuery(
    (addressToCheck || '0x') as Web3Address
  )
  const tokensMetadataQuery = useTokenMetadataQuery(
    spendApprovalQuery.data
      ?.map((item) => item.assetAddress)
      .filter((item) => item != null) ?? []
  )
  const tokenMetadata = useTokenMetadata(
    spendApprovalQuery.data
      ?.map((item) => item.assetAddress)
      .filter((item) => item != null) ?? []
  )

  // contracts queries

  // misc

  const handleGetApprovalsForHackedContracts = useCallback(async () => {
    try {
      const logs = await getLogs({
        topics: [ERC20_APPROVAL_TOPIC, null, ETHEREUM_HACKED_CONTRACTS[0]],
      })
      console.log(
        Array.from(
          new Set(logs.map(spendAllowanceFrom).map((item) => item.owner))
        )
      )
    } catch (err) {
      console.debug(err)
      if (err instanceof Error) {
        setErrors([...errors, err])
      }
    }
  }, [errors])

  return (
    <WalletProvider>
      <Layout className="d12v-layout">
        <Layout.Content>
          <Row>
            <Typography.Title>Is my crypto wallet safe?</Typography.Title>
          </Row>
          <Row className="d12v-layout--row">
            <Col sm={24} lg={13}>
              <div>
                <Space.Compact block size="large">
                  <Form.Item style={{ width: '20%' }}>
                    <ChainSelect />
                  </Form.Item>
                  <Form.Item
                    style={{ width: '80%' }}
                    extra={
                      addressToCheck !== '' &&
                      !isValidAddress(addressToCheck) ? (
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
                      onSearch={setAddressToCheck}
                      loading={spendApprovalQuery.isFetching}
                    />
                  </Form.Item>
                </Space.Compact>
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
            <Card>
              <Row
                className="d12v-layout--row"
                justify="space-between"
                align="middle"
              >
                <Col span={18}>
                  {spendApprovalQuery.data.length > 0 && (
                    <p>
                      <Typography.Text>
                        List of known hacked smart contracts where wallet{' '}
                        {formatAddress(addressToCheck)} has approved funds to
                        spend, below funds may be at risk. Conntect wallet and
                        use revoke button to secure your funds from the hacked
                        contracts.
                      </Typography.Text>
                    </p>
                  )}
                  {spendApprovalQuery.data.length === 0 && (
                    <p>
                      <Typography.Text>
                        No hacked contracts has access to funds in{' '}
                        {formatAddress(addressToCheck)} wallet. There is no need
                        to take any action for this wallet here.
                      </Typography.Text>
                    </p>
                  )}
                </Col>
                <WalletButton />
              </Row>
              <Row>
                <Col span={24}>
                  <Table
                    showHeader={false}
                    pagination={spendApprovals.length > 25 ? undefined : false}
                    footer={() => (
                      <>
                        <p>
                          <Typography.Text
                            type="secondary"
                            className="d12v-text--disclaimer"
                          >
                            This tool does not gurantee to find all spending
                            approvals some tools may still behave unrespondintly
                            or maliciously.
                          </Typography.Text>
                        </p>
                        <p>
                          <Typography.Text
                            type="secondary"
                            className="d12v-text--disclaimer"
                          >
                            This tool does do it best but does not gurantee to
                            find all possible treats to funds in the wallet,
                            there are many more ways to lose assets using
                            wallets, be responsible and do your own research on
                            how to mitigate above and other risks.
                          </Typography.Text>
                        </p>
                      </>
                    )}
                    columns={[
                      {
                        title: '',
                        dataIndex: 'amountApprovedSpend',
                        key: 'transactionHash',
                        render: (ammountApprovedSpend, item) => {
                          if (ammountApprovedSpend === '0') {
                            return <span>you've revoked access</span>
                          }
                          const assetTokenMetadata = tokenMetadata.forAddress(
                            item.assetAddress
                          )
                          if (assetTokenMetadata != null) {
                            return (
                              <span>
                                {formatAmount(
                                  ammountApprovedSpend,
                                  assetTokenMetadata,
                                  { aprox: 4 }
                                )}
                              </span>
                            )
                          }
                          return (
                            <Tooltip title="visit the link of the apporval transaction to see exact amount approved to spend">
                              <span>some amount</span>
                            </Tooltip>
                          )
                        },
                      },
                      {
                        title: '',
                        dataIndex: 'assetAddress',
                        key: 'transactionHash',
                        render: (assetAddress) => (
                          <span>
                            of{' '}
                            <a
                              href={`https://etherscan.io/token/${assetAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {nameAlias(
                                tokensMetadataQuery
                                  .map((q) => q.data)
                                  .filter(isTokenMetadata),
                                assetAddress
                              )}
                            </a>
                          </span>
                        ),
                      },
                      {
                        title: '',
                        dataIndex: 'hackedContractAlias',
                        key: 'transactionHash',
                        render: (hackedContractAlias, item) => (
                          <span>
                            {item.amountApprovedSpend === '0'
                              ? 'for'
                              : 'is at risk in'}{' '}
                            <a
                              href={`https://etherscan.io/address/${item.hackedContractAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {hackedContractAlias}
                            </a>{' '}
                            contract
                          </span>
                        ),
                      },
                      {
                        title: '',
                        dataIndex: 'transactionHash',
                        key: 'transactionHash',
                        render: (transactionHash, item) => (
                          <a
                            href={`https://etherscan.io/tx/${transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.amountApprovedSpend === '0'
                              ? 'revoke transaction'
                              : 'approval transaction'}{' '}
                            {formatTx(transactionHash, 'short')}
                          </a>
                        ),
                      },
                      {
                        render: (_, item) => {
                          if (item.amountApprovedSpend === '0') {
                            return null
                          }
                          return <RevokeButton spendAllowance={item} />
                        },
                      },
                    ]}
                    dataSource={spendApprovalQuery.data}
                  />
                  {isEnv('development') && (
                    <ul>
                      {spendApprovals.map((item) => (
                        <li key={item.transactionHash}>
                          {item.amountApprovedSpend}{' '}
                          <a
                            href={`https://etherscan.io/address/${item.assetAddress}`}
                          >
                            {nameAlias(
                              tokensMetadataQuery
                                .map((q) => q.data)
                                .filter(isTokenMetadata),
                              item.assetAddress
                            )}
                          </a>{' '}
                          token at risk in conract{' '}
                          <a
                            href={`https://etherscan.io/address/${item.hackedContractAddress}`}
                          >
                            {nameAlias(
                              tokensMetadataQuery
                                .map((q) => q.data)
                                .filter(isTokenMetadata),
                              item.hackedContractAddress
                            )}
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
                </Col>
              </Row>
            </Card>
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
                      '0x78b90b4F409764b7f3b2940fb30e32a024c4a07D'
                    )
                  }
                >
                  check
                </button>
              </p>
              <p>
                example of affected address
                0x50f9F41c76cF7dE9E889b21A3073eb56a2890e39{' '}
                <button
                  className="btn"
                  onClick={() =>
                    handleAddressCheck(
                      '0x50f9F41c76cF7dE9E889b21A3073eb56a2890e39'
                    )
                  }
                >
                  check
                </button>
              </p>
              <p>
                example of affected address
                0xEC948f0a29cE77412773412D076fBBABa1e67491{' '}
                <button
                  className="btn"
                  onClick={() =>
                    handleAddressCheck(
                      '0xEC948f0a29cE77412773412D076fBBABa1e67491'
                    )
                  }
                >
                  check
                </button>
              </p>
              <p>
                example of affected address
                0x720da268Cf78f5d68fe7DF02880fa61620097190{' '}
                <button
                  className="btn"
                  onClick={() =>
                    handleAddressCheck(
                      '0x720da268Cf78f5d68fe7DF02880fa61620097190'
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
        <WalletModal />
      </Layout>
    </WalletProvider>
  )
}

export default App
