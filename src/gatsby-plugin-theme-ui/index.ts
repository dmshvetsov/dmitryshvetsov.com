import novelaTheme from '@narative/gatsby-theme-novela/src/gatsby-plugin-theme-ui'

// Defaults https://github.com/narative/gatsby-theme-novela/tree/master/%40narative/gatsby-theme-novela/src/gatsby-plugin-theme-ui

const tags = {
  pre: {
    variant: 'prism',
    fontFamily: '"Operator Mono", monospace',
    tabSize: 4,
    hyphens: 'none',
    color: 'white',
    bg: 'prism.background',
    overflow: 'auto',
    borderRadius: 10,
    p: 3
  },
  code: {
    fontFamily: '"Operator Mono", monospace',
    fontSize: 'inherit'
  },
  inlineCode: {
    borderRadius: '0.3em',
    color: 'secondary',
    bg: 'rgba(233, 218, 172, 0.3)',
    paddingTop: '0.15em',
    paddingBottom: '0.05em',
    paddingX: '0.2em'
  }
}

const colors = {
  ...novelaTheme.colors,
  background: '#fff'
}

export default {
  ...novelaTheme,
  tags,
  colors
}
