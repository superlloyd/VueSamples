
// extra utilities
interface Array<T> {
	swap(index1: number, index2: number);
	pushall(other: Array<T>): Array<T>;
	remove(item: T): boolean;
	removeWhere(predicate: (item: T) => boolean, max?: number): void;
}

/** swap value in array at given index */
Array.prototype.swap = function (index1: number, index2: number) {
	var item = this[index1];
	this[index1] = this[index2];
	this[index2] = item;
}
/** swap value in array at given index */
Array.prototype.pushall = function <T>(other: Array<T>): Array<T> {
	for (var i = 0; i < other.length; i++) {
		this.push(other[i]);
	}
	return this;
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

// a module which help to do routing / hash navigation, 80 lines for full flexibility and no mystery! :P
module HASH {
	var handlers: Array<{ key: string; handler: (key: string, value: string) => void }> = [];
	var _previous: any = {};
	var current: any = hashToObject();

	function handle(e: Event) {
		_previous = current;
		current = hashToObject();
		for (var i = 0; i < handlers.length; i++) {
			var data = handlers[i];
			if (_previous[data.key] != current[data.key])
				data.handler(data.key, current[data.key]);
		}
	}
	window.onhashchange = function (e:Event) { handle(e); };

	export function on(key: string, handler: (key: string, value: string) => void) {
		if (!handler || !key)
			return;
		handlers.push({ key: key, handler: handler });
	}
	export function off(key: string, handler: (key: string, value: string) => void) {
		handlers.removeWhere(x => x.key == key && x.handler == x.handler, 1);
	}

	function hashToObject(hash?: string) {
		if (hash == undefined) hash = window.location.hash;
		if (hash == null || hash.substr(0, 1) != "#")
			return {};
		var s = hash.substr(1);
		var ss = s.split(';');
		var jo: any = {};
		for (var i = 0; i < ss.length; i++) {
			var sss = ss[i].split(':');
			if (sss.length == 2)
				jo[sss[0]] = sss[1];
		}
		return jo;
		//var jo = JSON.parse('{' + s + '}');
		//return jo;
	}
	function objectToHash(o) {
		var s = '';
		for (var k in o) {
			if (o == undefined || o == null || o == '')
				continue;
			var v = o[k];
			if (v == undefined || v == null || v == '')
				continue;
			if (s.length > 0)
				s += ';';
			s += k + ':' + o[k];
		}
		return '#' + s;
		//var s = JSON.stringify(o);
		//return '#' + s.substr(1, s.length - 2);
	}

	export function set(key: string, value: any);
	export function set(keyValues: any);
	export function set(keyOrObject: any, value?: any) {
		// don't use current, because it will be in _previous, hence change will be hidden
		var o: any = hashToObject();
		if (typeof keyOrObject == "string") {
			o[keyOrObject] = value;
		}
		else {
			for (var k in keyOrObject) {
				o[k] = keyOrObject[k];
			}
		}
		window.location.hash = objectToHash(o);
	}
	export function get(key: string) {
		return current[key];
	}
	export function previous(key: string) {
		return _previous[key];
	}

	// this function does a local navigation, find
	var LINK = 'link';
	export function navigateTo(location: string) {
		set(LINK, location);
	}

	var onLink = (key, value) => {
		if (!value)
			return;
		var $e = $('#' + value, document);
		if ($e.length > 0)
			$e[0].scrollIntoView();
	};
	on(LINK, onLink);
	$(document).ready(() => { onLink(LINK, get(LINK)); });
}
