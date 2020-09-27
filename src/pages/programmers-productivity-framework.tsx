import * as React from 'react'
import Layout from '@narative/gatsby-theme-novela/src/components/Layout'
import Section from '@narative/gatsby-theme-novela/src/components/Section'
import SEO from '@narative/gatsby-theme-novela/src/components/SEO'
import Headings from '@narative/gatsby-theme-novela/src/components/Headings'
import ConvertKitForm from 'convertkit-react'
import forms from '../forms'

const PageProductivityFramework = (): JSX.Element => {
  return (
    <Layout>
      <SEO />
      <Section>
        <div style={{ marginTop: "100px" }}>
          <Headings.h1 style={{ marginBottom: "1em" }}>
            Get Your Free Copy of the Productivity Framework
          </Headings.h1>
          <p style={{ marginBottom: "2em" }}>
            Weekly Productivity Framework for programmer will help you design
            your weeks and days for effortless execution.
          </p>
          <ConvertKitForm {...forms.PRODUCTIVITY_FRAMEWORK} />
          <p style={{ marginBottom: "2em" }}>
            I use a 6-step personal productivity framework to plan my days for
            effortless execution. With the framework, you will batch as many
            activities as possible into once-a-week or once-a-day blocks.
          </p>
          <p style={{ marginBottom: "2em" }}>
            This framework is intended to maximize the productivity of a single
            week via planning for effortless execution. It also implements
            retrospectives to replace what isn’t working.
          </p>
          <p style={{ marginBottom: "2em" }}>
            I’ve used this framework when I’ve worked in an office and also
            remotely. It has even worked for when I changed time zones relative
            to the executives and my teammates. All I need to do is reiterate
            through 6 steps to fit together all the essential pieces that make
            me productive.
          </p>
          <p style={{ marginBottom: "2em" }}>
            This can be applied to a 40-hours-a-week plan or fewer hours. I
            would not recommend creating a plan with this framework for a
            workweek that’s more than 48 hours because getting enough rest is
            also an important part of productivity.
          </p>
        </div>
      </Section>
    </Layout>
  );
}

export default PageProductivityFramework
