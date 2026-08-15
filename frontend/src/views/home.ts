import { getMockFeed } from "../data/mock-feed";
import { createPostCard } from "../components/post-card";
import type {
  FeedResponse,
  FeedPost,
} from "../types/social";

/**
 * statuzfree
 * Home / timeline view.
 *
 * This file renders the social feed and handles browser-side
 * interactions for the feed UI.
 *
 * It does not calculate game progression, generate NPC
 * behaviour or call any AI provider.
 */


/* =========================================================
   Public view renderer
   ========================================================= */

export function renderHomeView(
  root: HTMLElement
): void {
  const feed = getMockFeed();

  root.replaceChildren(
    createHomeView(feed)
  );
}


/* =========================================================
   View construction
   ========================================================= */

function createHomeView(
  feed: FeedResponse
): HTMLElement {
  const view =
    document.createElement("section");

  view.className = "home-view";

  view.append(
    createFeedHeader(feed),
    createTimeline(feed.posts)
  );

  initialiseFeedEvents(view);

  return view;
}


/* =========================================================
   Feed header
   ========================================================= */

function createFeedHeader(
  feed: FeedResponse
): HTMLElement {
  const header =
    document.createElement("header");

  header.className = "feed-header";

  const top =
    document.createElement("div");

  top.className = "feed-header__top";

  const titleGroup =
    document.createElement("div");

  titleGroup.className =
    "feed-header__title-group";

  const title =
    document.createElement("h1");

  title.className = "feed-header__title";
  title.textContent = "Home";

  const worldStatus =
    document.createElement("span");

  worldStatus.className =
    "feed-header__status";

  worldStatus.textContent =
    `DAY ${feed.day.number}`;

  titleGroup.append(
    title,
    worldStatus
  );

  const progress =
    createDayProgress(feed);

  top.append(
    titleGroup,
    progress
  );

  const tabs =
    createFeedTabs();

  header.append(
    top,
    tabs
  );

  return header;
}


/* =========================================================
   Simulation day progress
   ========================================================= */

function createDayProgress(
  feed: FeedResponse
): HTMLElement {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "day-progress";

  const label =
    document.createElement("div");

  label.className =
    "day-progress__label";

  const used =
    document.createElement("span");

  used.textContent =
    `${feed.day.postsUsed}`;

  const separator =
    document.createElement("span");

  separator.textContent = "/";

  const required =
    document.createElement("span");

  required.textContent =
    `${feed.day.postsRequired}`;

  label.append(
    used,
    separator,
    required
  );

  const track =
    document.createElement("div");

  track.className =
    "day-progress__track";

  track.setAttribute(
    "role",
    "progressbar"
  );

  track.setAttribute(
    "aria-label",
    "Posts towards next simulation day"
  );

  track.setAttribute(
    "aria-valuemin",
    "0"
  );

  track.setAttribute(
    "aria-valuemax",
    `${feed.day.postsRequired}`
  );

  track.setAttribute(
    "aria-valuenow",
    `${feed.day.postsUsed}`
  );

  const fill =
    document.createElement("div");

  fill.className =
    "day-progress__fill";

  const percentage =
    calculateProgressPercentage(
      feed.day.postsUsed,
      feed.day.postsRequired
    );

  fill.style.width =
    `${percentage}%`;

  track.append(fill);

  wrapper.append(
    label,
    track
  );

  return wrapper;
}


/* =========================================================
   Feed tabs
   ========================================================= */

function createFeedTabs(): HTMLElement {
  const tabs =
    document.createElement("div");

  tabs.className = "feed-tabs";
  tabs.setAttribute(
    "role",
    "tablist"
  );

  const forYou =
    createFeedTab(
      "For you",
      "for-you",
      true
    );

  const following =
    createFeedTab(
      "Following",
      "following",
      false
    );

  tabs.append(
    forYou,
    following
  );

  return tabs;
}


function createFeedTab(
  label: string,
  value: string,
  active: boolean
): HTMLButtonElement {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "feed-tabs__item";

  button.dataset.feed =
    value;

  button.setAttribute(
    "role",
    "tab"
  );

  button.setAttribute(
    "aria-selected",
    active ? "true" : "false"
  );

  if (active) {
    button.classList.add(
      "is-active"
    );
  }

  button.textContent = label;

  return button;
}


/* =========================================================
   Timeline
   ========================================================= */

function createTimeline(
  posts: FeedPost[]
): HTMLElement {
  const timeline =
    document.createElement("div");

  timeline.className = "timeline";

  timeline.setAttribute(
    "aria-label",
    "Social feed"
  );

  if (posts.length === 0) {
    timeline.append(
      createEmptyTimeline()
    );

    return timeline;
  }

  const fragment =
    document.createDocumentFragment();

  posts.forEach((post) => {
    fragment.append(
      createPostCard(post)
    );
  });

  timeline.append(fragment);

  return timeline;
}


/* =========================================================
   Empty state
   ========================================================= */

function createEmptyTimeline(): HTMLElement {
  const empty =
    document.createElement("div");

  empty.className =
    "timeline-empty";

  const title =
    document.createElement("h2");

  title.textContent =
    "Nothing here yet";

  const description =
    document.createElement("p");

  description.textContent =
    "Posts from your world will appear here as events unfold.";

  empty.append(
    title,
    description
  );

  return empty;
}


/* =========================================================
   Feed interactions
   ========================================================= */

function initialiseFeedEvents(
  view: HTMLElement
): void {
  initialiseTabs(view);

  view.addEventListener(
    "click",
    handlePostClick
  );
}


/* =========================================================
   Feed tab behaviour
   ========================================================= */

function initialiseTabs(
  view: HTMLElement
): void {
  const tabs =
    view.querySelectorAll<HTMLButtonElement>(
      ".feed-tabs__item"
    );

  tabs.forEach((tab) => {
    tab.addEventListener(
      "click",
      () => {
        selectFeedTab(
          tabs,
          tab
        );
      }
    );
  });
}


function selectFeedTab(
  tabs: NodeListOf<HTMLButtonElement>,
  selected: HTMLButtonElement
): void {
  tabs.forEach((tab) => {
    const active =
      tab === selected;

    tab.classList.toggle(
      "is-active",
      active
    );

    tab.setAttribute(
      "aria-selected",
      active ? "true" : "false"
    );
  });

  const feed =
    selected.dataset.feed;

  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:feed-change",
      {
        detail: {
          feed,
        },
      }
    )
  );
}


/* =========================================================
   Opening posts
   ========================================================= */

function handlePostClick(
  event: MouseEvent
): void {
  const target =
    event.target as HTMLElement;

  /*
   * Action buttons handle their own events.
   * Clicking one should not also open the post.
   */

  if (
    target.closest(
      ".post-card__action"
    ) ||
    target.closest(
      ".post-card__menu"
    )
  ) {
    return;
  }

  const card =
    target.closest<HTMLElement>(
      ".post-card"
    );

  if (!card) {
    return;
  }

  const postId =
    card.dataset.postId;

  if (!postId) {
    return;
  }

  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:open-post",
      {
        detail: {
          postId,
        },
      }
    )
  );
}


/* =========================================================
   Helpers
   ========================================================= */

function calculateProgressPercentage(
  used: number,
  required: number
): number {
  if (required <= 0) {
    return 0;
  }

  const percentage =
    (used / required) * 100;

  return Math.min(
    100,
    Math.max(
      0,
      percentage
    )
  );
}
