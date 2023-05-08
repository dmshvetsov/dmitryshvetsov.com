#!/usr/bin/env ./node_modules/.bin/ts-node -r dotenv/config

import assert from 'assert'
import { erc20ABI } from 'wagmi'
import Web3 from 'web3'

assert(
  typeof process.env.VITE_RPC_URL !== 'undefined',
  'VITE_RPC_URL env variable is required'
)
assert(
  typeof process.env.SCRIPTS_ACCOUNT_PRIVATE_KEY !== 'undefined',
  'SCRIPTS_ACCOUNT_PRIVATE_KEY env variable is required'
)
const web3 = new Web3(process.env.VITE_RPC_URL)

const privateKey = process.env.SCRIPTS_ACCOUNT_PRIVATE_KEY
const spenderAddress = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506' // SushiSwapRouter goerli
const assetContractAddress = '0xfad6367E97217cC51b4cd838Cc086831f81d38C2' // tether goerli
const walletAddress = '0x5c8e156a0bad6f12b72c2e03e53d223dbbe4853c'
const approveToSpendAmount = 2_000_000_000

function getTxExpectedGasLimit(tx, safetyOverhead = 1_000) {
  console.log(tx)
  return 21_0000 + tx.data.length * 68 + safetyOverhead
}

const contract = new web3.eth.Contract(erc20ABI, assetContractAddress, {
  from: walletAddress,
})

const tx = {
  from: walletAddress,
  to: assetContractAddress,
  data: contract.methods
    .approve(spenderAddress, approveToSpendAmount)
    .encodeABI(),
}

contract.methods
  .approve(spenderAddress, approveToSpendAmount)
  .estimateGas({ gas: getTxExpectedGasLimit(tx) })
  .then((estiatedTxGas) => {
    console.log('estimated tx gas:', estiatedTxGas)
    tx.gas = estiatedTxGas
    console.log('calculated max gas fees:', getTxExpectedGasLimit(tx))
    return web3.eth.accounts.signTransaction(tx, privateKey)
  })
  .then((signedTx) => {
    const sendPromise = web3.eth.sendSignedTransaction(
      signedTx.raw || signedTx.rawTransaction
    )
    // sendPromise.on("receipt", receipt => {
    //   // do something when receipt comes back
    // });
    // sendPromise.on("error", err => {
    //   // do something on transaction error
    // });
    return sendPromise
  })
  .then((txReceipt) => {
    console.log(txReceipt)
    process.exit()
  })
  .catch((err) => {
    console.error(err)
    process.exit()
  })
