---
title: "Mastering PostgreSQL in Application Development by Dimitri Fontaine"
slug: "mastering-postgresql-in-application-development-by-dimitri-fontaine"
author: "Dmitry Shvetsov"
date: "2019-01-13"
hero: images/hero.png
---

## The book review

## For whom

> This book is intended for developers working on applications that use a database server.
> 
> Dimitri Fontaine. Mastering PostgreSQL in Application Development (Kindle Locations 66–67). Kindle Edition.

“Mastering PostgreSQL in Application Development” will most valuable for developers dealing with PostgreSQL relational database management system.

## How to read

The book requires you to follow and read numerous links to the PostgreSQL docs. To follow this book you have to be familiar with the topics mentioned in the links.

The content should be read sequentially because later chapters reference the content from earlier chapters. Also, the book contains many links to additional materials in external articles, libraries, and wiki pages.

## Facts about this book

There are a lot of code examples in the book. It has 257 SQL examples, 5 python code examples, 1 Java example in 3 pieces, 1 Go lang example in 2 pieces and 2 Lisp code examples.

Rarely you can find that code examples formatted not tidy. Occasionally you can face a typo.

It is almost impossible to copy a code example of SQL from PDF version of the book because of code examples split into columns (tried on Mac OS with Preview app). SQL Code examples sometimes broken by a page break which makes it even harder to copy and paste. Copy and paste from Kindle have problems as well. Any example that you copy and paste becomes a one-liner replacing line breaks with a lot of space characters (tried in Mac OS Kindle version 1.25.2).

The book touches the subject of denormalized datatypes: arrays, jsonb, and json as a predecessor, enum, xml, and composite types, and how to use them. Datatypes chapter also explains unique for PostgreSQL range type and why PostgreSQL has no unsigned numeric datatype.

Normalization and denormalization topics are part of the book as well. The database “Practical Use Case: Geonames” chapter contains an example of 357 lines of code in 6 pieces of database normalization process for [http://www.geonames.org/](http://www.geonames.org/) database.

Three value logic example explaining how `Null` in SQL is different to `nil`, `null`, `NONE` that we used to use in our programming languages.

Wondering how to display an article and all it comments as one row this book has an answer for this.

“Mastering PostgreSQL in Application Development” is written to show how some of the problems that we have to solve as developers are best addressed using SQL.

## Misc

This book contains not a valid statement about MongoDB. Version 4.0 of NoSQL database, released in June 2018, now supports ACID transactions. In the book stated opposite.

## Subjective assessment

The book not well structured and sometimes not easy to follow. For example, Materialized views topic explains in a later chapter when used in an earlier.

I would consider that this book covers beginners, intermediate and advanced topics. The problem is that book not structured as learning edition instead you can face advance topics in earlier chapters and topics for beginners at the end of the book. Like `insert`, `update`, `delete` operations explained in 7.2 chapter of 8 chapters book.

Some ideas explain repeatedly over the book, but I tend to think that it’s good.

The book doesn’t mean to teach you advanced queries and techniques. The main goal is to show the power of SQL and power of full of features PostgreSQL database that we may use to simplify our application code.

I can not say that this book is written in language that is simple and easy to grasp. Sometimes I read a sentence or even paragraph again and again because of a lack of concentration or understanding the written information. This may due to that English is not my native language. But stated above not related to lastest two chapters, which was enjoyed to read.

This is not a PostgreSQL recipes book nor an educational book. Although you will find inspiration and ideas in numerous code examples and topics covered in this book to solve your day to day tasks.

My favorite chapters:

- “Relation theory” chapter that goes into the internals of PostgreSQL
- Dealing with Timezones explained in “Date/Time and Time Zones” chapter is also very useful to know before you start working with time in your application
- Data manipulation chapter especially “Isolation and Locking” and “Listen and Notify” has a ton of new and advanced information for me

I learned some useful tricks to improve my productivity of designing a database schema or composing your SQL query.

It would be very cool to have an improved 2nd edition of “Mastering PostgreSQL in Application Development”. And I have a guess that this project [http://theartofpostgresql.com](http://theartofpostgresql.com/) may be the next book in series or the 2nd edition by Dimitri.

* * *

## Links

- The book web site [https://masteringpostgresql.com](https://masteringpostgresql.com/)
- A printed paperback book edition in the [Amazon store](https://amzn.to/2BkQXmo)
- Dmitri Fountaine (the author) blog [https://tapoueh.org](https://tapoueh.org/)
