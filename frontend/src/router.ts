/**
 * statuzfree
 * Frontend router.
 *
 * This module owns client-side navigation only.
 *
 * It does not fetch data, call backend services, calculate
 * simulation state or invoke any AI provider.
 */

import {
  getGameState,
  setActiveConversation,
  setActivePost,
  setActiveProfile,
  setRoute,
  type MainRoute,
} from "./state/game-state";


/* =========================================================
   Route types
   ========================================================= */

export type AppRoute =
  | {
      type: "main";
      path: MainRoute;
    }
  | {
      type: "post";
      postId: string;
    }
  | {
      type: "profile";
      profileId: string;
    }
  | {
      type: "conversation";
      conversationId: string;
    };


/* =========================================================
   Router listener
   ========================================================= */

export type RouteListener = (
  route: AppRoute
) => void;


const listeners =
  new Set<RouteListener>();


/* =========================================================
   Public initialisation
   ========================================================= */

export function initialiseRouter(): void {
  initialiseLinkInterception();

  initialiseBrowserHistory();

  initialiseApplicationEvents();

  syncRouteFromLocation();
}


/* =========================================================
   Subscribe
   ========================================================= */

export function subscribeRouter(
  listener: RouteListener
): () => void {
  listeners.add(
    listener
  );


  return () => {
    listeners.delete(
      listener
    );
  };
}


/* =========================================================
   Navigate to main route
   ========================================================= */

export function navigateTo(
  path: MainRoute,
  options: {
    replace?: boolean;
  } = {}
): void {
  const route:
    AppRoute = {
      type: "main",
      path,
    };


  updateHistory(
    path,
    route,
    options.replace
  );


  applyRoute(route);
}


/* =========================================================
   Navigate to post
   ========================================================= */

export function navigateToPost(
  postId: string
): void {
  const path =
    `/post/${encodeURIComponent(
      postId
    )}`;


  const route:
    AppRoute = {
      type: "post",
      postId,
    };


  updateHistory(
    path,
    route
  );


  applyRoute(route);
}


/* =========================================================
   Navigate to profile
   ========================================================= */

export function navigateToProfile(
  profileId: string
): void {
  /*
   * The player's own profile keeps the simple /profile URL.
   */

  const playerId =
    getGameState()
      .player
      .id;


  const path =
    profileId === playerId
      ? "/profile"
      : `/profile/${encodeURIComponent(
          profileId
        )}`;


  const route:
    AppRoute = {
      type: "profile",
      profileId,
    };


  updateHistory(
    path,
    route
  );


  applyRoute(route);
}


/* =========================================================
   Navigate to conversation
   ========================================================= */

export function navigateToConversation(
  conversationId: string
): void {
  const path =
    `/messages/${encodeURIComponent(
      conversationId
    )}`;


  const route:
    AppRoute = {
      type: "conversation",
      conversationId,
    };


  updateHistory(
    path,
    route
  );


  applyRoute(route);
}


/* =========================================================
   Back
   ========================================================= */

export function navigateBack(
  fallback:
    MainRoute = "/"
): void {
  if (
    window.history.length > 1
  ) {
    window.history.back();

    return;
  }


  navigateTo(
    fallback,
    {
      replace: true,
    }
  );
}


/* =========================================================
   Current route
   ========================================================= */

export function getCurrentRoute():
  AppRoute {
  return parsePath(
    window.location.pathname
  );
}


/* =========================================================
   Parse URL
   ========================================================= */

function parsePath(
  pathname: string
): AppRoute {
  const path =
    normalisePath(
      pathname
    );


  const mainRoute =
    parseMainRoute(
      path
    );


  if (mainRoute) {
    if (
      mainRoute ===
      "/profile"
    ) {
      return {
        type: "profile",
        profileId:
          getGameState()
            .player
            .id,
      };
    }


    return {
      type: "main",
      path:
        mainRoute,
    };
  }


  const postMatch =
    path.match(
      /^\/post\/([^/]+)$/
    );


  if (postMatch) {
    return {
      type: "post",

      postId:
        decodeURIComponent(
          postMatch[1]
        ),
    };
  }


  const profileMatch =
    path.match(
      /^\/profile\/([^/]+)$/
    );


  if (profileMatch) {
    return {
      type: "profile",

      profileId:
        decodeURIComponent(
          profileMatch[1]
        ),
    };
  }


  const conversationMatch =
    path.match(
      /^\/messages\/([^/]+)$/
    );


  if (conversationMatch) {
    return {
      type:
        "conversation",

      conversationId:
        decodeURIComponent(
          conversationMatch[1]
        ),
    };
  }


  return {
    type: "main",
    path: "/",
  };
}


/* =========================================================
   Main route parser
   ========================================================= */

function parseMainRoute(
  path: string
): MainRoute | null {
  const routes:
    MainRoute[] = [
      "/",
      "/discover",
      "/world",
      "/messages",
      "/alerts",
      "/profile",
    ];


  if (
    routes.includes(
      path as MainRoute
    )
  ) {
    return path as MainRoute;
  }


  return null;
}


/* =========================================================
   Apply route
   ========================================================= */

function applyRoute(
  route: AppRoute
): void {
  switch (route.type) {
    case "main":
      applyMainRoute(
        route.path
      );
      break;


    case "post":
      setActivePost(
        route.postId
      );

      setActiveProfile(
        null
      );

      setActiveConversation(
        null
      );
      break;


    case "profile":
      setActiveProfile(
        route.profileId
      );

      setActivePost(
        null
      );

      setActiveConversation(
        null
      );
      break;


    case "conversation":
      setActiveConversation(
        route.conversationId
      );

      setActivePost(
        null
      );

      setActiveProfile(
        null
      );
      break;
  }


  updateNavigationState(
    route
  );


  updateDocumentTitle(
    route
  );


  notify(
    route
  );
}


/* =========================================================
   Main route state
   ========================================================= */

function applyMainRoute(
  path: MainRoute
): void {
  setRoute(
    path
  );


  setActivePost(
    null
  );


  setActiveConversation(
    null
  );


  if (
    path !== "/profile"
  ) {
    setActiveProfile(
      null
    );
  }
}


/* =========================================================
   Browser history
   ========================================================= */

function updateHistory(
  path: string,
  route: AppRoute,
  replace = false
): void {
  const current =
    normalisePath(
      window.location.pathname
    );


  if (
    current === path
  ) {
    return;
  }


  const state = {
    statuzfree: true,
    route,
  };


  if (replace) {
    window.history.replaceState(
      state,
      "",
      path
    );

    return;
  }


  window.history.pushState(
    state,
    "",
    path
  );
}


/* =========================================================
   Browser back / forward
   ========================================================= */

function initialiseBrowserHistory():
  void {
  window.addEventListener(
    "popstate",
    () => {
      syncRouteFromLocation();
    }
  );
}


/* =========================================================
   Initial URL
   ========================================================= */

function syncRouteFromLocation():
  void {
  const route =
    parsePath(
      window.location.pathname
    );


  applyRoute(
    route
  );
}


/* =========================================================
   Navigation links
   ========================================================= */

function initialiseLinkInterception():
  void {
  document.addEventListener(
    "click",
    (event) => {
      if (
        event.defaultPrevented
      ) {
        return;
      }


      if (
        !(event.target instanceof Element)
      ) {
        return;
      }


      const anchor =
        event.target.closest<HTMLAnchorElement>(
          "a[data-route]"
        );


      if (!anchor) {
        return;
      }


      const route =
        anchor.dataset.route;


      if (
        !route ||
        !isMainRoute(
          route
        )
      ) {
        return;
      }


      if (
        event instanceof MouseEvent &&
        (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        )
      ) {
        return;
      }


      event.preventDefault();


      navigateTo(
        route
      );
    }
  );
}


/* =========================================================
   Application-level events
   ========================================================= */

function initialiseApplicationEvents():
  void {
  document.addEventListener(
    "statuzfree:open-post",
    (event) => {
      const detail =
        getEventDetail<{
          postId?: string;
        }>(
          event
        );


      if (!detail?.postId) {
        return;
      }


      navigateToPost(
        detail.postId
      );
    }
  );


  document.addEventListener(
    "statuzfree:open-profile",
    (event) => {
      const detail =
        getEventDetail<{
          profileId?: string;
        }>(
          event
        );


      if (
        !detail?.profileId
      ) {
        return;
      }


      navigateToProfile(
        detail.profileId
      );
    }
  );


  document.addEventListener(
    "statuzfree:open-conversation",
    (event) => {
      const detail =
        getEventDetail<{
          conversationId?: string;
        }>(
          event
        );


      if (
        !detail?.conversationId
      ) {
        return;
      }


      navigateToConversation(
        detail.conversationId
      );
    }
  );


  document.addEventListener(
    "statuzfree:conversation-back",
    () => {
      navigateBack(
        "/messages"
      );
    }
  );


  document.addEventListener(
    "statuzfree:post-detail-back",
    () => {
      navigateBack(
        "/"
      );
    }
  );


  document.addEventListener(
    "statuzfree:profile-back",
    () => {
      navigateBack(
        "/"
      );
    }
  );
}


/* =========================================================
   Bottom navigation state
   ========================================================= */

function updateNavigationState(
  route: AppRoute
): void {
  const navigationItems =
    document.querySelectorAll<
      HTMLAnchorElement
    >(
      "[data-route]"
    );


  const activePath =
    getNavigationPath(
      route
    );


  navigationItems.forEach(
    (item) => {
      const path =
        item.dataset.route;


      const active =
        path ===
        activePath;


      item.classList.toggle(
        "is-active",
        active
      );


      if (active) {
        item.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        item.removeAttribute(
          "aria-current"
        );
      }
    }
  );
}


/* =========================================================
   Resolve active navigation item
   ========================================================= */

function getNavigationPath(
  route: AppRoute
): MainRoute | null {
  switch (route.type) {
    case "main":
      return route.path;


    case "conversation":
      return "/messages";


    case "profile":
      return "/profile";


    case "post":
      return null;


    default:
      return null;
  }
}


/* =========================================================
   Document title
   ========================================================= */

function updateDocumentTitle(
  route: AppRoute
): void {
  switch (route.type) {
    case "main":
      document.title =
        getMainRouteTitle(
          route.path
        );
      return;


    case "post":
      document.title =
        "Post · statuzfree";
      return;


    case "profile":
      document.title =
        "Profile · statuzfree";
      return;


    case "conversation":
      document.title =
        "Messages · statuzfree";
      return;
  }
}


/* =========================================================
   Route titles
   ========================================================= */

function getMainRouteTitle(
  route: MainRoute
): string {
  switch (route) {
    case "/":
      return "statuzfree";


    case "/discover":
      return "Discover · statuzfree";


    case "/world":
      return "World · statuzfree";


    case "/messages":
      return "Messages · statuzfree";


    case "/alerts":
      return "Alerts · statuzfree";


    case "/profile":
      return "Profile · statuzfree";
  }
}


/* =========================================================
   Notification
   ========================================================= */

function notify(
  route: AppRoute
): void {
  listeners.forEach(
    (listener) => {
      try {
        listener(
          route
        );
      } catch (error) {
        console.error(
          "[statuzfree] router listener failed",
          error
        );
      }
    }
  );


  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:route-change",
      {
        detail: {
          route,
        },
      }
    )
  );
}


/* =========================================================
   Helpers
   ========================================================= */

function normalisePath(
  path: string
): string {
  if (
    !path ||
    path === "/"
  ) {
    return "/";
  }


  const normalised =
    path.replace(
      /\/+$/,
      ""
    );


  return normalised || "/";
}


function isMainRoute(
  value: string
): value is MainRoute {
  return [
    "/",
    "/discover",
    "/world",
    "/messages",
    "/alerts",
    "/profile",
  ].includes(
    value
  );
}


function getEventDetail<T>(
  event: Event
): T | null {
  if (
    !(event instanceof CustomEvent)
  ) {
    return null;
  }


  return event.detail as T;
}
