/**
 * statuzfree
 * Frontend application entry point
 *
 * This file owns browser-side application bootstrapping only.
 * No game logic, database logic or LLM provider logic belongs here.
 */

type Route =
  | "/"
  | "/discover"
  | "/messages"
  | "/alerts"
  | "/profile";

interface RouteDefinition {
  path: Route;
  title: string;
}

const routes: RouteDefinition[] = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/discover",
    title: "Discover",
  },
  {
    path: "/messages",
    title: "Messages",
  },
  {
    path: "/alerts",
    title: "Alerts",
  },
  {
    path: "/profile",
    title: "Profile",
  },
];

const viewRoot = document.querySelector<HTMLElement>("#view-root");

if (!viewRoot) {
  throw new Error(
    "statuzfree could not start: #view-root was not found."
  );
}


/* =========================================================
   Application bootstrap
   ========================================================= */

function initialiseApp(): void {
  initialiseNavigation();
  initialiseGlobalActions();

  renderRoute(getCurrentRoute());
}


/* =========================================================
   Router
   ========================================================= */

function getCurrentRoute(): Route {
  const pathname = normalisePath(window.location.pathname);

  const routeExists = routes.some(
    (route) => route.path === pathname
  );

  if (routeExists) {
    return pathname as Route;
  }

  return "/";
}


function normalisePath(path: string): string {
  if (path === "/") {
    return "/";
  }

  return path.replace(/\/+$/, "");
}


function navigate(path: Route): void {
  if (window.location.pathname !== path) {
    window.history.pushState(
      {
        route: path,
      },
      "",
      path
    );
  }

  renderRoute(path);
}


function initialiseNavigation(): void {
  const navigationItems =
    document.querySelectorAll<HTMLAnchorElement>(
      "[data-route]"
    );

  navigationItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      const route = item.dataset.route;

      if (!isRoute(route)) {
        return;
      }

      navigate(route);
    });
  });

  window.addEventListener("popstate", () => {
    renderRoute(getCurrentRoute());
  });
}


function isRoute(value: string | undefined): value is Route {
  if (!value) {
    return false;
  }

  return routes.some(
    (route) => route.path === value
  );
}


/* =========================================================
   Route rendering
   ========================================================= */

function renderRoute(route: Route): void {
  updateNavigation(route);
  updateDocumentTitle(route);

  switch (route) {
    case "/":
      renderHome();
      break;

    case "/discover":
      renderPlaceholderView(
        "Discover",
        "People, conversations and events from your world will appear here."
      );
      break;

    case "/messages":
      renderPlaceholderView(
        "Messages",
        "Your conversations will appear here."
      );
      break;

    case "/alerts":
      renderPlaceholderView(
        "Alerts",
        "Replies, mentions and social activity will appear here."
      );
      break;

    case "/profile":
      renderPlaceholderView(
        "Profile",
        "Your public profile and activity will appear here."
      );
      break;

    default:
      renderHome();
  }

  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
}


function updateNavigation(activeRoute: Route): void {
  const navigationItems =
    document.querySelectorAll<HTMLAnchorElement>(
      "[data-route]"
    );

  navigationItems.forEach((item) => {
    const route = item.dataset.route;
    const active = route === activeRoute;

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
  });
}


function updateDocumentTitle(route: Route): void {
  const definition = routes.find(
    (item) => item.path === route
  );

  if (!definition) {
    document.title = "statuzfree";
    return;
  }

  if (route === "/") {
    document.title = "statuzfree";
    return;
  }

  document.title =
    `${definition.title} · statuzfree`;
}


/* =========================================================
   Temporary Home view
   ========================================================= */

function renderHome(): void {
  viewRoot.innerHTML = `
    <section class="temporary-view">
      <div class="temporary-view__header">
        <span class="temporary-view__eyebrow">
          DAY 1
        </span>

        <h1>Home</h1>

        <p>
          Your world is quiet for now.
        </p>
      </div>
    </section>
  `;
}


/* =========================================================
   Temporary route view
   ========================================================= */

function renderPlaceholderView(
  title: string,
  description: string
): void {
  viewRoot.innerHTML = `
    <section class="temporary-view">
      <div class="temporary-view__header">
        <h1>${escapeHTML(title)}</h1>

        <p>
          ${escapeHTML(description)}
        </p>
      </div>
    </section>
  `;
}


/* =========================================================
   Global UI actions
   ========================================================= */

function initialiseGlobalActions(): void {
  const composeButton =
    document.querySelector<HTMLButtonElement>(
      '[data-action="compose"]'
    );

  const searchButton =
    document.querySelector<HTMLButtonElement>(
      '[data-action="search"]'
    );

  const settingsButton =
    document.querySelector<HTMLButtonElement>(
      '[data-action="settings"]'
    );

  composeButton?.addEventListener(
    "click",
    handleCompose
  );

  searchButton?.addEventListener(
    "click",
    handleSearch
  );

  settingsButton?.addEventListener(
    "click",
    handleSettings
  );
}


function handleCompose(): void {
  /*
   * The composer will become its own UI component.
   * For now we keep this action intentionally empty.
   */

  console.info(
    "[statuzfree] compose requested"
  );
}


function handleSearch(): void {
  navigate("/discover");
}


function handleSettings(): void {
  console.info(
    "[statuzfree] settings requested"
  );
}


/* =========================================================
   Utilities
   ========================================================= */

function escapeHTML(value: string): string {
  const element =
    document.createElement("div");

  element.textContent = value;

  return element.innerHTML;
}


/* =========================================================
   Development styling
   ========================================================= */

/*
 * These styles exist only so our initial routes have a clean
 * appearance before the real feed components are introduced.
 *
 * They are injected here temporarily rather than polluting
 * main.css with placeholder component rules.
 */

function injectTemporaryStyles(): void {
  const style =
    document.createElement("style");

  style.dataset.statuzfreeTemporary = "true";

  style.textContent = `
    .temporary-view {
      min-height: 100%;
      padding: 32px 20px;
    }

    .temporary-view__header {
      max-width: 520px;
    }

    .temporary-view__eyebrow {
      display: inline-block;
      margin-bottom: 12px;

      color: var(--colour-accent);

      font-size: 11px;
      font-weight: 750;
      letter-spacing: 1.4px;
    }

    .temporary-view h1 {
      margin: 0;

      color: var(--colour-text);

      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.8px;
    }

    .temporary-view p {
      margin: 8px 0 0;

      color: var(--colour-text-secondary);

      font-size: 14px;
    }
  `;

  document.head.append(style);
}


/* =========================================================
   Start statuzfree
   ========================================================= */

injectTemporaryStyles();
initialiseApp();
