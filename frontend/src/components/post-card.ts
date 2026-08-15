import type {
  FeedPost,
  PostAuthor,
} from "../types/social";

/**
 * statuzfree
 * Feed post component.
 *
 * Responsible only for rendering a social post and emitting
 * browser events when the player interacts with it.
 *
 * It does not calculate engagement, call an LLM or mutate
 * game state.
 */


/* =========================================================
   Public component
   ========================================================= */

export function createPostCard(post: FeedPost): HTMLElement {
  const article = document.createElement("article");

  article.className = "post-card";
  article.dataset.postId = post.id;

  const avatar = createAvatar(post.author);

  const content = document.createElement("div");
  content.className = "post-card__content";

  content.append(
    createPostHeader(post),
    createPostBody(post)
  );

  if (post.media && post.media.length > 0) {
    content.append(createMedia(post));
  }

  content.append(createPostActions(post));

  article.append(
    avatar,
    content
  );

  return article;
}


/* =========================================================
   Avatar
   ========================================================= */

function createAvatar(author: PostAuthor): HTMLElement {
  const wrapper = document.createElement("div");

  wrapper.className = "post-card__avatar";

  if (author.avatarUrl) {
    const image = document.createElement("img");

    image.src = author.avatarUrl;
    image.alt = `${author.displayName} profile picture`;
    image.loading = "lazy";

    wrapper.append(image);

    return wrapper;
  }

  /*
   * Accounts without profile images receive a neutral
   * initial-based placeholder.
   *
   * Anonymous accounts intentionally receive no initial.
   */

  if (author.accountType === "anonymous") {
    wrapper.classList.add(
      "post-card__avatar--anonymous"
    );

    return wrapper;
  }

  const initial = document.createElement("span");

  initial.textContent =
    author.displayName
      .trim()
      .charAt(0)
      .toUpperCase();

  initial.setAttribute(
    "aria-hidden",
    "true"
  );

  wrapper.append(initial);

  return wrapper;
}


/* =========================================================
   Header
   ========================================================= */

function createPostHeader(post: FeedPost): HTMLElement {
  const header = document.createElement("header");

  header.className = "post-card__header";

  const identity = document.createElement("div");

  identity.className = "post-card__identity";

  const name = document.createElement("span");

  name.className = "post-card__name";
  name.textContent = post.author.displayName;

  const username = document.createElement("span");

  username.className = "post-card__username";
  username.textContent = `@${post.author.username}`;

  const separator = document.createElement("span");

  separator.className = "post-card__separator";
  separator.textContent = "·";
  separator.setAttribute(
    "aria-hidden",
    "true"
  );

  const timestamp = document.createElement("time");

  timestamp.className = "post-card__time";
  timestamp.dateTime = post.createdAt;
  timestamp.textContent = formatRelativeTime(
    post.createdAt
  );

  identity.append(
    name,
    username,
    separator,
    timestamp
  );

  const menuButton = createMenuButton(post.id);

  header.append(
    identity,
    menuButton
  );

  return header;
}


/* =========================================================
   Body
   ========================================================= */

function createPostBody(post: FeedPost): HTMLElement {
  const body = document.createElement("p");

  body.className = "post-card__body";
  body.textContent = post.content;

  return body;
}


/* =========================================================
   Media
   ========================================================= */

function createMedia(post: FeedPost): HTMLElement {
  const mediaContainer =
    document.createElement("div");

  mediaContainer.className = "post-card__media";

  const mediaItems = post.media ?? [];

  if (mediaItems.length > 1) {
    mediaContainer.classList.add(
      "post-card__media--multiple"
    );
  }

  mediaItems.forEach((media) => {
    if (
      media.type === "image" ||
      media.type === "gif"
    ) {
      const image = document.createElement("img");

      image.src = media.url;
      image.alt = media.alt ?? "";
      image.loading = "lazy";

      if (media.width) {
        image.width = media.width;
      }

      if (media.height) {
        image.height = media.height;
      }

      mediaContainer.append(image);

      return;
    }

    if (media.type === "video") {
      const video = document.createElement("video");

      video.src = media.url;
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;

      if (media.posterUrl) {
        video.poster = media.posterUrl;
      }

      mediaContainer.append(video);
    }
  });

  return mediaContainer;
}


/* =========================================================
   Actions
   ========================================================= */

function createPostActions(post: FeedPost): HTMLElement {
  const actions = document.createElement("div");

  actions.className = "post-card__actions";

  actions.append(
    createActionButton({
      action: "reply",
      label: "Reply",
      count: post.metrics.replies,
      postId: post.id,
      icon: replyIcon(),
    }),

    createActionButton({
      action: "repost",
      label: "Repost",
      count: post.metrics.reposts,
      postId: post.id,
      active: post.viewerState.reposted,
      icon: repostIcon(),
    }),

    createActionButton({
      action: "like",
      label: "Like",
      count: post.metrics.likes,
      postId: post.id,
      active: post.viewerState.liked,
      icon: likeIcon(),
    }),

    createActionButton({
      action: "share",
      label: "Share",
      postId: post.id,
      icon: shareIcon(),
    })
  );

  return actions;
}


interface ActionButtonOptions {
  action:
    | "reply"
    | "repost"
    | "like"
    | "share";

  label: string;

  postId: string;

  count?: number;

  active?: boolean;

  icon: SVGSVGElement;
}


function createActionButton(
  options: ActionButtonOptions
): HTMLButtonElement {
  const button = document.createElement("button");

  button.type = "button";

  button.className =
    "post-card__action";

  button.dataset.action =
    options.action;

  button.dataset.postId =
    options.postId;

  button.setAttribute(
    "aria-label",
    options.label
  );

  button.setAttribute(
    "aria-pressed",
    options.active ? "true" : "false"
  );

  if (options.active) {
    button.classList.add("is-active");
  }

  button.append(options.icon);

  if (
    typeof options.count === "number" &&
    options.count > 0
  ) {
    const count =
      document.createElement("span");

    count.className =
      "post-card__action-count";

    count.textContent =
      formatCount(options.count);

    button.append(count);
  }

  button.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      emitPostAction(
        options.action,
        options.postId
      );
    }
  );

  return button;
}


/* =========================================================
   Post menu
   ========================================================= */

function createMenuButton(
  postId: string
): HTMLButtonElement {
  const button = document.createElement("button");

  button.type = "button";

  button.className =
    "post-card__menu";

  button.dataset.action =
    "post-menu";

  button.dataset.postId =
    postId;

  button.setAttribute(
    "aria-label",
    "Post options"
  );

  button.append(moreIcon());

  button.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();

      emitPostAction(
        "menu",
        postId
      );
    }
  );

  return button;
}


/* =========================================================
   Component events
   ========================================================= */

type PostAction =
  | "reply"
  | "repost"
  | "like"
  | "share"
  | "menu";


function emitPostAction(
  action: PostAction,
  postId: string
): void {
  const event =
    new CustomEvent("statuzfree:post-action", {
      bubbles: true,

      detail: {
        action,
        postId,
      },
    });

  document.dispatchEvent(event);
}


/* =========================================================
   Formatting
   ========================================================= */

function formatCount(value: number): string {
  if (value < 1_000) {
    return value.toString();
  }

  if (value < 1_000_000) {
    const formatted =
      (value / 1_000).toFixed(
        value >= 10_000 ? 0 : 1
      );

    return `${removeTrailingZero(formatted)}K`;
  }

  const formatted =
    (value / 1_000_000).toFixed(
      value >= 10_000_000 ? 0 : 1
    );

  return `${removeTrailingZero(formatted)}M`;
}


function removeTrailingZero(
  value: string
): string {
  return value.replace(/\.0$/, "");
}


function formatRelativeTime(
  isoDate: string
): string {
  const timestamp =
    new Date(isoDate).getTime();

  const now = Date.now();

  const difference =
    Math.max(
      0,
      now - timestamp
    );

  const seconds =
    Math.floor(difference / 1_000);

  if (seconds < 60) {
    return "now";
  }

  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h`;
  }

  const days =
    Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d`;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
    }
  ).format(new Date(isoDate));
}


/* =========================================================
   SVG helpers
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
  pathData: string
): SVGPathElement {
  const path =
    document.createElementNS(
      SVG_NAMESPACE,
      "path"
    );

  path.setAttribute(
    "d",
    pathData
  );

  return path;
}


function replyIcon(): SVGSVGElement {
  const svg = createSvg();

  svg.append(
    createPath(
      "M20 15a4 4 0 0 1-4 4H9l-5 3V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4Z"
    )
  );

  return svg;
}


function repostIcon(): SVGSVGElement {
  const svg = createSvg();

  svg.append(
    createPath(
      "M7 7h10l-3-3m3 3-3 3M17 17H7l3 3m-3-3 3-3"
    )
  );

  return svg;
}


function likeIcon(): SVGSVGElement {
  const svg = createSvg();

  svg.append(
    createPath(
      "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
    )
  );

  return svg;
}


function shareIcon(): SVGSVGElement {
  const svg = createSvg();

  svg.append(
    createPath(
      "M12 16V4m0 0L7 9m5-5 5 5M5 13v7h14v-7"
    )
  );

  return svg;
}


function moreIcon(): SVGSVGElement {
  const svg = createSvg();

  const first =
    document.createElementNS(
      SVG_NAMESPACE,
      "circle"
    );

  const second =
    document.createElementNS(
      SVG_NAMESPACE,
      "circle"
    );

  const third =
    document.createElementNS(
      SVG_NAMESPACE,
      "circle"
    );

  [
    [first, "5"],
    [second, "12"],
    [third, "19"],
  ].forEach(([circle, cx]) => {
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "1.2");
  });

  svg.append(
    first,
    second,
    third
  );

  return svg;
}
