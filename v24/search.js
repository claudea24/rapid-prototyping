/* ===== v24 Cmd+K Search ===== */
(function(){
  const INDEX = [
    // Sections
    { title:'SQL — Execution Order', type:'SQL', url:'sql.html', tags:'select from where group by having order limit execution logical' },
    { title:'SQL — Joining Tables', type:'SQL', url:'sql.html#joins', tags:'inner join left right full outer cross join' },
    { title:'SQL — Window Functions', type:'SQL', url:'sql.html#windows', tags:'row_number rank dense_rank partition over lag lead' },
    { title:'SQL — CTEs', type:'SQL', url:'sql.html#ctes', tags:'common table expression with recursive cte' },
    { title:'Python — Data Structures', type:'Python', url:'python.html', tags:'list dict set deque heap hash map' },
    { title:'Python — Pandas', type:'Python', url:'python.html#pandas', tags:'groupby merge pivot dataframe agg' },
    { title:'Python — Coding Patterns', type:'Python', url:'python.html#patterns', tags:'two sum hash map sliding window two pointer' },
    { title:'Python — Gotchas', type:'Python', url:'python.html#gotchas', tags:'mutable default shallow copy is vs equals' },
    { title:'ML — Supervised Learning', type:'ML', url:'ml.html', tags:'linear logistic regression decision tree random forest gradient boosting svm knn' },
    { title:'ML — Evaluation Metrics', type:'ML', url:'ml.html#metrics', tags:'accuracy precision recall f1 auc roc rmse mae' },
    { title:'ML — Bias-Variance Tradeoff', type:'ML', url:'ml.html#bias-variance', tags:'overfitting underfitting regularization l1 l2 lasso ridge' },
    { title:'ML — Cross-Validation & Leakage', type:'ML', url:'ml.html#cv', tags:'k-fold data leakage pipeline time series' },
    { title:'Statistics — Descriptive Stats', type:'Stats', url:'stats.html', tags:'mean median mode variance standard deviation iqr' },
    { title:'Statistics — Hypothesis Testing', type:'Stats', url:'stats.html#hypothesis', tags:'p-value null hypothesis type I type II power significance' },
    { title:'Statistics — A/B Testing', type:'Stats', url:'stats.html#ab', tags:'experiment peeking multiple comparisons novelty simpson' },
    { title:'Statistics — CLT', type:'Stats', url:'stats.html#clt', tags:'central limit theorem sample mean normal distribution' },
    { title:'Probability — Bayes Theorem', type:'Probability', url:'probability.html', tags:'bayes posterior prior likelihood conditional probability' },
    { title:'Probability — Distributions', type:'Probability', url:'probability.html#distributions', tags:'bernoulli binomial poisson geometric normal exponential' },
    { title:'Probability — Expected Value', type:'Probability', url:'probability.html#ev', tags:'expected value variance linearity' },
    { title:'Probability — Classic Puzzles', type:'Probability', url:'probability.html#puzzles', tags:'birthday monty hall coupon collector' },
    { title:'Casing — Product Metrics', type:'Casing', url:'casing.html', tags:'aarrr acquisition activation retention revenue referral north star' },
    { title:'Casing — Metric Investigation', type:'Casing', url:'casing.html#diagnose', tags:'metric drop investigation segment diagnose' },
    { title:'Casing — Market Sizing', type:'Casing', url:'casing.html#market', tags:'market sizing top down bottom up estimation' },
    { title:'Casing — Experiment Design', type:'Casing', url:'casing.html#experiment', tags:'experiment design ab test randomization guardrail' },
    // Mock Interview
    { title:'Mock: SQL Execution Order', type:'Mock', url:'mock.html#sql', tags:'sql mock interview execution order' },
    { title:'Mock: Window Functions', type:'Mock', url:'mock.html#sql', tags:'sql mock window rank' },
    { title:'Mock: Python Two Sum', type:'Mock', url:'mock.html#python', tags:'python mock two sum hash' },
    { title:'Mock: ML Model Selection', type:'Mock', url:'mock.html#ml', tags:'ml mock model selection' },
    { title:'Mock: Precision vs Recall', type:'Mock', url:'mock.html#ml', tags:'precision recall mock ml' },
    { title:'Mock: P-Value', type:'Mock', url:'mock.html#stats', tags:'p-value mock stats hypothesis' },
    { title:'Mock: Bayes Medical Test', type:'Mock', url:'mock.html#probability', tags:'bayes mock probability medical' },
    { title:'Mock: Metric Drop', type:'Mock', url:'mock.html#casing', tags:'metric drop casing mock investigation' },
    // Playground
    { title:'Playground: Fix the Query (SQL)', type:'Playground', url:'playground.html#sql', tags:'sql playground fix query easy' },
    { title:'Playground: LEFT JOIN Pattern (SQL)', type:'Playground', url:'playground.html#sql', tags:'sql playground left join easy' },
    { title:'Playground: Window Top-3 (SQL)', type:'Playground', url:'playground.html#sql', tags:'sql playground window rank medium' },
    { title:'Playground: CTE Month-over-Month (SQL)', type:'Playground', url:'playground.html#sql', tags:'sql playground cte month hard' },
    { title:'Playground: Set Dedup (Python)', type:'Playground', url:'playground.html#python', tags:'python playground set dedup easy' },
    { title:'Playground: GroupBy Revenue (Python)', type:'Playground', url:'playground.html#python', tags:'python playground groupby revenue easy' },
    { title:'Playground: Two Sum (Python)', type:'Playground', url:'playground.html#python', tags:'python playground two sum medium' },
    { title:'Playground: Mutable Default Fix (Python)', type:'Playground', url:'playground.html#python', tags:'python playground mutable default hard' },
    // Dashboard
    { title:'Dashboard — Diagnostic', type:'Home', url:'diagnostic.html', tags:'diagnostic quiz assessment weak spot' },
    { title:'Dashboard — Progress', type:'Home', url:'index.html', tags:'dashboard progress mastery rings' },
    { title:'Mock Interview Hub', type:'Home', url:'mock.html', tags:'mock interview conversational' },
    { title:'Coding Playground Hub', type:'Home', url:'playground.html', tags:'coding playground sandbox editor' }
  ];

  function initSearch(){
    const overlay = document.querySelector('.search-overlay');
    if(!overlay) return;
    const input = overlay.querySelector('input');
    const results = overlay.querySelector('.search-results');
    const trigger = document.getElementById('search-trigger');

    function open(){ overlay.classList.add('open'); input.value=''; results.innerHTML=''; setTimeout(()=>input.focus(),50); }
    function close(){ overlay.classList.remove('open'); }

    if(trigger) trigger.addEventListener('click', open);
    overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
    document.addEventListener('keydown', e=>{
      if((e.metaKey||e.ctrlKey) && e.key==='k'){ e.preventDefault(); open(); }
      if(e.key==='Escape') close();
    });

    input.addEventListener('input', ()=>{
      const q = input.value.toLowerCase().trim();
      if(!q){ results.innerHTML=''; return; }
      const tokens = q.split(/\s+/);
      const matches = INDEX.filter(item=>{
        const hay = (item.title+' '+item.tags+' '+item.type).toLowerCase();
        return tokens.every(t=>hay.includes(t));
      }).slice(0,10);
      if(!matches.length){
        results.innerHTML='<div class="no-results">No results found</div>';
        return;
      }
      results.innerHTML = matches.map(m=>
        `<a href="${m.url}"><span class="sr-type">${m.type}</span>${m.title}</a>`
      ).join('');
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initSearch);
  else initSearch();
})();
