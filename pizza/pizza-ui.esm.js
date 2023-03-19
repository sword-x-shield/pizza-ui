import { inject, defineComponent, ref, reactive, watch, onMounted, onBeforeUnmount, provide, openBlock, createElementBlock, normalizeClass, unref, createElementVNode, createCommentVNode, renderSlot, toDisplayString, normalizeStyle, toRefs, getCurrentInstance } from 'vue';
import scrollIntoViewIfNeed from 'smooth-scroll-into-view-if-needed';
import { isString, throttle, isUndefined } from 'lodash-es';

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
  if (componentName) {
    return `${clsPrefix}-${componentName}`;
  }
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

const getElement = (target, container) => {
  if (isString(target)) {
    const selector = target[0] === "#" ? `[id='${target.slice(1)}']` : target;
    return (container ?? document).querySelector(selector) ?? void 0;
  }
  return target;
};

const anchorInjectionKey = Symbol("PizzaAnchor");

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

var __defProp$2 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b ||= {}) if (__hasOwnProp$2.call(b, prop)) __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2) for (var prop of __getOwnPropSymbols$2(b)) {
    if (__propIsEnum$2.call(b, prop)) __defNormalProp$2(a, prop, b[prop]);
  }
  return a;
};
var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
const __default__$2 = defineComponent({
  name: "Anchor"
});
const _sfc_main$3 = /* @__PURE__ */defineComponent(__spreadProps$2(__spreadValues$2({}, __default__$2), {
  props: {
    showRail: {
      type: Boolean,
      required: false,
      default: true
    },
    showBackground: {
      type: Boolean,
      required: false,
      default: true
    },
    size: {
      type: String,
      required: false,
      default: "default"
    },
    smooth: {
      type: Boolean,
      required: false,
      default: true
    },
    offsetTarget: {
      type: [String, null],
      required: false
    }
  },
  emits: {
    select: (_hash, _preHash) => true
  },
  setup(__props, {
    emit
  }) {
    const props = __props;
    const clsPrefix = getClsPrefix("anchor");
    const currentLink = ref("");
    const isScrolling = ref(false);
    const links = reactive({});
    const scrollContainerEle = ref();
    const barRef = ref();
    const scrollIntoView = hash => {
      const element = getElement(hash);
      if (!element) {
        return;
      }
      isScrolling.value = true;
      const behaviorType = props.smooth ? "smooth" : "auto";
      scrollIntoViewIfNeed(element, {
        block: "start",
        behavior: behaviorType
      }).then(() => {
        isScrolling.value = false;
      });
    };
    const handleAnchorChange = hash => {
      if (hash !== currentLink.value) {
        currentLink.value = hash;
      }
    };
    const addLink = (hash, node) => {
      if (!hash) {
        return;
      }
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
      if (props.offsetTarget) {
        scrollContainerEle.value = getElement(props.offsetTarget);
      } else {
        scrollContainerEle.value = document.documentElement;
      }
    };
    const getFirstInViewportEle = () => {
      if (!scrollContainerEle.value) {
        return void 0;
      }
      const containerRect = scrollContainerEle.value.getBoundingClientRect();
      for (const hash of Object.keys(links)) {
        const element = getElement(hash);
        if (element) {
          const {
            top
          } = element.getBoundingClientRect();
          const offsetTop = scrollContainerEle.value === document.documentElement ? top : top - containerRect.top;
          if (offsetTop >= -5 && offsetTop <= containerRect.height / 2) {
            return element;
          }
        }
      }
      return void 0;
    };
    const handleScroll = throttle(() => {
      if (isScrolling.value) {
        return;
      }
      const element = getFirstInViewportEle();
      if (element && element.id) {
        const hash = `#${element.id}`;
        handleAnchorChange(hash);
      }
    });
    const bindScrollEvent = () => {
      if (scrollContainerEle.value) {
        document.addEventListener("scroll", handleScroll, true);
      }
    };
    const unbindScrollEvent = () => {
      if (scrollContainerEle.value) {
        document.removeEventListener("scroll", handleScroll, true);
      }
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
    provide(anchorInjectionKey, reactive({
      currentLink,
      showRail: props.showRail,
      handleClick,
      addLink
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(`${unref(clsPrefix)}`)
      }, [__props.showRail ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${unref(clsPrefix)}-rail`)
      }, [createElementVNode("div", {
        ref_key: "barRef",
        ref: barRef,
        class: normalizeClass([`${unref(clsPrefix)}-rail-bar`, currentLink.value !== null && `${unref(clsPrefix)}-rail-bar--active`])
      }, null, 2)], 2)) : createCommentVNode("v-if", true), createElementVNode("ul", {
        class: normalizeClass(`${unref(clsPrefix)}-wrap`)
      }, [renderSlot(_ctx.$slots, "default")], 2)], 2);
    };
  }
}));
var Anchor = /* @__PURE__ */_export_sfc(_sfc_main$3, [["__file", "/home/runner/work/pizza-ui/pizza-ui/packages/pizza-ui/components/anchor/src/anchor.vue"]]);

var __defProp$1 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b ||= {}) if (__hasOwnProp$1.call(b, prop)) __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1) for (var prop of __getOwnPropSymbols$1(b)) {
    if (__propIsEnum$1.call(b, prop)) __defNormalProp$1(a, prop, b[prop]);
  }
  return a;
};
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
const _hoisted_1 = ["href"];
const __default__$1 = defineComponent({
  name: "AnchorLink"
});
const _sfc_main$2 = /* @__PURE__ */defineComponent(__spreadProps$1(__spreadValues$1({}, __default__$1), {
  props: {
    title: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    const clsPrefix = getClsPrefix("anchor");
    const linkCls = `${clsPrefix}-link`;
    const linkRef = ref();
    const context = inject(anchorInjectionKey, void 0);
    onMounted(() => {
      if (props.href && linkRef.value) {
        context == null ? void 0 : context.addLink(props.href, linkRef.value);
      }
    });
    const handleClick = e => context == null ? void 0 : context.handleClick(e, props.href);
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return openBlock(), createElementBlock("li", {
        ref_key: "linkRef",
        ref: linkRef,
        class: normalizeClass(`${linkCls}-item`)
      }, [createElementVNode("a", {
        href: __props.href,
        class: normalizeClass([linkCls, {
          [`${linkCls}-active-line`]: ((_a = unref(context)) == null ? void 0 : _a.currentLink) === __props.href && ((_b = unref(context)) == null ? void 0 : _b.showRail),
          [`${linkCls}-active`]: ((_c = unref(context)) == null ? void 0 : _c.currentLink) === __props.href && !((_d = unref(context)) == null ? void 0 : _d.showRail)
        }]),
        onClick: handleClick
      }, toDisplayString(__props.title), 11, _hoisted_1), renderSlot(_ctx.$slots, "default")], 2);
    };
  }
}));
var AnchorLink = /* @__PURE__ */_export_sfc(_sfc_main$2, [["__file", "/home/runner/work/pizza-ui/pizza-ui/packages/pizza-ui/components/anchor/src/anchor-link.vue"]]);

const PAnchor = withInstall(Anchor);
const PAnchorLink = withInstall(AnchorLink);
const _Anchor = {
  ...Anchor,
  Link: AnchorLink,
  install: app => {
    [PAnchor.install, PAnchorLink.install].forEach(installFn => installFn && installFn(app));
  }
};

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {}) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
    if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const __default__ = defineComponent({
  name: "Affix"
});
const _sfc_main$1 = defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: {
    offsetTop: {
      type: Number,
      required: false,
      default: 0
    },
    offsetBottom: {
      type: Number,
      required: false
    },
    scrollTarget: {
      type: [String, null],
      required: false
    },
    position: {
      type: String,
      required: false,
      default: "fixed"
    }
  },
  setup(__props) {
    const props = __props;
    const clsPrefix = getClsPrefix("affix");
    const affixRef = ref();
    const container = ref();
    const fixedStyles = ref();
    ref(false);
    const handleScroll = throttle(() => {
      if (!affixRef.value) {
        return;
      }
      const {
        offsetTop,
        offsetBottom,
        position
      } = props;
      const offsetType = isUndefined(offsetBottom) ? "top" : "bottom";
      const affixRect = affixRef.value.getBoundingClientRect();
      const containerRect = container.value instanceof HTMLElement ? container.value.getBoundingClientRect() : {
        top: 0,
        bottom: window.innerHeight
      };
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
      fixedStyles.value = __spreadValues(__spreadValues({}, newFixedStyles), isFixed ? newPlaceholderStyles : {});
    }, 200);
    const init = () => {
      const {
        scrollTarget
      } = props;
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
      if (container.value) {
        container.value.removeEventListener("scroll", handleScroll);
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "affixRef",
        ref: affixRef
      }, [createElementVNode("div", {
        style: normalizeStyle(fixedStyles.value),
        class: normalizeClass(unref(clsPrefix))
      }, [renderSlot(_ctx.$slots, "default")], 6)], 512);
    };
  }
}));
var Affix = /* @__PURE__ */_export_sfc(_sfc_main$1, [["__file", "/home/runner/work/pizza-ui/pizza-ui/packages/pizza-ui/components/affix/src/affix.vue"]]);

const PAffix = withInstall(Affix);

const _sfc_main = defineComponent({
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
      if (instance) {
        instance.appContext.app.provide(injectKey, config);
      }
    } else {
      provide(injectKey, config);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default");
}
var ConfigProvider = /* @__PURE__ */_export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/pizza-ui/pizza-ui/packages/pizza-ui/components/config-provider/src/config-provider.vue"]]);

const PConfigProvider = withInstall(ConfigProvider);

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  PAnchorLink: PAnchorLink,
  _Anchor: _Anchor,
  PAffix: PAffix,
  PConfigProvider: PConfigProvider
});

const install = app => {
  for (const key of Object.keys(components)) {
    const name = key;
    app.use(components[name]);
  }
};
var index = {
  install
};

export { PAffix, PAnchorLink, PConfigProvider, _Anchor, index as default, useConfig };
