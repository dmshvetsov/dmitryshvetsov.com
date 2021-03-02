---
title: "Book notes: The Art Of PostgreSQL by Dimitri Fontaine"
slug: "the-art-of-postgresql-by-dimittri-fontaine"
author: "Dmitry Shvetsov"
hero: images/hero.jpg
---

> “The goal of this book is to provide you, the application developer, with new and powerful tools. Determining how and when to use them has to be done in a case by case basis.”

Relation is a set of data all having a common set of properties but with an exceptions that duplicates are allowed in SQL and "set" is not an 100% accurate term. Any result of a query defined in terms of being a relation of a known composite data type. Relations can be defined in advance with `create table` or  `create type` statements or on the fly by the query planner.

The first SQL example in the book shows how to import big CSV file (NYSE
exchange daily trading data from 2020 year) to a DB with only 21 lines of SQL
including `create table` statement. In yearly days of my career I spent weeks
to write fast import of 23+ thousands lines of CSV with code.

A reliable way to stop worying about SQL injection is to study how to send SQL
query parameters separetly from the main SQL query.

In many cases processing, changing, calculating data on the database side result
in the more performant and lest resource cost applications.

PostgreSQL gurantees that it won't lose any committed changes not eve an event of operating system crash. The only risk is disk corruption. Thus practice of making backups is important.

PostgreSQL is a stateful service on top of which we should build the other parts of the app or the system. It will be esier to achive scalability and high availability because they will be stateless services.

Structured Query Language (SQL) is a strong statically typed, domain-specific declarative programming language where we need to specify what, is a result, not how, algorithms.

SQL is extendable. SQL operators and functions are looked up at run-time. Functions and operators in PostgreSQL support polymorphism. Thus almost every part of PostgreSQL can be extended.

Thins about PosrgreSQL database as a concurrent data access service instead of storage layer.

PostgreSQL docs is one of the best in the software world. Version 9.6 has 3376 pages in A4 format. Only table of content takes 32 pages.

You can access docs in  `psql` utility with `\h <command>`.

The main aspects to consider in terms of where to maintain the business logic in the app code or in SQL code are the correctness and the efficiency aspects of your code architecture and organization.

Solving business logic in app vs in sql, considering use case "display the list of albums from a given artist, each with its total duration":
* sql fetch data in transactions that guranteed consisted data, app code that makes more than one queries to fetch releted data might fetch inconsistent data changed between app queries to the DB.
* writing queries in most cases faster than write app code, assuming you know sql and app code programing language in comparable levels.
* to run app code to fetch and manipulate data we need send query, often over the network, in some cases more than one query for different entities, sql can be done on the DB side without roundtrips and with single request.
* computation in the app code requires memory to manipulate fetched data and addition CPU cycles after data is fetched.
* often ORM usage encourage to fetch all fields of the table with default `select *` which is useless usage of all the computation resources.
* resources CPU, memory , network, disk that we need to run app code vs sql code

In the end with logic in SQL it is easier to achieve more efficient in terms of resources, easier mantainable, consistent in terms of data retrieved and results code.

Read uncommitted isolation level actually implements read committed.

The common usecase for Repeatable read isolation level is making online(?) backups.

You can specify different level of isolation per transaction.

If you want to be efficient when use stored procedures write them in SQL and avoid PLpgSQL.

Note outside the book: default join in PostgreSQL and in SQL in general is `inner join`. When you are using `join` you implicitly saying I want `inner join`.

> "rather than invest in an extra layer of caching architecture in front of your APIs, wouldn’t it be better to write smarter and more efficient SQL?"

Lateral join allowing one to write explicit loops in SQL.

Most PostgreSQL advanced experts favor `psql` to advanced visual query editing tools.

Configure `psql` for your need by adding `.psqlrc` at the root folder for your user (for *nix users).

Use `\set ON_ERROR_ROLLBACK interactive` for `psql` to automate savepoint creation and rollback to them in case of errors while you inside transaction using `psql`.

Main usecases of `psql` is preparing, trying things for your next query and as a reporting tool, and discovering database schema.

Setup EDITOR environment variable in the `.psqlrc` or inside `psql` session or inside shell profile and issue `\e` `psql` to edit sql in you editor of choice.

> realizing that your database engine actually is part of your application logic. Any SQL statement you write, even the sim- plest possible, does embed some logic

Avoid using `natural jooin` columns and their semantic will change.

Format your SQL for readability. We spend much more time reading the code than writing it.

Don't shorten variables to "a1" and "a2", to "o" and "l", you would pass this variables on the code review of your app code. Why you should pass it for SQL code? Again, readability matters.

Comment code when you want to make it easier for future reader to understand your intention and why you wrote this SQL not other.

Utilizy PostgreSQL `application_name` facility to simplify debugging. In logs you will see where this SQL comes from. You can set it in connection string or with `\set` command in your PostgreSQL client, `psql` for example.

You can write regression tests for your SQL using [pgTap](https://github.com/theory/pgtap/), [RegreSQL](https://github.com/dimitri/regresql).

In absence of an index a DB can only find records by sequential scan of tables.

Constraints `unique`, `primary key`, `exclude using` use indexes to do their job. PostgreSQL creates indexes for the constraints automaticaly to behave correctly.

> "As writing the SQL queries is the job of a developer, then coming up with the right indexing strategy for an application is also the job of the developer."

MVCC – multiversion concurrency control; each SQL statement sees a snapshot of data at it was some point of time in the past

Each index adds write cost for `insert`, `update`, and `delete`.

`B-Tree` index is default index type. Very efficient, for the most cases.

`GiST` or generalized search tree index support 2-dimensional data types, geometry point or ranges.

`SP-GiST` or spaced partitioned gist support non-balanced disk-based data structures, quadtrees, k-d trees, radix trees.

`GIN` or generalized inverted index for composite data, documents, arrays. An inverted index contains a separte entry for each part of value. Used for full text search.

`BRIN` or block rage index. ??? can be used differently. Useful to cover multiple columns and queries referenceing most or all columns included in the index.

`Hash` indexes can handle only simple equality comparisons. Never use `Hash` indexes before version 10 of PostgreSQL.

`Bloom filters` space-efficient. Useful to cover multiple columns and queries referenceing most or all columns included in the index. Only support equality queries. `B-Tree` faster than bloom index.

System wide analusis can be don eusing [`pg_stat_statements` extension](https://www.postgresql.org/docs/current/pgstatstatements.html).

Visual tools to read `explain` output [explain.depesz](https://explain.depesz.com/) and [Pev](http://tatiyants.com/pev/#/about).

When (explain analyze) effective row counts biger in thousand of times or more than estimated, check if tables are analyzed frequently enough by the Autovacuum Daemon, then check if you should adjust your statistics target, Finally check how much time spent doing sequential scans of data in the filter step.

Amdahl's law: "if some step takes 10% of the run time, then the best optimization you can reach from dealing with this step is 10% less, and usually that’s by removing the step entirely"

> The vast majority of slow queries found in the wild are still queries that return way too many rows to the application, straining the network and the servers memory. [..] The first rule of optimization in SQL, as is true for code in general, is to answer the following question: "Do I really need to do any of that?"

> The SQL writing process is mainly about discovery. In SQL you need to explain your problem, unlike in most programming languages where you need to focus on a solution you think is going to solve your problem.

> Here’s some good advice I received years and years ago, and it still applies to this day: when you’re struggling to write a SQL query, first write down a single sentence —in your native language— that perfectly describes what you’re trying to achieve. As soon as you can do that, then writing the SQL is going to be easier.

SQL is a declarative language you need to state what you want.

Parts of SQL:
* Data manipulation language (DML).
* Data definition language (DDL).
* Transaction control language TCL.
* data control language DCL.
* specific to PostgreSQL commands: analyze, cluster, prepare, execute, explain, listen, notify, lock, set, and more.

Aguments against `select *`:
* it hides the intention of the code
* it makes harder to review the code
* it is not efficient in terms of resources usage to retrieve all the bytes (especialy while your table columns number growth over time)

PostgreSQL is a strong tool to work with calendar, dates, and time zones. Doing it yourself in the app code mean deal with tons of odd problems.


Simple `where` clauses leads to better indexes usage.

Use short-cicuit eveluation when using `and` in `where`

`or` operator is harder to optimzie for indexes.

Indexes should never chage the result set of a query. If they does it is a bug or corrupted data.

Lateral joins allows to write subqueries that runs in a loop over a given to the join data set.

> "Another interesting implication of using a left join lateral subquery is how the join clause is then written: on true. That’s because we inject the join condition right into the subquery as a where clause. This trick allows us to only see the results from the current decade in the subquery, which then uses a limit clause on top of the order by wins desc to report the top three with the most wins."

`offset` causing performance issues. `offset` command will read all records before it will get to the point where the offset ends. Thus it's going worse and worse when `offset` argument are growing.

On aggreages when `group by` ommited we aggregate the whole set.

`having` clause can not references aliases from the `select` statement.

Aggregation with `grouping sets` allows to aggregate for several groups in parallel.

Aggregation with `rollup` clause generates permutations for each column of the grouping sets. Rollup represents the given list of expressions and all prefixes of the list including the empty list. We also have `cube` which represents the given list and all of its possible subsets (i.e. the power set).

Common table expression created by `with` clause. It allows to run a query and use results like a table in the following queries.

You can chain common table expressions like `with name1 as (), name2 as (), name3 as ()`. The next expression will have access to the results of the previous expressions by its name.

Aggregates cannot be nested. Use common table expressions to make a pipeline of aggregates.

`distinct on (<expression>)` is used to keep only the first row where the given expressioon evaluete to equal. Remember that without `order by` order of rows unpredictable and "the first row" might and will be a different one on each run of a query.

Note outside the book: there are `distinct <list of select attributes>` which is applies to the entire tuple, not to an attribute of the result. It will filter out duplicates where all values of the tuple is the same. [An article that describe the difference in details](https://sandeep45.github.io/postgresql/sql/rails/distinct/distinct_on/2018/07/22/distinct-vs-distinct-on.html)

You can add literal values to the result of a query like `select 'driver' as type;`.

`union` is useful when we need to combine results of more than 1 queries. Without `all` remove duplicates from the result set.

Outside of the book note: you required to name columns the same way (double check this!) and need to have the same number of result columns in combined queries when you union them.

`except` operator is useful to get a diff between two result sets. For example when you write tests for SQL queries or want to remove rows from one query that existis in another query (lists the drivers who received no points in race 972 (Russian Grand Prix of 2017-04-30) despite having gotten some points in the previous race (id 971, Bahrain Grand Prix of 2017-04-16)).

`cross join` implements Cartesian product over datasets.

To understand behavior of `null` in SQL think of it as meaning "I don’t know what this is" rather than "no value".

> “Say you have in A (left hand) something (hidden) that you don’t know what it is and in B (right hand) something (hidden) that you don’t know what it is. You’re asked if A and B are the same thing. Well, you can’t know that, can you?”

Hence `null = null` always result in `null`. But `null is distinct from null` results in `true` value. When you write raw queries in your app use `null is null`, `null is not null` or with some column `username is null`, `username is not null`. `username = null` return no rows.

Default value for any column is `null` unless you specified the default value. If your application requires to value exists make columns `not null` to remove the need of checks for nulls in your application code.

> "There was SQL before window functions and there is SQL af􏰂er window functions"

Window functions are for those cases when you want to make computation when you processing current row but want to access other rows. For example results of sales in comparison with previous period sales. Use window functions whenever you want to compute values for each row and those values computation depends on other rows.

Window functions executes last in the query. Thus they happens after the where clause so you only see rows in the function that was last after the where filtering. In any frame you can only see rows that have been selected for output.

TODO: explain `over (order by)`

`over (partition by)` allows to make computation with others rows that satisfy the partition condition. Partition it is a where condition inside a window function.

All aggregate function can be used against a window frame rather than a grouping clause.

You can create your custom aggregate function.

Cartesian product is a set of all possible combinations of all entries.

Joins takes two relations and join condition. A relation is a bag of rows that all share a common relation data type definition – set of columns with specific type.

Use `inner join` to keep rows that satisfy the join condition on left and right side of the join.

Use `outer join` to keep all rows of the left relation in the join and link rows from right side of the join that satisfy the join condition. When there is no rows that satisfy the condition on the right side null value will be placed in column values instead of data.

`full outer join` is a special case of an `outer join` where you want to keep all the rows in the dataset, whether they satisfy the join condition or not.

Lateral joins introduce the capability for the join condition to be pushed down into the relation on the right, allowing for new semantics such as top-N queries, thanks to being able to use limit in a lateral subquery. (TODO understand it and write better note)

> “People constantly try to apply their knowledge about algorithms to SQL statements, without knowing which algorithm the database actually uses. This causes a lot of problems, confusion and frustration. First, always focus on writing a clear statement to describe each column and row of the desired result. If needed, you can take care of performance afterwards. This however, requires some understanding of database internals.” – Markus Winard author of “SQL Performance explained”

RDBMS is more like transaction systems rather than storage system. Programming languages can store and retrieve data from files. And DB are not for solving the storage problems.

Consistency is the main problem that a relatioinal database management system is meant to solve.

One interpretation of a domain is a set of values that are given a common name.

Relation (domain) contains bag of tuples. Tuples are attribute-value pairs with specified types and rules such as constraints and triggers.

Decorated literal to enforce type syntax `date '2021-03-02'`, full query will be looking like this `select data '2021-03-02';`.

All quotes are excerpts from “The Art Of PostgreSQL” by Dimitri Fontaine.

Fun alias to get `00:00:00` time in PostgreSQL `select date 'today' + time 'allballs' as midnight;` will result in `2021-03-02 00:00:00`.

http://ergast.com/images/ergast_db.png

http://ergast.com/docs/f1db_user_guide.txt
