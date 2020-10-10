import * as React from 'react'
import { Helmet } from 'react-helmet'
import '../assets/tl101.css'
import bookCover from '../assets/tl101-cover.png'

const BuyButton = ({ style }: { style: Record<string, string>}): JSX.Element => (
  <div style={style}>
    <a
      className="gumroad-button"
      href="https://gum.co/team-lead-101?wanted=true"
    >
      Buy 'Team Lead 101' eBook for $28
    </a>
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
                      A book for software engineers who have been entrusted to
                      lead their teams but haven’t received a guide on how to do
                      this.
                    </em>
                  </p>
                </div>
                <p>107 pages of fundamental principles, tools, and approaches to team leadership and project management</p>
                <BuyButton style={{ marginTop: '3em', marginBottom: '1.5em' }}/>
                <p><i>You will get PDF and ePub file.</i></p>
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
                This book is for software engineers who have been entrusted to
                lead their teams but haven’t received a guide on how to do this.
              </h2>
              <div className="formkit-content-subheader">
                <div
                  className="formkit-text "
                  style={{ color: "#d1dbe7", fontSize: "18px" }}
                  id="892522"
                >
                  <p>
                    It’s perfect for engineering teams of 3-8 people in small
                    startups, where the structure of startups is flat with at
                    most 3 levels: developers, leads, and C-level executives.
                  </p>
                </div>
              </div>
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
                Why this eBook?
              </h2>
              <div className="">
                <div
                  className="formkit-text "
                  style={{ fontSize: "18px" }}
                  id="892522"
                >
                  <p>
                    In the book, I share the most useful knowledge, mistakes,
                    tools, and techniques that I&apos;ve acquired working as a
                    Team Lead and Head of Department in a small consulting
                    workshop, large telecom company, Hong Kong, and Silicon
                    Valley startups.
                  </p>
                  <p>
                    We are given to lead a team in the hope that we will cope,
                    but we do not always have answers to questions on how to
                    motivate, arguing, build processes, and achieve goals. Being
                    a leader means finding answers to many of these questions.
                  </p>
                  <p>
                    I did not have such answers when I started and was
                    disappointed in myself because I didn&apos;t justify the
                    expectations of the team leader assigned to me. I
                    didn&apos;t understand what I was doing wrong.
                  </p>
                  <p>
                    This book is an attempt to answer all the basic questions
                    that a novice team leader may have.
                  </p>
                  <p>
                    I put my efforts to disclose topics simply, short, and to
                    the point, so you can acquire them in less time. This book
                    is just 106 pages long and will take two evenings to read
                    the book.
                  </p>
                </div>
              </div>
              <h2
                className="formkit-content-header"
                style={{ fontSize: "30px", fontWeight: 400 }}
              >
                Sample Chapters
              </h2>
              <div className="">
                <div
                  className="formkit-text "
                  style={{ fontSize: "18px" }}
                  id="892522"
                >
                  <p>Read sample chapters. No email required.</p>
                  <ul>
                    <li>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://dmitryshvetsov.com/what-a-good-team-lead-does-and-does-not-do/?utm_source=tl101-langing&utm_medium=website"
                      >
                        What a Good Team Lead Does and Doesn’t Do
                      </a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://dmitryshvetsov.com/one-on-one-meetings-the-most-important-tool-for-engineering-team-leader?utm_source=tl101-langing&utm_medium=website/"
                      >
                        1:1 Meetings
                      </a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://dmitryshvetsov.com/how-to-speed-up-code-review-process-and-improve-the-code-review-process?utm_source=tl101-langing&utm_medium=website/"
                      >
                        Code Review Time
                      </a>
                    </li>
                  </ul>
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
                Table of Contents
              </h2>
              <div className="">
                <div
                  className="formkit-text "
                  style={{ fontSize: "18px" }}
                  id="892522"
                >
                  <ol>
                    <li>
                      Becoming a Team Lead
                      <ol>
                        <li>What a Good Team Lead Does and Doesn’t Do</li>
                        <li>How Much Does a Team Lead Code?</li>
                        <li>Macro- and Micro-Management</li>
                        <li>Importance of Routine</li>
                      </ol>
                    </li>
                    <li>
                      Tools
                      <ol>
                        <li>Teammate Cards</li>
                        <li>1:1 Meetings</li>
                        <li>Retrospectives</li>
                        <li>Effective Meetings</li>
                        <li>Agile Board</li>
                        <li>Mini-Challenges</li>
                        <li>Planning Poker</li>
                        <li>Pair Programming</li>
                        <li>Document Processes</li>
                        <li>Team Journaling</li>
                      </ol>
                    </li>
                    <li>
                      Leadership
                      <ol>
                        <li>Five Stages of a Team</li>
                        <li>Listen</li>
                        <li>Nothing is Possible Without Belief</li>
                        <li>Clarity of Goals, Roles, and Values</li>
                        <li>How to Argue</li>
                        <li>Happiness Drives Success</li>
                        <li>Constructive Criticism and Influence</li>
                        <li>Strict but Fair</li>
                        <li>Purposeful Improvement</li>
                        <li>Healthy Stress</li>
                      </ol>
                    </li>
                    <li>
                      Achieving Goals
                      <ol>
                        <li>First Mistakes</li>
                        <li>Empower Developers</li>
                        <li>Code Review Time</li>
                        <li>Deep Work Time</li>
                        <li>Team Productivity</li>
                      </ol>
                    </li>
                    <li>
                      Increase Your Productivity
                      <ol>
                        <li>Establish a Base</li>
                        <li>Schedule Must-Do Activities</li>
                        <li>Schedule Productive Activities</li>
                        <li>Fix Broken-Up Days</li>
                        <li>Execute and Measure</li>
                        <li>Analyze and Repeat</li>
                      </ol>
                    </li>
                    <li>
                      Technical Interviews
                      <ol>
                        <li>Take-Home Challenge</li>
                        <li>Code Review Challenge</li>
                        <li>Pair Programming Challenge</li>
                        <li>Assess the Candidate Through Their Best Code</li>
                      </ol>
                    </li>
                  </ol>
                </div>
              </div>
              <h2
                className="formkit-content-header"
                style={{ fontSize: "30px", fontWeight: 400 }}
              >
                What if I didn&apos;t like the book?
              </h2>
              <div className="">
                <div
                  className="formkit-text "
                  style={{ fontSize: "18px" }}
                  id="892522"
                >
                  <p>
                    No worries! If you didn’t like the book, reply to the
                    download email within 30 days from the purchase, and
                    you&apos;ll get a full refund. No questions asked.
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
                    You cannot share an individual (single copy) purchase with
                    others. However, you can buy a shareable team license
                    version. The team license version can be shared with an
                    unlimited number of people within a single team, class, or
                    organization.
                  </p>
                </div>
              </div>
              <BuyButton style={{ margin: '3em 0' }} />
            </div>
          </div>
        </div>
        <div className="formkit-powered-by-convertkit-container">
          <a
            href="https://convertkit.com/?utm_source=dynamic&utm_medium=referral&utm_campaign=poweredby&utm_content=form"
            className="formkit-powered-by-convertkit"
            data-element="powered-by"
            data-variant="dark"
            target="_blank"
            rel="noreferrer"
          >
            Powered By ConvertKit
          </a>
        </div>
      </div>
    </div>
  );
}

export default TeamLead101
