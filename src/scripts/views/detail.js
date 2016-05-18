var detailTpl = require('../tpl/detail.string');

var _ = SPA.util;

SPA.defineView('detail', {
  html: detailTpl,

  plugins: ['delegated', {
    name: 'avalon',
    options: function (vm) {
      vm.detail = {};
    }
  }],

  bindActions: {
    'close': function () {
      this.hide();
    },
    'commit': function () {

    }
  },

  bindEvents: {
    show: function () {
      var vm = this.getVM();
      $.ajax({
        url: "/api/getDetail.php",

        data: {

          // 获得上个页面的参数
          id: this.param.abc
        },

        success: function (res) {
          vm.detail = res.data;
        }
      });
    }
  }
})
