/// <reference path="../scripts/typings/jquery/jquery.d.ts" />

enum LoaderType {
    AsString,
    AsScriptTag,
    AsCssTag,
    AsContent,
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
        private CONTENT: HTMLDivElement;
        private Script: HTMLScriptElement;

        reload(useCache?: boolean) {
            if (useCache === undefined)
                useCache = true;
            this.result = $.Deferred<any>();
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
                case LoaderType.AsContent:
                    if (!this.CONTENT) {
                        this.CONTENT = document.createElement('div');
                        document.appendChild(this.CONTENT);
                    }
                    this.CONTENT.innerHTML = this.text;
                    break;
            }
        }
    }
    export var cache: { [key: string]: CacheData } = {};
    export var baseURL: string = "";
    export var useCache: boolean = true;
}


// extra utilities
interface Array<T> {
    contains(item: T): boolean;
    remove(item: T): boolean;
    removeWhere(predicate: (item: T) => boolean, max?: number): void;
}
/** check an array contains an item */
Array.prototype.contains = function <T>(item: T): boolean {
    for (var i = this.length; i-- > 0;) {
        var ti = this[i];
        if (ti === item) 
            return true;
    }
    return false;
}
/** remove one instance of the item and returns whether it was in the array or not */
Array.prototype.remove = function <T>(item: T): boolean {
    for (var i = this.length; i-- > 0;) {
        var ti = this[i];
        if (ti === item) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
}
/** remove one instance of the item and returns whether it was in the array or not */
Array.prototype.removeWhere = function <T>(predicate: (item: T) => boolean, max?: number): void {
    var rc = 0;
    for (var i = this.length; i-- > 0;) {
        if (predicate(this[i])) {
            this.splice(i, 1);
            if (max && max > 0) {
                rc++;
                if (rc >= max) break;
            }
        }
    }
}

function guid(): string {
    var d = Date.now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
function createHTML(name: string, attributes: any): HTMLElement {
    var res = document.createElement(name);
    for (var k in attributes) {
        res.setAttribute(k, attributes[k]);
    }
    return res;
}

// a module which help to do routing / hash navigation, 100 lines for full flexibility and no mystery! :P
module HASH {
    export interface ILocation {
        p: string[];
        kv: { [key: string]: string; }
    }

    var handlers: Array<(previous: ILocation, current: ILocation) => void> = [];
    var _previous: ILocation = { p: [], kv: {} };
    var current: ILocation = hashToObject();

    function handle(e: Event) {
        _previous = current;
        current = hashToObject();
        for (var i = 0; i < handlers.length; i++) {
            var data = handlers[i];
            data(_previous, current);
        }
    }
    window.onhashchange = function (e: Event) { handle(e); };

    export function on(handler: (previous: ILocation, current: ILocation) => void) {
        if (!handler)
            return;
        handlers.push(handler);
    }
    export function off(handler: (previous: ILocation, current: ILocation) => void) {
        if (!handler)
            return;
        handlers.remove(handler);
    }

    function hashToObject(hash?: string): ILocation {
        if (hash == undefined) hash = window.location.hash;
        var jo: any = { p: [], kv: {} };
        if (hash == null || hash.substr(0, 1) != "#")
            return jo;
        var s = hash.substr(1);
        var ss = s.split(';');
        for (var i = 0; i < ss.length; i++) {
            var sss = ss[i].split(':');
            if (sss.length == 2) jo.kv[decodeURIComponent(sss[0])] = decodeURIComponent(sss[1]);
            else jo.p.push(decodeURIComponent(ss[i]));
        }
        return jo;
    }
    function objectToHash(o: ILocation): string {
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

    export function value(o?: ILocation) {
        if (o != undefined) {
            _previous = current;
            current = o;
            window.location.hash = objectToHash(o);
        }
        return current;
    }
    export function set(key: string, value: string): ILocation {
        var o = hashToObject();
        o.kv[key] = value;
        return HASH.value(o);
    }

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
    };
    $(document).ready(() => scrollToHash());
}

module Vue {
    export function watcher(data: any, property, callback: (value) => void) {
        var options = {
            data: data,
            watch: <any>{}
        };
        options.watch[property] = function (value) {
            callback(value);
        };
        new Vue(options);
    }
}