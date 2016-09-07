'use strict';

(function (window, document) {

    var isTouchable = 'ontouchstart' in window;

    var util = {
        /*
         * @name extend
         * @type function
         * @explain 复制对象
         * */
        extend: function (to, from) {
            var keys = Object.keys(from);
            var i = keys.length;
            while (i--) {
                to[keys[i]] = from[keys[i]];
            }
            return to;
        },
        /*
         * @name each
         * @type function
         * @explain each循环
         * */
        each: function (obj, fn) {
            if (obj) {
                var i = 0;
                if (obj.length) {
                    for (var n = obj.length; i < n; i++) {
                        if (fn(i, obj[i]) === false)
                            break
                    }
                } else {
                    for (i in obj) {
                        if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                            break
                        }
                    }
                }
            }
        },
        /*
         * @name tf
         * @type function
         * @explain 添加0
         * */
        tf: function (i) {
            i = (typeof i == 'string' ? parseInt(i) : i);
            return (i < 10 ? '0' : '') + i
        },
        /*
         * @name formatDate
         * @type function
         * @explain 时间格式化
         * */
        formatDate: function (time, format) {
            time = (typeof time == 'string' ? new Date(time) : time);
            var getFullYear = util.tf(time.getFullYear()),
                getMonth = util.tf(time.getMonth() + 1),
                getDate = util.tf(time.getDate()),
                getDay = util.tf(time.getDay());
            return {
                getFullYear: parseInt(getFullYear),
                getMonth: parseInt(getMonth),
                getDate: parseInt(getDate),
                getDay: parseInt(getDay),
                date: format.replace(/yyyy|MM|dd/g, function (a) {
                    switch (a) {
                        case 'yyyy':
                            return getFullYear;
                            break;
                        case 'MM':
                            return getMonth;
                            break;
                        case 'dd':
                            return getDate;
                            break;
                    }
                })
            }
        },
        getStringDate: function (date) {
            if (typeof date == 'string') {
                var a = date.split('-'), i = 0;
                for (; i < a.length; i++) {
                    a[i] = util.tf(a[i])
                }
                return a.join('');
            }
        },
        /*
         * @name event
         * @type object
         * @explain 事件名
         * */
        event: {
            START: isTouchable ? 'touchstart' : 'mousedown',
            MOVE: isTouchable ? 'touchmove' : 'mousemove',
            END: isTouchable ? 'touchend' : 'mouseup'
        }
    };

    var template = '' +
        '<div class="ue-calendar-title ue-clearfix">' + '{{ date }}' + '</div>' +
        '<div class="ue-calendar-nav">' + '{{ nav }}' + '</div>' +
        '<div class="ue-calendar-wrap ue-clearfix">' + '{{ time }}' + '</div>';

    var festival = {
        '1-1': '元旦',
        '1-15': '元宵节',
        '3-8': '妇女节',
        '3-12': '植树节',
        '4-5': '清明节',
        '5-1': '劳动节',
        '5-4': '青年节',
        '5-5': '端午节',
        '6-1': '儿童节',
        '7-1': '建党节',
        '8-1': '建军节',
        '8-15': '中秋节',
        '9-9': '重阳节',
        '9-10': '教师节',
        '9-15': '中秋节',
        '10-1': '国庆节',
        '11-25': '感恩节',
        '12-8': '腊八节'
    };


    var Calendar = function (options) {

        options = options || {};

        /*
         * 默认配置
         * */
        this.defaults = {
            value: null,
            minDate: null,
            maxDate: null,
            isPopup: false,
            inputReadOnly: true,
            selectNav: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            dateFormat: 'yyyy-MM-dd',
            onChange: function () {

            }
        };

        this.defaults = util.extend(this.defaults, options);

        this._init();
    };

    Calendar.prototype = {
        constroctor: Calendar,
        /*
         * 初始化
         * */
        _init: function () {
            this.calendar = typeof this.defaults.el == 'string' ? document.querySelector(this.defaults.el) : this.defaults.el;
            this.calendar.className = 'ue-calendar';

            // isPopup = true
            if (this.defaults.isPopup) {
                this.calendar.classList.add('ue-calendar-popup');
                this.input = typeof this.defaults.input == 'string' ? document.querySelector(this.defaults.input) : this.defaults.input;
                this.input[this.defaults.inputReadOnly ? 'setAttribute' : 'removeAttribute']('readonly', true);
                this.defaults.value = (this.input.value == '' ? this.defaults.value : this.input.value);
            }

            this._selectorElement();
            this.defaults.isPopup && this._close();
        },
        _open: function () {
            this.calendar.style.opacity = 1;
            this.calendar.style.webkitTransition = 'all ease-in-out 0.5s';
            this.calendar.style.transition = 'all ease-in-out 0.5s';
            this.calendar.style.webkitTransform = 'translate3d(0, 0, 0)';
            this.calendar.style.transform = 'translate3d(0, 0, 0)';
        },
        _close: function () {
            var ch = this.calendar.offsetHeight;
            this.calendar.style.opacity = 0;
            this.calendar.style.webkitTransform = 'translate3d(0, ' + ch + 'px, 0)';
            this.calendar.style.transform = 'translate3d(0, ' + ch + 'px, 0)';
        },
        /*
         * 更新时间
         * */
        _updateDate: function (value, status) {
            if (status) {
                return util.formatDate(value ? new Date(value) : new Date(), this.defaults.dateFormat);
            }
            this.date = util.formatDate(value ? new Date(value) : new Date(), this.defaults.dateFormat);
        },
        /*
         * 查询element元素
         * */
        _selectorElement: function () {
            this._updateDate(this.defaults.value);
            this.localDate = this.date;
            this._render();
        },
        _render: function () {
            this.calendar.innerHTML = template
                .replace('{{ date }}', this._createCalendarTitle())
                .replace('{{ nav }}', this._createCalendarNav())
                .replace('{{ time }}', this._createCalendarWrap());
            this._bindEvent();
        },
        _bindEvent: function () {
            var self = this;
            this.grids = this.calendar.querySelectorAll('[data-current]');
            this.calendarLeft = this.calendar.querySelector('.ue-calendar-left');
            this.calendarRight = this.calendar.querySelector('.ue-calendar-right');

            util.each(this.grids, function (i, e) {
                e.addEventListener(util.event.START, function () {
                    for (var i = 0; i < self.grids.length; i++) {
                        self.grids[i].classList.remove('ue-active');
                    }
                    this.classList.add('ue-active');
                    self.defaults.onChange.call(self, e, e.dataset.current);
                    if (self.defaults.isPopup) {
                        self._close();
                        self._triggerShade();
                        self.input.value = e.dataset.current;
                    }
                }, false);
            });

            this.calendar.addEventListener(util.event.MOVE, function (e) {
                e.preventDefault();
            }, false);
            this.calendarLeft.addEventListener(util.event.START, function () {
                this._prevDate();
            }.bind(this), false);
            this.calendarRight.addEventListener(util.event.START, function () {
                this._nextDate();
            }.bind(this), false);

            if (this.defaults.isPopup) {
                this.input.addEventListener(util.event.START, function () {
                    this._open();
                    this._triggerShade();
                }.bind(this), false);
            }
        },
        _nextDate: function () {
            this._getNextMonthDate(++this.date.getMonth);
        },
        _prevDate: function () {
            this._getNextMonthDate(--this.date.getMonth);
        },
        _getNextMonthDate: function (month) {
            if (month > 12 || month < 1) {
                this.date.getFullYear = this.date.getFullYear + Math.floor(( this.date.getMonth - 1 ) / 12);
                this.date.getMonth = (this.date.getMonth % 12 == 0 ? 12 : this.date.getMonth % 12);
            }
            this._render();
        },
        /*
         * 创建calendar-title
         * */
        _createCalendarTitle: function () {
            return '' +
                '<a href="javascript:;" class="ue-calendar-left ue-icon ue-icon-back"></a>' +
                '<a href="javascript:;" class="ue-calendar-right ue-icon ue-icon-forward"></a>' +
                '<h2 class="ue-calendar-headline">' + (this.date.getFullYear) + '年' + (util.tf(this.date.getMonth)) + '月</h2>';
        },
        /*
         * 创建calendar-nav
         * */
        _createCalendarNav: function () {
            var dom = '';
            this.defaults.selectNav.forEach(function (e, i) {
                dom += '<div class="ue-calendar-nav-name' + (i > 4 ? ' ue-calendar-cl-orange' : ' ') + '">' + e + '</div>';
            });
            return dom;
        },
        /*
         * 创建calendar-wrap
         * */
        _createCalendarWrap: function () {
            var dom = [], before = [];
            var beforeCount = Math.abs(new Date(this.date.getFullYear, this.date.getMonth - 1, 1).getDay());
            // 如果是星期天
            beforeCount = beforeCount == 0 ? 7 : beforeCount;
            var beforeDate = new Date(this.date.getFullYear, this.date.getMonth - 1, 0).getDate();
            var currentDate = new Date(this.date.getFullYear, this.date.getMonth, 0).getDate();
            var x = beforeDate;
            var i = beforeCount - 2;
            var k = 0;
            var y = 0;
            var limit = 42 - beforeCount - currentDate + 1;


            // 前一个月的日期显示
            for (; x > 0; x--) {
                before.push(x);
            }
            for (; i >= 0; i--) {
                dom.push('<a href="javascript:;" class="ue-calendar-grid ue-calendar-cl-cfcfcf"><span>' + (before[i]) + '</span><span>入住</span></a>')
            }

            // 本月日期显示
            for (; k < currentDate; k++) {
                var curDate = this._updateDate(this.date.getFullYear + '-' + this.date.getMonth + '-' + (k + 1), true);
                var isFestival = festival[curDate.getMonth + '-' + curDate.getDate];
                var cfs = isFestival ? isFestival : '';
                var cls = 'ue-calendar-grid';
                // 是否是节日
                cls += isFestival ? ' ue-mini ue-calendar-cl-03C7AD' : '';
                // 是否是周六或周日
                cls += curDate.getDay == 6 || curDate.getDay == 0 ? ' ue-calendar-cl-orange' : '';
                // 是否是当前日期
                cls += this.localDate.date == curDate.date ? ' ue-active' : '';
                // 最大或最小
                var isScreen = this.defaults.minDate && util.getStringDate(this.defaults.minDate) > util.getStringDate(curDate.date) || this.defaults.maxDate && util.getStringDate(this.defaults.maxDate) < util.getStringDate(curDate.date);
                cls += isScreen ? ' ue-calendar-cl-cfcfcf' : '';

                dom.push('<a href="javascript:;" class="' + (cls) + '"  ' + (isScreen ? "" : "data-current=" + (curDate.date)) + '  data-index="' + (k) + '"><span>' + (k + 1) + '</span><span>' + (cfs) + '</span></a>');
            }

            // 下一个月的日期显示
            for (; y < limit; y++) {
                dom.push('<a href="javascript:;" class="ue-calendar-grid ue-calendar-cl-cfcfcf"><span>' + (y + 1) + '</span><span>入住</span></a>');
            }

            return dom.join('');
        },
        /*
         * 创建calendar-shade
         * */
        _triggerShade: function () {
            this.ueShade = document.querySelector('.ue-calendar-shade');
            if (this.ueShade) {
                document.body.removeChild(this.ueShade);
            } else {
                this.ueShade = document.createElement('div');
                this.ueShade.className = 'ue-calendar-shade';
                this.ueShade.addEventListener(util.event.START, function () {
                    this._close();
                    this._triggerShade();
                }.bind(this), false);
                document.body.appendChild(this.ueShade);
            }
        }
    };


    if (typeof exports === 'object') module.exports = Calendar;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return Calendar;
    });
    else window.Calendar = Calendar;
})(window, document);

