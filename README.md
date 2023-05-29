# Personal web site

[dmitryshvetsov.com](https://dmitryshvetsov.com)

## Content

Some publications are timeless and can be updated with additional thoughts or improved over time, this kind of publications should not have a published date but need last updated date. This is more like how to content or tutorials like.

 Some publications are time sensitive and require published date and disclaimer that it is what I thought at that point in time.

 Shorts are like short YouTube videos intended to grow content with less effort and try ideas quickly.

 All post have twitter search link where visitors can see tweets about article, comments and discussions.

## Releasing updates

Publish changes in the apps if any. This process is manual for now.

    $ cd apps && yarn build && yarn inject

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
