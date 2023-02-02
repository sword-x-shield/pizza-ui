import { inject, defineComponent, ref, reactive, watch, onMounted, onBeforeUnmount, provide, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, createCommentVNode, renderSlot, toDisplayString, normalizeStyle, toRefs, getCurrentInstance } from 'vue';

const injectKey = Symbol("PizzaConfigProvider");

const defaultClsPrefix = "p";
function useConfig() {
  const defaultProvide = {
    clsPrefix: defaultClsPrefix,
    mode: "light"
  };
  const PConfigProvider = inject(injectKey, defaultProvide);
  return PConfigProvider;
}

const componentPrefix = "P";
const getClsPrefix = componentName => {
  const {
    clsPrefix
  } = useConfig();
  if (componentName) return `${clsPrefix}-${componentName}`;
  return clsPrefix;
};
const getComponentPrefix = options => {
  return options?.componentPrefix ?? componentPrefix;
};

const withInstall = main => {
  main.install = app => {
    app.component(`${getComponentPrefix()}${main.name}`, main);
  };
  return main;
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
    tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
  undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;
var isArray$1 = isArray;

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now$1 = function () {
  return root.Date.now();
};
var now$2 = now$1;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
  nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime,
    lastInvokeTime = 0,
    leading = false,
    maxing = false,
    trailing = true;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs,
      thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime,
      timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
      timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now$2();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }
  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }
  function flush() {
    return timerId === undefined ? result : trailingEdge(now$2());
  }
  function debounced() {
    var time = now$2(),
      isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || !isArray$1(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
    trailing = true;
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

const getElement = (target, container) => {
  if (isString(target)) {
    const selector = target[0] === "#" ? `[id='${target.slice(1)}']` : target;
    return (container ?? document).querySelector(selector) ?? void 0;
  }
  return target;
};

function t(t) {
  return "object" == typeof t && null != t && 1 === t.nodeType;
}
function e(t, e) {
  return (!e || "hidden" !== t) && "visible" !== t && "clip" !== t;
}
function n(t, n) {
  if (t.clientHeight < t.scrollHeight || t.clientWidth < t.scrollWidth) {
    var r = getComputedStyle(t, null);
    return e(r.overflowY, n) || e(r.overflowX, n) || function (t) {
      var e = function (t) {
        if (!t.ownerDocument || !t.ownerDocument.defaultView) return null;
        try {
          return t.ownerDocument.defaultView.frameElement;
        } catch (t) {
          return null;
        }
      }(t);
      return !!e && (e.clientHeight < t.scrollHeight || e.clientWidth < t.scrollWidth);
    }(t);
  }
  return !1;
}
function r(t, e, n, r, i, o, l, d) {
  return o < t && l > e || o > t && l < e ? 0 : o <= t && d <= n || l >= e && d >= n ? o - t - r : l > e && d < n || o < t && d > n ? l - e + i : 0;
}
var i = function (e, i) {
  var o = window,
    l = i.scrollMode,
    d = i.block,
    f = i.inline,
    h = i.boundary,
    u = i.skipOverflowHiddenElements,
    s = "function" == typeof h ? h : function (t) {
      return t !== h;
    };
  if (!t(e)) throw new TypeError("Invalid target");
  for (var a, c, g = document.scrollingElement || document.documentElement, p = [], m = e; t(m) && s(m);) {
    if ((m = null == (c = (a = m).parentElement) ? a.getRootNode().host || null : c) === g) {
      p.push(m);
      break;
    }
    null != m && m === document.body && n(m) && !n(document.documentElement) || null != m && n(m, u) && p.push(m);
  }
  for (var w = o.visualViewport ? o.visualViewport.width : innerWidth, v = o.visualViewport ? o.visualViewport.height : innerHeight, W = window.scrollX || pageXOffset, H = window.scrollY || pageYOffset, b = e.getBoundingClientRect(), y = b.height, E = b.width, M = b.top, V = b.right, x = b.bottom, I = b.left, C = "start" === d || "nearest" === d ? M : "end" === d ? x : M + y / 2, R = "center" === f ? I + E / 2 : "end" === f ? V : I, T = [], k = 0; k < p.length; k++) {
    var B = p[k],
      D = B.getBoundingClientRect(),
      O = D.height,
      X = D.width,
      Y = D.top,
      L = D.right,
      S = D.bottom,
      j = D.left;
    if ("if-needed" === l && M >= 0 && I >= 0 && x <= v && V <= w && M >= Y && x <= S && I >= j && V <= L) return T;
    var N = getComputedStyle(B),
      q = parseInt(N.borderLeftWidth, 10),
      z = parseInt(N.borderTopWidth, 10),
      A = parseInt(N.borderRightWidth, 10),
      F = parseInt(N.borderBottomWidth, 10),
      G = 0,
      J = 0,
      K = "offsetWidth" in B ? B.offsetWidth - B.clientWidth - q - A : 0,
      P = "offsetHeight" in B ? B.offsetHeight - B.clientHeight - z - F : 0,
      Q = "offsetWidth" in B ? 0 === B.offsetWidth ? 0 : X / B.offsetWidth : 0,
      U = "offsetHeight" in B ? 0 === B.offsetHeight ? 0 : O / B.offsetHeight : 0;
    if (g === B) G = "start" === d ? C : "end" === d ? C - v : "nearest" === d ? r(H, H + v, v, z, F, H + C, H + C + y, y) : C - v / 2, J = "start" === f ? R : "center" === f ? R - w / 2 : "end" === f ? R - w : r(W, W + w, w, q, A, W + R, W + R + E, E), G = Math.max(0, G + H), J = Math.max(0, J + W);else {
      G = "start" === d ? C - Y - z : "end" === d ? C - S + F + P : "nearest" === d ? r(Y, S, O, z, F + P, C, C + y, y) : C - (Y + O / 2) + P / 2, J = "start" === f ? R - j - q : "center" === f ? R - (j + X / 2) + K / 2 : "end" === f ? R - L + A + K : r(j, L, X, q, A + K, R, R + E, E);
      var Z = B.scrollLeft,
        $ = B.scrollTop;
      C += $ - (G = Math.max(0, Math.min($ + G / U, B.scrollHeight - O / U + P))), R += Z - (J = Math.max(0, Math.min(Z + J / Q, B.scrollWidth - X / Q + K)));
    }
    T.push({
      el: B,
      top: G,
      left: J
    });
  }
  return T;
};

function isOptionsObject(options) {
  return options === Object(options) && Object.keys(options).length !== 0;
}
function defaultBehavior(actions, behavior) {
  if (behavior === void 0) {
    behavior = 'auto';
  }
  var canSmoothScroll = ('scrollBehavior' in document.body.style);
  actions.forEach(function (_ref) {
    var el = _ref.el,
      top = _ref.top,
      left = _ref.left;
    if (el.scroll && canSmoothScroll) {
      el.scroll({
        top: top,
        left: left,
        behavior: behavior
      });
    } else {
      el.scrollTop = top;
      el.scrollLeft = left;
    }
  });
}
function getOptions(options) {
  if (options === false) {
    return {
      block: 'end',
      inline: 'nearest'
    };
  }
  if (isOptionsObject(options)) {
    return options;
  }
  return {
    block: 'start',
    inline: 'nearest'
  };
}
function scrollIntoView(target, options) {
  var isTargetAttached = target.isConnected || target.ownerDocument.documentElement.contains(target);
  if (isOptionsObject(options) && typeof options.behavior === 'function') {
    return options.behavior(isTargetAttached ? i(target, options) : []);
  }
  if (!isTargetAttached) {
    return;
  }
  var computeOptions = getOptions(options);
  return defaultBehavior(i(target, computeOptions), computeOptions.behavior);
}

var memoizedNow;
var now = function now() {
  if (!memoizedNow) {
    memoizedNow = 'performance' in window ? performance.now.bind(performance) : Date.now;
  }
  return memoizedNow();
};
function step(context) {
  var time = now();
  var elapsed = Math.min((time - context.startTime) / context.duration, 1);
  var value = context.ease(elapsed);
  var currentX = context.startX + (context.x - context.startX) * value;
  var currentY = context.startY + (context.y - context.startY) * value;
  context.method(currentX, currentY);
  if (currentX !== context.x || currentY !== context.y) {
    requestAnimationFrame(function () {
      return step(context);
    });
  } else {
    context.cb();
  }
}
function smoothScroll(el, x, y, duration, ease, cb) {
  if (duration === void 0) {
    duration = 600;
  }
  if (ease === void 0) {
    ease = function ease(t) {
      return 1 + --t * t * t * t * t;
    };
  }
  var scrollable;
  var startX;
  var startY;
  var method;
  scrollable = el;
  startX = el.scrollLeft;
  startY = el.scrollTop;
  method = function method(x, y) {
    el.scrollLeft = Math.ceil(x);
    el.scrollTop = Math.ceil(y);
  };
  step({
    scrollable: scrollable,
    method: method,
    startTime: now(),
    startX: startX,
    startY: startY,
    x: x,
    y: y,
    duration: duration,
    ease: ease,
    cb: cb
  });
}
var shouldSmoothScroll = function shouldSmoothScroll(options) {
  return options && !options.behavior || options.behavior === 'smooth';
};
function scroll(target, options) {
  var overrides = options || {};
  if (shouldSmoothScroll(overrides)) {
    return scrollIntoView(target, {
      block: overrides.block,
      inline: overrides.inline,
      scrollMode: overrides.scrollMode,
      boundary: overrides.boundary,
      behavior: function behavior(actions) {
        return Promise.all(actions.reduce(function (results, _ref) {
          var el = _ref.el,
            left = _ref.left,
            top = _ref.top;
          var startLeft = el.scrollLeft;
          var startTop = el.scrollTop;
          if (startLeft === left && startTop === top) {
            return results;
          }
          return [].concat(results, [new Promise(function (resolve) {
            return smoothScroll(el, left, top, overrides.duration, overrides.ease, function () {
              return resolve({
                el: el,
                left: [startLeft, left],
                top: [startTop, top]
              });
            });
          })]);
        }, []));
      }
    });
  }
  return Promise.resolve(scrollIntoView(target, options));
}
var smoothScrollIntoView = scroll;
var scrollIntoViewIfNeed = smoothScrollIntoView;

const anchorInjectionKey = Symbol("PizzaAnchor");

const __default__$2 = defineComponent({
  name: "Anchor"
});
var script$3 = /* @__PURE__ */ defineComponent({
  ...__default__$2,
  props: {
    showRail: { type: Boolean, required: false, default: true },
    showBackground: { type: Boolean, required: false, default: true },
    size: { type: String, required: false, default: "default" },
    smooth: { type: Boolean, required: false, default: true },
    offsetTarget: { type: [String, null], required: false }
  },
  emits: {
    select: (_hash, _preHash) => true
  },
  setup(__props, { emit }) {
    const props = __props;
    const clsPrefix = getClsPrefix("anchor");
    const currentLink = ref("");
    const isScrolling = ref(false);
    const links = reactive({});
    const scrollContainerEle = ref();
    const barRef = ref();
    const scrollIntoView = (hash) => {
      const element = getElement(hash);
      if (!element)
        return;
      isScrolling.value = true;
      const behaviorType = props.smooth ? "smooth" : "auto";
      scrollIntoViewIfNeed(element, { block: "start", behavior: behaviorType }).then(() => {
        isScrolling.value = false;
      });
    };
    const handleAnchorChange = (hash) => {
      if (hash !== currentLink.value)
        currentLink.value = hash;
    };
    const addLink = (hash, node) => {
      if (!hash)
        return;
      links[hash] = node;
    };
    const handleClick = (_e, hash) => {
      if (hash) {
        scrollIntoView(hash);
        handleAnchorChange(hash);
      }
      emit("select", hash, currentLink.value);
    };
    const setContainer = () => {
      if (props.offsetTarget)
        scrollContainerEle.value = getElement(props.offsetTarget);
      else
        scrollContainerEle.value = document.documentElement;
    };
    const getFirstInViewportEle = () => {
      if (!scrollContainerEle.value)
        return void 0;
      const containerRect = scrollContainerEle.value.getBoundingClientRect();
      for (const hash of Object.keys(links)) {
        const element = getElement(hash);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const offsetTop = scrollContainerEle.value === document.documentElement ? top : top - containerRect.top;
          if (offsetTop >= -5 && offsetTop <= containerRect.height / 2)
            return element;
        }
      }
      return void 0;
    };
    const handleScroll = throttle(() => {
      if (isScrolling.value)
        return;
      const element = getFirstInViewportEle();
      if (element && element.id) {
        const hash = `#${element.id}`;
        handleAnchorChange(hash);
      }
    });
    const bindScrollEvent = () => {
      if (scrollContainerEle.value)
        document.addEventListener("scroll", handleScroll, true);
    };
    const unbindScrollEvent = () => {
      if (scrollContainerEle.value)
        document.removeEventListener("scroll", handleScroll, true);
    };
    watch(currentLink, () => {
      const link = links[currentLink.value];
      if (props.showRail && link && barRef.value) {
        barRef.value.style.top = `${link.firstElementChild.offsetTop}px`;
        barRef.value.style.height = `${link.firstElementChild.offsetHeight}px`;
      }
    });
    onMounted(() => {
      setContainer();
      const hash = decodeURIComponent(window.location.hash);
      if (hash) {
        scrollIntoView(hash);
        handleAnchorChange(hash);
      } else {
        handleScroll();
      }
      bindScrollEvent();
    });
    onBeforeUnmount(() => {
      unbindScrollEvent();
    });
    provide(
      anchorInjectionKey,
      reactive({
        currentLink,
        showRail: props.showRail,
        handleClick,
        addLink
      })
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(`${unref(clsPrefix)}`)
      }, [
        __props.showRail ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(`${unref(clsPrefix)}-rail`)
        }, [
          createElementVNode("div", {
            ref_key: "barRef",
            ref: barRef,
            class: normalizeClass([`${unref(clsPrefix)}-rail-bar`, currentLink.value !== null && `${unref(clsPrefix)}-rail-bar--active`])
          }, null, 2)
        ], 2)) : createCommentVNode("v-if", true),
        createElementVNode("ul", {
          class: normalizeClass(`${unref(clsPrefix)}-wrap`)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2)
      ], 2);
    };
  }
});

script$3.__file = "components/anchor/src/anchor.vue";

const _hoisted_1 = ["href"];
const __default__$1 = defineComponent({
  name: "AnchorLink"
});
var script$2 = /* @__PURE__ */ defineComponent({
  ...__default__$1,
  props: {
    title: { type: String, required: true },
    href: { type: String, required: false }
  },
  setup(__props) {
    const props = __props;
    const clsPrefix = getClsPrefix("anchor");
    const linkCls = `${clsPrefix}-link`;
    const linkRef = ref();
    const context = inject(anchorInjectionKey, void 0);
    onMounted(() => {
      if (props.href && linkRef.value)
        context?.addLink(props.href, linkRef.value);
    });
    const handleClick = (e) => context?.handleClick(e, props.href);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("li", {
        ref_key: "linkRef",
        ref: linkRef,
        class: normalizeClass(`${linkCls}-item`)
      }, [
        createElementVNode("a", {
          href: __props.href,
          class: normalizeClass([linkCls, {
            [`${linkCls}-active-line`]: unref(context)?.currentLink === __props.href && unref(context)?.showRail,
            [`${linkCls}-active`]: unref(context)?.currentLink === __props.href && !unref(context)?.showRail
          }]),
          onClick: handleClick
        }, toDisplayString(__props.title), 11, _hoisted_1),
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});

script$2.__file = "components/anchor/src/anchor-link.vue";

const PAnchor = withInstall(script$3);
const PAnchorLink = withInstall(script$2);
({
  ...script$3,
  Link: script$2,
  install: app => {
    [PAnchor.install, PAnchorLink.install].forEach(installFn => installFn && installFn(app));
  }
});

const __default__ = defineComponent({
  name: "Affix"
});
var script$1 = /* @__PURE__ */ defineComponent({
  ...__default__,
  props: {
    offsetTop: { type: Number, required: false, default: 0 },
    offsetBottom: { type: Number, required: false },
    scrollTarget: { type: [String, null], required: false },
    position: { type: String, required: false, default: "fixed" }
  },
  setup(__props) {
    const props = __props;
    const clsPrefix = getClsPrefix("affix");
    const affixRef = ref();
    const container = ref();
    const fixedStyles = ref();
    ref(false);
    const handleScroll = throttle(() => {
      if (!affixRef.value)
        return;
      const { offsetTop, offsetBottom, position } = props;
      const offsetType = isUndefined(offsetBottom) ? "top" : "bottom";
      const affixRect = affixRef.value.getBoundingClientRect();
      const containerRect = container.value instanceof HTMLElement ? container.value.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
      const positionType = position === "absolute" ? "absolute" : "fixed";
      let isFixed = false;
      let newFixedStyles = {};
      const newPlaceholderStyles = {
        width: `${affixRef.value.offsetWidth}px`,
        height: `${affixRef.value.offsetHeight}px`
      };
      if (offsetType === "top") {
        isFixed = affixRect.top - containerRect.top < (offsetTop || 0);
        newFixedStyles = isFixed ? {
          position: positionType,
          top: positionType === "fixed" ? `${containerRect.top + (offsetTop || 0)}px` : `${offsetTop || 0}px`
        } : {};
      } else {
        isFixed = containerRect.bottom - affixRect.bottom < (offsetBottom || 0);
        newFixedStyles = isFixed ? {
          position: positionType,
          bottom: positionType === "fixed" ? `${window.innerHeight - containerRect.bottom + (offsetBottom || 0)}px` : `${offsetBottom || 0}px`
        } : {};
      }
      fixedStyles.value = {
        ...newFixedStyles,
        ...isFixed ? newPlaceholderStyles : {}
      };
    }, 200);
    const init = () => {
      const { scrollTarget } = props;
      container.value = scrollTarget && scrollTarget !== document && getElement(scrollTarget) || document;
      if (container.value) {
        container.value.addEventListener("scroll", handleScroll);
        handleScroll();
      }
    };
    onMounted(() => {
      init();
    });
    onBeforeUnmount(() => {
      if (container.value)
        container.value.removeEventListener("scroll", handleScroll);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "affixRef",
        ref: affixRef
      }, [
        createElementVNode("div", {
          style: normalizeStyle(fixedStyles.value),
          class: normalizeClass(unref(clsPrefix))
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 6)
      ], 512);
    };
  }
});

script$1.__file = "components/affix/src/affix.vue";

const PAffix = withInstall(script$1);

var script = defineComponent({
  name: "ConfigProvider",
  props: {
    mode: {
      type: String,
      default: "light"
    },
    global: {
      type: Boolean,
      default: false
    },
    clsPrefix: {
      type: String,
      default: defaultClsPrefix
    }
  },
  setup(props) {
    const config = reactive(toRefs(props));
    if (props.global) {
      const instance = getCurrentInstance();
      if (instance)
        instance.appContext.app.provide(injectKey, config);
    } else {
      provide(injectKey, config);
    }
  }
});

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default");
}

script.render = render;
script.__file = "components/config-provider/src/config-provider.vue";

const PConfigProvider = withInstall(script);

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PAnchor: PAnchor,
  PAnchorLink: PAnchorLink,
  PAffix: PAffix,
  PConfigProvider: PConfigProvider
});

const install = app => {
  for (const key of Object.keys(components)) {
    const name = key;
    app.use(components[name]);
  }
};

export { PAffix, PAnchor, install as default, useConfig };
