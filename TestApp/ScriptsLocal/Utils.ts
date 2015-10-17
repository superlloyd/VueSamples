/// <reference path="../scripts/typings/jquery/jquery.d.ts" />

enum LoaderType {
    AsString,
    AsScriptTag,
    AsCssTag,
}
interface ILoaderOptions {
    url: string;
    type?: LoaderType,
    tagType?: string,
    cached?: boolean,
}
function loader(urlOrArgs: string | ILoaderOptions): JQueryPromise<string> {
    var options: ILoaderOptions;
    if (typeof urlOrArgs === "string") {
        options = {
            url: urlOrArgs,
        };
    }
    else {
        options = urlOrArgs;
    }

    var result = $.Deferred<string>();
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
    cache.result.then(s => {
        cache.handle(options);
        result.resolve(s);
    });
    return result;
}
module loader {
    export class CacheData {
        constructor(options: ILoaderOptions) {
            this.url = options.url;
            this.reload(options.cached);
        }
        private query: JQueryXHR;
        result: JQueryDeferred<any>;
        private url: string;
        private text: string;
        private CSS: HTMLStyleElement;
        private Script: HTMLScriptElement;

        reload(useCache?: boolean) {
            if (useCache === undefined)
                useCache = true;
            this.result = $.Deferred<any>();
            //this.query = $.get(loader.baseURL + this.url);
            this.query = $.ajax({
                url: loader.baseURL + this.url,
                cache: useCache,
            });
            this.query
                .then(s => {
                    this.result.resolve(s);
                })
                .fail(err => {
                    this.result.reject(err);
                    alert('Problem loading ' + this.url + ', ' + JSON.stringify(err));
                });
            ;
       }

        handle(options: ILoaderOptions) {
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
        }
    }
    export var cache: { [key: string]: CacheData } = {};
    export var baseURL: string = "";
    export var useCache: boolean = true;
}
