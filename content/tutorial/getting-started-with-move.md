+++
title = "[WIP] Tutorial: getting started with Move programming language (Mac OS)"
draft = true
date = '2999-12-31'
+++

TODO create a separate page that explains syntax used in all my tutorials, like what `$` sign in code example

if you brand new developer, congrats make sure esential tools are installed

    $ brew install git curl

## prepare

install rust

make sure clippy installed, otherwiseo

    $ rustup update && rustup component add clippy

dependencies for move and move-analyzer

    $ git clone --depth 1 move-language/move repository FIXME

run

    $ ./scripts/dev_setup.sh

or install dependencies manually

    $ brew install cmake

    $ brew install openssl

    $ brew install pkg-config

Only if for Aptos, then install (for what it is needed? in what cases need to be installed)

    $ (cd /usr/local && curl -LOs https://github.com/protocolbuffers/protobuf/releases/download/v23.3/protoc-23.3-osx-universal_binary.zip)
    $ unzip -o "protoc-23.3-osx-universal_binary.zip" -d /usr/local bin/protoc
    $ unzip -o "protoc-23.3-osx-universal_binary.zip" -d /usr/local 'include/*'
    $ chmod +x "/usr/local/bin/protoc"

dependencies for Move Prover

    $ brew install z3

    $ brew tap cvc5/cvc5

    $ brew install --cask dotnet

after dotnet is installed

    $ dotnet tool install --global boogie

, make sure folder $HOME/bin exists

    $ cd $HOME/bin

or create it if it does not exists

    $ mkdir $HOME/bin

get cvc5 binaries

    $ (cd $HOME/bin && curl -LOs https://github.com/cvc5/cvc5/releases/download/cvc5-1.0.5/cvc5-macOS && mv cvc5-macOS cvc5 && chmod +x cvc5)

or for linux

    $ (cd $HOME/bin && curl -LOs https://github.com/cvc5/cvc5/releases/download/cvc5-1.0.5/cvc5-Linux && mv cvc5-Linux cvc5 && chmod +x cvc5)

compile cvc5 from source

    $ git clone --depth 1 git@github.com:cvc5/cvc5.git

    $ cd cvc5

    $ ./configure.sh

    $ cd ./build

    $ make

    $ make check

    $ make install

make sure i didn't get any errors in previous 5 commands

sidenote
```
./configure.sh
    # use --prefix to specify an install prefix (default: /usr/local)
    # use --name=<PATH> for custom build directory
    # use --auto-download to download and build missing, required or
    #   enabled, dependencies
cd <build_dir>   # default is ./build
make             # use -jN for parallel build with N threads
make check       # to run default set of tests
make install     # to install into the prefix specified above
```
add these env vars to your profile `./profile` `.zshrc` or fish rc


```
  mkdir -p "${BIN_DIR}"
  if [ -n "$CARGO_HOME" ]; then
    add_to_profile "export CARGO_HOME=\"${CARGO_HOME}\""
    add_to_profile "export PATH=\"${BIN_DIR}:${CARGO_HOME}/bin:\$PATH\""
  else
    add_to_profile "export PATH=\"${BIN_DIR}:${C_HOME}/bin:\$PATH\""
  fi
  if [[ "$INSTALL_PROTOC" == "true" ]]; then
    add_to_profile "export PATH=\$PATH:/usr/local/include"
  fi
  if [[ "$INSTALL_PROVER" == "true" ]]; then
    add_to_profile "export DOTNET_ROOT=\"${DOTNET_ROOT}\""
    add_to_profile "export PATH=\"${DOTNET_ROOT}/tools:\$PATH\""
    add_to_profile "export Z3_EXE=\"${BIN_DIR}/z3\""
    add_to_profile "export CVC5_EXE=\"${BIN_DIR}/cvc5\""
    add_to_profile "export BOOGIE_EXE=\"${DOTNET_ROOT}/tools/boogie\""
  fi
  add_to_profile "export SOLC_EXE=\"${BIN_DIR}/solc\""

```

## install move-analyzer







# simplest solution

https://overmind-xyz.notion.site/Setup-Move-Environment-790203b5bfc046709f7dd2ad11998401

and

    $ cargo install --git https://github.com/aptos-labs/aptos-core.git move-analyzer







## guide from move repo

source https://github.com/move-language/move/tree/main/language/documentation/tutorial#step-0-installation


```
❯ ./scripts/dev_setup.sh -ypt
mkdir: /Users/dima/bin: No such file or directory
Welcome to Move!

This script will download and install the necessary dependencies needed to
build and run Move.

Based on your selection, these tools will be included:
Build tools (since -t or no option was provided):
  * Rust (and the necessary components, e.g. rust-fmt, clippy)
  * CMake
  * Clang
  * pkg-config
  * libssl-dev
  * if linux, gcc-powerpc-linux-gnu
  * NodeJS / NPM
Move prover tools (since -y was provided):
  * z3
  * cvc5
  * dotnet
  * boogie
Moreover, ~/.profile will be updated (since -p was provided).
If you'd prefer to install these dependencies yourself, please exit this script
now with Ctrl-C.
Proceed with installing necessary dependencies? (y/N) >
```

## see what else might be helpful to install

[scripts/dev_setup.sh](https://github.com/move-language/move/blob/main/scripts/dev_setup.sh)



## can it all be condensed to installing aptos cli with homebrew?

will it work for move-analyzer?

## do we need to isntall move from aptos-core repo if I want to work with Aptos?

```
cd aptos-core/scripts
❯ ./dev_setup.sh -ypt
Welcome to Aptos!

This script will download and install the necessary dependencies needed to
build, test and inspect Aptos Core.

Based on your selection, these tools will be included:
Build tools (since -t or no option was provided):
  * Rust (and the necessary components, e.g. rust-fmt, clippy)
  * CMake
  * Clang
  * grcov
  * lcov
  * pkg-config
  * libssl-dev
  * protoc (and related tools)
  * lld (only for Linux)
Move prover tools (since -y was provided):
  * z3
  * cvc5
  * dotnet
  * boogie
Moreover, ~/.profile will be updated (since -p was provided).
If you'd prefer to install these dependencies yourself, please exit this script
now with Ctrl-C.
Proceed with installing necessary dependencies? (y/N) > N
Exiting...
```

## how about SUI
