define(function(require, exports, module) {

    var $body=$(document.body);

    var $wordCloud=require('modules/preheat/ability/js/wordCloud');
    
    var initTopText=function(){
        $('#topText').find('span').each(function(index,item){
            setTimeout(function (argument) {
              $(item).addClass('t'+(index+1));
            },index*100);
        })
    }

    function init(opts) {
       setTimeout(initTopText,100);
       setTimeout(function(){
            $wordCloud.draw(opts.jobtag);
       },500);
       setTimeout(function(){
            $body.find('[node=btnBox]').css('display','block')
       },1000)
    }

    function destroy(opts) {

    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});