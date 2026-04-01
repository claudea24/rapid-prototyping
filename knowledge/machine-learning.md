# Machine Learning — From Theory to Practice

Supervised learning is the most widely used family of machine learning techniques. The premise is simple: you have labeled data — inputs paired with known outputs — and you want to learn a mapping that generalizes to unseen examples. What makes this domain rich is the variety of ways we can learn that mapping, each with its own geometric intuition, assumptions, and failure modes.

---

## 3.1 Supervised Learning Algorithms

**Linear Regression** fits a straight line (or hyperplane) through your data by minimizing the sum of squared residuals. The model assumes a *linear relationship* between features and the target, that residuals are normally distributed and homoscedastic (constant variance), and that features are not highly collinear. When does it fail? When the true relationship is nonlinear, when outliers dominate the squared-error objective, or when multicollinearity inflates coefficient variance. In interviews, emphasize that linear regression is not just a model — it is a *diagnostic framework*. You learn more from its residual plots than from its predictions.

**Logistic Regression** is a *classification* algorithm despite the name. It models the *log-odds* of belonging to the positive class as a linear function: `log(p / (1 − p)) = β₀ + β₁x₁ + … + βₙxₙ`. The sigmoid function squashes this output to the (0, 1) range, yielding a probability. The decision boundary is linear in feature space. Its coefficients are directly interpretable as the change in log-odds per unit change in a feature — a property beloved by stakeholders who want to understand *why* the model makes its predictions.

**Decision Trees** recursively partition the feature space by choosing, at each node, the feature and threshold that best separates the target classes. "Best" is measured by **impurity criteria**: *Gini impurity* quantifies the probability of misclassifying a randomly chosen sample, while *entropy* measures the information content of the split. Trees are wonderfully interpretable and handle nonlinear relationships, missing values, and mixed feature types naturally. Their downfall is *variance* — a small change in the data can produce a completely different tree structure. Left unchecked, they will memorize the training data.

**Random Forest** corrects the high variance of individual trees through **bagging** (bootstrap aggregating). It trains many trees on random subsets of both rows and features, then averages their predictions (regression) or takes a majority vote (classification). By *decorrelating* the trees — each sees a different slice of the data — the ensemble's variance drops dramatically while bias stays roughly the same. This is the statistical equivalent of "the wisdom of crowds."

**Gradient Boosting** builds trees *sequentially*. Each new tree is trained on the **residual errors** of the previous ensemble — it learns to correct the mistakes its predecessors made. The "gradient" comes from performing gradient descent in function space, stepping toward lower loss one tree at a time. Implementations like XGBoost, LightGBM, and CatBoost add regularization, histogram-based splits, and GPU support, making gradient boosting the dominant algorithm in tabular-data competitions.

**Support Vector Machines (SVM)** find the hyperplane that maximizes the *margin* — the distance to the nearest data points of each class (the "support vectors"). For nonlinear problems, the **kernel trick** implicitly maps features into a higher-dimensional space where a linear separator exists, without ever computing the transformation explicitly. SVMs are elegant but scale poorly to very large datasets, and their performance is sensitive to hyperparameters (C, gamma).

**K-Nearest Neighbors (KNN)** is the ultimate *lazy learner* — it stores the entire training set and defers all computation to prediction time. To classify a new point, it finds the *k* closest training points and takes a majority vote. There is no training phase, no learned parameters. It captures complex boundaries effortlessly, but is slow at inference, sensitive to the curse of dimensionality, and requires careful feature scaling since distances are meaningless when features have wildly different ranges.

| Algorithm | Strengths | Weaknesses | When to Use |
|-----------|-----------|------------|-------------|
| **Linear Regression** | Interpretable, fast, coefficients reveal importance | Assumes linearity, sensitive to outliers | Baseline for regression; interpretability paramount |
| **Logistic Regression** | Probabilistic output, interpretable, regularizable | Linear decision boundary only | Binary classification with explainability needs |
| **Decision Tree** | Nonlinear, no scaling, highly interpretable | High variance, prone to overfitting | Quick exploration; visual decision path needed |
| **Random Forest** | Low variance, robust, handles missing values | Less interpretable, slower | General-purpose; accuracy without much tuning |
| **Gradient Boosting** | State-of-the-art tabular, flexible loss | Overfitting risk if not regularized, slow | Competitions and production where accuracy is king |
| **SVM** | High-dim spaces, kernel flexibility | Slow, opaque, hyperparameter-sensitive | Text classification; small/medium datasets |
| **KNN** | No training, complex boundaries | Slow inference, curse of dimensionality | Small datasets; anomaly detection; prototyping |

---

## 3.2 Unsupervised Learning

Unsupervised learning operates without labels. Instead of predicting a target, we seek to discover *structure* hidden in the data.

**K-Means** begins with *k* randomly placed centroids. It alternates two steps: (1) assign each point to its nearest centroid, and (2) recompute each centroid as the mean of its assigned points. This repeats until assignments stabilize. The algorithm converges to a local optimum — different initializations can yield different results, which is why `k-means++` uses smart seeding. The **elbow method** plots within-cluster sum of squares against *k*; the **silhouette score** measures how similar each point is to its own cluster versus neighbors.

**Hierarchical Clustering** builds a tree of merges (agglomerative, bottom-up) or splits (divisive, top-down). The result is a **dendrogram** where the height of each merge indicates the distance between clusters. You "cut" at the desired level to get a specific number of clusters — useful when you want to explore structure at multiple granularities.

**DBSCAN** defines clusters as *dense regions* separated by low-density areas. A point is a **core point** if at least *minPts* neighbors fall within radius *ε*. Core points within *ε* of each other form a cluster; non-core points nearby are absorbed; everything else is **noise**. It doesn't require specifying *k*, finds arbitrary-shaped clusters, and naturally identifies outliers. The trade-off: choosing *ε* and *minPts* requires domain knowledge.

**PCA** finds new axes (principal components) along which data exhibits maximum variance. Mathematically, it computes eigenvectors of the covariance matrix. By keeping only top components, you project high-dimensional data into lower space while preserving information. PCA is linear, fast, and deterministic.

**t-SNE and UMAP** are nonlinear dimensionality reduction techniques for **visualization**. They preserve local neighborhood structure, making clusters visually apparent in 2D. However, both distort global distances — the relative positions and sizes of clusters in the plot do not reflect true relationships. Use them to *see* your data, never to *measure* it.

| Algorithm | Type | Key Property | Use When |
|-----------|------|-------------|----------|
| **K-Means** | Clustering | Fast, spherical clusters | Known k, convex clusters |
| **Hierarchical** | Clustering | Dendrogram exploration | Unknown k, want hierarchy |
| **DBSCAN** | Clustering | Arbitrary shapes, finds outliers | No k needed, noise expected |
| **PCA** | Dim. Reduction | Linear, fast, deterministic | Feature reduction, preprocessing |
| **t-SNE / UMAP** | Dim. Reduction | Nonlinear, preserves local structure | 2D visualization only |

### Example 3.1 — Customer Segmentation

An e-commerce company collects features: average order value, purchase frequency, days since last purchase, category preferences, and session duration. After standardizing (essential for Euclidean distance), we run K-Means with k = 2 through 10. The elbow appears at k = 4, revealing four personas: **Loyal High-Spenders** (frequent, high AOV), **Bargain Hunters** (frequent but low AOV, spike during sales), **Window Shoppers** (high session duration, low conversion), and **Churning Customers** (long recency, declining frequency). Marketing tailors campaigns to each segment. Silhouette score: 0.42 — reasonable for real-world data.

---

## 3.3 Evaluation Metrics

**Accuracy** is the proportion of correct predictions. It is intuitive but dangerously misleading with **imbalanced data**. A fraud detection model predicting "not fraud" for everything achieves 99.5% accuracy while catching zero fraud.

**Precision** answers: "Of all items flagged positive, how many actually were?" **Recall** answers: "Of all actual positives, how many did the model catch?" These are in tension — improving one typically hurts the other. A spam filter wants high **precision** (don't block legitimate email). A phishing detector wants high **recall** (catch every threat).

**F1 Score** is the *harmonic mean* of precision and recall: `F1 = 2 × (P × R) / (P + R)`. The harmonic mean punishes extreme imbalances — if precision is 1.0 and recall is 0.01, arithmetic mean is 0.505 but F1 is only 0.0198.

**AUC-ROC** plots True Positive Rate vs. False Positive Rate at every threshold. Area under the curve: 0.5 = random, 1.0 = perfect. AUC is *threshold-independent* — useful when comparing models or when you haven't decided on a threshold.

**RMSE** penalizes large errors disproportionately (squaring). **MAE** treats all errors linearly. If big misses are especially costly (hospital wait times), use RMSE. If all errors are equally bad per unit, use MAE.

| Metric | Formula Idea | Fails When | Use When |
|--------|-------------|------------|----------|
| **Accuracy** | (TP+TN) / total | Imbalanced classes | Balanced datasets |
| **Precision** | TP / (TP+FP) | — | Cost of FP is high (spam filter) |
| **Recall** | TP / (TP+FN) | — | Cost of FN is high (disease detection) |
| **F1 Score** | Harmonic mean of P & R | — | Need balance of precision and recall |
| **AUC-ROC** | Area under TPR vs FPR | — | Comparing models, threshold-independent |
| **RMSE** | √(mean squared errors) | — | Penalize large errors (regression) |
| **MAE** | Mean absolute errors | — | Treat all errors equally (regression) |

> **Key Insight:** Before choosing a metric, always ask: "What is the cost of a false positive versus a false negative?" The answer should drive every downstream decision — your metric, your threshold, your model, and how you present results to stakeholders.

---

## 3.4 The Bias-Variance Tradeoff

### The Dartboard Analogy

Imagine throwing darts at a target, where the bullseye is the true answer:

- **High bias, low variance:** Darts cluster tightly, but consistently away from the bullseye. The model has learned a systematically wrong pattern — it *underfits*.
- **Low bias, high variance:** Darts are centered around the bullseye on average, but scattered widely. The model captures noise as signal — it *overfits*.
- **Low bias, low variance:** Darts are tightly clustered around the bullseye — the sweet spot.

**Total Error = Bias² + Variance + Irreducible Noise.** Reducing bias (more complex model) typically increases variance, and vice versa.

| Scenario | Bias | Variance | Symptom | Fix |
|----------|------|----------|---------|-----|
| Underfitting | High | Low | Poor on train AND test | More features, complex model |
| Sweet spot | Low | Low | Good on both | Keep it |
| Overfitting | Low | High | Great train, poor test | Regularization, more data, simpler model |

### Regularization: L1 vs L2

**L1 (Lasso)** adds sum of |coefficients| to the loss. Key property: *sparsity* — drives some coefficients to exactly zero, performing feature selection. Use when many features are irrelevant.

**L2 (Ridge)** adds sum of coefficients². Shrinks all coefficients toward zero but rarely eliminates any. Provides *stability*, especially when features are correlated.

**Elastic Net** combines both, blending L1's sparsity with L2's stability.

### Example 3.2 — Polynomial Regression

- **Degree 1 (linear):** Straight line through curved data. High bias, low variance. *Underfitting.*
- **Degree 3–4:** Captures the true nonlinear trend without chasing noise. Minimum test error. *Sweet spot.*
- **Degree 15:** Wiggles wildly through every training point. Near-zero training error, but test error explodes. *Overfitting.*

The gap between training and test error is a direct measure of overfitting. When that gap widens, simplify or regularize.

---

## 3.5 Feature Engineering

Feature engineering is the art of transforming raw data into representations that make algorithms work better. It frequently matters more than model choice.

**One-Hot Encoding.** Nominal categories (no order) → binary columns. Prevents assuming "red=1, blue=2, green=3" implies blue is "between" red and green. For *ordinal* variables, use integer encoding preserving rank.

**Feature Scaling.** Critical for distance/gradient algorithms (KNN, SVM, logistic, PCA, neural nets). Immune for trees. StandardScaler (z-score) is the default; MinMaxScaler for bounded output.

**Log Transforms.** Right-skewed distributions (income, prices, views). `log(x + 1)` compresses the tail and symmetrizes. Remember to reverse: `exp(y) - 1`.

**Target Encoding.** Replaces category with mean of target for that category. Powerful for high-cardinality features but introduces *data leakage*: the target is used to construct the feature. Mitigate with smoothing and compute within CV folds.

| Technique | When | Watch Out |
|-----------|------|-----------|
| One-hot encoding | Nominal categories | High cardinality → many columns |
| Label encoding | Ordinal categories | Don't use for nominal |
| StandardScaler | KNN, SVM, logistic, PCA | Not needed for trees |
| Log transform | Right-skewed data | Remember to reverse |
| Target encoding | High cardinality | Data leakage risk |

> **Key Insight:** Feature engineering often matters more than model choice. Simple logistic regression on well-crafted features can outperform gradient boosting on raw features.

---

## 3.6 Cross-Validation and Data Leakage

### K-Fold Cross-Validation

Split data into *k* equal folds. Each iteration: one fold as test, *k−1* as train. Every point appears in both roles exactly once. 5-fold or 10-fold is standard.

```python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring='f1')
print(f"Mean F1: {scores.mean():.3f} (+/- {scores.std():.3f})")
```

### Time Series Cross-Validation

Standard k-fold is **fatal** for time series — it trains on future data. Time series CV respects temporal order: training set only includes data *before* the test period, and the test window slides forward.

### Data Leakage

The most insidious form: **fitting preprocessing on the full dataset** before splitting. If you standardize using the mean and std of the entire dataset (including test), the model implicitly "knows" something about the test data. The same applies to imputing, computing target encodings, or selecting features.

**Rule:** Everything that learns from data must be fit inside the training fold only. Use `Pipeline` to ensure containment.

### Example 3.3 — How Leakage Inflates Accuracy

A data scientist builds a hospital readmission model. They compute "average length of stay" including the current (unfinished) visit, and scale all features on the full dataset before splitting. Reported AUC: 94%. Production AUC: **68%**. Two leaks compounded for a 26-point drop.

> **Key Insight:** If performance seems "too good to be true," it almost certainly is. The most common culprit is data leakage. Audit every feature: "Would I have this information at the moment of prediction?" If not, remove it.
