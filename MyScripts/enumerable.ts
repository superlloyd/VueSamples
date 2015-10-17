
// extra utilities
interface Array<T> {
	enumerable(): Enumerable<T>;
	enumerator(): Enumerator<T>;
}

Array.prototype.enumerable = function <T>() { return Enumerable.From<T>(this); }
Array.prototype.enumerator = function () { return Enumerable.From(this).enumerator(); }



interface IEnumerable<T> {
	enumerator(): IEnumerator<T>;
}
interface IEnumerator<T> {
	current(): T;
	moveNext(): boolean;
	reset(): void;
}
class Enumerator<T> {
	private e: IEnumerator<T>;
	constructor(e: IEnumerator<T>) {
		this.e = e;
	}
	current() { return this.e.current(); }
	moveNext() { return this.e.moveNext(); }
	reset() { this.e.moveNext(); }
	next() { return this.moveNext() ? this.current() : undefined; }
}
class Enumerable<T> {
	private impl: IEnumerable<T>;

	/* either pass an IEnumerator or a function creating an enumerator */
	constructor(e?: IEnumerable<T>) {
		if (e !== null && e !== undefined) {
			this.impl = e;
		}
		else {
			this.impl = {
				enumerator: () => {
					return {
						current: (): T => undefined,
						moveNext: () => false,
						reset: () => { },
					};
				},
			};
		}
	}

	enumerator(): Enumerator<T> { return new Enumerator<T>(this.impl.enumerator()); }

	array(): T[] {
		var e = this.enumerator();
		var res = [];
		while (e.moveNext())
			res.push(e.current());
		return res;
	}
	count(): number {
		var e = this.enumerator();
		var res = 0;
		while (e.moveNext())
			res++;
		return res;
	}

	static Properties(obj): Enumerable<any> {
		if (obj === null || obj === undefined)
			return new Enumerable();

		if (obj instanceof Array)
			return Enumerable.Range(obj.length);

		var props = [];
		for (var p in obj) {
			props.push(p);
		}
		return props.enumerable();
	}
	static From<T>(array: T[]): Enumerable<T> {
		return new Enumerable({
			enumerator: () => {
				var i = -1;
				return {
					current: () => (i > -1 && i < array.length) ? array[i] : undefined,
					moveNext: () => ++i < array.length,
					reset: () => i = -1,
				};
			},
		});
	}
	static Repeat<T>(value: T, N: number): Enumerable<T> {
		return new Enumerable<T>({
			enumerator: () => {
				var i = -1;
				return {
					current: (): T => i > -1 && i < N ? value : undefined,
					moveNext: () => ++i < N,
					reset: () => i = -1,
				};
			},
		});
	}

	static Range(countOrStart: number, count?: number): Enumerable<number> {
		var start = 0;
		var N = countOrStart;
		if (typeof count === "number") {
			N = count;
			start = countOrStart;
		}

		return new Enumerable<number>({
			enumerator: () => {
				var i = -1;
				return {
					current: (): number => i > -1 && i < N ? start + i : undefined,
					moveNext: () => ++i < N,
					reset: () => i = -1,
				};
			},
		});
	}

	forEach(action: (x: T) => void) {
		var e = this.enumerator();
		while (e.moveNext()) {
			action(e.current());
		}
		return this;
	}
	forEachIndex(action: (index: number, item: T) => void) {
		var e = this.enumerator();
		var i = 0;
		while (e.moveNext()) {
			action(i++, e.current());
		}
		return this;
	}

	append(other: IEnumerable<T>): Enumerable<T> {
		return new Enumerable<T>({
			enumerator: () => {
				var e0 = this.enumerator();
				var e1 = other.enumerator();
				var cur = undefined;
				var part = 0;
				return {
					current: () => cur,
					reset: () => {
						part = 0;
						cur = undefined;
						e0.reset();
						e1.reset();
					},
					moveNext: () => {
						cur = undefined;
						var moved = false;
						if (part === 0) {
							moved = e0.moveNext();
							if (!moved)
								part = 1;
							else
								cur = e0.current();
						}
						if (part === 1) {
							moved = e1.moveNext();
							if (!moved)
								part = 2;
							else
								cur = e1.current();
						}
						return moved;
					}
				}
			},
		});
	}

	where(predicate: (x: T) => boolean): Enumerable<T> {
		return new Enumerable<T>({
			enumerator: () => {
				var e = this.enumerator();
				return {
					current: (): T => e.current(),
					reset: () => e.reset(),
					moveNext: () => {
						do {
							var moved = e.moveNext();
							if (!moved)
								return false;
						}
						while (!predicate(e.current()));
						return true;
					},
				}
			}
		});
	}

	take(num: number): Enumerable<T> {
		return new Enumerable<T>({
			enumerator: () => {
				var e = this.enumerator();
				var i = 0;
				return {
					current: () => {
						if (i > num) return undefined;
						return e.current();
					},
					reset: () => { i = 0; e.reset(); },
					moveNext: () => { return i++ < num && e.moveNext(); },
				};
			},
		});
	}

	skip(num: number): Enumerable<T> {
		return new Enumerable<T>({
			enumerator: () => {
				var e = this.enumerator();
				var i = num;
				return {
					current: () => e.current(),
					reset: () => { i = num; e.reset(); },
					moveNext: () => {
						while (i > 0 && e.moveNext()) { i--; }
						if (i === 0)
							return e.moveNext();
						return false;
					},
				};
			},
		});
	}

	select<U>(cvt: (item: T) => U): Enumerable<U> {
		return new Enumerable<U>({
			enumerator: () => {
				var e = this.enumerator();
				return {
					current: () => {
						var u = e.current();
						return u !== undefined ? cvt(u) : undefined;
					},
					reset: () => e.reset(),
					moveNext: () => e.moveNext(),
				};
			},
		});
	}

	selectMany<U>(cvt: (item: T) => IEnumerable<U>): Enumerable<U> {
		return new Enumerable<U>({
			enumerator: () => {
				var e = this.enumerator();
				var sub: IEnumerator<U> = undefined;
				return {
					reset: () => {
						e.reset();
						sub = undefined;
					},
					moveNext: (): boolean => {
						while (sub === undefined || !sub.moveNext()) {
							sub = undefined;
							while (sub === undefined) {
								if (!e.moveNext()) {
									sub = undefined;
									return false;
								}
								var u = e.current();
								sub = u !== undefined ? cvt(u).enumerator() : undefined;
							}
						}
						return true;
					},
					current: () => sub !== undefined ? sub.current() : undefined,
				}
			},
		});
	}

	distinct<U>(getKey?: (item: T) => U): Enumerable<T> {
		return new Enumerable<T>({
			enumerator: () => {
				if (getKey === undefined) {
					getKey = x => <U><any>x;
				}
				var found = [];
				var isThere = (x: T): boolean => {
					var k = getKey(x);
					if (found.enumerable().contains(k)) {
						return true;
					}
					else {
						found.push(k);
						return false;
					}
				}
				var e = this.enumerator();
				return {
					reset: () => {
						found = [];
						e.reset();
					},
					current: () => e.current(),
					moveNext: () => {
						do {
							if (!e.moveNext())
								return false;
						}
						while (isThere(e.current()));
						return true;
					},
				};
			}
		})
	}

	sort(cmpFn?: (a: T, b: T) => number): Enumerable<T> {
		var res = this.array();
		return res.sort(cmpFn).enumerable();
	}
	orderBy(getM: (x: T) => number): Enumerable<T> {
		return this.sort((a, b) => getM(a) - getM(b));
	}
	orderByString(getS: (x: T) => string): Enumerable<T> {
		return this.sort((a, b) => {
			var sa = '' + getS(a);
			var sb = '' + getS(b);
			if (sa > sb) return 1;
			if (sa < sb) return -1;
			return 0;
		});
	}

	max(cvt?: (item: T) => number) {
		var max = undefined;
		if (!cvt) cvt = item => <any>item;
		var e = this.enumerator();
		while (e.moveNext()) {
			var n = cvt(e.current());
			if (typeof n !== "number")
				continue;
			if (typeof max === "number") {
				if (n > max)
					max = n;
			}
			else {
				max = n;
			}
		}
		return max;
	}

	min(cvt?: (item: T) => number) {
		var min = undefined;
		if (!cvt) cvt = item => <any>item;
		var e = this.enumerator();
		while (e.moveNext()) {
			var n = cvt(e.current());
			if (typeof n !== "number")
				continue;
			if (typeof min === "number") {
				if (n < min)
					min = n;
			}
			else {
				min = n;
			}
		}
		return min;
	}

	contains(item: T) { return this.has(x => x === item); }
	has(predicate: (x: T) => boolean): boolean {
		var e = this.enumerator();
		while (e.moveNext()) {
			if (predicate(e.current()))
				return true;
		}
		return false;
	}
	first(predicate?: (x: T) => boolean): T {
		if (!predicate)
			predicate = x => true;
		var e = this.enumerator();
		var cur: T;
		do {
			if (!e.moveNext())
				return undefined;
			cur = e.current();
		}
		while (!predicate(cur));
		return cur;
	}

	aggregate(merge: (item1: T, item2: T) => T, emptyValue?: T): T {
		var e = this.enumerator();
		if (!e.moveNext()) {
			return emptyValue;
		}

		var res = e.current();
		while (e.moveNext()) {
			res = merge(res, e.current());
		}
		return res;
	}
}
