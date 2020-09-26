import React, { useRef, useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import styled from '@emotion/styled'
// import throttle from 'lodash/throttle'
// import { graphql, useStaticQuery } from 'gatsby'
// import get from 'lodash/get'

import Headings from '@narative/gatsby-theme-novela/src/components/Headings';
import Layout from '@narative/gatsby-theme-novela/src/components/Layout'
import MDXRenderer from '@narative/gatsby-theme-novela/src/components/MDX'
import SEO from '@narative/gatsby-theme-novela/src/components/SEO'
// import Progress from '@components/Progress'
// import Section from '@components/Section'

import mediaqueries from '@styles/media'
// import { debounce } from '@utils'

// import ArticleAside from '../sections/article/Article.Aside'
// import ArticleHero from '../sections/article/Article.Hero'
// import ArticleControls from '../sections/article/Article.Controls'
// import ArticlesNext from '../sections/article/Article.Next'
// import ArticleSEO from '../sections/article/Article.SEO'
// import ArticleShare from '../sections/article/Article.Share'
// import ArticleFooter from './article.footer.template'

import { Template } from '@types'

export const query = graphql`
  query PageQuery($slug: String!) {
    page: mdx(slug: { eq: $slug}) {
      body
      frontmatter {
        title
        date
        description
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`

const Page: Template = (props) => {
  const { location, data: { site, page: { frontmatter, body } } } = props

  return (
    <Layout>
      <SEO
        authorName="Dmitry Shvetsov"
        canonicalUrl={site.siteMetadata.siteUrl + location.pathname}
        dateforSEO={frontmatter.date}
        // image={imagelocation}
        description={frontmatter.description}
        isBlogPost={false}
        articlepathName={site.siteMetadata.siteUrl + location.pathname}
        published={frontmatter.date}
        title={frontmatter.title}
        // isSecret={frontmatter.secret}
      >
      </SEO>
      <Hero>
        <Header>
          <HeroHeading>{frontmatter.title}</HeroHeading>
        </Header>
      </Hero>
      <PageBody>
        <MDXRenderer content={body} />
      </PageBody>
    </Layout>
  )
}

const PageBody = styled.acticle`
  position: relative;
  padding: 160px 0 35px;
  padding-left: 68px;
  transition: background 0.2s linear;
  ${mediaqueries.desktop`
    padding-left: 53px;
  `}

  ${mediaqueries.tablet`
    padding: 70px 0 80px;
  `}
  ${mediaqueries.phablet`
    padding: 60px 0;
  `}
`

const Hero = styled.div`
  ${p => mediaqueries.phablet`
    &::before {
      content: "";
      width: 100%;
      height: 20px;
      background: ${p.theme.colors.primary};
      position: absolute;
      left: 0;
      top: 0;
      transition: ${p.theme.colorModeTransition};
    }
    &::after {
      content: "";
      width: 100%;
      height: 10px;
      background: ${p.theme.colors.background};
      position: absolute;
      left: 0;
      top: 10px;
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
      transition: ${p.theme.colorModeTransition};
    }
  `}
`
const Header = styled.header`
  position: relative;
  z-index: 10;
  margin:100px auto 120px;
  padding-left: 68px;
  max-width: 749px;
  ${mediaqueries.desktop`
    padding-left: 53px;
    max-width: calc(507px + 53px);
    margin: 100px auto 70px;
  `}
  ${mediaqueries.tablet`
    padding-left: 0;
    margin: 100px auto 70px;
    max-width: 480px;
  `}
  ${mediaqueries.phablet`
    margin: 170px auto 180px;
    padding: 0 40px;
  `}
  @media screen and (max-height: 700px) {
    margin: 100px auto;
  }
`

const HeroHeading = styled(Headings.h1)`
  font-size: 48px;
  font-family: ${p => p.theme.fonts.serif};
  margin-bottom: 25px;
  font-weight: bold;
  line-height: 1.32;
  ${mediaqueries.tablet`
    margin-bottom: 20px;
    font-size: 36px;
  `}
  ${mediaqueries.phablet`
    font-size: 32px;
  `}
`;

export default Page
