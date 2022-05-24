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
- about 1.5 hour of free and undistracted time

## Setup Hardhat Project with TypeScript

Open your terminal.

Navigate to a directory where you will create a project and run a command to create a directory for your smart contract project:

    $ mkdir hello-contract

Change directory to the created one. You will execute all the following commands from this directory.

    $ cd hello-contract

_Note: I'm using Unix/Linux commands here. Feel free to submit a [PR for this tutorial](https://github.com/dmshvetsov/dmitryshvetsov.com/edit/master/content/articles/how-to-deploy-goerli-ethereum-smart-contract-using-hardhat-alchemy-typescript.md) to include Windows commands_

Initialize npm project

    $ npm init -y

With the `-y` flag `init` command will create a `package.json` file with default values.

Install `hardhat` npm package

    $ npm install --save-dev hardhat

`hardhat` is a development environment or framework that helps you build smart contracts for EVM

Run `hardhat` command to bootstrap the project

    $ npx hardhat

You will be prompted to:
- First, choose "Create an advanced sample project that uses TypeScript" option.
- Left "Hardhat project root" without changes, the current `hello-contract` directory.
- " Do you want to add a .gitignore?" choose `y` which is "yes"
- "Do you want to install this sample project's dependencies", choose `y`
- Now you will have 2-3 minutes to make a coffee or green tea while `hardhat` installing npm dependencies for the project.

_yarn users need to use `yarn` where I'm using `npx` and most likely you will need to remove `package-lock.json` file and run yarn install command manually right after hardhat project initialization_

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
_If you are curious why we need to prefix commands with `npx`, it allows you to run executable files of installed dependencies without specifying a full path like `./node_modules/.bit/<name of a package>`. The `$ hardhat test` command will fail with a message that the command not found because it requires a full path to `.bin` directory in `node_modules`. Another useful property of `npx` command is that you can run not installed npm packages by downloading them temporarily. Give this command a try in the terminal `$ npx cowsay Cooool!`_


To see the code of the `Greeter` contract that `hardhat` bootstrapped for you open `contracts/Greeter.sol` with the editor of your choice.

## Create an Alchemy account

Alchemy is a SaaS project that takes care of web3 deployments, smart contracts for Ethereum, Polygon, Arbitrum, Optimism blockchains. Alchemy, also, provides API for interacting with the blockchains and suite of developer tools that will be handy when you need to debug or analyze what happening in your web3 application.

Let's create an Alchemy account. Visit `alchemy.com` find "getting started" or "sign up" button, fill out signup details, and submit the form.

Then you will be prompted to create an Alchemy App and give it a name and description. "greeter" or "hello contract" will be good choices. Leave description blank if you don't want to provide any context about your web3 app.

Next, choose "Ethereum" chain and "Goerli" network and hit "Create App". Ethereum is the most popular blockchain for distributed apps (dApps) or web3 apps and [Goerli](https://goerli.net/) is a test network where $ETH crypto is not real. More on test networks later.

When a dashboard for your first Alchemy app will finish loading find "HTTP" value. It should be behind "API KEY" button. The value in "HTTP" field is your RPC server. RPC servers are your servers to send commands to blockchains with remote procedure calls (RPC).

For storing configuration variables, you will be using `.env` file. This file serves as a source of environment variables that will be used as dynamic part of your project configuration. Let's create it first.

    $ touch .env

_Read [12factor.net](https://12factor.net/config) to learn more about good practices of configuring your apps_

Then copy the value from "HTTP" field on Alcehmy dashboard and put it in the `.env` file with `GOERLI_RPC_URL` name

```
GOERLI_RPC_URL="https://eth-goerli.alchemyapi.io/v2/<here you will have your API key>"
```

Use the environment variable in the hadrdhat configuration file `hardhat.config.ts` like this:

```typescript
import * as dotenv from "dotenv";

// rest of imports omitted

dotenv.config();

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

_There is `dotenv.config()` call at the top of the hardhat config file that make available values from `.env` in the Node.JS `process.env` object_

## Getting ETH to testnet wallet

To make our contract available online we need to deploy and pay gas, blockchain fees for all sorts of transactions. Even in test networks, we need $ETH for deployments so we will need to get some. In Goerli network $ETH is not real, it is for testing and you can get it using so called _faucet_ that provides blockchain currencies in devnet and testnet.

We need a wallet to store $ETH. We can get a wallet by using [Metamask crypto wallet](https://metamask.io/) or by programmatically generating key pair of private and public keys. Metamask is just a user interface in a browser or in mobile phone that generates a key pair for you and allows convenient usage of keys.

For deployments, you will create a "wallet" programmatically. Don't worry you will create a Metamask wallet today, but for a different purpose.

We will practice Hardhat task to create a wallet.

Open `./hardhat.config.ts` and add a hardhat task with "createWallet" name. This task responsibility is to generate a new public, private keys and public address of a wallet.

```typescript
// define task with a name as 1st argument and handler function as the 2nd argument
task("createWallet", "print out address, public and private key", (_taskArgs, hre) => {
  const wallet = hre.ethers.Wallet.createRandom()
  console.log({
    address: wallet.address,
    publicKey: wallet.publicKey,
    privateKey: wallet.privateKey,
  })
})
```

The first argument to `task` function is a task name, the second is a description for the task, the third argument is task handler that contains the task code.

The exact place where to add the new task is not important, put it where you will likely to search for it when you will need to revisit the code of the task.

Now run the task and generate the keys and address.

    $ npx hardhat createWallet
    {
      address: <string of your address>,
      publicKey: <string of your wallet public key>,
      privateKey: <string of your private public key>,
    }

Keep your private key safe and do not share it with anyone. It is the key to your wallet those who owns it own the wallet content.

Add displayed values into `.env` file at that you created earlier.

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

Now it is time to put some $ETH into your new wallet.

Visit [https://goerlifaucet.com/](https://goerlifaucet.com/). This $ETH faucet is powered by Alchemy. You can transfer $ETH to your wallet by connecting your Alchemy account, entering your wallet address string into the address field that you got from the "createWallet" task and clicking "Send Me ETH". You will get 50,000,000 Gwei which is equal to 0.05 $ETH which will be enough for our tutorial.

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

    $ npx hardhat getBalance --address <address string from createWallet task> 

It must display "$ETH 0.05".

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

Note that `network` object in config must contain key with name equal to the value from `defaultNetwork`. "riikeby" in the example above.

I prefer to use "hardhat" network by default so every hardhat command or script that will be run will operate against "hardhat" network. This is safety measure, you won't spend real ETH on gas fees by running commands against "hardhat" network and won't accidentally publish a not ready for deployment contract.

You already added Goerli network configuration in the previous section with private key of a wallet that now has ETH to cover deployment gas fees. You are ready to deploy to the blockchain.

Hardhat advanced sample projects comes with a deploy script. This means you can make your contract will be live on Ethereum blockchain with the help of one command.

    $ npx hardhat run scripts/deploy.ts

The command above will deploy your `Greeting` contract to hardhat network that is running locally on your machine with one validator. The code will be compiled by the deploy script before the deployment.

In order to deploy to Goerli network you must specify the `--network` flag `--network goerli`.

    $ npx hardhat --network goerli run scripts/deploy.ts

As result commands above log to the console `<contract name> deployed to: <address string>` where `<contract name>` will be "Greeting" if you have not tweaked the sample contract and `<address string>` will be the address of the deployed contract on the chosen network, "hardhat" or "goerli".

To verify goerli deployment visit [goerli.etherscan.io](https://goerli.etherscan.io/) and paste `<address string>` from the command that deployed the contract to "goerli" network to the search field and hit enter.

On the opened page navigate to "Contract" tab. You should see the code of your contract from `./contracts/Greeting.sol` file.

## Interacting with contract

Install [Metamask wallet](https://metamask.io/download/) as a chrome extension or you can use any other compatible with Ethereum networks wallet.

As soon you have your wallet in your browser top up it with [goerlifaucet.com](https://goerlifaucet.com/). You know the drill, connect your Alchemy account, copy your address from chrome Metamask wallet and paste it into the wallet address field, and hit "Send me ETH".

Now you have funds to interact with your live contract on "Goerli" network.

Visit again your contract address on [goerli.etherscan.io](https://goerli.etherscan.io) navigate to "Contract" tab, "Read Contract" sub-tab, and unfold "1. greet". You most likely will see "Hello, Hardhat!" value. This is the value that was set during deployment in `scripts/deploy.ts` script. Congratulations, you've just read a value from your contract.

Now you will change the value. Open "Write Contract" sub-tab and unfold "setGreeting". In order to update `_greeting` value click "Connect - Web3" button slightly above the `_greeting` label. You might need to click "connect" button in the Metamask browser extension and agree.

_Subtle part, to see your balance in Goerli network you need to choose "Goerli Test Network" in the upper part of Metamask interface. Balances are separate for each network but you don't have to choose network in Metamask to interact with a particular network. Metamask wallet is smart enough to work with the network that your current web page works with._

When the wallet is connected paste a new value in the input slightly below the `_greeting` label and hit "Write" button. Sign a transaction in the wallet. You will pay some gas fees in Goerli ETH.

Metamask notification window will pop up. Make sure you read the content of transaction that you are going to confirm, this is a good habit. Only then hit confirm if you agree with what the transaction will do. In our case we will update `_greeting` value of the deployed contract.

Once the transaction is settled, you will see a confirmation navigate back to "Read Contract", unfold "1. greet" if it is not and you should see the hello message with the value you just sent to the Goerli Ethereum blockchain.

Congrats! You've successfully deployed Ethereum contract using Alchemy, Hardhat, and TypeScript.

## Other Hardhat commands

For your perspective here is an explanation of the other Hardhat commands:

Compile contract. Usually, you do not need it since you have `test` and `deploy` commands that do compile Solidity code into a deployable contract for you.

    $ npx hardhat compile

Clean cache and compiled code. Useful when you feel something weird is going on and hardhat commands do not work as expected.

    $ npx hardhat clean

See how many lines of your contracts code are covered by automated tests.

    $ npx hardhat coverage

