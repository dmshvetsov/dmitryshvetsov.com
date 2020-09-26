exports.createPages = async ({ actions, reporter, graphql }) => {
  const blogPostTemplate = require.resolve('./src/templates/page.template.tsx')
  const result = await graphql(`
    {
      allFile(filter: {sourceInstanceName: {eq: "mdPages"}}) {
        edges {
          node {
            mdPage: childMarkdownRemark {
              frontmatter {
                slug
              }
            }
          }
        }
      }
    }
  `)
  reporter.info(`Creating MD pages ${result.data.allFile.edges.length}`)
  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.')
    return
  }
  result.data.allFile.edges.forEach(({ node }) => {
    const { mdPage } = node
    actions.createPage({
      path: mdPage.frontmatter.slug,
      component: blogPostTemplate,
      context: {
        slug: mdPage.frontmatter.slug
      }
    })
  })
}
