require('./lib/spa.min.js');
require('./lib/swiper-3.3.1.min.js');

// require views
require('./views/guide.js');
require('./views/home.js');
require('./views/search.js');
require('./views/detail.js');
require('./views/my.js');
require('./views/dialog.js');
require('./views/actionsheet.js');
require('./views/index.js');

// 定义默认视图
SPA.config({
  indexView: 'guide'
});
