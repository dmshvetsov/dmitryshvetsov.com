import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import {
  configureChains,
  createClient,
  WagmiConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { TxConfig } from './types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { mainnet, goerli, arbitrum } from 'wagmi/chains'

const chains = [mainnet, arbitrum, goerli]
const projectId = '24a4a2799d98c9623ab70d8a0c1f624b'

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
})
const ethereumClient = new EthereumClient(wagmiClient, chains)

export function WalletProvider(props: any) {
  return <WagmiConfig client={wagmiClient}>{props.children}</WagmiConfig>
}

export function WalletModal() {
  return <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
}

export function WalletButton() {
  return <Web3Button />
}

/**
 * Generic hook to send contract write transactions
 */
export function useSendTx(txConfig: TxConfig) {
  const [isTriggered, setTriggered] = useState(false)

  useEffect(() => {
    setTriggered(false)
  }, [txConfig])

  console.log('tx config', txConfig)
  const { config } = usePrepareContractWrite(txConfig)
  const {
    data: txData,
    isError: isApprovalError,
    isLoading: isWaitingForTxApproval,
    isSuccess: isTxApproved,
    write,
  // } = useContractWrite(isTriggered ? config : undefined)
  } = useContractWrite(config)
  const {
    isError: isTxError,
    isLoading: isWaitingForComfirmation,
    isSuccess: isTxConfirmed,
  } = useWaitForTransaction({ hash: isTriggered ? txData?.hash : undefined })

  const send = useCallback(() => {
    if (write != null && !isTriggered) {
      setTriggered(true)
      write()
    }
  }, [write, isTriggered])

  return useMemo(
    () => ({
      send,
      txData,
      isApprovalError,
      isWaitingForTxApproval,
      isTxApproved,
      isWaitingForComfirmation,
      isTxConfirmed,
      isTxError,
    }),
    [
      send,
      txData,
      isApprovalError,
      isTxError,
      isWaitingForComfirmation,
      isTxApproved,
      isWaitingForTxApproval,
      isTxConfirmed,
    ]
  )
}

export { useAccount } from 'wagmi'
