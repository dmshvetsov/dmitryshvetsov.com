module.exports = {
  siteMetadata: {
    title: 'Dmitry Shvetsov, Upbeat Software Developer and Mentor.',
    name: 'Dmitry Shvetsov',
    siteUrl: 'https://dmitryshvetsov.com',
    description: 'Free online mentorship calls. I help novice developers gain experience and write good code.',
    hero: {
      heading: 'Become A Better Software Developer',
      maxWidth: '100%'
    },
    social: [
      {
        name: 'twitter',
        url: 'https://twitter.com/iamdidev'
      }
    ]
  },
  plugins: [
    {
      resolve: '@narative/gatsby-theme-novela',
      options: {
        contentPosts: 'content/posts',
        contentAuthors: 'content/authors',
        basePath: '/',
        authorsPage: true,
        sources: {
          local: true
          // contentful: true,
        }
      }
    },
    {
      // PWA plugin
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Dmitry Shvetsov',
        short_name: 'D. Shvetsov',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        icon: 'src/assets/favicon.png'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'mdPages',
        path: `${__dirname}/src/md-pages/`
      }
    },
    'gatsby-plugin-sitemap'
  ]
}
