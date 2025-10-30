+++
title = "Code: the Good, the Bad, the Ugly — Literal Values as Function Arguments"
slug = "code-good-bad-ugly-literal-arguments"
author = "Dmitry Shvetsov"
date = "2025-10-30"
+++

A very common pattern I see is passing **a boolean flag as a function argument**.

When you see something like `getTopTeams("week", true)`, you have almost no context. You can’t tell what `true` means without using an IDE or reading the `getTopTeams` code.

Then it grows. Suddenly you need a limit, and now you have: `getTopTeams("week", true, 20)`. More things to guess, but not significantly worse than the previous example.

Eventually, in codebases that have evolved long enough, it becomes something like: `getTopTeams("week", true, 20, true, false, null, 3)` — *facepalm*

It is painful to read, it is painful to use.

It’s almost never a good idea to pass raw booleans or numbers as positional arguments.
Instead, pass an **object / hash / struct**, call it "options" (usually when it is 2nd argument or the last one) or "params" (if a function has only single argument): `getTopTeams("week", { excludeSomething: true, limit: 20, order: Ordering.DESC, retries: 3 })`

All the `null` or undefined arguments disappear, and what remains becomes readable.

Worth mention it is also not a good idea to have multiple positional arguments when they are not literal value 

Worth mentioning: it’s also not a good idea to have multiple positional arguments even when they’re not literal values:

`getTopTeams("week", teams, filter, Ordering.DESC, chacheManager, formatter)`

Same problem - zero context, need to keep position in mind.

Use params pattern

`getTopTeams({ range: "week", list: teams, filter: filter, order: Ordering.DESC, cache: chacheManager, formatter: formatter })` 

Nevertheless, the first version is ugly the second is bad.

* * *

Also, this is totally fine: `getTopTeams("week")`

Why?

Because it reads almost naturally: *"get top teams for the week"*.

This only works when the function has **one argument** that is self-explanatory.

`getTopTeams({ range: "week" })` or `getTopTeams(Range.WEEK)` is also an option.

* * *

There *are* functions where multiple positional arguments are totally readable: `sum(50, 12300, 48)`

Or a more fancy one `mathOp("sum", 50, 12300, 48)`

* * *

Sadly, not every language supports the options/params pattern. Some force you into this chaos: `iamLuky(true, false, true, undefined, null, false, 0)`
