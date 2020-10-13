import * as React from 'react'
import { Helmet } from 'react-helmet'
import '../assets/tl101.css'
import bookCover from '../assets/tl101-cover.png'

const BuyButton = ({ style }: { style: Record<string, string>}): JSX.Element => (
  <div style={style}>
    <div style={{ marginBottom: '1em' }}>
      <a
        className="gumroad-button"
        href="https://gum.co/team-lead-101?wanted=true"
      >
        Get My Copy
      </a>
    </div>

    <p><i>You get PDF and ePUB ebook, You pay $28</i></p>
  </div>
);

const TeamLead101 = (): JSX.Element => {
  return (
    <div id="container">
      <Helmet>
        <title>Team Lead 101: How to Manage and Grow Engineering Teams in Small Startups</title>
        <meta
          name="description"
          content="A book for software engineers who have been entrusted to lead their teams but haven’t received a guide on how to do this."
        />
      </Helmet>
      <div className="formkit-page" style={{ backgroundColor: "#ffffff" }}>
        <div
          className="formkit-background"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#45556a",
            borderWidth: "10px",
            backgroundImage: "",
            opacity: 1,
          }}
        />
        <div className="formkit-container">
          <div className="formkit-page-header">
            <div className="formkit-image formkit-image formkit-column">
              <img src={bookCover} style={{ maxWidth: "100%" }} />
            </div>
            <div className="formkit-column">
              <h1
                className="formkit-header"
                style={{
                  color: "#41444b",
                  fontSize: "48px",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                Team Lead 101&nbsp;
                <br />
                <span style={{ fontSize: "24px" }}>
                  How to Manage and Grow Engineering Teams in Small Startups
                </span>
              </h1>
              <hr />
              <div className="formkit-subheader">
                <div
                  className="formkit-text"
                  style={{ color: "#52575d", fontSize: "23px" }}
                >
                  <p>
                    <em>
                      A book for software engineers who have been entrusted to lead their teams but haven’t received a guide on how to do this.
                    </em>
                  </p>
                </div>
                <p>107 pages of fundamental principles, tools and approaches to team leadership and project management</p>
                <BuyButton style={{ marginTop: '3em', marginBottom: '3em' }}/>
              </div>
            </div>
          </div>
          <div
            className="formkit-card"
            style={{ backgroundColor: "#41444b", borderRadius: "4px" }}
          >
            <div className="formkit-card-top">
              <h2
                className="formkit-content-header"
                style={{ color: "#ffffff", fontSize: "30px", fontWeight: 400 }}
              >
                This book is a leadership road map for software engineers who have been entrusted to lead their teams. It’s perfect for engineering teams of 3-8 people in small startups where the structure is flat with three or fewer levels: developers, leads, and C-level executives.
              </h2>
            </div>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                borderColor: "#dfdede",
                borderWidth: "1px",
              }}
              className="formkit-card-section"
            >
              <h2
                className="formkit-content-header"
                style={{ fontSize: "30px", fontWeight: 400 }}
              >
                Why do I need to read Team Lead 101?
              </h2>
              <div className="">
                <div
                  className="formkit-text "
                  style={{ fontSize: "18px" }}
                  id="892522"
                >
                  <p>I was so excited when I got my first assignment to team lead. I was a good programmer, I had proven my abilities and it felt great to be rewarded for it. Finally people were going to seek my advice and listen to it. The team would rally around me and function as a well-oiled machine to get the work done.</p>
                  <p>But it didn’t happen that way. My first three years as a team lead were fraught with frustration and disappointment. Mainly I was disappointed with myself. I was trying so hard but didn’t seem to be making any headway. Certainly not the progress I expected from myself.</p>
                  <p>Because I didn’t have good skills in place, I reverted back to ineffective behaviors like arguing, trying to prove myself right and grinding away to gain new hard skills that would make me more valuable to the company but did nothing to improve my management acumen.</p>
                  <p>Then I figured out I was lacking in soft skills. Empathy. Active listening. And I knew I’d have to develop these first if I wanted to make a true difference.</p>
                  <p>In Team Lead 101, I share the most useful tools and techniques I've developed working in management positions in small startups and large companies alike.</p>
                  <p>Our employers call on us to lead teams in the hopes that we will rise to lead, but they don’t always give us guidance about how to motivate, arbitrate disagreements, build processes and achieve goals. Being the leader means more than just being a good programmer in charge of the team. It means finding solutions to these challenges and more.</p>
                  <p>This is what you’ll learn from reading Team Lead 101.</p>
                </div>
              </div>
              <h2
                className="formkit-content-header"
                style={{ fontSize: "30px", fontWeight: 400 }}
              >
                Here’s what people have said about ‘Team Lead 101’
              </h2>
              <div className="">
                <div
                  className="formkit-text "
                  style={{ fontSize: "18px" }}
                  id="892522"
                >
                  <blockquote>
                    "I have read only half of the book and already realized how
                    sad it is that I didn't have it 4 years ago when I was told
                    that I'm tech lead! ... This book is a must-have [for
                    tech-leads] ... Exactly what you need in small startups."
                    <br />
                    <cite>
                      <a href="https://www.linkedin.com/in/smalljeeper/">
                        – Anton Kireev, Tech Lead at drom.ru
                      </a>
                    </cite>
                  </blockquote>
                  <blockquote>
                    "An excellent resource for all budding team leads... I got a
                    whole heap of tips to bring into my new gig."
                    <br />
                    <cite>
                      <a href="https://twitter.com/codingmindfully/status/1297791151911522305">
                        – Daragh Byrne, Software Engineering Manager at Digital
                        Creators
                      </a>
                    </cite>
                  </blockquote>
                  <blockquote>
                    "I like how the book is written. It is easy to read without
                    complicated terminology. I think not only team leads find
                    this book useful but SCRUM masters and agile coaches."
                    <br />
                    <cite>
                      <a href="https://www.linkedin.com/in/slavanikitin/">
                        – Slava Nikitin, Head of Corporate Development at Virto
                        Commerce
                      </a>
                    </cite>
                  </blockquote>
                  <blockquote>
                    "One will find not only valuable advice regarding strategies
                    to implement to lead a small team effectively, but will be
                    able to also understand the role a team leader plays in a
                    deeper way, which will lead to team happiness and
                    productivity."
                    <br />
                    <cite>
                      <a href="https://www.linkedin.com/posts/mihai-alina_team-lead-101-how-to-manage-and-grow-engineering-activity-6701033206243762176-_Jth">
                        – Alina Mihai, Life Coach and Front End Developer{" "}
                      </a>
                    </cite>
                  </blockquote>
                </div>
              </div>
              <BuyButton style={{ margin: '3em 0' }}/>
              <h2
                className="formkit-content-header"
                style={{ fontSize: "30px", fontWeight: 400 }}
              >
                30-Day money back guarantee
              </h2>
              <div className="">
                <div
                  className="formkit-text "
                  style={{ fontSize: "18px" }}
                  id="892522"
                >
                  <p>
                    If you’re not 100% satisfied with this book, just reply to the download email within 30 days from the purchase and you’ll get a full refund. No questions asked.
                  </p>
                </div>
              </div>
              <h2
                className="formkit-content-header"
                style={{ fontSize: "30px", fontWeight: 400 }}
              >
                Can I share this book with my team?
              </h2>
              <div className="">
                <div
                  className="formkit-text "
                  style={{ fontSize: "18px" }}
                  id="892522"
                >
                  <p>
                    The team license version can be shared with an unlimited number of people within a single team, class or organization. <a href="https://gumroad.com/l/team-lead-101">Buy a shareable team license version here</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="formkit-powered-by-convertkit-container">
          <span
            data-element="powered-by"
            data-variant="dark"
            style={{ textAlign: 'center', margin: '0 auto' }}
          >
            Dmitry Shvetsov – All Rights Reserved © 2020 | Zeiskaya, 4/2, 690005, Vladivostok, Russia
          </span>
        </div>
      </div>
    </div>
  );
}

export default TeamLead101
