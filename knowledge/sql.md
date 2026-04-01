# SQL — The Language of Data

Structured Query Language is the lingua franca of anyone who works with data. Whether you are an analyst pulling a report, a data scientist building a feature pipeline, or an engineer designing a schema, fluency in SQL is non-negotiable. This chapter treats SQL not as a checklist of syntax to memorise, but as a way of thinking — a declarative logic for asking precise questions of structured data. We begin where most confusion originates: the order in which the database actually processes your query.

---

## 1.1 The Logical Order of Query Execution

When you write a SQL query, you begin with `SELECT`, follow it with `FROM`, perhaps a `WHERE` clause, and so on. This written order feels natural — you are declaring *what* you want, then *where* to find it, then *how* to filter it. But the database engine does not read your query top to bottom. It follows its own logical execution order, and understanding that order is the single most important step toward writing correct, efficient SQL.

Consider a common frustration: you create an alias in the `SELECT` clause — say, `revenue - cost AS profit` — and then attempt to filter on it in the `WHERE` clause. The query fails. Why? Because `WHERE` is evaluated *before* `SELECT`. The alias does not yet exist at the time the engine processes the filter. This is not a quirk; it is a direct consequence of the logical execution order.

The full order is as follows:

| Step | Clause | What It Does |
|------|--------|-------------|
| 1 | **FROM / JOIN** | Identify source tables and perform joins |
| 2 | **WHERE** | Filter individual rows before grouping |
| 3 | **GROUP BY** | Collapse rows into groups |
| 4 | **HAVING** | Filter groups after aggregation |
| 5 | **SELECT** | Evaluate expressions and aliases |
| 6 | **ORDER BY** | Sort the result set |
| 7 | **LIMIT** | Restrict the number of returned rows |

Let us trace through a concrete query. Suppose we have a table called `orders` with columns `customer_id`, `amount`, and `order_date`. We want to find customers who spent more than $1,000 in 2024, sorted by total spending:

```sql
SELECT   customer_id,
         SUM(amount) AS total_spent
FROM     orders
WHERE    order_date >= '2024-01-01'
GROUP BY customer_id
HAVING   SUM(amount) > 1000
ORDER BY total_spent DESC
LIMIT    10;
```

The engine proceeds as follows. **Step 1 (FROM):** it loads the `orders` table. **Step 2 (WHERE):** it discards all rows where `order_date` is before 2024. **Step 3 (GROUP BY):** it groups the remaining rows by `customer_id`. **Step 4 (HAVING):** it removes any group whose `SUM(amount)` is $1,000 or less. **Step 5 (SELECT):** it computes `SUM(amount)` for each surviving group and assigns the alias `total_spent`. **Step 6 (ORDER BY):** it sorts results by `total_spent` descending. **Step 7 (LIMIT):** it returns only the top 10 rows.

> **Key Insight:** Notice that `HAVING` must use `SUM(amount)` rather than the alias `total_spent`, because the alias is not created until `SELECT` runs in step 5. Some databases (MySQL, for instance) relax this rule as a convenience, but standard SQL does not. Always write with the standard in mind.

---

## 1.2 Joining Tables

Real-world data rarely lives in a single table. Customers are stored separately from their orders; employees are stored separately from their departments. Joins are the mechanism by which we reunite these related pieces of information.

An **INNER JOIN** returns only the rows that have a match in *both* tables. Think of two class rosters: if you inner-join them on student name, you get only the students enrolled in both classes. Anyone exclusive to one list is dropped entirely.

A **LEFT JOIN** (or `LEFT OUTER JOIN`) returns every row from the left table, regardless of whether a match exists on the right. Where no match is found, the right-side columns are filled with `NULL`. This is indispensable when you need a complete roster — for example, all employees including those not yet assigned to any department.

A **RIGHT JOIN** is the mirror image: all rows from the right table are preserved. In practice it is rarely used, since you can always swap the table order and use a LEFT JOIN instead, which most people find easier to read.

A **FULL OUTER JOIN** keeps all rows from both sides, filling `NULL` wherever a match is absent. It is useful for reconciliation tasks — comparing two data sources to find records missing from either side.

Finally, a **CROSS JOIN** produces the Cartesian product: every row from the left paired with every row from the right. It has niche uses (generating date spines, for instance) but should be used with caution, as the output size is multiplicative.

| Join Type | Keeps | Non-Matches | Use When |
|-----------|-------|-------------|----------|
| **INNER JOIN** | Only matched rows | Dropped from both sides | You only want records in both tables |
| **LEFT JOIN** | All left + matched right | Right fills with NULL | Need complete roster from left table |
| **RIGHT JOIN** | All right + matched left | Left fills with NULL | Mirror of LEFT — swap table order instead |
| **FULL OUTER** | All rows from both | NULLs on both sides | Reconciliation — find records missing from either |
| **CROSS JOIN** | Every row × every row | N/A (Cartesian product) | Generate combinations (e.g., date spines) |

### Example 1.1 — Inner Join vs. Left Join

Consider two small tables:

**employees:**

| emp_id | name | dept_id |
|--------|------|---------|
| 1 | Alice | 10 |
| 2 | Bob | 20 |
| 3 | Carol | NULL |

**departments:**

| dept_id | dept_name |
|---------|-----------|
| 10 | Engineering |
| 20 | Marketing |
| 30 | Finance |

```sql
-- INNER JOIN: only matched rows
SELECT e.name, d.dept_name
FROM   employees e
INNER JOIN departments d
  ON e.dept_id = d.dept_id;
```

**Result:**

| name | dept_name |
|------|-----------|
| Alice | Engineering |
| Bob | Marketing |

Carol is excluded because her `dept_id` is NULL — there is no match. Finance is excluded because no employee belongs to it.

```sql
-- LEFT JOIN: all employees, even unmatched
SELECT e.name, d.dept_name
FROM   employees e
LEFT JOIN departments d
  ON e.dept_id = d.dept_id;
```

**Result:**

| name | dept_name |
|------|-----------|
| Alice | Engineering |
| Bob | Marketing |
| Carol | NULL |

Now Carol appears. Her department name is NULL because no match was found, but the left table's row is preserved.

> **Tip:** A common interview pattern is to find rows in one table that have *no* match in another. Use a LEFT JOIN and filter with `WHERE d.dept_id IS NULL`. This is often more readable (and equally efficient) than a `NOT EXISTS` subquery.

---

## 1.3 Window Functions

Aggregate functions like `SUM` and `COUNT` collapse multiple rows into one. But what if you need to compute a value across a set of related rows while keeping every individual row intact? This is the domain of **window functions**.

A window function performs a calculation across a "window" of rows defined by an `OVER` clause. The key distinction is that the rows are not collapsed: you still get one output row for each input row, but each row now carries an additional computed value that reflects its context within the window.

Three ranking functions appear constantly in interviews:

- **`ROW_NUMBER()`** assigns a unique sequential integer to each row within its partition. Ties are broken arbitrarily — no two rows share the same number.
- **`RANK()`** assigns the same number to tied rows, then *skips* the next values. If two rows tie for rank 1, the next row is rank 3.
- **`DENSE_RANK()`** also assigns the same number to ties, but does *not* skip. After two rows at rank 1, the next row is rank 2.

Choosing between them depends on the business question. If you need exactly one winner per partition (e.g., deduplicate rows), use `ROW_NUMBER`. If you need to know competitive standing with gaps (like Olympic medals: gold, gold, bronze), use `RANK`. If you need consecutive labels regardless of ties, use `DENSE_RANK`.

| Function | Ties | Gaps After Ties | Example (95k, 95k, 88k) | Use Case |
|----------|------|-----------------|--------------------------|----------|
| `ROW_NUMBER()` | Broken arbitrarily | N/A — always unique | 1, 2, 3 | Deduplication, top-N per group |
| `RANK()` | Same rank | Yes — skips next | 1, 1, 3 | Competitive standing (Olympics) |
| `DENSE_RANK()` | Same rank | No — consecutive | 1, 1, 2 | Consecutive labels regardless of ties |

### Example 1.2 — Salary Ranking by Department

Given an **employees** table:

| name | department | salary |
|------|-----------|--------|
| Alice | Engineering | 95000 |
| Bob | Engineering | 95000 |
| Carol | Engineering | 88000 |
| Diana | Marketing | 78000 |
| Eve | Marketing | 72000 |

```sql
SELECT
  name, department, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num,
  RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS d_rnk
FROM employees;
```

**Result:**

| name | department | salary | row_num | rnk | d_rnk |
|------|-----------|--------|---------|-----|-------|
| Alice | Engineering | 95000 | 1 | 1 | 1 |
| Bob | Engineering | 95000 | 2 | 1 | 1 |
| Carol | Engineering | 88000 | 3 | 3 | 2 |
| Diana | Marketing | 78000 | 1 | 1 | 1 |
| Eve | Marketing | 72000 | 2 | 2 | 2 |

Notice that Alice and Bob tie at $95,000. `ROW_NUMBER` still assigns them distinct values (1 and 2). `RANK` gives both a 1 and then skips to 3 for Carol. `DENSE_RANK` gives both a 1 and proceeds to 2 for Carol.

> **Tip:** Beyond ranking, window functions support running totals (`SUM() OVER`), moving averages (`AVG() OVER (ROWS BETWEEN ...)`), and access to other rows via `LAG()` and `LEAD()`.

---

## 1.4 Aggregation and Grouping

Aggregation is the act of reducing many rows into fewer rows by computing summary statistics — sums, counts, averages, minima, maxima. The `GROUP BY` clause defines which rows should be collapsed together: all rows sharing the same values in the grouped columns become a single row in the output.

A question that surfaces repeatedly in interviews is the difference between `WHERE` and `HAVING`. The answer follows directly from the execution order we discussed in Section 1.1. `WHERE` filters individual rows *before* grouping occurs, so it cannot reference aggregate functions. `HAVING` filters *after* grouping, so it can.

```sql
-- This FAILS: WHERE cannot use aggregates
SELECT   department, COUNT(*) AS headcount
FROM     employees
WHERE    COUNT(*) > 5      -- ERROR!
GROUP BY department;

-- This WORKS: HAVING filters after aggregation
SELECT   department, COUNT(*) AS headcount
FROM     employees
GROUP BY department
HAVING   COUNT(*) > 5;
```

Another subtle but critical distinction is between `COUNT(*)` and `COUNT(column)`. The former counts all rows in the group, including those where every column is NULL. The latter counts only the rows where the specified column is *not* NULL. Consider this table:

| id | name | email |
|----|------|-------|
| 1 | Alice | alice@co.com |
| 2 | Bob | NULL |
| 3 | Carol | carol@co.com |
| 4 | Diana | NULL |

```sql
SELECT
  COUNT(*)      AS total_rows,     -- 4
  COUNT(email)  AS has_email       -- 2
FROM users;
```

`COUNT(*)` returns 4 because there are four rows. `COUNT(email)` returns 2 because only Alice and Carol have non-NULL email values.

| Function | Counts NULLs? | Returns |
|----------|--------------|---------|
| `COUNT(*)` | Yes — counts all rows | Total rows in group |
| `COUNT(col)` | No — skips NULLs | Number of non-NULL values |
| `SUM(col)` | Skips NULLs | Sum of non-NULL values |
| `AVG(col)` | Skips NULLs | Average of non-NULL values |
| `MIN(col)` / `MAX(col)` | Skips NULLs | Minimum / maximum value |

> **Key Insight:** Every column in the `SELECT` clause must either appear in `GROUP BY` or be wrapped in an aggregate function. If you select `department` and `name` but only group by `department`, the database does not know which `name` to display for each group. Most databases will raise an error; MySQL in its default mode may silently pick an arbitrary value, which is almost always a bug.

---

## 1.5 Common Table Expressions (CTEs)

A Common Table Expression (CTE) is a named, temporary result set that exists only for the duration of a single query. Introduced with the `WITH` keyword, CTEs let you break a complex query into digestible, named steps — much like assigning intermediate results to variables in a programming language.

Without CTEs, the alternative is deeply nested subqueries, which quickly become unreadable. Consider a task where you need to compute monthly revenue and then compare each month to the previous one. With subqueries, you would nest a derived table inside another derived table. With CTEs, each logical step gets a clear name:

### Example 1.3 — Month-over-Month Revenue

We want to calculate each month's total revenue and its change from the prior month.

```sql
WITH monthly_revenue AS (
  SELECT
    DATE_TRUNC('month', order_date) AS month,
    SUM(amount)                       AS revenue
  FROM   orders
  GROUP BY 1
),
with_prior AS (
  SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_revenue
  FROM monthly_revenue
)
SELECT
  month,
  revenue,
  prev_revenue,
  ROUND(
    100.0 * (revenue - prev_revenue) / prev_revenue, 1
  ) AS pct_change
FROM   with_prior
ORDER BY month;
```

The first CTE, `monthly_revenue`, computes the aggregate. The second, `with_prior`, uses the window function `LAG` to fetch the preceding month's revenue. The final `SELECT` calculates the percentage change. Each step is self-contained and easy to verify independently.

CTEs are also invaluable for recursive queries (traversing hierarchies, generating series), though recursive CTEs are less commonly tested in data science interviews. Focus on mastering the non-recursive form: chaining two or three CTEs to build up a result step by step.

> **Tip:** In most databases, CTEs are optimised the same way as subqueries — the planner inlines them. In PostgreSQL 12+, you can add `MATERIALIZED` or `NOT MATERIALIZED` to control this behaviour explicitly.

---

## 1.6 Query Optimisation

Writing correct SQL is necessary but not sufficient. In production, queries run against tables with millions or billions of rows, and a poorly written query can take minutes instead of milliseconds. While deep optimisation is a specialised discipline, a few principles go a long way.

**Use EXPLAIN (or EXPLAIN ANALYZE).** This is your primary diagnostic tool. It shows the query plan the database intends to use — which indexes it will leverage, whether it will perform a sequential scan, how it estimates row counts. Reading execution plans is a skill that improves dramatically with practice.

```sql
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42;
```

**Index the columns you filter and join on.** An index on `customer_id` turns the query above from a full table scan (reading every row) into an index lookup (reading only the relevant rows). Without it, performance degrades linearly with table size.

**Avoid SELECT \*.** Selecting all columns forces the database to read and transmit data you may not need. Specify only the columns your analysis requires. This is especially impactful in columnar storage systems (Redshift, BigQuery) where each column is stored separately.

**Filter early.** Push `WHERE` conditions as close to the base tables as possible. If you are joining a large fact table to a small dimension table, filtering the fact table before the join reduces the number of rows that need to be matched.

**Prefer EXISTS over IN for large subqueries.** `EXISTS` can short-circuit — it stops scanning once a match is found. `IN` must evaluate the entire subquery first.

| Principle | Why | Impact |
|-----------|-----|--------|
| **Use EXPLAIN** | Shows query plan — indexes, scans, row estimates | Primary diagnostic tool |
| **Index filter/join columns** | Turns full scan O(n) into index lookup O(log n) | Orders of magnitude faster |
| **Avoid SELECT \*** | Forces reading all columns; costly in columnar storage | Less I/O, faster queries |
| **Filter early** | Push WHERE before JOIN to reduce rows entering the join | Dramatically reduces join size |
| **EXISTS over IN** | EXISTS short-circuits; IN evaluates entire subquery | Faster for large subqueries |

> **Key Insight:** Optimisation is about reducing the amount of data the engine must read and process at each step. Every principle above — indexing, projection, early filtering — serves that single goal. When a query is slow, ask: "Where is the engine reading more data than it needs to?"
