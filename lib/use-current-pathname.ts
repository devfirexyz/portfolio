"use client";

import { useSyncExternalStore } from "react";

const PATH_CHANGE_EVENT = "portfolio:pathchange";
const HISTORY_PATCH_FLAG = "__portfolioHistoryPatched";

function dispatchPathChange() {
  window.dispatchEvent(new Event(PATH_CHANGE_EVENT));
}

function patchHistoryEvents() {
  const historyWithFlag = window.history as History & {
    [HISTORY_PATCH_FLAG]?: boolean;
  };

  if (historyWithFlag[HISTORY_PATCH_FLAG]) {
    return;
  }

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = function pushState(...args) {
    originalPushState(...args);
    dispatchPathChange();
  };

  window.history.replaceState = function replaceState(...args) {
    originalReplaceState(...args);
    dispatchPathChange();
  };

  historyWithFlag[HISTORY_PATCH_FLAG] = true;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  patchHistoryEvents();

  const onPathChange = () => callback();
  window.addEventListener(PATH_CHANGE_EVENT, onPathChange);
  window.addEventListener("popstate", onPathChange);

  return () => {
    window.removeEventListener(PATH_CHANGE_EVENT, onPathChange);
    window.removeEventListener("popstate", onPathChange);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname;
}

export function useCurrentPathname() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "/");
}
