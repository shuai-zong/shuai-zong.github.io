window.MathJax = {
  loader: { paths: { mathjax: '/assets/vendor/mathjax', sre: '/assets/vendor/mathjax/sre/mathmaps' } },
  tex: {
    inlineMath: [['\\(', '\\)'], ['$', '$']],
    displayMath: [['\\[', '\\]'], ['$$', '$$']],
    macros: {
      Perf: '\\operatorname{Perf}',
      QCoh: '\\operatorname{QCoh}',
      IndCoh: '\\operatorname{IndCoh}',
      Map: '\\operatorname{Map}',
      Hom: '\\operatorname{Hom}',
      Sp: '\\mathrm{Sp}'
    }
  },
  options: { skipHtmlTags: ['script','noscript','style','textarea','pre','code'] }
};
