// 引入模板
var searchTpl = require('../tpl/search.string');

// 定义一个视图
SPA.defineView('search', {
  // 将模板写在body里
  html: searchTpl,

  plugins: [
    'delegated'
  ],

  bindActions: {

  }
});
