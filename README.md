# Personal web site

[dmitryshvetsov.com](https://dmitryshvetsov.com)

## Releasing updates

Publish changes in the apps if any. This process is manual for now.

    $ cd apps && yarn publish

Then commit changes to the main branch. Cloudflare will build and deploy Zola static site to [dmitryshvetsov.com](dmitryshvetsov.com).

## Updating content

Up to date content has a link without a date e.g. `/how-to-mint-nft-on-solana`. To update article make a copy of old version with a timestamp `/how-to-mint-nft-on-solana-2022-12-11`, updated content should be available under untimestamped URL `/how-to-mint-nft-on-solana`

## Built with

- [Rust lang](https://www.rust-lang.org)
- [Zola static site generator](https://www.getzola.org)
- [Cloudflare pages](https://pages.cloudflare.com)
- React
- Vite
- yarn
