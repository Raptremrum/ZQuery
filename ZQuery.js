// ============================================================================
// --- ZQUERY INTERNAL TYPE DEFINITIONS (JSDoc Engine) ---
// ============================================================================

/**
 * @template T, ElementType
 * @typedef {T extends (...args: infer Args) => infer Return ? (...args: Args) => Return extends void | undefined ? ZQueryInstance<ElementType> : Return[] : (value?: T | ((currentValue: T, index: number) => T)) => T extends NodeList | HTMLCollection ? ZQueryInstance<Element> : T} DOMMethodOrPropertyWrapper
 */

/**
 * @template T, ElementType
 * @typedef {T extends (...args: infer Args) => infer Return ? (...args: Args) => Return extends void | undefined ? ZQueryInstance<ElementType> : Return[] : never} DOMMethodWrapper
 */

/**
 * @template PrimitiveType, ElementType
 * @typedef {{ [K in Extract<keyof PrimitiveType, string>]: PrimitiveType[K] extends (...args: infer Args) => infer Return ? (...args: Args) => Return extends string | number | boolean | String | Number | Boolean | RegExp ? ProxiedPrimitiveMethods<Return, ElementType> & { return(): ZQueryInstance<ElementType> } : Return extends any[] ? Array<any> & { return(): ZQueryInstance<ElementType> } : Return : PrimitiveType[K]; }} ProxiedPrimitiveMethods
 */

/**
 * @template PrimitiveType, ReturnTarget
 * @typedef {{ [K in Extract<keyof PrimitiveType, string>]: PrimitiveType[K] extends (...args: infer Args) => infer Return ? (...args: Args) => Return extends string | number | boolean | String | Number | Boolean | RegExp ? ProxiedStringPipeline<Return, ReturnTarget> & { return(): ReturnTarget } : Return extends any[] ? Array<any> & { return(): ReturnTarget } : Return : PrimitiveType[K]; }} ProxiedStringPipeline
 */

/**
 * @template T, ElementType
 * @typedef {T extends string ? ProxiedPrimitiveMethods<String, ElementType> : T extends number ? ProxiedPrimitiveMethods<Number, ElementType> : T extends boolean ? ProxiedPrimitiveMethods<Boolean, ElementType> : T} WrapPrimitivePipeline
 */

/**
 * @template T, ElementType
 * @typedef {{ (): WrapPrimitivePipeline<T, ElementType> & { return(): ZQueryInstance<ElementType> }; (value: T | ((currentValue: T, index: number) => T)): ZQueryInstance<ElementType>; }} DOMPropertyMethod
 */

/**
 * @template T
 * @typedef {{ [K in Extract<keyof T, string>]: T[K] extends (...args: any[]) => any ? DOMMethodWrapper<T[K], T> : DOMPropertyMethod<T[K], T>; }} ProxiedDOMMethods
 */

/**
 * @template {string} K
 * @typedef {K extends keyof CSSStyleDeclaration ? CSSStyleDeclaration[K] extends string ? CSSStyleDeclaration[K] | (string & {}) : string : string} GetCSSValueHint
 */

/**
 * NOTE: This opens a transactional update context. You MUST call `.return()` to batch and commit these mutations back to the main collection.
 * @template T
 * @typedef {{ [K in Extract<keyof CSSStyleDeclaration, string> as K extends 'return' ? never : K]: { (): ProxiedStringPipeline<String, ZQueryStyleNamespace<T>> & { return(): ZQueryStyleNamespace<T> }; (value?: GetCSSValueHint<K> | ((currentValue: string, index: number) => GetCSSValueHint<K>)): ZQueryStyleNamespace<T> & { return(): ZQueryInstance<T> } }; } & { return(): ZQueryInstance<T>; }} ZQueryStyleNamespace
 */

/**
 * NOTE: This opens a transactional update context. You MUST call `.return()` to batch and commit these mutations back to the main collection.
 * @template T
 * @typedef {({ [key: string]: { (): ProxiedStringPipeline<String, ZQueryDatasetNamespace<T>> & { return(): ZQueryDatasetNamespace<T> }; (value: string | number | null | undefined | ((currentValue: string, index: number) => string | number | null | undefined)): ZQueryDatasetNamespace<T> & { return(): ZQueryInstance<T> } } }) & { return(): ZQueryInstance<T>; }} ZQueryDatasetNamespace
 */

/**
 * NOTE: This opens a transactional update context. You MUST call `.return()` to batch and commit these mutations back to the main collection.
 * @template T, ElementType
 * @typedef {{ [K in Extract<keyof T, string> as K extends 'return' ? never : K]: T[K] extends (...args: infer Args) => infer Return ? (...args: Args) => Return extends void | boolean | undefined ? ProxiedClassListMethods<T, ElementType> & { return(): ZQueryInstance<ElementType> } : Return[] : T[K]; }} ProxiedClassListMethods
 */

/**
 * NOTE: This opens a transactional update context. You MUST call `.return()` to batch and commit these mutations back to the main collection.
 * @template T
 * @typedef {Partial<ProxiedClassListMethods<DOMTokenList, T>> & { return(): ZQueryInstance<T>; }} ZQueryClassListNamespace
 */

/**
 * @template [T=HTMLElement]
 * @typedef {Omit<ProxiedDOMMethods<T>, 'style' | 'dataset' | 'classList'> & { elements: T[]; length: number; readonly size: number; return(): ZQueryInstance<any> | null; inspect(): { length: number; elements: T[] }; toJSON(): { length: number; elements: T[] }; [Symbol.iterator](): IterableIterator<T>; forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): ZQueryInstance<T>; map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): ZQueryInstance<U>; filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): ZQueryInstance<T>; reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U; some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean; every(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean; style(): ZQueryStyleNamespace<T>; dataset(): ZQueryDatasetNamespace<T>; classList(): ZQueryClassListNamespace<T>; addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): ZQueryInstance<T>; on(type: string, selector: string, listener: (this: Element, ev: Event) => any, options?: boolean | AddEventListenerOptions): ZQueryInstance<T>; removeEventListeners(type?: string, listener?: EventListenerOrEventListenerObject): ZQueryInstance<T>; }} ZQueryInstance
 */

// ============================================================================
// --- Runtime Logic & Framework Implementation ---
// ============================================================================

const propertyCache = new Map();
const eventRegistry = new WeakMap();
const zQuerySymbol = Symbol("ZQuery");
const zQueryPipelineSymbol = Symbol("ZQueryPipeline");

const IS_COMPLEX_SELECTOR = /[ .\[]/;
const IS_PURE_TAG = /^[a-zA-Z0-9-]+$/;
const MUTATION_PROPERTIES = new Set(["style", "dataset", "classList"]);

const LIBRARY_INTERNAL_KEYS = new Set([
    'constructor', 'then', 'elements', 'length', 'size', '__prev__',
    '_mutations', 'return', 'addEventListener', 'on',
    'removeEventListeners', 'inspect', 'toJSON',
    'forEach', 'map', 'filter', 'reduce', 'some', 'every'
]);

let fallbackDivInstance = null;
let templateCache = null;

const isDoc = typeof document !== 'undefined';
const getFallbackDiv = () => isDoc ? (fallbackDivInstance ||= document.createElement('div')) : null;
const getTemplateContainer = () => isDoc ? (templateCache ||= document.createElement('template')) : null;
const isNumericIndex = (str) => typeof str === "string" && Number.isInteger(+str) && +str >= 0 && String(+str) === str;

function createAccessor(sampleElement, propName) {
    if (sampleElement && typeof sampleElement[propName] === "function") {
        return (els, args) => {
            const output = els.map(el => {
                const method = el?.[propName];
                return typeof method === "function" ? method.apply(el, args) : undefined;
            });
            const isVoid = output.every(x => x === undefined);
            return {
                output: output.map((x, i) => x === undefined ? els[i] : x),
                isVoid
            };
        };
    }

    return (els, args) => {
        if (args.length > 0) {
            const val = args[0];
            const isFn = typeof val === "function";

            els.forEach((el, i) => {
                if (!el) return;
                el[propName] = isFn ? val.call(el, el[propName], i) : val;
            });
            return { output: els, isVoid: false, isAssignment: true };
        }

        const output = [];
        els.forEach(el => {
            const v = el?.[propName];
            if (v instanceof NodeList || v instanceof HTMLCollection) {
                output.push(...v);
            } else if (v != null) {
                output.push(v);
            }
        });
        return { output, isVoid: false };
    };
}

class ZQueryCollection {
    constructor(elements, prev = null) {
        this.elements = elements;
        this.length = elements.length;
        this.__prev__ = prev;
    }

    get [zQuerySymbol]() { return true; }
    get size() { return this.length; }

    return() { return this.__prev__; }

    forEach(...args) { this.elements.forEach(...args); return this; }
    map(...args) { return wrapInProxy(this.elements.map(...args), this); }
    filter(...args) { return wrapInProxy(this.elements.filter(...args), this); }
    reduce(...args) { return this.elements.reduce(...args); }
    some(...args) { return this.elements.some(...args); }
    every(...args) { return this.elements.every(...args); }

    _parseEvent(type) {
        if (!type) return { base: '', ns: null };
        const dot = type.indexOf('.');
        return dot > -1
            ? { base: type.substring(0, dot), ns: type.substring(dot + 1) }
            : { base: type, ns: null };
    }

    _setupEvent(type, cb) {
        const { base, ns } = this._parseEvent(type);
        this.elements.forEach(el => {
            if (!el || typeof el.addEventListener !== "function") return;
            const reg = eventRegistry.get(el) || Object.create(null);
            eventRegistry.set(el, reg);
            cb(el, base, ns, reg[base] ||= []);
        });
        return this;
    }

    addEventListener(type, listener, options) {
        return this._setupEvent(type, (el, base, namespace, list) => {
            el.addEventListener(base, listener, options);
            list.push({ listener, options, namespace });
        });
    }

    on(type, selector, listener, options) {
        return this._setupEvent(type, (parent, base, namespace, list) => {
            const delegated = function(e) {
                let el = e.target;
                while (el && el !== parent) {
                    if (el.matches?.(selector)) {
                        listener.call(el, e);
                        if (e.cancelBubble) break;
                    }
                    el = el.parentNode;
                }
            };
            parent.addEventListener(base, delegated, options);
            list.push({ listener: delegated, options, _original: listener, namespace });
        });
    }

    removeEventListeners(type, listener) {
        const { base, ns } = this._parseEvent(type);

        this.elements.forEach(el => {
            const reg = el ? eventRegistry.get(el) : null;
            if (!reg) return;

            if (!type) {
                Object.keys(reg).forEach(t => {
                    reg[t].forEach(i => el.removeEventListener(t, i.listener, i.options));
                });
                eventRegistry.delete(el);
                return;
            }

            if (!reg[base]) return;

            reg[base] = reg[base].filter(item => {
                const isMatch = (!listener || item.listener === listener || item._original === listener) &&
                    (!ns || item.namespace === ns);
                if (isMatch) {
                    el.removeEventListener(base, item.listener, item.options);
                    return false;
                }
                return true;
            });

            if (!reg[base].length) delete reg[base];
            if (!Object.keys(reg).length) eventRegistry.delete(el);
        });
        return this;
    }
}

/** @type {ProxyHandler<any>} */
const mutationProxyHandler = {
    get(target, prop, receiver) {
        if (prop === zQueryPipelineSymbol) return target.ns;
        if (prop === "return") {
            target.isCommitted = true;
            return () => {
                // Batch execution context: Apply mutations down to live nodes sequentially on commitment
                target.collection.elements.forEach(el => {
                    if (!el) return;
                    
                    if (target.ns === "classList") {
                        target.queue.forEach(mutation => {
                            if (typeof el.classList[mutation.prop] === "function") {
                                el.classList[mutation.prop](...mutation.args);
                            }
                        });
                    } else {
                        const subNamespace = el[target.ns];
                        if (!subNamespace) return;
                        
                        target.queue.forEach(mutation => {
                            if (mutation.isDelete) {
                                delete subNamespace[mutation.prop];
                            } else {
                                const currentLiveVal = subNamespace[mutation.prop];
                                subNamespace[mutation.prop] = mutation.isFn
                                    ? mutation.value.call(el, currentLiveVal)
                                    : mutation.value;
                            }
                        });
                    }
                });
                return target.collection.return();
            };
        }
        if (prop in target.collection) return Reflect.get(target.collection, prop, receiver);
        
        if (isNumericIndex(prop)) {
            target.isCommitted = true;
            return target.collection.elements[prop];
        }

        return function(...args) {
            if (args.length === 0) {
                // Read operations capture live historical snapshots from index 0
                const firstEl = target.collection.elements[0];
                let rawValue = "";
                if (firstEl) {
                    if (target.ns === "classList") {
                        rawValue = firstEl.classList.contains(prop);
                    } else {
                        rawValue = firstEl[target.ns]?.[prop] ?? "";
                    }
                }
                return createPrimitiveProxy(
                    new ZQueryCollection([rawValue], receiver),
                    receiver,
                    { ns: target.ns, prop: prop }
                );
            }

            // Write staging structure (Gated from executing until .return() is run)
            const val = args[0];
            if (target.ns === "classList") {
                target.queue.push({ prop, args });
            } else {
                if (val === null || val === undefined) {
                    target.queue.push({ prop, isDelete: true });
                } else {
                    target.queue.push({ 
                        prop, 
                        value: val, 
                        isFn: typeof val === "function" 
                    });
                }
            }
            return receiver;
        };
    }
};

/** @type {ProxyHandler<any>} */
const primitiveProxyHandler = {
    get(state, prop, receiver) {
        if (prop === "return") {
            return () => {
                state.isCommitted = true;
                state._parentProxy.elements.forEach((el, i) => {
                    if (!el) return;
                    const newValue = state.collection.elements[i];

                    if (state._propName && typeof state._propName === "object") {
                        const { ns, prop: subProp } = state._propName;
                        if (el[ns]) el[ns][subProp] = newValue;
                    } else {
                        el[state._propName] = newValue;
                    }
                });
                return state._parentProxy;
            };
        }
        
        if (isNumericIndex(prop)) {
            state.isCommitted = true;
            return state.collection.elements[prop];
        }
        
        if (prop in state.collection) return Reflect.get(state.collection, prop, receiver);

        return function(...args) {
            const mapping = state.collection.elements.map(item => {
                if (item == null) return item;
                const targetProp = item[prop];
                return typeof targetProp === "function" ? targetProp.apply(item, args) : targetProp;
            });
            return createPrimitiveProxy(new ZQueryCollection(mapping, state._parentProxy), state._parentProxy, state._propName);
        };
    }
};

function createPrimitiveProxy(collection, parentProxy, propName) {
    const state = { 
        collection, 
        _parentProxy: parentProxy, 
        _propName: propName, 
        isCommitted: false 
    };

    if (typeof FinalizationRegistry !== 'undefined') {
        primitiveProxyHandler._registry ||= new FinalizationRegistry((heldState) => {
            if (!heldState.isCommitted) {
                console.warn(`[ZQuery Warning]: A primitive property pipeline was garbage collected without calling .return() or extracting a value via an index. Updates were dropped.`);
            }
        });
        primitiveProxyHandler._registry.register(state, {
            get isCommitted() { return state.isCommitted; }
        });
    }

    return new Proxy(state, primitiveProxyHandler);
}

/** @type {ProxyHandler<any>} */
const mainProxyHandler = {
    get(target, prop, receiver) {
        if (LIBRARY_INTERNAL_KEYS.has(prop)) {
            if (prop === "inspect" || prop === "toJSON") {
                return () => ({ length: target.length, elements: target.elements });
            }
            if (prop === "__prev__" || prop === "elements" || prop === "constructor") {
                return target[prop];
            }
            const nativeMethod = target[prop];
            return typeof nativeMethod === "function" && prop !== "return"
                ? (...args) => { const res = nativeMethod.apply(target, args); return res === target ? receiver : res; }
                : nativeMethod;
        }

        if (prop === zQuerySymbol) return true;
        if (prop === Symbol.iterator) return target.elements[Symbol.iterator].bind(target.elements);
        if (typeof prop === "symbol" || isNumericIndex(prop)) return target.elements[prop];

        return function(...args) {
            if (!args.length && MUTATION_PROPERTIES.has(prop)) {
                const state = { 
                    collection: new ZQueryCollection(target.elements, receiver), 
                    ns: prop,
                    queue: [], // Local transactional buffer queue
                    isCommitted: false
                };

                if (typeof FinalizationRegistry !== 'undefined') {
                    mutationProxyHandler._registry ||= new FinalizationRegistry((heldState) => {
                        if (!heldState.isCommitted) {
                            console.warn(`[ZQuery Warning]: A transactional .${heldState.ns}() pipeline was garbage collected without calling .return(). Updates were dropped and not applied to the DOM.`);
                        }
                    });
                    mutationProxyHandler._registry.register(state, { 
                        ns: prop, 
                        get isCommitted() { return state.isCommitted; } 
                    });
                }

                return new Proxy(state, mutationProxyHandler);
            }

            let accessor = propertyCache.get(prop);
            if (!accessor) {
                const sample = target.elements[0] || getFallbackDiv();
                if (!sample) return wrapInProxy([], receiver);
                propertyCache.set(prop, accessor = createAccessor(sample, prop));
            }

            const { output, isVoid, isAssignment } = accessor(target.elements, args);
            if (isAssignment || isVoid) return receiver;

            if (!args.length && output.length) {
                const sampleItem = output[0];
                if (sampleItem === null || (typeof sampleItem !== "object" && typeof sampleItem !== "function")) {
                    return createPrimitiveProxy(new ZQueryCollection(output, receiver), receiver, prop);
                }
            }

            if (typeof output[prop] === "function" && !output[zQuerySymbol]) {
                return (...nextArgs) => output[prop].apply(output, nextArgs);
            }

            return wrapInProxy(output, receiver);
        };
    }
};

const wrapInProxy = (els, prev) => new Proxy(new ZQueryCollection(els, prev), mainProxyHandler);

/**
 * @type {{
 * (): ZQueryInstance<HTMLElement>;
 * <K extends keyof HTMLElementTagNameMap>(selector: K, context?: Node): ZQueryInstance<HTMLElementTagNameMap[K]>;
 * <E extends Element = HTMLElement>(selector: string, context?: Node | Record<string, any>): ZQueryInstance<E>;
 * <E extends Node | Window>(element: E): ZQueryInstance<E>;
 * <E extends Node | Window>(elements: E[] | NodeListOf<any> | HTMLCollectionOf<any>): ZQueryInstance<E>;
 * }}
 */
const Z = function(selector, context) {
    if (typeof selector === "string" && selector.length > 0) {

        if (selector.charCodeAt(0) === 60) {
            const container = getTemplateContainer();
            if (!container) return wrapInProxy([], null);

            container.innerHTML = selector.trim();
            const nodes = [...container.content.children];
            container.content.replaceChildren();

            if (context && typeof context === "object" && !context.nodeType && nodes.length) {
                Object.assign(nodes[0], context);
            }
            return wrapInProxy(nodes, null);
        }

        if (!isDoc) return wrapInProxy([], null);
        const root = (context && [1, 9, 11].includes(context.nodeType)) ? context : document;
        const firstCharCode = selector.charCodeAt(0);

        if (firstCharCode === 35 && !IS_COMPLEX_SELECTOR.test(selector)) {
            const idNode = typeof root.getElementById === "function" ? root.getElementById(selector.substring(1)) : root.querySelector(selector);
            return wrapInProxy(idNode ? [idNode] : [], null);
        }

        if (firstCharCode === 46 && !IS_COMPLEX_SELECTOR.test(selector)) {
            const classNodes = typeof root.getElementsByClassName === "function"
                ? [...root.getElementsByClassName(selector.substring(1))]
                : [...root.querySelectorAll(selector)];
            return wrapInProxy(classNodes, null);
        }

        const elements = (IS_PURE_TAG.test(selector) && typeof root.getElementsByTagName === "function")
            ? [...root.getElementsByTagName(selector)]
            : [...root.querySelectorAll(selector)];

        return wrapInProxy(elements, null);
    }

    if (selector && (selector.nodeType || (typeof window !== 'undefined' && selector === window))) {
        return wrapInProxy([selector], null);
    }

    return wrapInProxy(selector ? (Array.isArray(selector) ? selector : [...selector]) : [], null);
};

// ============================================================================
// --- DevTools Custom Formatter ---
// ============================================================================
if (typeof window !== 'undefined') {
    window.devtoolsFormatters = window.devtoolsFormatters || [];
    window.devtoolsFormatters.push({
        header: function(obj) {
            if (obj && obj[zQuerySymbol]) {
                return ['span', { style: 'color: #8c52ff; font-weight: bold;' }, `ZQuery(${obj.length})`];
            }
            if (obj && obj[zQueryPipelineSymbol]) {
                return ['span', { style: 'color: #e67e22; font-weight: bold; font-style: italic;' }, `ZQueryPipeline(pending .${obj[zQueryPipelineSymbol]}() -> needs .return())`];
            }
            return null;
        },
        hasBody: function(obj) {
            return (obj && obj.length > 0) || (obj && obj[zQueryPipelineSymbol]);
        },
        body: function(obj) {
            if (obj && obj[zQueryPipelineSymbol]) {
                return ['div', { style: 'padding-left: 12px; font-family: monospace; color: #d35400;' },
                    ['div', { style: 'margin-bottom: 4px; font-weight: bold;' }, `⚠️ Transaction Open`],
                    ['div', { style: 'color: #666;' }, `This proxy is batching changes for namespace: "${obj[zQueryPipelineSymbol]}". Call .return() to push updates back to the parent element tree structure.`]
                ];
            }
            return ['div', { style: 'padding-left: 12px; font-family: monospace;' },
                ['div', { style: 'color: #777; margin-bottom: 4px;' }, `Elements matching selection:`],
                ['object', { object: obj.elements }]
            ];
        }
    });
}

export { Z };
export default Z;
