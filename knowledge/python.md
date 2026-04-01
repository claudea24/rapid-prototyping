# Python — The Analyst's Toolkit

Python has become the lingua franca of data science — not because it is the fastest language or the most elegant, but because it sits at a remarkable intersection of readability, ecosystem breadth, and community momentum. From cleaning messy CSVs to training neural networks, Python provides a single thread that ties the entire analytical workflow together. In this chapter, we build the fluency an interviewer expects: mastery of core data structures, dexterity with Pandas and NumPy, familiarity with algorithmic patterns, and awareness of the subtle pitfalls that separate a seasoned practitioner from a beginner.

---

## 2.1 Data Structures and Their Complexity

Choosing the right data structure is often the difference between a solution that passes and one that times out. Python's standard library offers several workhorse structures, each with distinct performance characteristics. Understanding *why* you would reach for one over another is far more important than memorizing their APIs.

**List.** The `list` is Python's general-purpose dynamic array. It stores elements contiguously in memory, which means index access is O(1) and appending is amortized O(1). However, inserting or deleting at the front costs O(n) because every subsequent element must shift. Use lists when you need ordered, index-addressable storage and most operations happen at the end.

**Dict (Hash Map).** A `dict` maps keys to values via a hash table, giving O(1) average-case lookups, inserts, and deletes. Dicts are the backbone of frequency counting, caching, and any task where you need to answer "have I seen this before?" quickly. Since Python 3.7, dicts also preserve insertion order.

**Set.** A `set` is essentially a dict without values — a hash table of unique keys. Membership testing (`in`) runs in O(1) on average, compared to O(n) for a list. Use sets when you need to track unique elements or perform mathematical set operations (union, intersection, difference).

**Deque.** The `collections.deque` is a double-ended queue backed by a doubly-linked list of fixed-size blocks. It offers O(1) appends and pops at *both* ends, which the list cannot match. Reach for a deque when implementing BFS, sliding window algorithms, or any queue/stack hybrid.

**Heap (Priority Queue).** Python's `heapq` module provides a min-heap on top of a regular list. Pushing and popping are both O(log n), while peeking at the minimum is O(1). Heaps are the right choice for "give me the k largest/smallest elements" problems, Dijkstra's algorithm, and any scenario where you repeatedly need the extreme value from a dynamic collection.

| Structure | Lookup | Insert | Delete | Best Use Case |
|-----------|--------|--------|--------|---------------|
| `list` | O(1) index | O(1) end / O(n) front | O(n) | Ordered sequences, stacks |
| `dict` | O(1) avg | O(1) avg | O(1) avg | Key-value mapping, counting |
| `set` | O(1) avg | O(1) avg | O(1) avg | Membership tests, dedup |
| `deque` | O(n) | O(1) both ends | O(1) both ends | BFS, sliding windows |
| `heapq` | O(1) min | O(log n) | O(log n) | Top-k, priority scheduling |

> **Key Insight:** Choosing the right data structure can turn an O(n²) solution into O(n). A classic example: checking whether a list contains duplicates takes O(n²) with nested loops, but only O(n) if you pour the elements into a `set` and compare lengths. When an interview solution feels too slow, the first question to ask is: *"Am I using the right container?"*

---

## 2.2 Pandas for Data Manipulation

At its heart, a Pandas **DataFrame** is a two-dimensional, labeled data structure — think of it as a spreadsheet with named columns and an index. Under the hood, each column is stored as a contiguous NumPy array, which is why column-wise operations are fast while row-wise iteration is slow. The golden rule of Pandas: *if you are writing a for-loop over rows, you are almost certainly doing it wrong.*

### GroupBy: Split-Apply-Combine

The `groupby` operation follows a three-stage mental model introduced by Hadley Wickham:

1. **Split** — partition the DataFrame into groups based on one or more keys.
2. **Apply** — apply a function (aggregation, transformation, or filtration) to each group independently.
3. **Combine** — stitch the results back into a single DataFrame.

This pattern underpins nearly every analytical question that starts with "for each category, compute…"

### Merge: SQL-Style Joins in Pandas

`pd.merge()` mirrors the join operations from SQL. The `how` parameter maps directly: `'inner'`, `'left'`, `'right'`, `'outer'`. The `on` parameter specifies the join key(s). When column names differ between tables, use `left_on` and `right_on`. Always verify the resulting row count after a merge — unexpected duplicates from many-to-many joins are a common source of bugs.

### Pivot Tables

A `pivot_table` reshapes long-form data into a summary matrix — rows as one dimension, columns as another, and cell values as an aggregation. It is the Pandas equivalent of a spreadsheet pivot table and is invaluable for cross-tabulation analysis.

### Example 2.1 — GroupBy with Summary Statistics

```python
import pandas as pd

df = pd.DataFrame({
    'region':  ['East', 'West', 'East', 'West', 'East'],
    'product': ['Widget', 'Gadget', 'Gadget', 'Widget', 'Widget'],
    'revenue': [120, 340, 210, 150, 95]
})

summary = df.groupby('region')['revenue'].agg(
    total_revenue='sum',
    avg_order='mean',
    num_transactions='count'
)
print(summary)
#         total_revenue  avg_order  num_transactions
# East              425     141.67                 3
# West              490     245.00                 2
```

The `agg()` method accepts named aggregations — each keyword becomes a column name. This is the idiomatic Pandas approach; avoid calling `.sum()` and `.mean()` separately and merging them back.

| Operation | Method | What It Does |
|-----------|--------|-------------|
| GroupBy | `df.groupby('col').agg()` | Split → apply function → combine results |
| Merge | `df.merge(df2, on='id', how='left')` | SQL-style joins in Python |
| Pivot | `df.pivot_table(values, index, aggfunc)` | Reshape long → wide format |
| Missing data | `df.fillna(0)` / `df.dropna()` | Handle NULL values |
| Apply | `df.apply(fn, axis=1)` | Row/column-wise transformation |

> **Key Insight:** If you're writing a `for` loop over DataFrame rows, you're almost certainly doing it wrong. Use vectorized operations or `groupby` + `agg`.

---

## 2.3 NumPy for Numerical Computing

NumPy is the foundation upon which almost every numerical library in Python is built. Its core contribution is the **ndarray** — a homogeneous, fixed-type, contiguous block of memory that enables *vectorized* operations.

### Why Vectorization Is Faster

A Python `for`-loop that adds two lists element-by-element must, for each iteration: look up the list element (a Python object), unbox the numeric value, perform the addition, box the result, and store it. NumPy sidesteps all of this. Because the array is a raw C buffer of, say, 64-bit floats, it hands the entire operation to a compiled C loop that processes thousands of elements in the time Python would handle one. Speedups of 10–100× are typical.

### Broadcasting

Broadcasting is NumPy's mechanism for performing operations on arrays of different shapes. The smaller array is "broadcast" across the larger one without actually copying data. The rules are simple: dimensions are compared from right to left; they are compatible if they are equal or one of them is 1.

### Array Operations and Dot Products

NumPy overloads Python operators: `+`, `*`, `/` all work element-wise. For matrix multiplication (the dot product), use `@` or `np.dot()`. This distinction trips up many beginners — `*` is Hadamard (element-wise) product, while `@` is the true matrix product.

### Example 2.2 — Matrix Multiplication for Linear Regression

In ordinary least squares, the closed-form solution for the coefficient vector is **β = (X^T X)^−1 X^T y**:

```python
import numpy as np

X = np.array([
    [1, 2, 5],
    [1, 3, 8],
    [1, 5, 12]
], dtype=float)

y = np.array([10, 15, 24], dtype=float)

# Closed-form OLS
XtX     = X.T @ X
XtX_inv = np.linalg.inv(XtX)
beta    = XtX_inv @ X.T @ y

print(beta)  # array([ 0.5,  0.5,  1.5])
# Interpretation: y ≈ 0.5 + 0.5·x1 + 1.5·x2
```

The entire computation uses the `@` operator — no loops, no manual indexing. This is not just concise; it runs orders of magnitude faster than the loop-based equivalent.

> **Key Insight:** When you see `for i in range(len(arr))` with NumPy arrays, stop and ask: "Can I express this as a vectorized operation?" Almost always, the answer is yes.

---

## 2.4 Common Coding Patterns

Many interview problems reduce to a handful of recurring patterns. Recognizing the pattern early lets you skip the brute-force stage and jump straight to the optimal approach.

**Two-Pointer.** Place one pointer at each end of a *sorted* array and walk them inward. If the current sum is too small, advance the left pointer; too large, retreat the right. Solves "find a pair that satisfies a condition" in O(n) without extra space.

**Sliding Window.** Maintain a window (two indices) that slides across a sequence. As the right boundary expands, update a running aggregate; when a constraint is violated, shrink from the left. Handles "longest/shortest subarray with property X" in O(n).

**Hash Map.** Use a dictionary to remember previously seen values, converting nested-loop lookups into O(1) checks. The most versatile pattern — appears in two-sum, group anagrams, subarray sum equals k, and dozens more.

| Pattern | When to Use | Complexity | Classic Examples |
|---------|-------------|------------|-----------------|
| Two Pointers | Sorted array problems | O(n) | Pair sum, container with most water |
| Sliding Window | Subarray/substring problems | O(n) | Longest unique substring, max sum subarray |
| Hash Map | Counting, lookup, grouping | O(n) | Two Sum, frequency counting, anagram detection |
| Sort + Greedy | Optimization problems | O(n log n) | Interval scheduling, activity selection |
| Counter/defaultdict | Frequency counts | O(n) | Word frequencies, most common elements |

### Example 2.3 — Two Sum: Brute Force vs. Hash Map

**Problem:** Given a list of integers and a target, find two numbers that add up to the target. Return their indices.

```python
# ── Naive approach: O(n²) ──
def two_sum_naive(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]

# ── Hash map approach: O(n) ──
def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
```

The naive approach checks every pair, giving O(n²). The hash map version makes a single pass: for each element, it computes the needed complement, checks the dictionary in O(1), and either returns or stores the current element. Total: O(n) time, O(n) space.

> **Key Insight:** The hash map pattern is, arguably, the single most important tool in coding interviews. Whenever a brute-force solution uses a nested loop where the inner loop is *searching* for something, ask: "Can I replace that search with a dictionary lookup?" If yes, you have just shaved an order of magnitude off your complexity.

---

## 2.5 Python Gotchas

Python's readability is a double-edged sword: many behaviours *look* intuitive but harbour subtle surprises. Interviewers love testing these because they reveal depth of understanding.

### Mutable Default Arguments

Default argument values are evaluated **once** — when the function is defined, not each time it is called. If the default is a mutable object (like a list), it is shared across all calls:

```python
def append_to(item, target=[]):
    target.append(item)
    return target

print(append_to(1))   # [1]         — list created at def time
print(append_to(2))   # [1, 2]      — SAME list, not a new one!
print(append_to(3))   # [1, 2, 3]   — it just keeps growing
```

**Step by step:** When Python executes the `def` statement, it creates a single list object `[]` and binds it to `target`. On Call 1, `1` is appended to that list, yielding `[1]`. On Call 2, no new list is created — the same object is reused — so `2` is appended to `[1]`, producing `[1, 2]`.

```python
# The fix: use None as a sentinel
def append_to(item, target=None):
    if target is None:
        target = []
    target.append(item)
    return target
```

### Shallow vs. Deep Copy

Assignment in Python never copies data — it copies *references*. A **shallow copy** creates a new outer container but still shares the inner objects. A **deep copy** recursively duplicates everything.

```python
import copy

original = [[1, 2], [3, 4]]

shallow = copy.copy(original)
shallow[0].append(99)
print(original)  # [[1, 2, 99], [3, 4]] — inner list was shared!

deep = copy.deepcopy(original)
deep[0].append(777)
print(original)  # [[1, 2, 99], [3, 4]] — unaffected
```

### Floor Division Rounds Toward −∞

Python's `//` operator performs floor division — it always rounds toward negative infinity, not toward zero. This matches the mathematical definition but differs from C/Java truncation:

```python
print(7 // 2)     #  3   — both languages agree
print(-7 // 2)    # -4   — Python floors toward -∞
                   #       — C/Java would give -3 (truncate toward 0)
```

If you need C-style truncation, use `int(a / b)` or `math.trunc(a / b)`.

### `is` vs. `==`

The `==` operator compares *values*; `is` compares *identity* (whether two names point to the exact same object in memory). Python interns small integers (−5 to 256) and short strings, so `is` may appear to "work" for those — but this is an implementation detail, not a guarantee.

```python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  — same value
print(a is b)   # False — different objects in memory

x = 256; y = 256
print(x is y)   # True  — interned (implementation detail!)

x = 257; y = 257
print(x is y)   # False — not interned, different objects
```

> **Key Insight:** Use `is` only to check for `None` (i.e., `if x is None`). For everything else, use `==`. Relying on `is` for integers or strings is a bug waiting to happen.

| Gotcha | What Happens | The Fix |
|--------|-------------|---------|
| Mutable defaults | `def f(x=[])`: list shared across all calls | Use `None` sentinel |
| Shallow copy | Inner objects still shared | Use `copy.deepcopy()` |
| Floor division | `-7 // 2 = -4` (rounds toward −∞) | Use `int(a/b)` for truncation |
| `is` vs `==` | `is` checks identity, `==` checks value | Use `is` only for `None` |
