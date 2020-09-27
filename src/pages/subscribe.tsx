import * as React from 'react'
import Layout from '@narative/gatsby-theme-novela/src/components/Layout'
import Section from '@narative/gatsby-theme-novela/src/components/Section'
import SEO from '@narative/gatsby-theme-novela/src/components/SEO'
import Headings from '@narative/gatsby-theme-novela/src/components/Headings'
import ConvertKitForm from 'convertkit-react'
import forms from '../forms'

const PageSubscribe = (): JSX.Element => {
  return (
    <Layout>
      <SEO />
      <Section>
        <div style={{ marginTop: "100px" }}>
          <Headings.h1 style={{ marginBottom: '1em' }}>Subscribe</Headings.h1>
          <p style={{ marginBottom: '2em'}}>
            Each week, I send one letter of programming wisdom and one letter
            with ideas on how to advance your career with improving your
            soft-skills and design good software.
          </p>
          <p style={{ display: 'flex', alignItems: 'center', marginBottom: '2em' }}>
            <div style={{marginRight: '1.22em'}}>Featured on:</div>
            <a style={{marginRight: '0.915em'}} href="https://twitter.com/search?q=from%3A%40ThePracticalDev%20%7B%20author%3A%20%20%40iamdidev%20%20%7D&src=typed_query" target="_blank" rel="noopener noreferrer"><img loading="lazy" alt="dev.to community icon" width={50} height={50} src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDMyIDQ0Ny45OTk5OTk5OTk5OTk5NCA0NDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI1MDAiIGhlaWdodD0iMjMyMSI+PHBhdGggZD0iTTEyMC4xMiAyMDguMjljLTMuODgtMi45LTcuNzctNC4zNS0xMS42NS00LjM1SDkxLjAzdjEwNC40N2gxNy40NWMzLjg4IDAgNy43Ny0xLjQ1IDExLjY1LTQuMzVzNS44Mi03LjI1IDUuODItMTMuMDZ2LTY5LjY1Yy0uMDEtNS44LTEuOTYtMTAuMTYtNS44My0xMy4wNnpNNDA0LjEgMzJINDMuOUMxOS43IDMyIC4wNiA1MS41OSAwIDc1Ljh2MzYwLjRDLjA2IDQ2MC40MSAxOS43IDQ4MCA0My45IDQ4MGgzNjAuMmMyNC4yMSAwIDQzLjg0LTE5LjU5IDQzLjktNDMuOFY3NS44Yy0uMDYtMjQuMjEtMTkuNy00My44LTQzLjktNDMuOHpNMTU0LjIgMjkxLjE5YzAgMTguODEtMTEuNjEgNDcuMzEtNDguMzYgNDcuMjVoLTQ2LjRWMTcyLjk4aDQ3LjM4YzM1LjQ0IDAgNDcuMzYgMjguNDYgNDcuMzcgNDcuMjh6bTEwMC42OC04OC42NkgyMDEuNnYzOC40MmgzMi41N3YyOS41N0gyMDEuNnYzOC40MWg1My4yOXYyOS41N2gtNjIuMThjLTExLjE2LjI5LTIwLjQ0LTguNTMtMjAuNzItMTkuNjlWMTkzLjdjLS4yNy0xMS4xNSA4LjU2LTIwLjQxIDE5LjcxLTIwLjY5aDYzLjE5em0xMDMuNjQgMTE1LjI5Yy0xMy4yIDMwLjc1LTM2Ljg1IDI0LjYzLTQ3LjQ0IDBsLTM4LjUzLTE0NC44aDMyLjU3bDI5LjcxIDExMy43MiAyOS41Ny0xMTMuNzJoMzIuNTh6Ii8+PC9zdmc+" /></a>
            <a href="https://medium.com/better-programming/22-things-you-should-give-up-if-you-want-to-be-a-successful-developer-aaee8699185c" target="_blank" rel="noopener noreferrer"><img loading="lazy" alt="Better Programming Medium publication logo" width={50} height={50} style={{height: '50px'}} src="data:image/svg+xml,%3Csvg width='77' height='102' viewBox='0 0 77 102' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M52.5 0H0V63H52.5H54V62.9419C66.8324 61.9455 77 48.2494 77 31.5C77 14.7506 66.8324 1.05455 54 0.058075V0H52.5Z' fill='%2300E691'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M52.5 39H0V102H52.5H54V101.942C66.8324 100.945 77 87.2494 77 70.5C77 53.7506 66.8324 40.0545 54 39.0581V39H52.5Z' fill='%2300E645'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M71.7424 51C67.5454 44.163 61.1911 39.6165 54 39.0581V39H52.5H0V63H52.5H54V62.9419C61.1911 62.3835 67.5454 57.837 71.7424 51Z' fill='%231A9AA0'/%3E%3C/svg%3E%0A" /></a>
          </p>
          <ConvertKitForm {...forms.DEDICATED_SUBSCRIBE} />
        </div>
      </Section>
    </Layout>
  );
}

export default PageSubscribe
