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
import { RevokeTransactionConfig, revokeTxConfig } from './web3/abi/erc20'

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
function simpleTopAmountFirstSort(item: SpendAllowance) {
  return (
    (item.amountApprovedSpend.length - item.amountApprovedSpend.length) * -1
  )
}

function useTokenMetadataQuery(tokenAddress: Web3Address[]) {
  return useQueries({
    queries: tokenAddress.map((address) => ({
      queryKey: ['token-client', 'metadata', address],
      queryFn: () => getTokenMetadata(address),
      retry: false,
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  })
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

type RevokeButtonProps = RevokeTransactionConfig & {
  tooltipHint: string
  disabled?: boolean
}

function RevokeButton(props: RevokeButtonProps) {
  const { assetContractAddress, spenderAddress, ...restProps } = props
  const revokeQuery = useSendTx(
    revokeTxConfig({ assetContractAddress, spenderAddress })
  )

  if (revokeQuery.isWaitingForTxApproval) {
    ;<Button loading disabled={restProps.disabled}>
      Approve In Wallet
    </Button>
  }
  if (revokeQuery.isTxApproved) {
    ;<Button loading disabled={restProps.disabled}>
      In Progress
    </Button>
  }
  return (
    <Tooltip title={props.tooltipHint}>
      <Button
        loading={revokeQuery.isWaitingForTxApproval}
        disabled={restProps.disabled}
        onClick={revokeQuery.send}
      >
        Revoke
      </Button>
    </Tooltip>
  )
}

function App() {
  // state

  const [spendApprovals, setSpandApprovals] = useState<SpendAllowance[]>([])
  const [addressToCheck, setAddressToCheck] = useState('')
  const [errors, setErrors] = useState<Error[]>([])
  const walletAccount = useAccount()

  // handlers

  // TODO: add router and move wallet check app to /apps/is-my-wallet-safe URL
  const handleAddressCheck = useCallback(async (address: Web3Address) => {
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
      setSpandApprovals(
        Array.from(allowanceMap.values()).sort(simpleTopAmountFirstSort)
      )
    } catch (err) {
      console.debug(err)
      if (err instanceof Error) {
        setErrors([...errors, err])
      }
    }
  }, [errors])

  // data queries

  const spendApprovalQuery = useAddressSpendApprovalQuery(
    (addressToCheck || '0x') as Web3Address
  )
  const tokensMetadataQuery = useTokenMetadataQuery(
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
            <Col sm={24} lg={12}>
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
                    onSearch={setAddressToCheck}
                    loading={spendApprovalQuery.isFetching}
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
                        render: (ammountApprovedSpend) => (
                          <span>
                            {ammountApprovedSpend === '0'
                              ? 'you have revoked access'
                              : ammountApprovedSpend}
                          </span>
                        ),
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
                              ? 'in'
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
                      {
                        render: (_, item) => {
                          if (item.amountApprovedSpend !== '0') {
                            const tooltipHint = walletAccount.isConnected
                              ? 'click revoke and sing a transaction to revoke access to your funds'
                              : 'connect wallet to revoke access to your funds from the contract'
                            return (
                              <RevokeButton
                                tooltipHint={tooltipHint}
                                assetContractAddress={item.assetAddress}
                                spenderAddress={item.hackedContractAddress}
                                disabled={!walletAccount.isConnected}
                              />
                            )
                          }
                          return null
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
