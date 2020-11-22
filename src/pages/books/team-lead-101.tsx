import * as React from 'react'
import { Helmet } from 'react-helmet'
import sample from 'lodash/sample'
import classLister from '../../helpers/classes'
import style from '../tl101-css-modules.module.sass'
import bookCover from '../../assets/tl101-cover.png'
import firebase from 'gatsby-plugin-firebase'

const GUMROAD_PRODUCT_LINK = "https://gum.co/team-lead-101"
const GUMROAD_BUY_LINK = `${GUMROAD_PRODUCT_LINK}?wanted=true`
const EVENT = Object.freeze({
  BUY_CLICK: 'buy_click'
})

const TITLES = [
  // "An simple and proven way to become better at managing engineers and ?? smt to avoid",
  "35 Proven Secrets on How To Build A Strong, Close-knit Team",
  "35 Secrets To Build Team That getting Thing Done...",
  "Everyone Has a Leader Inside Of Them...",
  "You are Team Lead Now, But Why Do You Feel So Bad?",
  "Why are Some Engineers Unable Find a Way To Become a Team Lead and Others Who Become a Team Lead are Overworked and Drive Crazy"
]

const classes = classLister(style)

const GumroadBuyButton = ({
  buttonId,
  context = {}
}: {
  buttonId: string,
  context: Record<string, unknown>
}): JSX.Element => {
  return (
    <button
      type="button"
      className={style.buyButton}
      onClick={() => {
        firebase.analytics().logEvent(EVENT.BUY_CLICK, {
          ...context,
          button_id: buttonId
        })
        window.location.href = GUMROAD_BUY_LINK
      }}
    >
      Click Here to Buy Now on Gumroad
    </button>
  );
}

/**
 * Team Lead 101 landing, version A2.0
 * `A` stands for "Atomic [Habits]", this landing design is based on Atomic
 * Habits book langing https://jamesclear.com/atomic-habits
 *
 */
const AtomicTeamLead101 = (): JSX.Element => {
  const randomTitle = sample(TITLES)
  const experiment = {
    page_header: randomTitle
  }

  return (
    <div className={style.contentContainer}>
      <Helmet>
        <title>Team Lead 101 | {randomTitle} A2</title>
        <meta
          name="description"
          content="A book for software engineers who have been entrusted to lead their teams but haven’t received a guide on how to do this."
        />
      </Helmet>
      <header className={style.headline}>{randomTitle}</header>
      <div className={style.headerContainer}>
        <div className={style.bookCoverContainer}>
          <img
            className={style.bookCover}
            src={bookCover}
            alt="Team Lead 101 book cover"
          />
        </div>
        <div className={style.bookPitchContainer}>
          <h1 className={style.bookTitle}>
            Team Lead 101:{" "}
            How to Manage and Grow Engineering Teams in Small Startups
          </h1>
          <p>
            A book for software engineers who have been entrusted to lead their
            teams but haven’t received a guide on how to do this.
          </p>

          <div className={classes('bookFeaturedReview')}>
            <div className={classes('bookReviewRating')}>★ ★ ★ ★ ★</div>
            <strong><i>"An excellent resource for all budding team leads... I got a whole heap of tips to bring into my new gig."</i></strong>
            <br/>
            <br/>
            – Daragh Byrne, Software Engineering Manager at Digital Creators
          </div>
        </div>
      </div>
      <section className={classes('contentSection', 'ctaSection')}>
        <h2 className={style.subHeadline}>
          Get Your Copy of `Team Lead 101`...
        </h2>
        <GumroadBuyButton buttonId="immediate-button" context={experiment} />
      </section>
      <section className={style.contentSection}>
        <h2 className={style.subHeadline}>
          107 pages of fundamental principles, tools and approaches to team leadership and project management
        </h2>
        5 Things This Book Will Teach You:
        <ul className={style.bulletList}>
          <li>
            Understand <b>what distinguishes a good team lead from a bad one</b>{" "}
            so you're able to <b>avoid repeating the same mistakes </b> almost
            every aspiring team leader making (including me 9 years ago).
          </li>
          <li>
            Learn the{" "}
            <b>tools which helps you save more time and get better results</b>{" "}
            while solving the most common team management tasks ... you can
            benefit from the best practices of results-oriented team leaders.
          </li>
          <li>
            Learn the fundamental principles of leadership which let you{" "}
            <b>take the actions that are right</b> for the team and its members
            so you can discover your own personal pathway to <b>becoming
            a person teammates want to follow</b>.
          </li>
          <li>
            Find out <b>what can prevent your team from achieving its goals</b>{" "}
            so you're able to use your team's exact strengths and know areas for
            improvement which means you can{" "}
            <b>realize your team's unique potential</b> and surpass the goals
            faster.
          </li>
          <li>
            Learn frameworks and practices for{" "}
            <b>increasing your personal and team productivity</b> and how you
            can <b>overcome unproductive day to day busy-ness</b> which means
            you can find more <b>time to do the really important things</b>.
          </li>
        </ul>
      </section>
      <section className={style.contentSection}>
        <h2 className={style.subHeadline}>100% Guaranteed</h2>
        <p>
          I 100% guarantee that you'll love this book, or I'll return your money and let you keep the book anyway.
        </p>
        <p>
          Just reply to the download email within 30 days from the purchase and I’ll give you back your money with no questions asked.
        </p>
      </section>
      <section className={style.contentSection}>
        <h2 className={style.subHeadline}>
          But don't just take my word for it... take a look at these
          testimonials and reviews from happy software developers, tech and team
          leads just like you!
        </h2>
        <blockquote className={style.blockquote}>
          "I have read only half of the book and already realized how sad it is
          that I didn't have it 4 years ago when I was told that I'm tech lead!
          ... This book is a must-have [for tech-leads] ... Exactly what you
          need in small startups."
          <cite>
            – Anton Kireev, Tech Lead at drom.ru
          </cite>
        </blockquote>
        <blockquote className={style.blockquote}>
          "An excellent resource for all budding team leads... I got a whole
          heap of tips to bring into my new gig."
          <cite>
            – Daragh Byrne, Software Engineering Manager at Digital Creators
          </cite>
        </blockquote>
        <blockquote className={style.blockquote}>
          "I like how the book is written. It is easy to read without
          complicated terminology. I think not only team leads find this book
          useful but SCRUM masters and agile coaches."
          <cite>
            – Slava Nikitin, Head of Corporate Development at Virto Commerce
          </cite>
        </blockquote>
        <blockquote className={style.blockquote}>
          "One will find not only valuable advice regarding strategies to
          implement to lead a small team effectively, but will be able to also
          understand the role a team leader plays in a deeper way, which will
          lead to team happiness and productivity."
          <cite>
            – Alina Mihai, Life Coach and Front End Developer{" "}
          </cite>
        </blockquote>
      </section>
      <section className={style.contentSection}>
        <GumroadBuyButton
          buttonId="after-testimonials-button"
          context={experiment}
        />
      </section>
      <hr/>
      <footer className={classes('contentSection', 'footer')}>Dmitry Shvetsov (Sole proprietorship) – All Rights Reserved © 2020 | Zeiskaya, 4/2, 690005, Vladivostok, Russia </footer>
    </div>
  );
}

export default AtomicTeamLead101
