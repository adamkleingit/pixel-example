import { getMode, inject, MISSING, record } from "../../../node_modules/@getpixel/ui/dist/chunk-6SFDMV6N.js";
import * as React2 from "react";
export {
  Children,
  Component,
  Fragment,
  Profiler,
  PureComponent,
  StrictMode,
  Suspense,
  cloneElement,
  createContext,
  createElement,
  createRef,
  forwardRef,
  isValidElement,
  lazy,
  memo,
  startTransition,
  useCallback,
  useDebugValue,
  useDeferredValue,
  useId,
  useMemo,
  useTransition,
  version,
} from "react";

function reactInternals() {
  return (
    React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ??
    React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  );
}

var warnedNoFiber = false;

function currentFiber() {
  const internals = reactInternals();
  const owner =
    internals?.ReactCurrentOwner?.current ??
    (typeof internals?.A?.getOwner === "function" ? internals.A.getOwner() : null);
  if (!owner && !warnedNoFiber) {
    warnedNoFiber = true;
    console.warn(
      "[pixel-react] React current-owner fiber is unavailable — state capture falls back to a single flat key and may misalign. (React internals moved?)",
    );
  }
  return owner;
}

function componentName(type) {
  if (typeof type === "function") {
    const fn = type;
    return fn.displayName || fn.name || "Anonymous";
  }
  if (type && typeof type === "object") {
    const o = type;
    return o.displayName || o.render?.name || o.type?.name || "Component";
  }
  return "Component";
}

function instanceKey(fiber) {
  if (!fiber) return "@root";
  const segs = [];
  let f = fiber;
  while (f) {
    if (typeof f.type === "function" || (f.type && typeof f.type === "object")) {
      const name = componentName(f.type);
      if (name !== "Component" && !name.startsWith("Anonymous")) {
        segs.push(name);
      }
    }
    f = f.return;
  }
  const path = segs.reverse().join("/");
  const anchor = path.indexOf("ThemeProvider/");
  return anchor >= 0 ? path.slice(anchor + "ThemeProvider/".length) : path;
}

var lastFiber = Symbol("none");
var curKey = "@root";
var cursor = { state: 0, refs: 0, contexts: 0, stores: 0 };

function begin(kind) {
  const f = currentFiber();
  if (f !== lastFiber) {
    lastFiber = f;
    curKey = instanceKey(f);
    cursor.state = 0;
    cursor.refs = 0;
    cursor.contexts = 0;
    cursor.stores = 0;
  }
  return { key: curKey, index: cursor[kind]++ };
}

function resolveInit(init) {
  return typeof init === "function" ? init() : init;
}

function useState2(initial) {
  const { key, index } = begin("state");
  const mode = getMode();
  if (mode === "suppress") {
    const injected = inject(key, "state", index);
    const [live, setLive] = React2.useState(initial);
    return [injected === MISSING ? live : injected, setLive];
  }
  if (mode === "restore") {
    const injected = inject(key, "state", index);
    const [v2, setV2] = React2.useState(() =>
      injected === MISSING ? resolveInit(initial) : injected,
    );
    record(key, "state", index, v2);
    return [v2, setV2];
  }
  const [v, setV] = React2.useState(initial);
  record(key, "state", index, v);
  return [v, setV];
}

function useReducer2(reducer, initialArg, init) {
  const { key, index } = begin("state");
  const mode = getMode();
  const injected = mode === "capture" ? MISSING : inject(key, "state", index);
  const seed = () => (injected === MISSING ? (init ? init(initialArg) : initialArg) : injected);
  const [live, dispatch] = React2.useReducer(reducer, undefined, seed);
  if (mode === "suppress") {
    return [injected === MISSING ? live : injected, dispatch];
  }
  record(key, "state", index, live);
  return [live, dispatch];
}

function useRef2(initial) {
  const { key, index } = begin("refs");
  const ref = React2.useRef(initial);
  if (getMode() === "capture") record(key, "refs", index, ref.current);
  return ref;
}

function useContext2(context) {
  return React2.useContext(context);
}

function useSyncExternalStore2(subscribe, getSnapshot, getServerSnapshot) {
  const { key, index } = begin("stores");
  const mode = getMode();
  if (mode === "capture") {
    const snap2 = React2.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    record(key, "stores", index, snap2);
    return snap2;
  }
  const injected = inject(key, "stores", index);
  const snap = React2.useSyncExternalStore(
    () => () => {},
    getSnapshot,
    getServerSnapshot,
  );
  return injected === MISSING ? snap : injected;
}

var NOOP_EFFECT = () => {};

function useEffect2(effect, deps) {
  React2.useEffect(getMode() === "suppress" ? NOOP_EFFECT : effect, deps);
}

function useLayoutEffect2(effect, deps) {
  React2.useLayoutEffect(getMode() === "suppress" ? NOOP_EFFECT : effect, deps);
}

function useInsertionEffect2(effect, deps) {
  React2.useInsertionEffect(getMode() === "suppress" ? NOOP_EFFECT : effect, deps);
}

function useImperativeHandle2(ref, create, deps) {
  React2.useImperativeHandle(ref, getMode() === "suppress" ? () => ({}) : create, deps);
}

var _default = {
  ...React2,
  useState: useState2,
  useReducer: useReducer2,
  useRef: useRef2,
  useContext: useContext2,
  useSyncExternalStore: useSyncExternalStore2,
  useEffect: useEffect2,
  useLayoutEffect: useLayoutEffect2,
  useInsertionEffect: useInsertionEffect2,
  useImperativeHandle: useImperativeHandle2,
};

export {
  _default as default,
  useContext2 as useContext,
  useEffect2 as useEffect,
  useImperativeHandle2 as useImperativeHandle,
  useInsertionEffect2 as useInsertionEffect,
  useLayoutEffect2 as useLayoutEffect,
  useReducer2 as useReducer,
  useRef2 as useRef,
  useState2 as useState,
  useSyncExternalStore2 as useSyncExternalStore,
};
