import type {
  PostAuthor,
} from "../types/social";

/**
 * statuzfree
 * Discover view.
 *
 * Discover exposes activity from the simulated world:
 * trending conversations, characters, publications and topics.
 *
 * For now this uses local development data. Later, the same
 * view will consume the Discover API without changing its
 * presentation logic.
 */


/* =========================================================
   Types
   ========================================================= */

interface TrendingTopic {
  id: string;
  category: string;
  title: string;
  postCount: number;
}

interface DiscoverAccount {
  profile: PostAuthor;
  description: string;
  followers: number;
  following: boolean;
}


/* =========================================================
   Temporary development data
   ========================================================= */

const trendingTopics: TrendingTopic[] = [
  {
    id: "trend_001",
    category: "Campus",
    title: "Last night's incident",
    postCount: 1284,
  },
  {
    id: "trend_002",
    category: "Trending in your world",
    title: "Northside",
    postCount: 763,
  },
  {
    id: "trend_003",
    category: "Conversation",
    title: "Campus administration",
    postCount: 492,
  },
  {
    id: "trend_004",
    category: "Entertainment",
    title: "Friday night",
    postCount: 318,
  },
];


const suggestedAccounts: DiscoverAccount[] = [
  {
    profile: {
      id: "char_maya_001",
      displayName: "Maya Collins",
      username: "mayacollins",
      avatarUrl: null,
      accountType: "character",
    },

    description:
      "Student. Usually has something to say.",

    followers: 12800,

    following: false,
  },

  {
    profile: {
      id: "publication_campuswire_001",
      displayName: "Campus Wire",
      username: "campuswire",
      avatarUrl: null,
      accountType: "publication",
    },

    description:
      "News and conversations from around campus.",

    followers: 42600,

    following: true,
  },

  {
    profile: {
      id: "char_daniel_001",
      displayName: "Daniel Cole",
      username: "danielcole",
      avatarUrl: null,
      accountType: "character",
    },

    description:
      "Mostly observing. Occasionally involved.",

    followers: 7400,

    following: false,
  },
];


/* =========================================================
   Public renderer
   ========================================================= */

export function renderDiscoverView(
  root: HTMLElement
): void {
  const view =
    document.createElement("section");

  view.className = "discover-view";

  view.append(
    createDiscoverHeader(),
    createSearch(),
    createTrendingSection(),
    createPeopleSection()
  );

  initialiseDiscoverEvents(view);

  root.replaceChildren(view);
}


/* =========================================================
   Header
   ========================================================= */

function createDiscoverHeader(): HTMLElement {
  const header =
    document.createElement("header");

  header.className =
    "discover-header";

  const eyebrow =
    document.createElement("span");

  eyebrow.className =
    "discover-header__eyebrow";

  eyebrow.textContent =
    "YOUR WORLD";

  const title =
    document.createElement("h1");

  title.textContent = "Discover";

  const description =
    document.createElement("p");

  description.textContent =
    "See what people are talking about right now.";

  header.append(
    eyebrow,
    title,
    description
  );

  return header;
}


/* =========================================================
   Search
   ========================================================= */

function createSearch(): HTMLElement {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "discover-search";

  const icon =
    searchIcon();

  const input =
    document.createElement("input");

  input.type = "search";

  input.className =
    "discover-search__input";

  input.placeholder =
    "Search people or conversations";

  input.autocomplete = "off";

  input.setAttribute(
    "aria-label",
    "Search your world"
  );

  wrapper.append(
    icon,
    input
  );

  return wrapper;
}


/* =========================================================
   Trending
   ========================================================= */

function createTrendingSection(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "discover-section";

  section.append(
    createSectionHeader(
      "Trending now"
    )
  );

  const list =
    document.createElement("div");

  list.className =
    "trending-list";

  trendingTopics.forEach(
    (topic, index) => {
      list.append(
        createTrendingItem(
          topic,
          index + 1
        )
      );
    }
  );

  section.append(list);

  return section;
}


function createTrendingItem(
  topic: TrendingTopic,
  position: number
): HTMLElement {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "trending-item";

  button.dataset.trendId =
    topic.id;

  const rank =
    document.createElement("span");

  rank.className =
    "trending-item__rank";

  rank.textContent =
    position
      .toString()
      .padStart(2, "0");

  const content =
    document.createElement("div");

  content.className =
    "trending-item__content";

  const category =
    document.createElement("span");

  category.className =
    "trending-item__category";

  category.textContent =
    topic.category;

  const title =
    document.createElement("strong");

  title.className =
    "trending-item__title";

  title.textContent =
    topic.title;

  const activity =
    document.createElement("span");

  activity.className =
    "trending-item__activity";

  activity.textContent =
    `${formatCount(topic.postCount)} posts`;

  content.append(
    category,
    title,
    activity
  );

  const arrow =
    arrowIcon();

  button.append(
    rank,
    content,
    arrow
  );

  return button;
}


/* =========================================================
   Suggested people
   ========================================================= */

function createPeopleSection(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "discover-section discover-section--people";

  section.append(
    createSectionHeader(
      "People to know"
    )
  );

  const list =
    document.createElement("div");

  list.className =
    "discover-people";

  suggestedAccounts.forEach(
    (account) => {
      list.append(
        createAccountItem(account)
      );
    }
  );

  section.append(list);

  return section;
}


function createAccountItem(
  account: DiscoverAccount
): HTMLElement {
  const row =
    document.createElement("article");

  row.className =
    "discover-account";

  row.dataset.profileId =
    account.profile.id;

  const avatar =
    createAvatar(account.profile);

  const information =
    document.createElement("div");

  information.className =
    "discover-account__information";

  const identity =
    document.createElement("div");

  identity.className =
    "discover-account__identity";

  const name =
    document.createElement("strong");

  name.className =
    "discover-account__name";

  name.textContent =
    account.profile.displayName;

  const username =
    document.createElement("span");

  username.className =
    "discover-account__username";

  username.textContent =
    `@${account.profile.username}`;

  identity.append(
    name,
    username
  );

  const description =
    document.createElement("p");

  description.className =
    "discover-account__description";

  description.textContent =
    account.description;

  const followers =
    document.createElement("span");

  followers.className =
    "discover-account__followers";

  followers.textContent =
    `${formatCount(account.followers)} followers`;

  information.append(
    identity,
    description,
    followers
  );

  const follow =
    createFollowButton(account);

  row.append(
    avatar,
    information,
    follow
  );

  return row;
}


/* =========================================================
   Avatar
   ========================================================= */

function createAvatar(
  profile: PostAuthor
): HTMLElement {
  const avatar =
    document.createElement("div");

  avatar.className =
    "discover-account__avatar";

  if (profile.avatarUrl) {
    const image =
      document.createElement("img");

    image.src =
      profile.avatarUrl;

    image.alt =
      `${profile.displayName} profile picture`;

    image.loading = "lazy";

    avatar.append(image);

    return avatar;
  }

  const initial =
    document.createElement("span");

  initial.textContent =
    profile.displayName
      .trim()
      .charAt(0)
      .toUpperCase();

  avatar.append(initial);

  return avatar;
}


/* =========================================================
   Follow button
   ========================================================= */

function createFollowButton(
  account: DiscoverAccount
): HTMLButtonElement {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "discover-account__follow";

  button.dataset.followId =
    account.profile.id;

  button.setAttribute(
    "aria-pressed",
    account.following
      ? "true"
      : "false"
  );

  updateFollowButton(
    button,
    account.following
  );

  return button;
}


function updateFollowButton(
  button: HTMLButtonElement,
  following: boolean
): void {
  button.classList.toggle(
    "is-following",
    following
  );

  button.setAttribute(
    "aria-pressed",
    following
      ? "true"
      : "false"
  );

  button.textContent =
    following
      ? "Following"
      : "Follow";
}


/* =========================================================
   Section heading
   ========================================================= */

function createSectionHeader(
  title: string
): HTMLElement {
  const header =
    document.createElement("div");

  header.className =
    "discover-section__header";

  const heading =
    document.createElement("h2");

  heading.textContent = title;

  header.append(heading);

  return header;
}


/* =========================================================
   Events
   ========================================================= */

function initialiseDiscoverEvents(
  view: HTMLElement
): void {
  view.addEventListener(
    "click",
    (event) => {
      const target =
        event.target as HTMLElement;

      const followButton =
        target.closest<HTMLButtonElement>(
          "[data-follow-id]"
        );

      if (followButton) {
        handleFollow(followButton);

        return;
      }

      const account =
        target.closest<HTMLElement>(
          "[data-profile-id]"
        );

      if (account) {
        emitProfileOpen(
          account.dataset.profileId
        );

        return;
      }

      const trend =
        target.closest<HTMLElement>(
          "[data-trend-id]"
        );

      if (trend) {
        emitTrendOpen(
          trend.dataset.trendId
        );
      }
    }
  );
}


/* =========================================================
   Follow interaction
   ========================================================= */

function handleFollow(
  button: HTMLButtonElement
): void {
  const profileId =
    button.dataset.followId;

  if (!profileId) {
    return;
  }

  const currentlyFollowing =
    button.getAttribute(
      "aria-pressed"
    ) === "true";

  const following =
    !currentlyFollowing;

  updateFollowButton(
    button,
    following
  );

  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:follow-change",
      {
        detail: {
          profileId,
          following,
        },
      }
    )
  );
}


/* =========================================================
   Navigation events
   ========================================================= */

function emitProfileOpen(
  profileId: string | undefined
): void {
  if (!profileId) {
    return;
  }

  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:open-profile",
      {
        detail: {
          profileId,
        },
      }
    )
  );
}


function emitTrendOpen(
  trendId: string | undefined
): void {
  if (!trendId) {
    return;
  }

  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:open-trend",
      {
        detail: {
          trendId,
        },
      }
    )
  );
}


/* =========================================================
   Formatting
   ========================================================= */

function formatCount(
  value: number
): string {
  if (value < 1_000) {
    return value.toString();
  }

  if (value < 1_000_000) {
    const result =
      (value / 1_000).toFixed(
        value >= 10_000
          ? 0
          : 1
      );

    return `${trimZero(result)}K`;
  }

  const result =
    (value / 1_000_000).toFixed(1);

  return `${trimZero(result)}M`;
}


function trimZero(
  value: string
): string {
  return value.replace(
    /\.0$/,
    ""
  );
}


/* =========================================================
   SVG
   ========================================================= */

const SVG_NAMESPACE =
  "http://www.w3.org/2000/svg";


function createSvg(): SVGSVGElement {
  const svg =
    document.createElementNS(
      SVG_NAMESPACE,
      "svg"
    );

  svg.setAttribute(
    "viewBox",
    "0 0 24 24"
  );

  svg.setAttribute(
    "aria-hidden",
    "true"
  );

  svg.setAttribute(
    "focusable",
    "false"
  );

  return svg;
}


function createPath(
  data: string
): SVGPathElement {
  const path =
    document.createElementNS(
      SVG_NAMESPACE,
      "path"
    );

  path.setAttribute(
    "d",
    data
  );

  return path;
}


function searchIcon(): SVGSVGElement {
  const svg = createSvg();

  const circle =
    document.createElementNS(
      SVG_NAMESPACE,
      "circle"
    );

  circle.setAttribute(
    "cx",
    "11"
  );

  circle.setAttribute(
    "cy",
    "11"
  );

  circle.setAttribute(
    "r",
    "6.5"
  );

  svg.append(
    circle,
    createPath(
      "m16 16 4.5 4.5"
    )
  );

  return svg;
}


function arrowIcon(): SVGSVGElement {
  const svg = createSvg();

  svg.append(
    createPath(
      "m9 6 6 6-6 6"
    )
  );

  return svg;
}
