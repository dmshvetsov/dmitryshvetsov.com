+++
title = "How to Deploy Ethereum Contract to Goerli network Using Hardhat, Alchemy and TypeScript"
date = 2022-05-05
+++

In this tutorial, you will deploy an Ethereum smart contract written in solidity to Goerli network backed by Alchemy platform using Node.JS, TypeScript and Hardhat development environment.

What you will need for this tutorial:
- some experience developing apps with Node.JS and Typescript
- [Node JS](https://nodejs.org) version 16+, installed on your machine
- CLI terminal, I'm using [iTerm](https://iterm2.com) for MacOS and [Alacritty](https://alacritty.org) MacOs/Unix/Linux
- web browser, I prefer [Google Chrome](https://www.google.com/intl/en_sg/chrome/) for development
- about 1 hour of free and undistracted time

## Setup Hardhat Project with TypeScript

Open your terminal.

Create a directory for your new smart contract project

    $ mkdir hello-contract

Navigate to the created directory. You will execute all the following commands from this directory.

    $ cd hello-contract

_Note: I'm using Unix/Linux commands here. Feel free to submit a [PR for this tutorial](https://github.com/dmshvetsov/dmitryshvetsov.com/blob/master/content/articles/how-to-deploy-ethereum-smart-contract-using-hardhat-alchemy-typescript.md) to include Windows commands_

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

_If you are a yarn user, most likely you will need to remove package-lock.json file and run yarn install command manually_

Run tests to make sure the project is set up correctly and it works.

    $ npx hardhat test

The successful output of `$ npx hardhat test` will look like this:

```shell
  Greeter
Deploying a Greeter with greeting: Hello, world!
Changing greeting from 'Hello, world!' to 'Hola, mundo!'
    ✔ Should return the new greeting once it's changed (942ms)


  1 passing (944ms)
```
_If you are curious why we need to prefix commands with `npx`, it allows you to run executable files of installed dependencies without specifying a fool path like `./node_modules/.bit/<name of a package>`. For e.g. the `$ hardhat test` command will fail with a message that the command not found. Another useful property of `npx` command is that you can run even not installed npm packages by downloading them temporarily, `npx` will handle it under the hood. Give this command a try in the terminal `$ npx cowsay Cooool!`_


To see the code of the `Greeter` contract that `hardhat` bootstrapped for you open `contracts/Greeter.sol` with the editor of your choice.

## Create an Alchemy account

Alchemy is a SaaS project that takes care of web3 deployments, smart contracts for Ethereum, Polygon, Arbitrum, Optimism blockchains. Alchemy, also, provides API for interacting with the blockchains and suite of developer tools that will be handy when you need to debug or analyze what happening in your web3 application.

Let's create an Alchemy account. Visit `alchemy.com` find "getting started" or "sign up" button, fill out signup details, and submit the form.

Then you will be prompted to create an Alchemy App and give it a name, "greeter" or "hello world" will be good choices and description, leave it blank if you don't want to provide any context about your web3 app.

Next, choose "Ethereum" chain and "Goerli" network and hit "Create App". Ethereum is the most popular blockchain for distributed apps (dApps) or web3 apps and [Goerli](https://goerli.net/) is a test network where $ETH is not real $ETH. More on test networks later.

Then when a dashboard for your first Alchemy up will finish loading find "HTTP" value. It should be behind "API KEY" button. The value in "HTTP" field is your RPC server. RPC servers are your servers to send commands to blockchains with remote procedure calls (RPC).

For storing configuration variables, you will be using `.env` file. This file serves as a source of environment variables that will be used as dynamic part of your project configuration. Let's create it first.

    $ touch .env

_Read [12factor.net](https://12factor.net/config) to learn more about good practices of configuring your apps_

Then copy the value from "HTTP" field on Alcehmy dashboard and put it in the `.env` file with `GOERLI_RPC_URL` name

```
GOERLI_RPC_URL="https://eth-goerli.alchemyapi.io/v2/<here you will have your API key>"
```

Use the environment variable like in this example:

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

To make our contract available online we need to deploy and pay gas, blockchain fees for it. Even in test networks, we need $ETH for deployments so we will need some $ETH. In Goerli network $ETH is not real, it is for testing and you can get it using a faucet that provides Goerli $ETH.

We need a wallet to put $ETH inside. We can get a wallet by using [Metamask crypto wallet](https://metamask.io/) or by programmatically generating key pair of private and public keys. Metamask is just a user interface in a browser or in mobile phone that generates a key pair for you and allows convenient usage of the pair. For deployments, you will create a "wallet" programmatically. Don't worry you will create a Metamask wallet today, but for a different purpose.

We will practice Hardhat task to create a wallet.

Open `./hardhat.config.ts` and add the following hardhat task. This task responsibility is to generate a new public, private keys and public address of a wallet.

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

The exact place where to add the new task is not important, put it where you will likely to look for it when you will need to revisit the code of the task.

Now run it and generate the keys and address.

    $ npx hardhat createWallet
    {
      address: <string of your address>,
      publicKey: <string of your wallet public key>,
      privateKey: <string of your private public key>,
    }

_if you are a `yarn` user you can substitute `npx` with `yarn` to get the same result_

Keep your private key safe and do not share it with anyone. It is the key to your wallet those who owns it own the wallet content.

Add these values into `.env` file at the root of your hardhat project. This file serves as a source of environment variables that will be used as a dynamic part of your project configuration.

```
GOERLI_RPC_URL=<your goerli URL that you put here in previous steps>
WALLET_ADDRESS=<address string>
WALLET_PRIVATE_KEY=<privateKey string>
```

Update `HardhatUserConfig` inside `hardhat.config.ts`. Add `WALLET_PRIVATE_KEY` environment variable to the accounts array and remove the `TODO:` that you left on a previous step.

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

Now it is time to put some $ETH into your new wallet. Visit [https://goerlifaucet.com/](https://goerlifaucet.com/). This $ETH faucet is powered by Alchemy. You can transfer $ETH to your wallet by connecting your Alchemy account, entering your address string into the address field that you got from the "createWallet" command and clicking "Send Me ETH". You will get 50,000,000 Gwei which is equal to 0.05 $ETH which will be enough for our tutorial.

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

By default, hardhat works with "hardhat" network that comes with hardhat development environment. You can change the default network by specifying another network in `config.network` and specifying the network name in `defaultNetwork`. All of this is done in the hardhat config file `hardhat.config.ts`.

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

I prefer to use "hardhat" network by default so every hardhat command or script that will be run will operate against "hardhat" network. This is good because you won't spend any gas fees on running commands against "hardhat" network and won't accidentally publish a not ready for deployment contract. Having "hardhat" network as the default network way is safer.

Now you will add "goerli" network configuration for your project:

...


Hardhat advanced sample projects comes with a deploy script. This means you can make your contract live on Ethereum blockchain with one command. You will be deploying to Goerli network in this tutorial and you must specify explicitly with `--network goerli`

    $ npx hardhat run scripts/deploy.ts

The command above will deploy your `Greeting` contract to hardhat network that is running locally on your machine with one validator. The code will be compiled by the deploy script before the deployment.

The command below is for deploying your contract to "goerli" network.

    $ npx hardhat --network goerli run scripts/deploy.ts

As result commands above log to the console `<contract name> deployed to: <address string>` where `<contract name>` will be "Greeting" if you have not tweaked the sample contract and `<address string>` will be the address of the deployed contract on the chosen network, "hardhat" or "goerli" in our example.

To verify your deployment visit [goerli.etherscan.io](https://goerli.etherscan.io/) and paste `<address string>` from the command that deployed the contract to "goerli" network to the search field and hit enter.

On the opened page navigate to "Contract" tab. You should see the code of your contract.

## Interacting with contract

Install [Metamask wallet](https://metamask.io/download/) as a chrome extension. You can use any other compatible with Ethereum networks wallet.

As soon you have your wallet in your browser top up it with [goerlifaucet.com](https://goerlifaucet.com/). You know the drill, connect your Alchemy account, copy your address from chrome Metamask wallet and paste it into the wallet address field, and hit "Send me ETH".

Now you have funds to interact with your live contract on "Goerli" network.

Visit again your contract address on [goerli.etherscan.io](https://goerli.etherscan.io) navigate to "Contract" tab, "Read Contract" sub-tab, and unfold "1. greet". You most likely will see "Hello, Hardhat!" value. This is the value that was set during deployment in `scripts/deploy.ts`. Congratulations, you've just read a value from your contract.

Now you change the value. Open "Write Contract" sub-tab and unfold "setGreeting". You are going to update `_greeting` value.

To do so click "Connect - Web3" button slightly above the `_greeting` label. You might need to click "connect" button in the Metamask browser extension and agree. Subtle part, to see your balance in Goerli network you need to choose "Goerli Test Network" in the upper part of Metamask interface. Balances are separate for each network but you don't have to choose network in Metamask to interact with a particular network Metamask wallet is smart enough to work with the network that your current web page works with.

When the wallet is connected paste a new value in the input slightly below the `_greeting` label and hit "Write" button. Sign a transaction in the wallet. You will pay some gas fees in test ETH.

Metamask notification window will pop up. Make sure you read the content of transaction that you are going to confirm, this is a good habit. Only then hit confirm if you agree with what the transaction will do. In our case we will update `_greeting` value of the deployed contract.

Once the transaction is settled, you will see a confirmation navigate back to "Read Contract", unfold "1. greet" if it is not and you should see a hello message with the value you just sent to the Goerli Ethereum blockchain.

## Other Hardhat commands

For your perspective here is an explanation of the other Hardhat commands:

Compile contract. Usually, you do not need it since you have `test` and `deploy` commands that do compile Solidity code into a deployable contract for you.

    $ npx hardhat compile

Clean cache and compiled code. Useful when you feel something weird is going on and hardhat commands do not work as expected.

    $ npx hardhat clean

See how many lines of your contracts code are covered by automated tests.

    $ npx hardhat coverage

