import * as React from 'react'
import { Helmet } from 'react-helmet'
import style from '../tl101-css-modules.module.sass'
import bookCover from '../../assets/tl101-cover.png'

const AtomicTeamLead101 = (): JSX.Element => {
  return (
    <div className={style.contentContainer}>
      <Helmet>
        <title>
          Team Lead 101: How to Manage and Grow Engineering Teams in Small
          Startups (A)
        </title>
        <meta
          name="description"
          content="A book for software engineers who have been entrusted to lead their teams but haven’t received a guide on how to do this."
        />
      </Helmet>
      <header className={style.headline}>
        <span className={style.headlineTextWrap}>
          "How To Build A Strong, Close-knit Team... Even If You Did Not Consider
        Yourself A Leader Before!"
        </span>
      </header>
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
            Team Lead 101{" "}
            <span className={style.bookSubTitle}>
              How to Manage and Grow Engineering Teams in Small Startups
            </span>
          </h1>
          <p><i>eBook (PDF, ePUB)</i></p>
        </div>
      </div>
      <section className={style.contentSection}>
        <h2 className={style.subHeadline}>
          Yes! I'm ready to understand that leading people and managing projects
          are easier than I thought. I'm ready to build a strong, close-knit
          team, and become a leader in a tech startup!
        </h2>
        <p>
          I Understand That When I Act Now, I get instant access to the eBook (ePUB and PDF formats)
          "Team Lead 101: How to Manage and Grow Engineering Teams
          in Small Startups", which includes:
        </p>
        <ul className={style.bulletList}>
          <li>
            Finally, understand <b>what distinguishes a good team lead from a bad one</b>{" "}
            so you're able to <b>avoid repeating the same mistakes </b> almost
            every aspiring team leader making (including me 9 years ago) so you
            can <b>become a good team lead faster</b>
          </li>
          <li>
            Learn the{" "}
            <b>tools which helps you save more time and get better results</b>{" "}
            while solving the most common team management tasks ... you can
            benefit from the best practices of results-oriented team leaders
          </li>
          <li>
            Learn the fundamental principles of leadership which lets you{" "}
            <b>take the actions that are right</b> for the team and its members
            so you can you <b>discover your own personal pathway</b> to becoming
            a person teammates Want To Follow
          </li>
          <li>
            Find out <b>what can prevent your team from achieving its goals</b>{" "}
            so you're able to use your team exact strengths and know areas for
            improvement which means you can{" "}
            <b>realize your team unique potential</b> and surpass the goals
            faster
          </li>
          <li>
            Learn frameworks and practices for{" "}
            <b>increasing your personal and team productivity</b> and how you
            can <b>overcome unproductive day to day busy-ness</b> which means
            you can find more <b>time to do the really important things</b>
          </li>
        </ul>
      </section>
      <section className={style.contentSection}>
        <h2 className={style.subHeadline}>100% Guaranteed</h2>
        <p>
          If Team Lead 101: How to Manage and Grow Engineering Teams in Small
          Startups doesn't show me exactly how to lead people and
          manage projects ... if it doesn't take me
          by the hand, step-by-step to build a strong, close-knit team... or if
          it fails to help me become a leader in tech startup, then I understand
          that I will receive a full refund, No Questions Asked!
        </p>
        <a
          type="button"
          href="https://gum.co/team-lead-101?wanted=true"
          className={style.buyButton}
        >
          Click Here to Become a Better Team Lead
        </a>
        <div>
          <p>To Your Success, </p>
          <p>Dmitry Shvetsov author of Team Lead 101</p>
        </div>
      </section>
      <section className={style.contentSection}>
        <h2 className={style.subHeadline}>
          But don't just take my word for it... take a look at these
          testimonials and reviews from happy software developers, tech leads, and team leads
          just like you!
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
      <section>
        <a
          type="button"
          href="https://gum.co/team-lead-101?wanted=true"
          className={style.buyButton}
        >
          Click Here to Become a Better Team Lead
        </a>
      </section>
    </div>
  );
}

export default AtomicTeamLead101
