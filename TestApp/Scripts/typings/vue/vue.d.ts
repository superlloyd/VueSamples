
interface VueAttributes {
    [n: string]: string;
}

interface VueCallback {
    (): void;
}

interface ValueCallback {
    (value: any): void;
}

interface Array<T> {
    $set(o: T): Array<T>;
    $remove(o: T): Array<T>;
}

declare class Vue {
    constructor();
    constructor(options: boolean);
    constructor(options: {});
    static extend(options: {}): Vue;
    static config(key: string, value?: any);
    static config(options: string);
    static config(options: string, value: any);
    static config(options: {});
    static directive(id: string, definition: ValueCallback);
    static directive(id: string, definition?: any);
    static filter(id: string, definition?: ValueCallback);
    static component(id: string, definition: Vue);
    static component(id: string, definition?: {});
    static effect(id: string, definition?: ValueCallback);
    static partial(id: string, definition: string);
    static partial(id: string, definition: HTMLElement);
    static nextTick(callback: ValueCallback);
    static require(module: string);
    static use(plugin: string, args?: {});
    static use(plugin: {}, args?: {});

    $init(options: any);
    $watch(keypath: string, callback: any);
    $unwatch(keypath: string, callback?: any);
    $get(keypath: string);
    $set(keypath: string, value: any);
    $dispatch(event: string, ...args: any[]);
    $broadcast(event: string, ...args: any[]);
    $emit(event: string, ...args: any[]);
    $on(keypath: string, callback: any);
    $once(keypath: string, callback: any);
    $off(keypath: string, callback: any);
    $appendTo(element: HTMLElement);
    $appendTo(element: string);

    $log(keypath?: string);
    $add(key: string, value);
    $delete(key: string);
    $eval(expression: string);
    $interpolate(templateString: string);

    $mount(target: HTMLElement | string);
    $destroy(remove?: boolean);
    $compile(element: HTMLElement);
    $addChild(options?: any, construct?: Function);

    $before(element: HTMLElement);
    $before(element: string);

    $after(element: HTMLElement);
    $after(element: string);

    $remove();
    $destroy();

    $el: HTMLElement;
    $data: any; // {}
    $options: any; // {}
    $: any; // {}
    $index: number;
    $parent: Vue;
    $root: Vue;
    $compiler: any;


    template: string;
    replace: boolean;
    tagName: string;
    id: string;
    className: string;
    attributes: any;

    created(): void;
    ready(): void;
    attached(): void;
    detached(): void;
    beforeDestroy(): void;
    afterDestroy(): void;

    lazy: boolean;
}
