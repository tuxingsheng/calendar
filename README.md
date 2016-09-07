# calendar

## github地址：https://github.com/tuxingsheng/calendar.git
## 在线效果访问ue框架页面地址：https://tuxingsheng.github.io/ue/examples/calendar/index.html

###主要功能
1. 可配置日期选择范围，范围之外的不可点击
2. 可配置节假日日期显示
3. 可配置内联和弹窗两种模式
4. 原生js编写，除了部分css样式（也可以自己写，重要的是逻辑），js不依赖任何第三方类库，完全无依赖

###配置参数说明
```javascript
this.defaults = {
    /*
     * 初始化日历开始年月，默认为null，例如：'2016-08-08'
     * */
    value: null,
    /*
     * 日期最小值，默认为null，例如：'2016-05-05'
     * */
    minDate: null,
    /*
     * 日期最大值，默认为null，例如：'2016-10-05'
     * */
    maxDate: null,
    /*
     * 是否使用弹窗模式，默认为内联
     * */
    isPopup: false,
    /*
     * 当模式是弹窗的是否，对应的Input是否要readonly
     * */
    inputReadOnly: true,
    /*
     * 日历组件nav文字内容
     * */
    selectNav: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    /*
     * 点击日期，返回的内容格式，例如：'yyyy/MM/dd' ---> '2016/05/06'
     * */
    dateFormat: 'yyyy-MM-dd',
    /*
     * 选择日历的回调函数，返回点击对象和日期
     * */
    onChange: function (e, v) {
        console.log(e, v);
    }
};