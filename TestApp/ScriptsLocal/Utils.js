/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
var LoaderType;
(function (LoaderType) {
    LoaderType[LoaderType["AsString"] = 0] = "AsString";
    LoaderType[LoaderType["AsScriptTag"] = 1] = "AsScriptTag";
    LoaderType[LoaderType["AsCssTag"] = 2] = "AsCssTag";
    LoaderType[LoaderType["AsContent"] = 3] = "AsContent";
})(LoaderType || (LoaderType = {}));
function loader(urlOrArgs) {
    var options;
    if (typeof urlOrArgs === "string") {
        options = {
            url: urlOrArgs,
        };
    }
    else {
        options = urlOrArgs;
    }
    var result = $.Deferred();
    if (!options.url) {
        result.reject('No URL');
        return result;
    }
    if (options.url[0] != '/')
        options.url = '/' + options.url;
    var useCache = options.cached == undefined ? loader.useCache : options.cached;
    var cache = loader.cache[options.url];
    if (!cache) {
        cache = new loader.CacheData(options);
        loader.cache[options.url] = cache;
    }
    else if (!useCache) {
        cache.reload(false);
    }
    cache.then(function (s) {
        cache.handle(options);
        result.resolve(s);
    });
    return result;
}
var loader;
(function (loader) {
    var CacheData = (function () {
        function CacheData(options) {
            this.done = false;
            this.callbacks = [];
            this.url = options.url;
            this.reload(options.cached);
        }
        CacheData.prototype.then = function (doneFilter) {
            if (this.done) {
                if (this.text) {
                    doneFilter(this.text);
                }
            }
            else {
                this.callbacks.push(doneFilter);
            }
        };
        CacheData.prototype.reload = function (useCache) {
            var _this = this;
            if (useCache === undefined)
                useCache = true;
            this.done = false;
            this.text = null;
            this.query = $.ajax({
                url: loader.baseURL + this.url,
                cache: useCache,
            });
            this.query
                .then(function (s) {
                _this.done = true;
                _this.text = s;
                for (var i = 0; i < _this.callbacks.length; i++) {
                    _this.callbacks[i](s);
                }
                _this.callbacks.splice(0, _this.callbacks.length);
            })
                .fail(function (err) {
                _this.done = true;
                _this.text = null;
                _this.callbacks.splice(0, _this.callbacks.length);
                alert('Problem loading ' + _this.url + ', ' + JSON.stringify(err));
            });
            ;
        };
        CacheData.prototype.handle = function (options) {
            if (!this.done || !this.text)
                return;
            if (options.type === undefined)
                options.type = LoaderType.AsString;
            switch (options.type) {
                case LoaderType.AsScriptTag:
                    if (!this.Script) {
                        this.Script = document.createElement('script');
                        if (options.tagType == undefined)
                            options.tagType = "text/javascript";
                        document.appendChild(this.Script);
                    }
                    this.Script.type = options.tagType;
                    this.Script.text = this.text;
                    break;
                case LoaderType.AsCssTag:
                    if (!this.CSS) {
                        this.CSS = document.createElement('style');
                        if (options.tagType == undefined)
                            options.tagType = "text/css";
                        document.appendChild(this.CSS);
                    }
                    this.CSS.type = options.tagType;
                    this.CSS.style.cssText = this.text;
                    break;
                case LoaderType.AsContent:
                    if (!this.CONTENT) {
                        this.CONTENT = document.createElement('div');
                        document.appendChild(this.CONTENT);
                    }
                    this.CONTENT.innerHTML = this.text;
                    break;
            }
        };
        return CacheData;
    })();
    loader.CacheData = CacheData;
    loader.cache = {};
    loader.baseURL = "";
    loader.useCache = true;
})(loader || (loader = {}));
/** check an array contains an item */
Array.prototype.contains = function (item) {
    for (var i = this.length; i-- > 0;) {
        var ti = this[i];
        if (ti === item)
            return true;
    }
    return false;
};
/** remove one instance of the item and returns whether it was in the array or not */
Array.prototype.remove = function (item) {
    for (var i = this.length; i-- > 0;) {
        var ti = this[i];
        if (ti === item) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
};
/** remove one instance of the item and returns whether it was in the array or not */
Array.prototype.removeWhere = function (predicate, max) {
    var rc = 0;
    for (var i = this.length; i-- > 0;) {
        if (predicate(this[i])) {
            this.splice(i, 1);
            if (max && max > 0) {
                rc++;
                if (rc >= max)
                    break;
            }
        }
    }
};
function guid() {
    var d = Date.now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
function createHTML(name, attributes) {
    var res = document.createElement(name);
    for (var k in attributes) {
        res.setAttribute(k, attributes[k]);
    }
    return res;
}
// a module which help to do routing / hash navigation, 100 lines for full flexibility and no mystery! :P
var HASH;
(function (HASH) {
    var handlers = [];
    var _previous = { p: [], kv: {} };
    var current = hashToObject();
    function handle(e) {
        _previous = current;
        current = hashToObject();
        for (var i = 0; i < handlers.length; i++) {
            var data = handlers[i];
            data(_previous, current);
        }
    }
    window.onhashchange = function (e) { handle(e); };
    function on(handler) {
        if (!handler)
            return;
        handlers.push(handler);
    }
    HASH.on = on;
    function off(handler) {
        if (!handler)
            return;
        handlers.remove(handler);
    }
    HASH.off = off;
    function hashToObject(hash) {
        if (hash == undefined)
            hash = window.location.hash;
        var jo = { p: [], kv: {} };
        if (hash == null || hash.substr(0, 1) != "#")
            return jo;
        var s = hash.substr(1);
        var ss = s.split(';');
        for (var i = 0; i < ss.length; i++) {
            var sss = ss[i].split(':');
            if (sss.length == 2)
                jo.kv[decodeURIComponent(sss[0])] = decodeURIComponent(sss[1]);
            else
                jo.p.push(decodeURIComponent(ss[i]));
        }
        return jo;
    }
    function objectToHash(o) {
        var s = '';
        for (var i = 0; i < o.p.length; i++) {
            var p = o.p[i];
            if (!p)
                continue;
            if (s)
                s += ';';
            s += encodeURIComponent(p);
        }
        for (var k in o.kv) {
            var v = o.kv[k];
            if (v == undefined || v == null || v == '')
                continue;
            if (s)
                s += ';';
            s += encodeURIComponent(k) + ':' + encodeURIComponent(v);
        }
        if (!s)
            return s;
        return '#' + s;
    }
    function value(o) {
        if (o != undefined) {
            _previous = current;
            current = o;
            window.location.hash = objectToHash(o);
        }
        return current;
    }
    HASH.value = value;
    function set(key, value) {
        var o = hashToObject();
        o.kv[key] = value;
        return HASH.value(o);
    }
    HASH.set = set;
    function scrollToHash() {
        for (var i = 0; i < current.p.length; i++) {
            var p = current.p[i];
            if (!p)
                continue;
            var $e = $('#' + p, document);
            if ($e.length > 0) {
                $e[0].scrollIntoView();
                break;
            }
        }
    }
    ;
    $(document).ready(function () { return scrollToHash(); });
})(HASH || (HASH = {}));
var Vue;
(function (Vue) {
    function watcher(data, property, callback) {
        var options = {
            data: data,
            watch: {}
        };
        options.watch[property] = function (value) {
            callback(value);
        };
        new Vue(options);
    }
    Vue.watcher = watcher;
})(Vue || (Vue = {}));
//# sourceMappingURL=Utils.js.map
