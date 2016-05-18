var guideTpl = require('../tpl/guide.string');
var _ = SPA.util;

SPA.defineView('guide', {
  html: guideTpl,

  // 插件列表
  plugins: [
    'delegated'
  ],

  // 给模板绑定事件
  bindActions: {
    'goto.index': function () {
      // 进入index视图
      SPA.open('index');
    }
  },

  // 给视图绑定事件
  bindEvents: {
    // 在试图还没有打开的时候触发
    beforeShow: function () {
      // swiper
      var mySwiper = new Swiper('#guide-swiper', {
        loop: false
      });
    },

    receiveData: function (d) {
      if(d.data.isExited) {
        _.storage('isLogin', null);
      }
    }
  }
});
