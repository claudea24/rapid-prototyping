# Probability — Reasoning Under Uncertainty

Probability is the mathematical language of uncertainty. Every confidence interval, every p-value, every Bayesian model rests on its foundation. This chapter builds from axioms to the puzzles that interviewers love — not as trivia to memorize, but as exercises in careful conditional reasoning.

---

## 5.1 Fundamentals

### Core Rules

**Addition Rule:** P(A ∪ B) = P(A) + P(B) − P(A ∩ B). We subtract the intersection because it is counted once in P(A) and once in P(B) — without correction, we would double-count. For mutually exclusive events (no overlap), this simplifies to P(A ∪ B) = P(A) + P(B).

**Multiplication Rule:** P(A ∩ B) = P(A) · P(B|A). The probability of both A and B equals the probability of A times the probability of B given A occurred. This is the chain rule of probability.

**Independence:** Events A and B are independent if P(B|A) = P(B) — learning that A occurred doesn't change your belief about B. For independent events: P(A ∩ B) = P(A) · P(B).

**Complement:** P(A) = 1 − P(Aᶜ). Often it is far easier to count what *doesn't* happen. "What is the probability that at least one person..." is almost always easier solved as 1 − P(nobody does).

### Permutations vs. Combinations

**Permutations:** Ordered arrangements. P(n, k) = n! / (n−k)! — how many ways to arrange k items from n when order matters.

**Combinations:** Unordered selections. C(n, k) = n! / (k!(n−k)!) — how many ways to choose k items from n when order doesn't matter.

The test: does swapping two selected items create a *different* outcome? If yes, permutations. If no, combinations.

### Example 5.1 — Committee Formation

Form a committee of 3 from 10 people. Since the committee is an unordered group (no special roles): C(10, 3) = 10! / (3! · 7!) = (10 × 9 × 8) / (3 × 2 × 1) = 120 ways.

If each member has a distinct role (chair, secretary, treasurer): P(10, 3) = 10 × 9 × 8 = 720 arrangements.

| Rule | Formula | Key Point |
|------|---------|-----------|
| Addition | P(A∪B) = P(A) + P(B) − P(A∩B) | Subtract intersection (counted twice) |
| Multiplication | P(A∩B) = P(A) · P(B\|A) | Chain conditional probabilities |
| Independence | P(A∩B) = P(A) · P(B) | Learning A doesn't change P(B) |
| Complement | P(A) = 1 − P(Aᶜ) | Count what doesn't happen |
| Permutations | n! / (n−k)! | Order matters |
| Combinations | n! / (k!(n−k)!) | Order doesn't matter |

> **Key Insight:** "At least one..." problems → solve as 1 − P(nobody does). This complementary counting appears in the birthday problem, network reliability, and dozens of interview questions.

---

## 5.2 Conditional Probability and Bayes' Theorem

### Conditional Probability

P(A|B) = P(A ∩ B) / P(B). Read: "probability of A given that B has occurred." Conditioning narrows the sample space: B becomes your new universe, and you ask how much of B is also A.

### Bayes' Theorem

```
P(A|B) = P(B|A) · P(A) / P(B)
```

In words: **Posterior = (Likelihood × Prior) / Evidence.**

- **Prior** P(A): your belief before seeing data
- **Likelihood** P(B|A): probability of the data under your hypothesis
- **Evidence** P(B): overall probability of the data (normalizing constant)
- **Posterior** P(A|B): your updated belief after seeing data

### Example 5.2 — The Medical Test Problem

A disease affects 1% of the population. A test is 99% accurate (99% sensitivity, 99% specificity). You test positive. What's the probability you actually have the disease?

**Intuition says:** 99%. **Reality:** ~50%.

**Setup:**
- P(D) = 0.01 (prevalence)
- P(+|D) = 0.99 (sensitivity — positive given disease)
- P(+|D') = 0.01 (false positive rate)

**Step 1 — Compute P(+) using the law of total probability:**
```
P(+) = P(+|D) · P(D) + P(+|D') · P(D')
     = 0.99 × 0.01 + 0.01 × 0.99
     = 0.0099 + 0.0099
     = 0.0198
```

**Step 2 — Apply Bayes' theorem:**
```
P(D|+) = P(+|D) · P(D) / P(+)
       = 0.0099 / 0.0198
       = 0.50 (50%)
```

**Why so low?** Consider 10,000 people: 100 are sick (99 test positive), 9,900 are healthy (99 falsely test positive). Total positives: 198. Only 99 are actually diseased — exactly half. The **base rate** (1% prevalence) dominates the calculation. A 99% accurate test is not very useful when the condition is rare.

---

## 5.3 Key Distributions

**Bernoulli:** The building block — a single yes/no trial with probability p of success. P(X = 1) = p, P(X = 0) = 1 − p.

**Binomial:** The sum of n independent Bernoulli trials. P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ. "Out of n attempts, exactly k successes."

**Poisson:** Models the count of events in a fixed interval when events occur independently at a constant average rate λ. P(X = k) = e⁻λ · λᵏ / k!. Approximates Binomial when n is large and p is small (λ = np).

**Geometric:** Number of trials until the first success. P(X = k) = (1−p)ᵏ⁻¹ · p. Memoryless: "how long until the next success?"

**Normal (Gaussian):** The bell curve, defined by mean μ and standard deviation σ. The **68-95-99.7 rule:** ~68% of data falls within 1σ, ~95% within 2σ, ~99.7% within 3σ.

**Exponential:** Time between events in a Poisson process, parameter λ. Has the **memoryless property:** P(X > s+t | X > s) = P(X > t) — the time you've already waited doesn't affect the probability of waiting longer.

| Distribution | Type | Parameters | Mean | Variance | Models |
|-------------|------|-----------|------|----------|--------|
| **Bernoulli** | Discrete | p | p | p(1−p) | Single yes/no trial |
| **Binomial** | Discrete | n, p | np | np(1−p) | Successes in n trials |
| **Poisson** | Discrete | λ | λ | λ | Events in fixed interval |
| **Geometric** | Discrete | p | 1/p | (1−p)/p² | Trials until first success |
| **Normal** | Continuous | μ, σ | μ | σ² | Bell curve — everything |
| **Exponential** | Continuous | λ | 1/λ | 1/λ² | Time between events |

---

## 5.4 Expected Value and Variance

### Expected Value

```
E[X] = Σ x · P(X = x)
```

The long-run average of a random variable. If you played a game infinitely many times, the average payoff would converge to E[X].

### Variance

```
Var(X) = E[X²] − (E[X])²
```

How spread out the random variable is around its mean. Standard deviation σ = √Var(X) gives spread in the same units as X.

### Linearity of Expectation

```
E[aX + bY] = a · E[X] + b · E[Y]
```

**This works even when X and Y are dependent!** This is incredibly powerful for interview problems. You can decompose complex expected values into simple pieces without worrying about dependencies.

### Variance Properties

```
Var(aX + b) = a² · Var(X)
If X, Y independent: Var(X + Y) = Var(X) + Var(Y)
```

Note: variance of a sum only decomposes nicely for independent variables. For dependent variables, you must include the covariance term.

### Example 5.3 — Expected Winnings

Pay $5 to roll a fair die. Roll 6 → win $20. Roll 4 or 5 → win $10. Otherwise → win $0.

```
E[winnings] = (1/6) · 20 + (2/6) · 10 + (3/6) · 0 − 5
            = 3.33 + 3.33 + 0 − 5
            = $1.67
```

The expected profit is positive — you should play this game.

---

## 5.5 The Law of Large Numbers

As sample size n → ∞, the sample mean X̄ₙ converges to the population mean μ. More data = more reliable estimates.

### Why This Matters for Data Science

- **A/B testing backbone:** The observed conversion rate is a sample mean. LLN guarantees it converges to the true rate with enough data.
- Small samples are noisy. Large samples are reliable. This is why experiments run for weeks, not hours.
- "We tried it once and it didn't work" is not a statistically valid conclusion.

> **Key Insight:** The Law of Large Numbers tells us that sample means converge to the true mean. The Central Limit Theorem tells us *how* — normally, with SE = σ/√n. Together, they form the foundation of statistical inference.

---

## 5.6 Classic Interview Puzzles

These puzzles test careful reasoning, not memorization. Interviewers look for problem decomposition, correct conditional probability, and the ability to check whether an answer passes the smell test.

### The Birthday Problem

**Question:** How many people do you need in a room before there's a ≥50% chance two share a birthday?

**Answer:** 23 people.

**Approach:** Use complementary counting. P(at least one match) = 1 − P(all unique).

```
P(all unique) = (365/365) × (364/365) × (363/365) × ...
```

At n = 23, P(at least one match) crosses 50%. At n = 50, it exceeds 97%.

**Why 23 is enough:** 23 people = C(23, 2) = 253 pairs to compare. Each pair has a 1/365 chance of matching. With 253 "chances," a match becomes likely.

### The Monty Hall Problem

**Setup:** 3 doors, 1 car, 2 goats. You pick a door. The host (who knows what's behind each door) opens a *different* door, revealing a goat. Should you switch?

**Answer:** Yes — switching wins 2/3 of the time.

**Why:** Your initial pick has a 1/3 chance. The other two doors collectively have 2/3. When the host reveals a goat behind one of them, all 2/3 concentrates on the remaining unopened door.

| Scenario | Stay | Switch |
|----------|------|--------|
| Car behind your door (1/3) | Win | Lose |
| Car behind door 2 (1/3) | Lose | Win |
| Car behind door 3 (1/3) | Lose | Win |

### The Coupon Collector Problem

**Question:** On average, how many boxes must you buy to collect all n distinct coupons (one random coupon per box)?

After collecting k unique coupons, the probability the next box has a new one is (n−k)/n. Expected boxes for the next new coupon: n/(n−k).

```
E[T] = n/n + n/(n−1) + n/(n−2) + ... + n/1 = n · H(n)
```

H(n) = harmonic number ≈ ln(n) + 0.5772 for large n.

Example: n = 50 → E[T] ≈ 50 × 4.49 ≈ 225 boxes.

> **Key Insight:** These puzzles test your ability to decompose problems, apply conditional probability correctly, and verify your answer makes sense. When unsure, try a small example first (2 doors, 3 people) to build intuition.
