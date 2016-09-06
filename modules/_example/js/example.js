define(function(require, exports, module) {

    function init(opts) {
        // body...
	    console.log("example init");
    }

    function destroy(opts) {
        console.log("destroy example");
    }
    var that = {
        init: init,
        destroy: destroy
    };
    return that;
});