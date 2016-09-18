define(function(require, exports, module) {
    function init(opts) {
        seajs.use('http://' + opts._extra.domain + '/libs/echarts/3.1.10/echarts.min.js',function(weixinSDK){
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('modelCharts'));
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption( opts.charts );
        });
    }
    function destroy(opts) {
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});