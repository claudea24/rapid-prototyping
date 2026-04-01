# Statistics — The Foundation of Inference

Before modeling, before hypothesis testing, before anything else, you must describe your data. Descriptive statistics compress a dataset into a handful of numbers that capture its shape and tendencies. Choosing the wrong summary can mislead you entirely.

---

## 4.1 Descriptive Statistics

### Measures of Central Tendency

The **mean** (arithmetic average) sums every observation and divides by the count. It is sensitive to outliers: a single billionaire in a room of teachers will drag the mean salary far above what any teacher actually earns. Use the mean when your data is roughly symmetric — heights, exam scores, measurement errors.

The **median** is the middle value when data is sorted. It is robust to outliers and skew. Income distributions, home prices, and response times are all better summarized by the median. If someone asks "what does the typical household earn?" the median is almost always the right answer.

The **mode** is the most frequently occurring value. It is the only measure of central tendency that works for categorical data (the most common shirt size, the most popular browser). For continuous data, the mode is rarely used in practice.

### Measures of Spread

**Variance** measures how far observations are from the mean, on average. More precisely, it is the mean of squared deviations. Squaring serves two purposes: it makes all deviations positive, and it penalizes large deviations more heavily than small ones.

**Standard deviation** is the square root of variance. It has the same units as the data, making it far more interpretable. "The standard deviation of heights is 3 inches" means something; "the variance is 9 square inches" is harder to grasp.

**IQR** (Interquartile Range) is Q3 − Q1 — the spread of the middle 50% of data. It is robust to outliers. The **1.5×IQR rule** flags values below Q1 − 1.5×IQR or above Q3 + 1.5×IQR as potential outliers.

| Measure | What It Tells You | Sensitive To | When to Use |
|---------|-------------------|-------------|-------------|
| **Mean** | Average value | Outliers, skew | Symmetric data |
| **Median** | Middle value | Nothing (robust) | Skewed data, outliers present |
| **Mode** | Most frequent | — | Categorical data |
| **Variance** | Spread (squared units) | Outliers | Mathematical properties needed |
| **Std Dev** | Spread (same units) | Outliers | Reporting spread |
| **IQR** | Middle 50% spread | Nothing (robust) | Outlier detection |

> **Key Insight:** Always ask "is my data skewed?" If yes or outliers suspected, prefer median and IQR over mean and standard deviation. Using the wrong summary statistic is common, quiet damage.

---

## 4.2 Hypothesis Testing

### The Framework, Step by Step

1. **Formulate hypotheses:** H₀ (null — status quo, no effect), H₁ (alternative — suspected effect)
2. **Choose significance level α** (conventional: 0.05; medical/legal: 0.01)
3. **Collect data**
4. **Compute test statistic**
5. **Compare to critical value or compute p-value**
6. **Conclude:** reject or fail to reject H₀

### What the P-Value Actually Means

The p-value is the probability of observing data at least as extreme as what you got, **assuming H₀ is true**.

- It does **NOT** mean the probability that H₀ is true.
- It does **NOT** mean the probability that the result is due to chance.
- It is conditional on H₀ being correct.

A small p-value says: "data this extreme would be very unlikely if H₀ were true." It does *not* tell you how likely H₀ is.

### Type I and Type II Errors

| Error | Name | Analogy | Probability |
|-------|------|---------|-------------|
| **Type I** | False Positive | Convicting an innocent person | α (usually 0.05) |
| **Type II** | False Negative | Acquitting a guilty person | β |
| **Power** | Correct Rejection | Catching the guilty | 1 − β (target ≥ 0.80) |

### Worked Example: Testing a New Feature

A product team launches a new onboarding flow. Baseline conversion: 12%.

- H₀: New flow has no effect (conversion = 12%)
- H₁: New flow increases conversion (> 12%)
- Sample: 2,000 users, observed 13.8% conversion
- z = 2.48, p = 0.0066
- p < 0.05 → **Reject H₀**: the new flow significantly increases conversions.

---

## 4.3 Common Statistical Tests

| Test | When | Assumes | Example |
|------|------|---------|---------|
| **z-test** | Large n, population σ known | Normality | Rare in practice |
| **t-test** | Unknown σ, any sample size | Normality | Comparing two group means |
| **Paired t-test** | Same subjects, before/after | Paired differences normal | Pre/post treatment |
| **Chi-squared** | Two categorical variables | Expected counts ≥ 5 | Independence testing |
| **ANOVA** | 3+ groups | Normality, equal variance | Comparing multiple group means |
| **Mann-Whitney U** | Non-parametric | — | When normality is violated |

### Decision Flowchart

1. **Is the outcome categorical?** → Yes → **Chi-squared test**
2. **Continuous → How many groups?**
   - One sample vs. known value → **One-sample t-test** (or z-test if σ known)
   - Two groups → continue
   - Three or more groups → **ANOVA** (then post-hoc Tukey's HSD)
3. **Are observations paired?** → Yes → **Paired t-test**
4. **Can you assume normality?** → Yes → **Independent-samples t-test** / No → **Mann-Whitney U**

---

## 4.4 Confidence Intervals

### Formula

```
CI = x̄ ± z* × (σ / √n)
```

- x̄ = sample mean
- z* = critical value (1.645 for 90%, 1.96 for 95%, 2.576 for 99%)
- σ = population SD (or estimate s)
- n = sample size

### Correct Interpretation

A 95% CI does **NOT** mean "there is a 95% probability the true parameter is in this interval."

**Correct interpretation:** If we repeated the sampling procedure 100 times, approximately 95 of those intervals would contain the true parameter. Confidence is in the **procedure**, not the single interval.

### Factors Controlling Width

| Factor | Effect on Width | Can You Control? |
|--------|----------------|-----------------|
| Sample size n | Larger → narrower (via √n) | Yes — run bigger study |
| Variability σ | More → wider | No (inherent to data) |
| Confidence level | 99% wider than 95% | Yes (trade-off with precision) |

### Worked Example: Average Session Duration

- Sample: 200 sessions, mean = 4.2 minutes, SD = 1.8 minutes
- SE = 1.8 / √200 ≈ 0.127
- Margin = 1.96 × 0.127 ≈ 0.249
- 95% CI = (3.95, 4.45) minutes
- We are 95% confident the procedure captured the true average session duration.

---

## 4.5 A/B Testing

### The Full Process

1. **Define metric** — specific, measurable, decided before the experiment starts
2. **Conduct power analysis** — determine sample size from MDE, α, power
3. **Randomize** — typically user-level assignment
4. **Run for fixed duration** — decided in advance, no early stopping
5. **Analyze** — compute test statistic, p-value, confidence intervals at the predetermined end
6. **Measure** — document how to validate the recommendation

### Pitfalls

| Pitfall | What Goes Wrong | The Fix |
|---------|----------------|---------|
| **Peeking** | Checking daily and stopping when p < 0.05 inflates FP rate from 5% to ~30%. Each peek is another hypothesis test. | Decide duration in advance. If monitoring needed, use sequential testing (group sequential designs, always-valid p-values). |
| **Multiple comparisons** | Testing 10 metrics simultaneously: ~40% chance of finding one "significant" by chance. | Bonferroni correction: divide α by number of tests (α = 0.05/10 = 0.005). Conservative but simple and widely accepted. |
| **Novelty effect** | Users engage more with new features simply because they're new. The lift fades over time. | Run the experiment long enough for novelty to wear off. Examine time trends within the experiment period. |
| **Simpson's paradox** | Overall positive result masks negative results in every subgroup when subgroups differ in size. | Always segment results by key dimensions (platform, geography, user cohort). |

> **Key Insight:** The hardest part of A/B testing isn't the statistics — it's defining the right metric. Spend as much time debating the metric as analyzing results.

---

## 4.6 The Central Limit Theorem

### The Statement

Take **any** population with finite mean μ and standard deviation σ. Draw random samples of size n. As n grows, the distribution of sample means approaches a **normal distribution** with:

- Mean = μ (same as population)
- Standard Error = σ / √n

### The Intuition

Roll a single die: you get a uniform distribution (each face equally likely). Now roll 30 dice and compute the average: you get a beautiful bell-shaped curve centered at 3.5. This works for *any* starting distribution — skewed, bimodal, discrete — as long as variance is finite. Rule of thumb: n ≥ 30 is usually sufficient, though more skewed populations need larger samples.

### Why It Matters

The entire edifice of frequentist inference rests on the CLT:

- **Confidence intervals** use the formula x̄ ± z*·SE, which relies on x̄ being approximately normal.
- **P-values** compare test statistics to the standard normal distribution, which relies on CLT.
- Without CLT, we would need to know the exact population distribution before making any inference.

### Worked Example: CLT with Skewed Population

User session durations are highly right-skewed (mostly short visits, some 30+ minute sessions). Draw n = 50 sessions and compute the mean. Repeat 1,000 times. The histogram of 1,000 sample means forms a smooth, symmetric bell curve — despite the underlying data being wildly skewed. This is why confidence intervals on "average session duration" work.

> **Key Insight:** The Law of Large Numbers tells us that sample means converge to the true mean. The CLT tells us *how* — normally, with SE = σ/√n. Together, they form the foundation of statistical inference.
