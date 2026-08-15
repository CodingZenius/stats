import type {
  PostAuthor,
} from "../types/social";

/**
 * statuzfree
 * Profile view.
 *
 * The profile displays identity, social position and the
 * player's visible progression through the simulated world.
 *
 * Aura, clout, appeal, follower growth and relationship
 * calculations do not happen here. This view only renders
 * values supplied by game state.
 */


/* =========================================================
   Types
   ========================================================= */

interface ProfileStats {
  aura: number;
  clout: number;
  appeal: number;
  followers: number;
  following: number;
}

interface ProfilePost {
  id: string;
  content: string;
  createdAt: string;

  likes: number;
  replies: number;
  reposts: number;
}

interface ProfileData {
  profile: PostAuthor;

  bio: string;

  location?: string;

  stats: ProfileStats;

  posts: ProfilePost[];

  isPlayer: boolean;

  isFollowing?: boolean;
}


/* =========================================================
   Temporary development data
   ========================================================= */

const profiles:
  Record<string, ProfileData> = {
    user_player_001: {
      profile: {
        id: "user_player_001",
        displayName: "Alex",
        username: "alex",
        avatarUrl: null,
        accountType: "player",
      },

      bio:
        "Apparently people have started paying attention.",

      location:
        "Northside",

      stats: {
        aura: 42,
        clout: 31,
        appeal: 58,
        followers: 2184,
        following: 147,
      },

      posts: [
        {
          id: "player_post_003",

          content:
            "Some of you hear one thing and somehow create an entirely different story.",

          createdAt:
            "2026-08-15T18:31:00.000Z",

          likes: 184,
          replies: 37,
          reposts: 21,
        },

        {
          id: "player_post_002",

          content:
            "I'm going out tonight. That's literally all I said.",

          createdAt:
            "2026-08-15T16:42:00.000Z",

          likes: 93,
          replies: 19,
          reposts: 8,
        },

        {
          id: "player_post_001",

          content:
            "First day here and this place already feels strange.",

          createdAt:
            "2026-08-15T12:14:00.000Z",

          likes: 41,
          replies: 7,
          reposts: 2,
        },
      ],

      isPlayer: true,
    },


    char_maya_001: {
      profile: {
        id: "char_maya_001",
        displayName: "Maya Collins",
        username: "mayacollins",
        avatarUrl: null,
        accountType: "character",
      },

      bio:
        "I usually know what's happening before you do.",

      location:
        "Northside",

      stats: {
        aura: 73,
        clout: 68,
        appeal: 81,
        followers: 12800,
        following: 612,
      },

      posts: [
        {
          id: "maya_post_002",

          content:
            "Watching people rewrite what happened in real time is kind of incredible.",

          createdAt:
            "2026-08-15T18:12:00.000Z",

          likes: 917,
          replies: 143,
          reposts: 96,
        },

        {
          id: "maya_post_001",

          content:
            "Friday is going to be interesting.",

          createdAt:
            "2026-08-15T14:22:00.000Z",

          likes: 604,
          replies: 88,
          reposts: 41,
        },
      ],

      isPlayer: false,

      isFollowing: false,
    },


    char_daniel_001: {
      profile: {
        id: "char_daniel_001",
        displayName: "Daniel Cole",
        username: "danielcole",
        avatarUrl: null,
        accountType: "character",
      },

      bio:
        "Mostly observing.",

      location:
        "Northside",

      stats: {
        aura: 55,
        clout: 49,
        appeal: 61,
        followers: 7400,
        following: 331,
      },

      posts: [
        {
          id: "daniel_post_001",

          content:
            "People are talking like nobody keeps screenshots.",

          createdAt:
            "2026-08-15T17:09:00.000Z",

          likes: 372,
          replies: 61,
          reposts: 34,
        },
      ],

      isPlayer: false,

      isFollowing: true,
    },
  };


/* =========================================================
   Public renderer
   ========================================================= */

export function renderProfileView(
  root: HTMLElement,
  profileId = "user_player_001"
): void {
  const data =
    profiles[profileId];


  if (!data) {
    root.replaceChildren(
      createMissingProfile()
    );

    return;
  }


  const view =
    document.createElement("section");

  view.className =
    "profile-view";

  view.dataset.profileId =
    data.profile.id;


  view.append(
    createProfileHeader(data),
    createProfileIdentity(data),
    createStats(data),
    createProfileNavigation(),
    createProfilePosts(data)
  );


  initialiseProfileEvents(
    view,
    data
  );


  root.replaceChildren(
    view
  );
}


/* =========================================================
   Header
   ========================================================= */

function createProfileHeader(
  data: ProfileData
): HTMLElement {
  const header =
    document.createElement("header");

  header.className =
    "profile-header";


  const back =
    document.createElement("button");

  back.type = "button";

  back.className =
    "profile-header__back";

  back.dataset.action =
    "profile-back";

  back.setAttribute(
    "aria-label",
    "Go back"
  );

  back.append(
    backIcon()
  );


  const identity =
    document.createElement("div");

  identity.className =
    "profile-header__identity";


  const name =
    document.createElement("strong");

  name.textContent =
    data.profile.displayName;


  const postCount =
    document.createElement("span");

  postCount.textContent =
    `${data.posts.length} ${
      data.posts.length === 1
        ? "post"
        : "posts"
    }`;


  identity.append(
    name,
    postCount
  );


  const options =
    document.createElement("button");

  options.type = "button";

  options.className =
    "profile-header__options";

  options.dataset.action =
    "profile-options";

  options.setAttribute(
    "aria-label",
    "Profile options"
  );

  options.append(
    moreIcon()
  );


  header.append(
    back,
    identity,
    options
  );


  return header;
}


/* =========================================================
   Identity
   ========================================================= */

function createProfileIdentity(
  data: ProfileData
): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "profile-identity";


  const top =
    document.createElement("div");

  top.className =
    "profile-identity__top";


  const avatar =
    createAvatar(
      data.profile
    );


  const actions =
    document.createElement("div");

  actions.className =
    "profile-identity__actions";


  if (data.isPlayer) {
    const edit =
      document.createElement("button");

    edit.type = "button";

    edit.className =
      "profile-action profile-action--secondary";

    edit.dataset.action =
      "edit-profile";

    edit.textContent =
      "Edit profile";


    actions.append(edit);
  } else {
    const message =
      document.createElement("button");

    message.type = "button";

    message.className =
      "profile-action profile-action--secondary";

    message.dataset.action =
      "message-profile";

    message.textContent =
      "Message";


    const follow =
      document.createElement("button");

    follow.type = "button";

    follow.className =
      "profile-action profile-action--primary";

    follow.dataset.action =
      "follow-profile";

    updateFollowButton(
      follow,
      Boolean(
        data.isFollowing
      )
    );


    actions.append(
      message,
      follow
    );
  }


  top.append(
    avatar,
    actions
  );


  const names =
    document.createElement("div");

  names.className =
    "profile-identity__names";


  const displayName =
    document.createElement("h1");

  displayName.textContent =
    data.profile.displayName;


  const username =
    document.createElement("span");

  username.textContent =
    `@${data.profile.username}`;


  names.append(
    displayName,
    username
  );


  const bio =
    document.createElement("p");

  bio.className =
    "profile-identity__bio";

  bio.textContent =
    data.bio;


  section.append(
    top,
    names,
    bio
  );


  if (data.location) {
    const location =
      document.createElement("div");

    location.className =
      "profile-identity__location";

    location.append(
      locationIcon()
    );


    const locationText =
      document.createElement("span");

    locationText.textContent =
      data.location;


    location.append(
      locationText
    );


    section.append(
      location
    );
  }


  const social =
    document.createElement("div");

  social.className =
    "profile-identity__social";


  const following =
    createSocialCount(
      data.stats.following,
      "Following"
    );


  const followers =
    createSocialCount(
      data.stats.followers,
      "Followers"
    );


  social.append(
    following,
    followers
  );


  section.append(
    social
  );


  return section;
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
    "profile-avatar";


  if (profile.avatarUrl) {
    const image =
      document.createElement("img");

    image.src =
      profile.avatarUrl;

    image.alt =
      `${profile.displayName} profile picture`;

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


  avatar.append(
    initial
  );


  return avatar;
}


/* =========================================================
   Social count
   ========================================================= */

function createSocialCount(
  value: number,
  label: string
): HTMLElement {
  const element =
    document.createElement("button");

  element.type = "button";

  element.className =
    "profile-social-count";


  const count =
    document.createElement("strong");

  count.textContent =
    formatCount(value);


  const text =
    document.createElement("span");

  text.textContent =
    label;


  element.append(
    count,
    text
  );


  return element;
}


/* =========================================================
   Game statistics
   ========================================================= */

function createStats(
  data: ProfileData
): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "profile-stats";

  section.setAttribute(
    "aria-label",
    "Profile statistics"
  );


  section.append(
    createStat(
      "Aura",
      data.stats.aura
    ),

    createStat(
      "Clout",
      data.stats.clout
    ),

    createStat(
      "Appeal",
      data.stats.appeal
    )
  );


  return section;
}


function createStat(
  label: string,
  value: number
): HTMLElement {
  const stat =
    document.createElement("div");

  stat.className =
    "profile-stat";


  const header =
    document.createElement("div");

  header.className =
    "profile-stat__header";


  const name =
    document.createElement("span");

  name.textContent =
    label;


  const score =
    document.createElement("strong");

  score.textContent =
    value.toString();


  header.append(
    name,
    score
  );


  const track =
    document.createElement("div");

  track.className =
    "profile-stat__track";


  const progress =
    document.createElement("span");

  progress.className =
    "profile-stat__progress";

  progress.style.width =
    `${clamp(value, 0, 100)}%`;


  track.append(
    progress
  );


  stat.append(
    header,
    track
  );


  return stat;
}


/* =========================================================
   Profile navigation
   ========================================================= */

function createProfileNavigation(): HTMLElement {
  const navigation =
    document.createElement("nav");

  navigation.className =
    "profile-tabs";

  navigation.setAttribute(
    "aria-label",
    "Profile content"
  );


  navigation.append(
    createTab(
      "Posts",
      "posts",
      true
    ),

    createTab(
      "Replies",
      "replies",
      false
    )
  );


  return navigation;
}


function createTab(
  label: string,
  value: string,
  active: boolean
): HTMLButtonElement {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "profile-tabs__item";

  button.dataset.profileTab =
    value;


  if (active) {
    button.classList.add(
      "is-active"
    );
  }


  button.setAttribute(
    "aria-selected",
    active
      ? "true"
      : "false"
  );


  button.textContent =
    label;


  return button;
}


/* =========================================================
   Posts
   ========================================================= */

function createProfilePosts(
  data: ProfileData
): HTMLElement {
  const list =
    document.createElement("div");

  list.className =
    "profile-posts";

  list.dataset.profilePosts =
    "true";


  if (
    data.posts.length === 0
  ) {
    const empty =
      document.createElement("div");

    empty.className =
      "profile-posts__empty";


    const title =
      document.createElement("h2");

    title.textContent =
      "No posts";


    const text =
      document.createElement("p");

    text.textContent =
      "Posts will appear here.";


    empty.append(
      title,
      text
    );


    list.append(
      empty
    );


    return list;
  }


  data.posts.forEach(
    (post) => {
      list.append(
        createProfilePost(
          data.profile,
          post
        )
      );
    }
  );


  return list;
}


/* =========================================================
   Profile post
   ========================================================= */

function createProfilePost(
  profile: PostAuthor,
  post: ProfilePost
): HTMLElement {
  const article =
    document.createElement("article");

  article.className =
    "profile-post";

  article.dataset.postId =
    post.id;


  const header =
    document.createElement("div");

  header.className =
    "profile-post__header";


  const name =
    document.createElement("strong");

  name.textContent =
    profile.displayName;


  const username =
    document.createElement("span");

  username.textContent =
    `@${profile.username}`;


  const separator =
    document.createElement("span");

  separator.textContent =
    "·";


  const time =
    document.createElement("time");

  time.dateTime =
    post.createdAt;

  time.textContent =
    formatRelativeTime(
      post.createdAt
    );


  header.append(
    name,
    username,
    separator,
    time
  );


  const content =
    document.createElement("p");

  content.className =
    "profile-post__content";

  content.textContent =
    post.content;


  const activity =
    document.createElement("div");

  activity.className =
    "profile-post__activity";


  activity.append(
    createActivity(
      replyIcon(),
      post.replies,
      "Replies"
    ),

    createActivity(
      repostIcon(),
      post.reposts,
      "Reposts"
    ),

    createActivity(
      likeIcon(),
      post.likes,
      "Likes"
    )
  );


  article.append(
    header,
    content,
    activity
  );


  return article;
}


/* =========================================================
   Post activity
   ========================================================= */

function createActivity(
  icon: SVGSVGElement,
  value: number,
  label: string
): HTMLElement {
  const item =
    document.createElement("span");

  item.className =
    "profile-post__activity-item";

  item.setAttribute(
    "aria-label",
    `${formatCount(value)} ${label}`
  );


  const count =
    document.createElement("span");

  count.textContent =
    formatCount(value);


  item.append(
    icon,
    count
  );


  return item;
}


/* =========================================================
   Events
   ========================================================= */

function initialiseProfileEvents(
  view: HTMLElement,
  data: ProfileData
): void {
  view.addEventListener(
    "click",
    (event) => {
      const target =
        event.target as HTMLElement;


      if (
        target.closest(
          '[data-action="profile-back"]'
        )
      ) {
        document.dispatchEvent(
          new CustomEvent(
            "statuzfree:profile-back"
          )
        );

        return;
      }


      const follow =
        target.closest<HTMLButtonElement>(
          '[data-action="follow-profile"]'
        );


      if (follow) {
        const currentlyFollowing =
          follow.getAttribute(
            "aria-pressed"
          ) === "true";


        const following =
          !currentlyFollowing;


        updateFollowButton(
          follow,
          following
        );


        document.dispatchEvent(
          new CustomEvent(
            "statuzfree:follow-change",
            {
              detail: {
                profileId:
                  data.profile.id,

                following,
              },
            }
          )
        );

        return;
      }


      if (
        target.closest(
          '[data-action="message-profile"]'
        )
      ) {
        document.dispatchEvent(
          new CustomEvent(
            "statuzfree:start-conversation",
            {
              detail: {
                profileId:
                  data.profile.id,
              },
            }
          )
        );

        return;
      }


      if (
        target.closest(
          '[data-action="edit-profile"]'
        )
      ) {
        document.dispatchEvent(
          new CustomEvent(
            "statuzfree:edit-profile"
          )
        );

        return;
      }


      const tab =
        target.closest<HTMLButtonElement>(
          "[data-profile-tab]"
        );


      if (tab) {
        selectProfileTab(
          view,
          tab
        );

        return;
      }


      const post =
        target.closest<HTMLElement>(
          "[data-post-id]"
        );


      if (post?.dataset.postId) {
        document.dispatchEvent(
          new CustomEvent(
            "statuzfree:open-post",
            {
              detail: {
                postId:
                  post.dataset.postId,
              },
            }
          )
        );
      }
    }
  );
}


/* =========================================================
   Profile tabs
   ========================================================= */

function selectProfileTab(
  view: HTMLElement,
  selected: HTMLButtonElement
): void {
  const tabs =
    view.querySelectorAll<HTMLButtonElement>(
      "[data-profile-tab]"
    );


  tabs.forEach(
    (tab) => {
      const active =
        tab === selected;


      tab.classList.toggle(
        "is-active",
        active
      );


      tab.setAttribute(
        "aria-selected",
        active
          ? "true"
          : "false"
      );
    }
  );


  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:profile-tab-change",
      {
        detail: {
          profileId:
            view.dataset.profileId,

          tab:
            selected.dataset.profileTab,
        },
      }
    )
  );
}


/* =========================================================
   Follow button
   ========================================================= */

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
   Missing profile
   ========================================================= */

function createMissingProfile(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "profile-missing";


  const title =
    document.createElement("h1");

  title.textContent =
    "Profile unavailable";


  const text =
    document.createElement("p");

  text.textContent =
    "This profile could not be found.";


  section.append(
    title,
    text
  );


  return section;
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
    (value / 1_000_000)
      .toFixed(1);


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


function formatRelativeTime(
  isoDate: string
): string {
  const timestamp =
    new Date(
      isoDate
    ).getTime();


  const difference =
    Math.max(
      0,
      Date.now() -
        timestamp
    );


  const minutes =
    Math.floor(
      difference /
        60_000
    );


  if (minutes < 1) {
    return "now";
  }


  if (minutes < 60) {
    return `${minutes}m`;
  }


  const hours =
    Math.floor(
      minutes / 60
    );


  if (hours < 24) {
    return `${hours}h`;
  }


  const days =
    Math.floor(
      hours / 24
    );


  if (days < 7) {
    return `${days}d`;
  }


  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
    }
  ).format(
    new Date(
      isoDate
    )
  );
}


function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value
    )
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


function backIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "m15 18-6-6 6-6"
    )
  );


  return svg;
}


function moreIcon(): SVGSVGElement {
  const svg =
    createSvg();


  [5, 12, 19].forEach(
    (cx) => {
      const circle =
        document.createElementNS(
          SVG_NAMESPACE,
          "circle"
        );


      circle.setAttribute(
        "cx",
        cx.toString()
      );


      circle.setAttribute(
        "cy",
        "12"
      );


      circle.setAttribute(
        "r",
        "1.25"
      );


      svg.append(circle);
    }
  );


  return svg;
}


function locationIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"
    )
  );


  const circle =
    document.createElementNS(
      SVG_NAMESPACE,
      "circle"
    );


  circle.setAttribute(
    "cx",
    "12"
  );


  circle.setAttribute(
    "cy",
    "10"
  );


  circle.setAttribute(
    "r",
    "2"
  );


  svg.append(circle);


  return svg;
}


function replyIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "M20 11.5a7.5 7.5 0 1 1-3-6l3-1-1 3"
    )
  );


  return svg;
}


function repostIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "m7 7 3-3 3 3"
    ),

    createPath(
      "M10 4v11a4 4 0 0 0 4 4h3"
    ),

    createPath(
      "m17 17 3 2-3 2"
    )
  );


  return svg;
}


function likeIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "M20.8 8.4c0 5.2-8.8 10.1-8.8 10.1S3.2 13.6 3.2 8.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.8 1.4Z"
    )
  );


  return svg;
}
