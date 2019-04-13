(function() {
  "use strict";

  function accessProperty(args, target, prop, previous) {
    let values = target
      .map(elem => propertyToFunction(elem, prop))
      .map(f => f(...args));
    return values[0] instanceof Object && !(values[0] instanceof HTMLElement)
      ? ZQuery(values, previous || ZQuery(target))
      : values[0] instanceof HTMLElement
      ? ZQuery(values)
      : values;
  }

  function ZQuery(array, previous) {
    return new Proxy(array, {
      get: function(target, prop) {
        if (prop === iSZQuery) {
          return true;
        } else if (prop === "return") {
          return n => previous;
        } else if (prop === "size") {
          return n => target.length;
        } else if (
          target &&
          target[0] instanceof DOMTokenList &&
          prop === "toggle"
        ) {
          throw new Error("Toggling classes is not supported at this time.");
        } else if (!Number.isNaN(Number(prop))) {
          return target[prop];
        } else {
          return function(args) {
            return accessProperty(
              Array.from(arguments),
              target,
              prop,
              previous
            );
          };
        }
      }
    });
  }

  function converter(val) {
    return val instanceof HTMLCollection ? ZQuery(Array.from(val)) : val;
  }

  function propertyToFunction(elem, prop) {
    if (elem[prop] instanceof Function) {
      return function(n) {
        n = converter(elem[prop](...arguments));
        return n === undefined ? elem : n;
      };
    } else {
      return function(n) {
        return n === undefined
          ? converter(elem[prop])
          : ((elem[prop] = n), elem);
      };
    }
  }

  function init(selector) {
    if (Object(selector) instanceof String) {
      if (selector.charAt(0) == "<") {
        selector = [
          document.createElement(selector.substring(1, selector.length - 1))
        ];
      } else {
        selector = Array.from(document.querySelectorAll(selector));
      }
    }

    return ZQuery(selector || []);
  }

  let iSZQuery = Symbol("ZQuery");

  globalThis.Z = function(selector) {
    return init(selector);
  };
})();
