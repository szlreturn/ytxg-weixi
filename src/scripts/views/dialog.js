var dialogTpl = require('../tpl/dialog.string');

var _ = SPA.util;

SPA.defineView('dialog', {
  html: dialogTpl,

  styles: {
    background: 'transparent !important'
  },

  plugins: ['delegated'],

  bindActions: {
    'close': function () {
      this.hide();
    },
    'commit': function () {
      _.storage('isLogin', true);
      this.hide();
    }
  }
})
