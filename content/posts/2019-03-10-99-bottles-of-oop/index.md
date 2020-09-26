---
title: "99 Bottles of Object-Oriented Programming"
slug: "99-bottles-of-oop"
author: "Dmitry Shvetsov"
date: "2019-03-10"
hero: images/hero.png
---

## Review of “99 Bottle of OOP” book by Sandi Metz and Katrina Owen

[Link to the book](https://www.sandimetz.com/99bottles).

> This book is about writing cost-effective, maintainable, and pleasing code … \[by\] … finding the right abstractions.
> 
> Sandi Metz, Katrina Owen. 99 Bottles of OOP (Kindle Locations 119–120, 213). Kindle Edition.

* * *

## Authors

[Sandi Metz](https://www.sandimetz.com/) and [Katrina Owen](https://www.kytrinyx.com/).

Sandi is a programmer, teacher, author and consultant.

Katrina is a Go and Ruby programmer, creator of [exercism](https://exercism.io/).

## Facts

This book is available in two verstions: 99 Bottles of Beer and 99 Bottles of Milk.

The book has 187 code examples not counting examples from appendix content. All code written in Ruby.

Mobi version with Kindle has indentation problems, making a version by myself with Amazon tooling does not solve the issue. Epub with Mac OS Book has no problems with indentation but lacks syntax colors for the code. The PDF format has colored syntax and has no indentation problem.

## For whom

The book will be interesting to those who are looking to improve their Object Oriented Design (hereinafter OOD) skills.

Ideas in “99 Bootles of OOP” will be teachable for Object-Oriented Programming (hereinafter OOP) novice and experienced programmers.

Authors warn that programmers with existing OOP knowledge may absorb the material with difficulty or dislike if the concepts differ from their experience.

## How to read

Sequentially, chapters depend one on another.

The best effect from the book will be achieved by work the code samples from the book. Those knowing Ruby programming language is valuable, hence the samples are made in Ruby.

Since you understand the code examples you can write exercises in any programming language that you comfortable with. You can check the code from all chapters [here](https://github.com/sandimetz/99bottles).

## Content

**The first chapter** introduces the problem and initial solutions that you can come up to, as well as metrics to objectively compare the solutions. Before you start reading this chapter it is better to solve the problem by yourself.

**The 2nd chapter** is about Test Driven Development (hereinafter TDD). The chapter illustrates how to incrementally write tests which drive the development code. This approach leads to better code and difference between effective tests and costly to maintain tests.

**The 3rd chapter** is about how to handle new requirements, about those feeling when you no longer like the code that results from the implementation of new features and sees no options to do it in another way. This chapter reveals how to handle it with Open/Close principle, by identifying and removing smells, that make it difficult to see hidden abstractions.

**The 4th chapter** continues to practice ideas from 3rd chapter with slightly more complex tasks. It reveals the importance of consistency in the code, which empowers us to make refactoring and lower cost by simplifying reading, the most common action on a code. The chapter emphasizes the importance to stick with refactoring rules. It explains the Liskov substitution principle.

**The 5th chapter** demonstrates the next smell in the code and the next step to fix it by applying extract className refactoring. It explains the importance of messaging in OOP. Also, the chapter touches such topics as premature performance optimization, caching and immutability.

**In the 6th chapter**, the authors will explain how to solve the requirement introduced earlier in the book. In order to do this, you explore Data clump code smell and replace if/switch statement with a set of polymorphic objects created by a factory.

## Subjective assessment

The book is written good, with a wealthy English from time to time. The authors put a lot of rich words in their book. If you are not native English speaker as I am, this will make grasp the book harder for you but you learn from 1 to 3 of new words and phrasal verbs from each section.

I found this book interesting. Having 5 years of writing OOP, I learned a lot from this book.

It was interesting to me to solve the problems of the next chapter without reading it before it and to compare the result of my work with the results of the authors.

The content of the book is deep and narrow as a result.

I would recommend [POODR book](https://amzn.to/32MLnFU) (or [2nd edition](https://amzn.to/2YotkX8), although I have no luck to read it) by Sandi Metz as a complement material for “99 Bottles Of OOP”. I personally read the first edition of POODR twice and going to read the second edition, POODR is totally worth its money.

\[convertkit form=1272468\]
