+++
title = "\"Not your keys, not your crypto\" is actually not the full truth in Ethereum ecosystem"
slug = "erc-20-allowance-problem"
author = "Dmitry Shvetsov"
date = "2023-06-27"
+++

Would you give someone unrestricted access to part of your capital?

I would not. Then why do we do it in Ethereum ecosystem and considering it a standard?

To use ERC-20 tokens in DeFi protocols such as Sushiswap you must approve DApp to spend tokens on your behalf - known as an allowance. In simple words, unlimited access to the allowed amount of your asset.

Some time ago smart contract developers come up with tiny additional standard to ERC-20 that allows DApps to ask for unlimited allowance for your tokens which "enables" ordinary users to lose everything.

Ordinary users tend to listen what other saying and people tend to say "funds in a wallet". That's wrong. Crypto assets such as tokens, native coins, and NFTs are on-chain and your wallet is the key to do stuff on-chain.

And here is the key idea: **"not your keys, not your crypto" is actually not the full truth in EVM ecosystem.** ERC-20 allowance means you grant full rights to use your crypto to an approved contract – known as a spender.

Recent bug in Sushi swap new v2 smart contract [led to an exploit](https://twitter.com/jaredgrey/status/1644914375151550464) [twitter link] and users were asked to revoke allowances to secure their crypto

**If you think hardware wallets are the solution to the allowance problem, they are not.** With an allowance an approved spender can use tokens associated with your address without your keys anytime they want to.

There are some solutions like approve-spend patterns, which result in more fees. This creates another problem because gas is not cheap in Ethereum ecosystem even in L2.

Gasless spend approval ERC-2612 is another solution to the allowance problem but you have to sign an additional transaction. Uniswap recently came up with Permit2 solution when you need to approve just once for any token in their app.

Newer ERC-1155 standard only amplify the problem. ERC-1155 contracts may have more than one asset in a single contract and do have a function to delegate right to transfer all assets without any limits.

ERC-20 allowance mechanism cannot be the future of finance for the masses. We need better technology but while we build it use the amazing [Revoke.cash web app](https://revoke.cash) to revoke risky allowances and [is my crypto wallet safe app](https://dmitryshvetsov.com/apps/is-my-crypto-wallet-safe/) to check if you have allowances in hacked smart contracts.

**You can help and contribute** by reporting hacked smart contracts to me on twitter or submitting a pull request to the list of hacked smart contracts repository [https://github.com/dmshvetsov/hacked-smart-contracts](https://github.com/dmshvetsov/hacked-smart-contracts)
