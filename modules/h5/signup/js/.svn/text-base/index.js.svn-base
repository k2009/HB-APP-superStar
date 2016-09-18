define(function(require, exports, module) {
    function init(opts) {
        var platform = opts.platform;
        //美化alert start
        var Alert = function( str ){
            var dom = '<div class="alert_dom mui-popup mui-popup-in" style="display: block;">\
                    <div class="mui-popup-inner">\
                        <p class="alert_content"></p>\
                    </div>\
                    <div class="mui-popup-buttons"><span class="alert_close mui-popup-button mui-popup-button-bold">确定</span></div></div>\
                    <div class="alert_dom mui-popup-backdrop mui-active" style="display: block;"></div>';
            var $dom = $( dom );
            $dom.find( '.alert_content' ).html( str );
            $( 'body' ).append( $dom );
            $( '.alert_close' ).on('touchend', function(){
                $( this ).off();
                $( '.alert_dom' ).remove();
                return false;
            });
        }
        //美化alert end
        var validate = {
            user_name: function(value) {
                var user_name = $.trim(value),
                  //reg = /^([\u4e00-\u9fa5]){2,5}$/;
                  reg = /^[0-9a-zA-Z\u4e00-\u9fa5_·-]{1,30}$/;
                if (!reg.test(user_name)) {
                  this.handle('user_name');
                  return false;
                }
                return true;
            },
            phone: function(value) {
                var phone = $.trim(value),
                  reg = /^1[3|4|5|7|8]\d{9}$/;
                if (!reg.test(phone)) {
                  this.handle('phone');
                  return false;
                }
                return true;
            },
            weibo_nick_name: function(value) {
                var weibo_nick_name = $.trim(value)
                reg = /^[0-9a-zA-Z\u4e00-\u9fa5_-]{1,30}$/;
                if (!reg.test(value)) {
                  this.handle('weibo_nick_name');
                  return false;
                }
                return true;
            },
            handle: function(item) {
                var text = {
                  user_name: '亲，请输入正确姓名',
                  phone: '亲，请输入正确的手机号',
                  weibo_nick_name: '亲，请输入正确昵称'
                }
                setTimeout(function() {
                  Alert(text[item])
                }, 0);
                //$( '[data-validate=' + item + ']' ).show();
            }
        };

        $( '#st_modules_h5_signup' ).on('touchend', '#submit', function(){
            var validateItem = $( '[data-validate]' ),
              validateStatus = true,
              ajaxData = {},
              self = $(this),
              phone = $('[data-validate="phone"]').val();
            for( var i=0; i<validateItem.length; i++ ){
              var value = validateItem.eq( i ).val(),
                type = validateItem.eq( i ).data( 'validate' );
              ajaxData[ type ] = value;
              if( validate[ type ] && !validate[ type ]( value ) ){
                validateStatus = false;
                return;
              }
            }
            if( !validateStatus ){
              return;
            }
            if( self.data('phone') == phone ){
              Alert( '亲，请不要重复提交手机号码~' );
              return;
            }
            $.ajax({
              type: "post",
              url: opts.submit_url,
              dataType:"json",
              data:ajaxData,
              success:function(msg){
                if( msg.code != 0 ){
                  Alert( msg.message );
                  return;
                }
                self.data( 'phone', phone );
                Alert( '提交成功！' );
              },
              error:function(){
                Alert('网络错误，请刷新页面或稍后重试')
              }
            });
        });
    }

    function destroy(opts) {
      $( '#st_modules_signup_submit' ).off();
    }
  var that = {
    init: init,
    destroy: destroy
  };
  return that;
});