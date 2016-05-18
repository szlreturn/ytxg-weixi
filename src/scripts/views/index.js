// 引入模板
var indexTpl = require('../tpl/index.string');

var _ = SPA.util;

// 定义一个视图
SPA.defineView('index', {
  // 将模板写在body里
  html: indexTpl,

  // 定义子视图
  modules: [{
    name: 'content',
    views: ['home', 'search', 'my'],
    container: '.m-index-container',
    defaultTag: 'home'
  }],

  init: {
    setActive: function (obj) {
      obj.addClass('active').siblings().removeClass('active');
    }
  },

  plugins: [
    'delegated'
  ],

  bindActions: {
    // 切换子视图
    'tap.switch': function (e, data) {
      // 切换：launch方法里传入视图的名字
      this.modules.content.launch(data.tag);
      this.setActive($(e.el));
    },

    // 我的试图切换
    'tap.my': function (e, data) {
      this.setActive($(e.el));
      this.modules.content.launch('my');

      // localstorage 操作
      if(!_.storage('isLogin')) {
        // 打开dialog视图
        SPA.open('dialog', {
          ani: {
            name: 'dialog',
            width: 280,
            height: 200,
            autoHide: true
          }
        });
      }
    },

    'tap.exit': function () {
      // 关闭视图
      this.hide({
        isExited: true
      });
    }
  }
});
