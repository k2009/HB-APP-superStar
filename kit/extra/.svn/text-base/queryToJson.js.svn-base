define(function(require) {
    var isArray=function (a){return Object.prototype.toString.call(a)==="[object Array]"};
    var trim=function(str){
        return str.replace(/^\s+/,'').replace(/\s+$/,'');
    };
    return function(b, c) {
        var d = trim(b).split("&"),
            e = {},
            f = function(a) {
                return c ? decodeURIComponent(a) : a
            };
        for (var g = 0, h = d.length; g < h; g++)
            if (d[g]) {
                var i = d[g].split("="),
                    j = i[0],
                    k = i[1];
                if (i.length < 2) {
                    k = j;
                    j = "$nullName"
                }
                if (!e[j]) e[j] = f(k);
                else {
                    isArray(e[j]) != !0 && (e[j] = [e[j]]);
                    e[j].push(f(k))
                }
            }
        return e
    }
})