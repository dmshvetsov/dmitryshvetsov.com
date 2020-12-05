require('dotenv').config()

module.exports = {
  siteMetadata: {
    title: 'Dmitry Shvetsov, Software Developer and Mentor.',
    name: 'Dmitry Shvetsov',
    siteUrl: 'https://dmitryshvetsov.com',
    description: 'Read about programming, ruby, javascript, typescript, productivity, mindset, and how to lead teams',
    hero: {
      heading: 'A Place to Read About Productivity, Mindset, How to Lead Teams, and Solving Problems With Technologies',
      maxWidth: '100%'
    },
    social: [
      {
        name: 'twitter',
        url: 'https://twitter.com/dmshvetsov'
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
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        // This will be available in the next version of the plugin
        // features: {
        //   auth: false,
        //   database: true,
        //   firestore: false,
        //   storage: true,
        //   messaging: false,
        //   functions: false,
        //   performance: true,
        //   analytics: true,
        // },
        credentials: {
          apiKey: process.env.GATSBY_FIREBASE_API_KEY,
          authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
          databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
          projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
          storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.GATSBY_FIREBASE_APP_ID,
          measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID
        }
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ['congratulations', 'download-your-productivity-framework']
      }
    },
    'gatsby-plugin-sass'
  ]
}
