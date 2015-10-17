/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
var LoaderType;
(function (LoaderType) {
    LoaderType[LoaderType["AsString"] = 0] = "AsString";
    LoaderType[LoaderType["AsScriptTag"] = 1] = "AsScriptTag";
    LoaderType[LoaderType["AsCssTag"] = 2] = "AsCssTag";
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
    cache.result.then(function (s) {
        cache.handle(options);
        result.resolve(s);
    });
    return result;
}
var loader;
(function (loader) {
    var CacheData = (function () {
        function CacheData(options) {
            this.url = options.url;
            this.reload(options.cached);
        }
        CacheData.prototype.reload = function (useCache) {
            var _this = this;
            if (useCache === undefined)
                useCache = true;
            this.result = $.Deferred();
            //this.query = $.get(loader.baseURL + this.url);
            this.query = $.ajax({
                url: loader.baseURL + this.url,
                cache: useCache,
            });
            this.query
                .then(function (s) {
                _this.result.resolve(s);
            })
                .fail(function (err) {
                _this.result.reject(err);
                alert('Problem loading ' + _this.url + ', ' + JSON.stringify(err));
            });
            ;
        };
        CacheData.prototype.handle = function (options) {
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
            }
        };
        return CacheData;
    })();
    loader.CacheData = CacheData;
    loader.cache = {};
    loader.baseURL = "";
    loader.useCache = true;
})(loader || (loader = {}));
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
