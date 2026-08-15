import type {
  FeedPost,
  PostReply,
  PostAuthor,
} from "../types/social";

import {
  createPostCard,
} from "../components/post-card";

/**
 * statuzfree
 * Post detail / conversation thread.
 *
 * Displays one post and its public replies.
 *
 * The frontend does not generate replies or decide which
 * characters should respond. Eventually the backend social
 * service returns the thread after the simulation engine and
 * AI service have performed their respective jobs.
 */


/* =========================================================
   Local types
   ========================================================= */

interface PostThreadData {
  post: FeedPost;
  replies: PostReply[];
}


/* =========================================================
   Temporary accounts
   ========================================================= */

const player: PostAuthor = {
  id: "user_player_001",
  displayName: "Alex",
  username: "alex",
  avatarUrl: null,
  accountType: "player",
};


const maya: PostAuthor = {
  id: "char_maya_001",
  displayName: "Maya Collins",
  username: "mayacollins",
  avatarUrl: null,
  accountType: "character",
};


const daniel: PostAuthor = {
  id: "char_daniel_001",
  displayName: "Daniel Cole",
  username: "danielcole",
  avatarUrl: null,
  accountType: "character",
};


const campusWire: PostAuthor = {
  id: "publication_campuswire_001",
  displayName: "Campus Wire",
  username: "campuswire",
  avatarUrl: null,
  accountType: "publication",
};


const anonymousOne: PostAuthor = {
  id: "anonymous_481927",
  displayName: "somebody",
  username: "user481927",
  avatarUrl: null,
  accountType: "anonymous",
};


const ambientOne: PostAuthor = {
  id: "ambient_zac_001",
  displayName: "Zac",
  username: "northsidezac",
  avatarUrl: null,
  accountType: "ambient",
};


/* =========================================================
   Temporary thread data
   ========================================================= */

const threads:
  Record<string, PostThreadData> = {
    post_004: {
      post: {
        id: "post_004",

        author: player,

        content:
          "Some of you are making this sound much deeper than it actually was.",

        createdAt:
          "2026-08-15T18:31:00.000Z",

        metrics: {
          replies: 22,
          reposts: 8,
          likes: 117,
        },

        viewerState: {
          liked: false,
          reposted: false,
        },
      },

      replies: [
        {
          id: "reply_004_001",

          postId: "post_004",

          author: maya,

          content:
            "You say this after putting it on the timeline for everyone to see.",

          createdAt:
            "2026-08-15T18:35:00.000Z",

          metrics: {
            replies: 4,
            reposts: 9,
            likes: 81,
          },

          viewerState: {
            liked: false,
            reposted: false,
          },
        },

        {
          id: "reply_004_002",

          postId: "post_004",

          author: anonymousOne,

          content:
            "bro discovered consequences",

          createdAt:
            "2026-08-15T18:37:00.000Z",

          metrics: {
            replies: 3,
            reposts: 12,
            likes: 126,
          },

          viewerState: {
            liked: false,
            reposted: false,
          },
        },

        {
          id: "reply_004_003",

          postId: "post_004",

          author: daniel,

          content:
            "To be fair, people were already talking before he posted this.",

          createdAt:
            "2026-08-15T18:39:00.000Z",

          metrics: {
            replies: 6,
            reposts: 4,
            likes: 54,
          },

          viewerState: {
            liked: true,
            reposted: false,
          },
        },

        {
          id: "reply_004_004",

          postId: "post_004",

          author: ambientOne,

          content:
            "The replies proving his point is kind of funny.",

          createdAt:
            "2026-08-15T18:43:00.000Z",

          metrics: {
            replies: 2,
            reposts: 5,
            likes: 38,
          },

          viewerState: {
            liked: false,
            reposted: false,
          },
        },

        {
          id: "reply_004_005",

          postId: "post_004",

          author: campusWire,

          content:
            "Discussion around the original post has continued to grow across the timeline.",

          createdAt:
            "2026-08-15T18:49:00.000Z",

          metrics: {
            replies: 8,
            reposts: 18,
            likes: 104,
          },

          viewerState: {
            liked: false,
            reposted: false,
          },
        },
      ],
    },


    post_005: {
      post: {
        id: "post_005",

        author: anonymousOne,

        content:
          "bro posts one sentence and somehow the entire timeline starts fighting",

        createdAt:
          "2026-08-15T18:16:00.000Z",

        metrics: {
          replies: 4,
          reposts: 19,
          likes: 153,
        },

        viewerState: {
          liked: true,
          reposted: false,
        },
      },

      replies: [
        {
          id: "reply_005_001",

          postId: "post_005",

          author: maya,

          content:
            "Because nobody here knows how to act normal.",

          createdAt:
            "2026-08-15T18:19:00.000Z",

          metrics: {
            replies: 2,
            reposts: 5,
            likes: 67,
          },

          viewerState: {
            liked: false,
            reposted: false,
          },
        },
      ],
    },
  };


/* =========================================================
   Public renderer
   ========================================================= */

export function renderPostDetailView(
  root: HTMLElement,
  postId: string
): void {
  const thread =
    threads[postId];


  if (!thread) {
    root.replaceChildren(
      createMissingPost()
    );

    return;
  }


  const view =
    document.createElement("section");

  view.className =
    "post-detail-view";

  view.dataset.postId =
    postId;


  view.append(
    createHeader(),
    createOriginalPost(thread.post),
    createThreadSummary(thread),
    createReplies(thread.replies),
    createReplyComposer(thread.post)
  );


  initialiseThreadEvents(
    view,
    thread
  );


  root.replaceChildren(
    view
  );
}


/* =========================================================
   Header
   ========================================================= */

function createHeader(): HTMLElement {
  const header =
    document.createElement("header");

  header.className =
    "post-detail-header";


  const back =
    document.createElement("button");

  back.type = "button";

  back.className =
    "post-detail-header__back";

  back.dataset.action =
    "post-detail-back";

  back.setAttribute(
    "aria-label",
    "Go back"
  );

  back.append(
    backIcon()
  );


  const title =
    document.createElement("h1");

  title.textContent =
    "Post";


  const spacer =
    document.createElement("div");

  spacer.className =
    "post-detail-header__spacer";


  header.append(
    back,
    title,
    spacer
  );


  return header;
}


/* =========================================================
   Original post
   ========================================================= */

function createOriginalPost(
  post: FeedPost
): HTMLElement {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "post-detail-original";


  const card =
    createPostCard(post);

  card.classList.add(
    "post-card--detail"
  );


  wrapper.append(
    card
  );


  return wrapper;
}


/* =========================================================
   Thread summary
   ========================================================= */

function createThreadSummary(
  thread: PostThreadData
): HTMLElement {
  const section =
    document.createElement("div");

  section.className =
    "thread-summary";


  const replies =
    document.createElement("span");

  replies.textContent =
    `${formatCount(
      thread.post.metrics.replies
    )} replies`;


  const activity =
    document.createElement("span");

  activity.textContent =
    `${formatCount(
      thread.post.metrics.likes +
      thread.post.metrics.reposts
    )} reactions`;


  section.append(
    replies,
    activity
  );


  return section;
}


/* =========================================================
   Replies
   ========================================================= */

function createReplies(
  replies: PostReply[]
): HTMLElement {
  const container =
    document.createElement("section");

  container.className =
    "thread-replies";

  container.dataset.threadReplies =
    "true";

  container.setAttribute(
    "aria-label",
    "Replies"
  );


  if (replies.length === 0) {
    container.append(
      createEmptyReplies()
    );

    return container;
  }


  replies.forEach(
    (reply) => {
      container.append(
        createReply(reply)
      );
    }
  );


  return container;
}


/* =========================================================
   Individual reply
   ========================================================= */

function createReply(
  reply: PostReply
): HTMLElement {
  const article =
    document.createElement("article");

  article.className =
    "thread-reply";

  article.dataset.replyId =
    reply.id;

  article.dataset.profileId =
    reply.author.id;


  const avatar =
    createAvatar(
      reply.author
    );


  const body =
    document.createElement("div");

  body.className =
    "thread-reply__body";


  const header =
    document.createElement("header");

  header.className =
    "thread-reply__header";


  const identity =
    document.createElement("div");

  identity.className =
    "thread-reply__identity";


  const name =
    document.createElement("strong");

  name.className =
    "thread-reply__name";

  name.textContent =
    reply.author.displayName;


  const username =
    document.createElement("span");

  username.className =
    "thread-reply__username";

  username.textContent =
    `@${reply.author.username}`;


  const separator =
    document.createElement("span");

  separator.className =
    "thread-reply__separator";

  separator.textContent =
    "·";


  const time =
    document.createElement("time");

  time.className =
    "thread-reply__time";

  time.dateTime =
    reply.createdAt;

  time.textContent =
    formatRelativeTime(
      reply.createdAt
    );


  identity.append(
    name,
    username,
    separator,
    time
  );


  const menu =
    document.createElement("button");

  menu.type = "button";

  menu.className =
    "thread-reply__menu";

  menu.dataset.action =
    "reply-menu";

  menu.dataset.replyId =
    reply.id;

  menu.setAttribute(
    "aria-label",
    "Reply options"
  );

  menu.append(
    moreIcon()
  );


  header.append(
    identity,
    menu
  );


  const content =
    document.createElement("p");

  content.className =
    "thread-reply__content";

  content.textContent =
    reply.content;


  const actions =
    createReplyActions(
      reply
    );


  body.append(
    header,
    content,
    actions
  );


  article.append(
    avatar,
    body
  );


  return article;
}


/* =========================================================
   Reply avatar
   ========================================================= */

function createAvatar(
  author: PostAuthor
): HTMLElement {
  const avatar =
    document.createElement("button");

  avatar.type = "button";

  avatar.className =
    "thread-reply__avatar";

  avatar.dataset.profileId =
    author.id;

  avatar.setAttribute(
    "aria-label",
    `Open ${author.displayName}'s profile`
  );


  if (author.avatarUrl) {
    const image =
      document.createElement("img");

    image.src =
      author.avatarUrl;

    image.alt = "";

    image.loading =
      "lazy";


    avatar.append(
      image
    );


    return avatar;
  }


  if (
    author.accountType ===
    "anonymous"
  ) {
    avatar.classList.add(
      "thread-reply__avatar--anonymous"
    );

    return avatar;
  }


  const initial =
    document.createElement("span");

  initial.textContent =
    author.displayName
      .trim()
      .charAt(0)
      .toUpperCase();


  avatar.append(
    initial
  );


  return avatar;
}


/* =========================================================
   Reply actions
   ========================================================= */

function createReplyActions(
  reply: PostReply
): HTMLElement {
  const actions =
    document.createElement("div");

  actions.className =
    "thread-reply__actions";


  actions.append(
    createReplyAction({
      action: "reply",
      replyId: reply.id,
      label: "Reply",
      count: reply.metrics.replies,
      icon: replyIcon(),
    }),

    createReplyAction({
      action: "repost",
      replyId: reply.id,
      label: "Repost",
      count: reply.metrics.reposts,
      active:
        reply.viewerState.reposted,
      icon: repostIcon(),
    }),

    createReplyAction({
      action: "like",
      replyId: reply.id,
      label: "Like",
      count: reply.metrics.likes,
      active:
        reply.viewerState.liked,
      icon: likeIcon(),
    })
  );


  return actions;
}


interface ReplyActionOptions {
  action:
    | "reply"
    | "repost"
    | "like";

  replyId: string;

  label: string;

  count: number;

  active?: boolean;

  icon: SVGSVGElement;
}


function createReplyAction(
  options: ReplyActionOptions
): HTMLButtonElement {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "thread-reply__action";

  button.dataset.action =
    options.action;

  button.dataset.replyId =
    options.replyId;

  button.setAttribute(
    "aria-label",
    options.label
  );

  button.setAttribute(
    "aria-pressed",
    options.active
      ? "true"
      : "false"
  );


  if (options.active) {
    button.classList.add(
      "is-active"
    );
  }


  button.append(
    options.icon
  );


  if (options.count > 0) {
    const count =
      document.createElement("span");

    count.textContent =
      formatCount(
        options.count
      );


    button.append(
      count
    );
  }


  return button;
}


/* =========================================================
   Empty replies
   ========================================================= */

function createEmptyReplies(): HTMLElement {
  const empty =
    document.createElement("div");

  empty.className =
    "thread-replies__empty";


  const title =
    document.createElement("h2");

  title.textContent =
    "No replies yet";


  const text =
    document.createElement("p");

  text.textContent =
    "Start the conversation.";


  empty.append(
    title,
    text
  );


  return empty;
}


/* =========================================================
   Reply composer
   ========================================================= */

function createReplyComposer(
  post: FeedPost
): HTMLElement {
  const form =
    document.createElement("form");

  form.className =
    "thread-composer";

  form.dataset.threadComposer =
    "true";


  const avatar =
    document.createElement("div");

  avatar.className =
    "thread-composer__avatar";

  avatar.textContent =
    "A";


  const inputWrapper =
    document.createElement("div");

  inputWrapper.className =
    "thread-composer__input-wrapper";


  const textarea =
    document.createElement("textarea");

  textarea.className =
    "thread-composer__input";

  textarea.rows = 1;

  textarea.maxLength =
    500;

  textarea.placeholder =
    `Reply to @${post.author.username}`;

  textarea.setAttribute(
    "aria-label",
    `Reply to ${post.author.displayName}`
  );


  const submit =
    document.createElement("button");

  submit.type = "submit";

  submit.className =
    "thread-composer__submit";

  submit.textContent =
    "Reply";

  submit.disabled =
    true;


  inputWrapper.append(
    textarea,
    submit
  );


  form.append(
    avatar,
    inputWrapper
  );


  return form;
}


/* =========================================================
   Events
   ========================================================= */

function initialiseThreadEvents(
  view: HTMLElement,
  thread: PostThreadData
): void {
  const composer =
    view.querySelector<HTMLFormElement>(
      "[data-thread-composer]"
    );


  const textarea =
    composer?.querySelector<HTMLTextAreaElement>(
      ".thread-composer__input"
    );


  const submit =
    composer?.querySelector<HTMLButtonElement>(
      ".thread-composer__submit"
    );


  if (
    composer &&
    textarea &&
    submit
  ) {
    textarea.addEventListener(
      "input",
      () => {
        autoResize(
          textarea
        );

        submit.disabled =
          textarea.value
            .trim()
            .length === 0;
      }
    );


    composer.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        submitReply(
          view,
          thread,
          textarea,
          submit
        );
      }
    );
  }


  view.addEventListener(
    "click",
    (event) => {
      const target =
        event.target as HTMLElement;


      if (
        target.closest(
          '[data-action="post-detail-back"]'
        )
      ) {
        emitBack();

        return;
      }


      const profile =
        target.closest<HTMLElement>(
          "[data-profile-id]"
        );


      if (
        profile &&
        !target.closest(
          "[data-action]"
        )
      ) {
        const profileId =
          profile.dataset.profileId;


        if (profileId) {
          emitProfileOpen(
            profileId
          );
        }


        return;
      }


      const action =
        target.closest<HTMLButtonElement>(
          "[data-action][data-reply-id]"
        );


      if (action) {
        handleReplyAction(
          action
        );
      }
    }
  );
}


/* =========================================================
   Submit reply
   ========================================================= */

function submitReply(
  view: HTMLElement,
  thread: PostThreadData,
  textarea: HTMLTextAreaElement,
  submit: HTMLButtonElement
): void {
  const content =
    textarea.value.trim();


  if (!content) {
    return;
  }


  const temporaryReply:
    PostReply = {
      id:
        createTemporaryId(),

      postId:
        thread.post.id,

      author:
        player,

      content,

      createdAt:
        new Date().toISOString(),

      metrics: {
        replies: 0,
        reposts: 0,
        likes: 0,
      },

      viewerState: {
        liked: false,
        reposted: false,
      },
  };


  const container =
    view.querySelector<HTMLElement>(
      "[data-thread-replies]"
    );


  if (container) {
    const empty =
      container.querySelector(
        ".thread-replies__empty"
      );


    empty?.remove();


    const element =
      createReply(
        temporaryReply
      );


    element.classList.add(
      "is-pending"
    );


    container.append(
      element
    );
  }


  textarea.value = "";

  textarea.style.height =
    "auto";

  submit.disabled = true;


  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:create-reply",
      {
        detail: {
          postId:
            thread.post.id,

          temporaryReplyId:
            temporaryReply.id,

          content,
        },
      }
    )
  );
}


/* =========================================================
   Reply interactions
   ========================================================= */

function handleReplyAction(
  button: HTMLButtonElement
): void {
  const action =
    button.dataset.action;

  const replyId =
    button.dataset.replyId;


  if (
    !action ||
    !replyId
  ) {
    return;
  }


  if (
    action === "like" ||
    action === "repost"
  ) {
    const active =
      button.getAttribute(
        "aria-pressed"
      ) === "true";


    button.setAttribute(
      "aria-pressed",
      active
        ? "false"
        : "true"
    );


    button.classList.toggle(
      "is-active",
      !active
    );
  }


  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:reply-action",
      {
        detail: {
          action,
          replyId,
        },
      }
    )
  );
}


/* =========================================================
   Navigation
   ========================================================= */

function emitBack(): void {
  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:post-detail-back"
    )
  );
}


function emitProfileOpen(
  profileId: string
): void {
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


/* =========================================================
   Missing post
   ========================================================= */

function createMissingPost(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "post-detail-missing";


  const title =
    document.createElement("h1");

  title.textContent =
    "Post unavailable";


  const text =
    document.createElement("p");

  text.textContent =
    "This post could not be found.";


  const back =
    document.createElement("button");

  back.type = "button";

  back.textContent =
    "Go back";

  back.addEventListener(
    "click",
    emitBack
  );


  section.append(
    title,
    text,
    back
  );


  return section;
}


/* =========================================================
   Textarea
   ========================================================= */

function autoResize(
  textarea: HTMLTextAreaElement
): void {
  textarea.style.height =
    "auto";


  textarea.style.height =
    `${Math.min(
      textarea.scrollHeight,
      120
    )}px`;
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
  const difference =
    Math.max(
      0,
      Date.now() -
        new Date(
          isoDate
        ).getTime()
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


/* =========================================================
   Temporary IDs
   ========================================================= */

function createTemporaryId(): string {
  if (
    "randomUUID" in crypto
  ) {
    return `temp_reply_${crypto.randomUUID()}`;
  }


  return (
    `temp_reply_${Date.now()}_` +
    Math.random()
      .toString(36)
      .slice(2)
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
        "1.2"
      );


      svg.append(
        circle
      );
    }
  );


  return svg;
}


function replyIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "M20 15a4 4 0 0 1-4 4H9l-5 3V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4Z"
    )
  );


  return svg;
}


function repostIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "M7 7h10l-3-3m3 3-3 3M17 17H7l3 3m-3-3 3-3"
    )
  );


  return svg;
}


function likeIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
    )
  );


  return svg;
}
