+++
title = "How to Deploy Etherium Contract to Goerli network Using Hardhat, Alchemy and TypeScript"
date = 2022-05-05
+++

similar article https://betterprogramming.pub/integrating-smart-contracts-using-hardhat-with-nextjs-typescript-7206890b9cd8

```
(base) d24v:evm/ (dima/add-evm-package✗) $ yarn hardhat                                                                                                                                                                                                                         [15:05:43]
yarn run v1.22.18
warning package.json: No license field
$ /Users/d24v/Projects/magiceden/marketplace/js/node_modules/.bin/hardhat
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.9.3 👷‍

✔ What do you want to do? · Create an advanced sample project that uses TypeScript
✔ Hardhat project root: · /Users/d24v/Projects/magiceden/marketplace/js/packages/evm
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with npm (@nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-etherscan dotenv eslint eslint-config-prettier eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-prettier eslint-plugin-promise hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage @typechain/ethers-v5 @typechain/hardhat @typescript-eslint/eslint-plugin @typescript-eslint/parser @types/chai @types/node @types/mocha ts-node typechain typescript)? (Y/n) · y
```

In this tutorial you will deploy an Etherium smart contract written in solidity to Goerli network backed by Alchemy platform using Node.JS, TypeScript and Hardhat development environment.

Requirements:
- [Node JS](https://nodejs.org) version 16+, installed on your machine
- CLI terminal
- web browser, I prefer Google Chrome for development
- about 1 hour of free and undistracted time

## Setup Hardhat Project with TypeScript

Open your terminal.

Create a directory for your new smart contract project

    $ mkdir hello-contract

Navigate to the created directory. You will execute all the following commands from this directory.

    $ cd hello-contract

_Note: I'm using Unix/Linux commands here. Feel free to submit a [PR for this tutoriatutoriall](https://github.com/dmshvetsov/dmitryshvetsov.com/blob/master/content/articles/how-to-deploy-etherium-smart-contract-using-hardhat-alchemy-typescript.md) to include Windows commands_

Initialize npm project

    $ npm init -y

This command will create a default `package.json` file for you.

Install `hardhat` npm package

    $ npm install --save-dev hardhat

`hardhat` is a development environment or framework that helps you rapidly build smart contracts for EVM

Run `hardhat` command to bootstrap the project

    $ npx hardhat

Then choose "Create an advanced sample project that uses TypeScript" option.

Left "Hardhat project root" without changes, the current `hello-contract` directory.

" Do you want to add a .gitignore?" choose `y` which is "yes"

"Do you want to install this sample project's dependencies", choose `y`

Now you will have 2-3 minutes to make a coffee or green tea while `hardhat` installing npm dependencies for the project.

_If you a yarn users most likely you will need to remove package-lock.json file and run yarn install command manually_

Run tests to make sure the project is set up correctly and it works.

    $ npx hardhat test

Successful output of `$ npx hardhat test` will look like this:

```shell
  Greeter
Deploying a Greeter with greeting: Hello, world!
Changing greeting from 'Hello, world!' to 'Hola, mundo!'
    ✔ Should return the new greeting once it's changed (942ms)


  1 passing (944ms)
```
_By the way if you currious why we need to prefix commands with `npx`, it allows you to run executable files of installed dependencies without specifying a fool path like `./node_modules/.bit/<name of a package>`. E.g. the `$ hardhat test` command will fail with a message that the command not found. Another useful property of `npx` command is that you can run even not installed npm packages by downloading them temporary, `npx` will handle it under the hood. Give this command a try in the terminal `$ npx cowsay Cooool!`_


To see the code of the `Greeter` contract that `hardhat` bootstraped for you open `contracts/Greeter.sol` with the editor of your choice. I'm using Neovim.

    $ nvim contracts/Greeter.sol

## Create an Alchemy account

Alchemy is a SaaS project that takes care of web3 deployements, smart contracts for Ethereum, Polygon, Arbitrum, Optimism blockchains. Alchemy, also, provides API for interacting with the blockchains and suite of developer tools that will be handy when you need to debug or analyze what happening in your web3 application.

Let's create an Alchemy account. Visit `alchemy.com` find "getting started" or "sign up" button, fillout signup details, and submit the form.

Then you will be promted to created an Alchemy App give it a name ("greeter" or "hello world" will be good choices) and description (leave it blank if don't want provide any context about your web3 app).

Next choose "Etherium" chain and "Goerli" network and hit "Create App". Etherium is the most popular blockchain for distributed apps (dApps) or web3 apps amd [Goerli](https://goerli.net/) is a test network where $ETH is not real $ETH. More on test networks later.

Then when a dashboard for your first Alchemy up will finish loading find "HTTP" value. It should be behind "API KEY" button. The value in "HTTP" field is your RPC server. RPC servers are your servers to send command to blockchains with remote procedure call (RPC).

For configuration variables you will be using `.env` file. This file serves as a source of environment variables that will be used as dynamic part of your project configuration. Let's create it first.

    $ touch .env

Then copy value from "HTTP" field on Alchmy dashboard and put it in the `.env` file withe `GOERLI_RPC_URL` name

```
GOERLI_RPC_URL="https://eth-goerli.alchemyapi.io/v2/<here you will have your API key>"
```

Use the environment variable like here.

```typescript
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL

const config: HardhatUserConfig = {
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [], // TODO: fill the private key
    },
  },
  // ...rest omitted
}
```

_This is `dotenv` node package at the top of the hardhat config file that make it available values from `.env` in the Node.JS `process.env` object_

## Getting ETH to testnet wallet

To make our contract available online we need to deployed and pay gas, a blockchain fees for it. Even in test networks we need $ETH to deployments so we will need some $ETH. In Goerli network $ETH is not real, it is for testing and you can get it using a faucet that provides Goerli $ETH.

But first we need a wallet to put $ETH inside. We can get a wallet by using [Metamask crypto wallet](https://metamask.io/) or by programmatically generating private and public key pair. Actually Metamask is just a user interface in a browser or in mobile phone that generating a key pari for you and allowing conviniet usage of it. For deployement you will create a "wallet" programmaticaly. Don't worry you will create a metamask wallet today, but for diffetent purpose.

We will practice Hardhat task to create a wallet.

Open `./hardhat.config.ts` and add the following hardhat task. This task resposability is to generate a new public, private keys and public address of a wallet.

```typescript
// define task with a name as 1st argument and handler function as the 2nd argument
task("createWallet", "", (_taskArgs, hre) => {
  const wallet = hre.ethers.Wallet.createRandom()
  console.log({
    address: wallet.address,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
  })
})
```

The exact place where to add the new task is not important, put it where you will likely to look for it when you will needed to revisite the code of the task.

Now run it and generate the keys and address.

    $ npx hardhat createWallet
    {
      address: <string of your address>,
      publicKey: <string of your wallet public key>,
      privateKey: <string of your private public key>,
    }

_if you are a `yarn` user you can substitute `npx` with `yarn` to get the same result_

Kepp you private key safe and do not share it with anyone. It is literally the key to your wallet.

Add these values into `.env` file in the root of your hardhat project. This file serves as a source of environment variables that will be used as dynamic part of your project configuration.

```
GOERLI_RPC_URL=<your goerli URL that you put here in previous steps>
WALLET_ADDRESS=<address string>
WALLET_PRIVATE_KEY=<privateKey string>
```

Update `HardhatUserConfig` inside `hardhat.config.ts`. Add `WALLET_PRIVATE_KEY` environement variable to the accounts array and remove the `TODO:` that you left on a previous step.

```ts
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const GOERLI_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY

const config: HardhatUserConfig = {
  defaultNetwork: 'rinkeby',
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [WALLET_PRIVATE_KEY]
    }
  },
  // ...rest omitted
}
```

Now it is time to put some $ETH to your new wallet. Visit [https://goerlifaucet.com/](https://goerlifaucet.com/). This $ETH faucet powered by Alchemy. You can transfer $ETH to your wallet by connection your Alchemy account, entering your address string into address field that you got from the "createWallet" command and clicking "Send Me ETH". You will get 50,000,000 Gwei which is equal to 0.05 $ETH wich will be enough for our tutorial.

Let's check balance and practice usage of hardhat tasks and [`ethers` npm package](https://www.npmjs.com/package/ethers) a JavaScript swiss knife library of EVM web3 apps. Add the following task to `hardhat.config.ts`.

```typescript
task("getBalance")
  // specify `--address` argument for the task, task arguments will be available as the 1st parameter `taskArgs` below
  .addParam("address")
  // specify handler function for the task, `hre` is the task context that contains `ethers` package
  .setAction(async (taskArgs, hre) => {
    // create RPC provider for Goerli network
    const provider = hre.ethers.getDefaultProvider("goerli");
    console.log(
      "$ETH",
      // format it from Gwei to ETH
      hre.ethers.utils.formatEther(
        // fetch wallet balance using its address
        await provider.getBalance(taskArgs.address)
      )
    );
  });
```

Get the balance with the new command:

    $ npx hardhat getBalance --address <address string from createWallet command> 

It shoud display "$ETH 0.05".

## Compiling and Deploying Solidity Smart Contract to Alchemy

By default hardhat works with "hardhat" network that comes with hardhat development environment. You can change the default network by specifying another network in `config.network` and specifying the newtwork name in `defaultNetwork`. All of this is done in the hardhat config file `hardhat.config.ts`.

For example here is the config with another test network, "rinkeby":

```ts
const config: HardhatUserConfig = {
  defaultNetwork: 'rinkeby',
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
      accounts: [SOME_RINKEBY_PRIVATE_KEY]
    }
  },
  // ...rest omitted
}
```

I prefer to use "hardhat" network by default so every hardhat command or script that will be runned will operate againg "hardhat" network. This is good because you won't spend any gas fees on running commands aganinst "hardhat" network and won't accidentaly publish a not ready for deployment contract. Having "hardhat" network as default network way safer.

Now ypu will add "goerli" network configuration for your project:


Hardhat advance sample projects comes with a deploy script. Thus means you can make you contract live on Etherium blockchain with one command. You will be deploying to Goerly network in this tutorial and you must specify explicitly witth `--network goerli`

    $ npx hardhat run scripts/deploy.ts

Command above will deploy your `Greeting` contract to hardhat netowrk that is running localy on your machine with one validator. The code will be compiled by the deploy scipt befor the deployment.

Command below is for deploying your contract to "goerli" network.

    $ npx hardhat --network goerli run scripts/deploy.ts

As result commands above log to the console `<contract name> deployed to: <address string>` where `<contract name>` will be "Greeting" if you not tweaked the sample contract and `<address string>` will be the address of the deployed contract on the choosed network, "hardhat" or "goerli" in our example.

To verify your deployement visit [goerli.etherscan.io](https://goerli.etherscan.io/) and paste `<address string>` from the command that deployed the contract to "goerli" network to search field and hit enter.

In the opened page navigate to "Contract" tab. You should see code of your contract.

## Interacting with contract

Install [Metamask wallet](https://metamask.io/download/) as chrome extension. You can use any other compatible with Etherium networks wallet.

As soon you have your wallet in your browser top up it with [goerlifaucet.com](https://goerlifaucet.com/). You know the drill, connect your Alchemy account, copy your address from chrome Metamask wallet and paste in the wallet address feild, hit "Send me ETH".

Now you have funds to interact with your live contract on "Goerli" netwrok.

Visit again your contract address on [goerli.etherscan.io](https://goerli.etherscan.io) navigate to "Contract" tab, "Read Contract" sub-tab, unfold "1. greet". You most likely will see "Hello, Hardhat!" value. This is the value that was set durring deployemnet in `scripts/deploy.ts`. Congratulations, you've just read a value from your contract.

Now you change the value. Open "Write Contract" sub-tab and unfold "setGreeting". You are going to update `_greeting` value.

To do so click "Connect - Web3" button slightly above the `_greeting` label. You might need to click "connect" button in the Metamask browser extension and agree. Subtle part, to see you balance in Goerli network you need to choose "Goerli Test Network" in the upper part of Metamask interace. Balances are separate for each network but you don't have to choose network in metamask to interact with particular network Metamask wallet is smart enought to work with the network that your current web page is works with.

When the wallet is connectedd paste a new value in the input slightly below the `_greeting` label and hit "Write" button. Sign a transaction in the wallet. You will pay some gas fees in test ETH.

Metamask notification window will popup. Make sure you read the content of transaction that you are going to confirm, this is a good habit. Only then hit confirm if you aggree witth what transaction will do. In our case we will update `_greeting` value of the deployed contract.

Once transaction is settled, you will see a confirmation navigate back to "Read Contract", unfold "1. greet" if it is not and you should see a hello message with the value you just sent to the Goerli Etherium blockchain.

## Other Hardhat commands

For your perspective here is an explanation of the other Hardhat commands:

Compile contract. Usually you do not need it since you have `test` and `deploy` commands that do compile Solidity code into deployable contract for you.

    $ npx hardhat compile

Clean cache and compiled code. Useful when you feel something weird is goigng on and hardhat commands do not work as expected.

    $ npx hardhat clean

See how many lines of you contracts code covered by automated tests.

    $ npx hardhat coverage

