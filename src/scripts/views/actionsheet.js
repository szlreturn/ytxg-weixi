var actionsheetTpl = require('../tpl/actionsheet.string');

SPA.defineView('actionsheet', {
  html: actionsheetTpl,

  plugins: ['delegated'],

  bindActions: {
    'back': function () {
      this.hide();
    }
  }
})
