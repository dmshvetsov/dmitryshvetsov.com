+++
title = "How to fix solana program build error: requires newer rustc"
slug = "how-to-fix-solana-program-cannot-be-build-requires-newer-rustc"
author = "Dmitry Shvetsov"
date = "2023-09-30"
+++

When you make a build of your Solana program with `cargo build-sbf` or `cargo build-bpf` or `anchor build` it fails with an error that suggests that you have old `rustc` than required.

```
$ cargo build-sbf
error: package `solana-program v1.16.14` cannot be built because it requires rustc 1.68.0 or newer, while the currently active rustc version is 1.62.0-dev
```

It is confusing, especially if you are a Rust developer and uses one of the latest version of `rustc`.

```
rustc -V
rustc 1.72.0 (5680fa18f 2023-08-23)
```

_By the way, if you are using `build-bpf`, it is deprecated, and it is better to switch to `build-sbf`. Here and after I continue to use `build-sbf` version and the same applies to `build-bpf` command._

## What's the problem

When you use `cargo build-sbf` it uses `rustc` installed with Solana tools.

## How to fix

Install newer Solana tools

    $ solana-install init 1.16.15

In case if you do not have `solana-install` CLI utility you can install it on MacOS & Linux with the command:

    $ sh -c "$(curl -sSfL https://release.solana.com/v1.16.15/install)"

or on Windows with the command:

    $ cmd /c "curl https://release.solana.com/v1.16.15/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
