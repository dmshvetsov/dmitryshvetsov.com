import React from 'react'
import novelaTheme from '@narative/gatsby-theme-novela/src/gatsby-plugin-theme-ui'

/**
 * Paste in your SVG logo and return it from this component.
 * Make sure you have a height set for your logo.
 * It is recommended to keep the height within 25-35px.
 * Logo comes with a property value called `fill`. `fill` is useful
 * when you want to change your logo depending on the theme you are on.
 *
 * Read more https://github.com/narative/gatsby-theme-novela#adding-your-logo
 */
const Logo = (): JSX.Element => (
  <div style={{
    fontSize: '1.5em',
    fontWeight: '500',
    color: novelaTheme.colors.grey
  }}>
    ~ Dmitry Shvetsov
  </div>
)

export default Logo
