// 引入模板
var homeTpl = require('../tpl/home.string');

// 定义一个视图
SPA.defineView('home', {
  // 将模板写在body里
  html: homeTpl,

  plugins: [
    'delegated',
    {
      name: 'avalon',
      options: function (vm) {
        vm.homeList = [];

        // 定义一个homelist临时公共数组
        vm.homeTempList = [];

        // 保存是否加载完数据，显示loading...
        vm.isShowLoading = true;

        // 保存用户输入的内容
        vm.surname = "";
      }
    }
  ],

  // 给视图定义公共的属性和方法
  init: {
    formatArray: function (arr) {
      var newArr = [];
      for(var i = 0; i < Math.ceil(arr.length/2); i++){
        newArr[i] = [];
        newArr[i][0] = arr[2*i];
        newArr[i][1] = arr[2*i+1];
      }
      return newArr;
    },

    // 定义视图公共的home hot swiper对象
    myHomeHotSwiper: null,

    // 定义视图公共的home swiper对象
    myHomeSwiper: null,

    // 定义scroll对象
    myScroll: null
  },

  bindActions: {
    'hot': function (e) {
      // 获得视图公共的home swiper, 跳转到某个slider
      this.myHomeSwiper.slideTo($(e.el).index());
      $('#m-index-container > #fixed-menu-body').hide();
    },
    'follow': function (e) {
      // 获得视图公共的home swiper, 跳转到某个slider
      this.myHomeSwiper.slideTo($(e.el).index());
      $('#m-index-container > #fixed-menu-body').show();
    },
    'tap.hot.slide': function (e) {
      // 获得视图公共的home hot swiper, 跳转到某个slider
      this.myHomeHotSwiper.slideTo($(e.el).index());
    },

    // 进入detail页
    'goto.detail': function (e, data) {
      SPA.open('detail', {

        // 定义参数对象传递给下个页面
        param: {
          abc: data.id
        }
      });
    }
  },

  bindEvents: {
    show: function () {
      // 保存视图对象
      var that = this;

      // 获得avalon的vm
      var vm = that.getVM();

      var gapSize = 26;

      // 第一次渲染数据
      $.ajax({
        // url: '/webapp1502/mock/home.json',
        url: '/api/homeList.php',
        success: function (res) {
          // 第一次获得的数据临时存储在homeTempList里
          vm.homeTempList = res.data;

          setTimeout(function () {
            // 第一次渲染数据
            vm.homeList = that.formatArray(vm.homeTempList);
            vm.isShowLoading = false;
            that.myScroll.scrollBy(0, -gapSize);
          }, 1000);
        }
      });

      // 定义home hot swiper，注意这里的that.mySwiper
      that.myHomeHotSwiper = new Swiper('#home-hot-swiper', {
        loop: false,
        onSlideChangeStart: function () {
          $('#home-hot-nav li').eq(that.myHomeHotSwiper.activeIndex).addClass('active').siblings().removeClass('active');
        }
      });

      // 定义home swiper，注意这里的that.mySwiper
      that.myHomeSwiper = new Swiper('#home-swiper', {
        loop: false,
        onSlideChangeStart: function () {
          $('#home-nav span').eq(that.myHomeSwiper.activeIndex).addClass('active').siblings().removeClass('active');
        }
      });

      // 下拉刷新，上拉加载
      // 使scroll pullToRefresh 滞后执行
      setTimeout(function () {
        // 获得SAP里定义的scroll对象，homeHotScroll通过data-scroll-id实现绑定的
        that.myScroll = that.widgets.homeHotScroll;
        var pageNo = 0;
        var pageSize = 6;
        that.myScroll.scrollBy(0, -gapSize);

        var head = $('.head img'),
            topImgHasClass = head.hasClass('up');
        var foot = $('.foot img'),
            bottomImgHasClass = head.hasClass('down');
        that.myScroll.on('scroll', function () {
            var y = this.y,
                maxY = this.maxScrollY - y;
            if (y >= 0) {
                !topImgHasClass && head.addClass('up');
                return '';
            }
            if (maxY >= 0) {
                !bottomImgHasClass && foot.addClass('down');
                return '';
            }
        });

        that.myScroll.on('scrollEnd', function () {
            if (this.y >= -100 && this.y < 0) {
                that.myScroll.scrollTo(0, -gapSize);
                head.removeClass('up');
            } else if (this.y >= 0) {
                head.attr('src', '/webapp1502/images/ajax-loader.gif');

                //ajax下拉刷新数据
                $.ajax({
                  url: '/api/homeList.php',
                  data: {
                    type: 'refresh'
                  },
                  success: function (res) {
                    vm.homeTempList.$model = res.data.concat(vm.homeTempList.$model);
                    vm.homeList = that.formatArray(vm.homeTempList.$model);

                    that.myScroll.scrollTo(0, -gapSize);
                    head.removeClass('up');
                    head.attr('src', '/webapp1502/images/arrow.png');
                  }
                });
            }

            var maxY = this.maxScrollY - this.y;
            var self = this;
            if (maxY > -gapSize && maxY < 0) {
                that.myScroll.scrollTo(0, self.maxScrollY + gapSize);
                foot.removeClass('down')
            } else if (maxY >= 0) {
                foot.attr('src', '/webapp1502/images/ajax-loader.gif');

                // ajax上拉加载更多数据
                $.ajax({
                  url: '/api/homeList.php',

                  // 请求参数，get：放置的url上，post:request体里
                  data: {
                    page: pageNo,
                    pageSize: pageSize
                  },

                  success: function (res) {
                    vm.homeTempList.pushArray(res.data);
                    vm.homeList = that.formatArray(vm.homeTempList.$model);
                    pageNo++;

                    // scroll 列表刷新
                    that.myScroll.refresh();
                    that.myScroll.scrollTo(0, self.y + gapSize);
                    foot.removeClass('down');
                    foot.attr('src', '/webapp1502/images/arrow.png');

                    // that.homeTempList = that.homeTempList.concat(res.data);
                    // vm.homeList = that.formatArray(that.homeTempList.concat(res.data));
                  }
                });
            }
        });

        // 停靠菜单
        var $fixedMenu = $('#fixed-menu');
        var offsetTop = $fixedMenu.offset().top;

        var myFS = that.widgets.myFollowScroll;
        myFS.on('scroll', function(){

          // Math.abs(this.y) 获得当前scroll滚动的y的坐标绝对值
          // offsetTop - 44 获得menu距离文档顶部的高度，减去44，是为了和scroll滚动做比较
          //console.log(Math.abs(this.y) + "/" + (offsetTop - 44));
          if( Math.abs(this.y) >= offsetTop - 44 ) {
            if($('#m-index-container > #fixed-menu-body').length <= 0){
              $fixedMenu.clone(true).attr('id', 'fixed-menu-body').after('#home-swiper');
            }
          } else {
            $('#m-index-container > #fixed-menu-body').remove();
          }
        });

      }, 0);
    },
    hide: function () {
      $('#m-index-container > #fixed-menu-body').remove();
    }
  }
});
