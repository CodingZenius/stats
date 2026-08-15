import type {
  SocialNotification,
  PostAuthor,
} from "../types/social";

/**
 * statuzfree
 * Notifications view.
 *
 * This surface reports events that have already happened in
 * the simulated world.
 *
 * The frontend does not decide why an event occurred. Aura,
 * clout, appeal, relationships, follower growth and world
 * reactions are calculated elsewhere and delivered here as
 * notification data.
 */


/* =========================================================
   Temporary development data
   ========================================================= */

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


const anonymousUser: PostAuthor = {
  id: "anonymous_001",
  displayName: "somebody",
  username: "user481927",
  avatarUrl: null,
  accountType: "anonymous",
};


const notifications: SocialNotification[] = [
  {
    id: "notification_001",

    type: "reply",

    actor: maya,

    message:
      "replied to your post.",

    createdAt:
      "2026-08-15T18:44:00.000Z",

    read: false,

    postId: "post_004",
  },

  {
    id: "notification_002",

    type: "follow",

    actor: daniel,

    message:
      "followed you.",

    createdAt:
      "2026-08-15T18:29:00.000Z",

    read: false,
  },

  {
    id: "notification_003",

    type: "repost",

    actor: campusWire,

    message:
      "reposted your post.",

    createdAt:
      "2026-08-15T17:56:00.000Z",

    read: true,

    postId: "post_004",
  },

  {
    id: "notification_004",

    type: "mention",

    actor: anonymousUser,

    message:
      "mentioned you in a post.",

    createdAt:
      "2026-08-15T17:31:00.000Z",

    read: true,

    postId: "post_005",
  },

  {
    id: "notification_005",

    type: "world_event",

    message:
      "Your name is appearing in more conversations.",

    createdAt:
      "2026-08-15T16:48:00.000Z",

    read: true,
  },

  {
    id: "notification_006",

    type: "relationship",

    actor: maya,

    message:
      "Your relationship with Maya has changed.",

    createdAt:
      "2026-08-15T15:52:00.000Z",

    read: true,
  },

  {
    id: "notification_007",

    type: "like",

    actor: daniel,

    message:
      "liked your post.",

    createdAt:
      "2026-08-15T15:21:00.000Z",

    read: true,

    postId: "post_004",
  },
];


/* =========================================================
   Public renderer
   ========================================================= */

export function renderNotificationsView(
  root: HTMLElement
): void {
  const view =
    document.createElement("section");

  view.className =
    "notifications-view";


  view.append(
    createHeader(),
    createFilterBar(),
    createNotificationList(
      notifications
    )
  );


  initialiseNotificationEvents(
    view
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
    "notifications-header";


  const text =
    document.createElement("div");

  text.className =
    "notifications-header__text";


  const eyebrow =
    document.createElement("span");

  eyebrow.className =
    "notifications-header__eyebrow";

  eyebrow.textContent =
    "ACTIVITY";


  const title =
    document.createElement("h1");

  title.textContent =
    "Notifications";


  const description =
    document.createElement("p");

  description.textContent =
    "See how people and the world are reacting to you.";


  text.append(
    eyebrow,
    title,
    description
  );


  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;


  if (unreadCount > 0) {
    const markRead =
      document.createElement("button");

    markRead.type = "button";

    markRead.className =
      "notifications-header__read";

    markRead.dataset.action =
      "mark-all-read";

    markRead.textContent =
      "Mark all read";


    header.append(
      text,
      markRead
    );

    return header;
  }


  header.append(text);

  return header;
}


/* =========================================================
   Filter bar
   ========================================================= */

function createFilterBar(): HTMLElement {
  const bar =
    document.createElement("div");

  bar.className =
    "notification-filters";

  bar.setAttribute(
    "role",
    "tablist"
  );


  bar.append(
    createFilter(
      "All",
      "all",
      true
    ),

    createFilter(
      "Mentions",
      "mentions",
      false
    )
  );


  return bar;
}


function createFilter(
  label: string,
  value: string,
  active: boolean
): HTMLButtonElement {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "notification-filters__item";

  button.dataset.notificationFilter =
    value;

  button.setAttribute(
    "role",
    "tab"
  );

  button.setAttribute(
    "aria-selected",
    active
      ? "true"
      : "false"
  );


  if (active) {
    button.classList.add(
      "is-active"
    );
  }


  button.textContent =
    label;


  return button;
}


/* =========================================================
   Notification list
   ========================================================= */

function createNotificationList(
  items: SocialNotification[]
): HTMLElement {
  const list =
    document.createElement("div");

  list.className =
    "notification-list";

  list.dataset.notificationList =
    "true";


  if (items.length === 0) {
    list.append(
      createEmptyState()
    );

    return list;
  }


  const sorted =
    [...items].sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    );


  sorted.forEach(
    (notification) => {
      list.append(
        createNotificationRow(
          notification
        )
      );
    }
  );


  return list;
}


/* =========================================================
   Notification row
   ========================================================= */

function createNotificationRow(
  notification: SocialNotification
): HTMLElement {
  const row =
    document.createElement("button");

  row.type = "button";

  row.className =
    "notification-row";

  row.dataset.notificationId =
    notification.id;

  row.dataset.notificationType =
    notification.type;


  if (!notification.read) {
    row.classList.add(
      "is-unread"
    );
  }


  const marker =
    createNotificationMarker(
      notification
    );


  const content =
    document.createElement("div");

  content.className =
    "notification-row__content";


  const message =
    document.createElement("p");

  message.className =
    "notification-row__message";


  if (notification.actor) {
    const actor =
      document.createElement("strong");

    actor.textContent =
      notification.actor.displayName;


    message.append(
      actor,
      document.createTextNode(
        ` ${notification.message}`
      )
    );
  } else {
    message.textContent =
      notification.message;
  }


  const metadata =
    document.createElement("div");

  metadata.className =
    "notification-row__metadata";


  const type =
    document.createElement("span");

  type.textContent =
    getTypeLabel(
      notification.type
    );


  const separator =
    document.createElement("span");

  separator.textContent =
    "·";


  const time =
    document.createElement("time");

  time.dateTime =
    notification.createdAt;

  time.textContent =
    formatRelativeTime(
      notification.createdAt
    );


  metadata.append(
    type,
    separator,
    time
  );


  content.append(
    message,
    metadata
  );


  const unread =
    document.createElement("span");

  unread.className =
    "notification-row__state";

  unread.setAttribute(
    "aria-hidden",
    "true"
  );


  row.append(
    marker,
    content,
    unread
  );


  return row;
}


/* =========================================================
   Notification marker
   ========================================================= */

function createNotificationMarker(
  notification: SocialNotification
): HTMLElement {
  const marker =
    document.createElement("div");

  marker.className =
    "notification-row__marker";


  if (
    notification.actor?.avatarUrl
  ) {
    const image =
      document.createElement("img");

    image.src =
      notification.actor.avatarUrl;

    image.alt = "";

    image.loading =
      "lazy";

    marker.append(image);

    return marker;
  }


  if (notification.actor) {
    const initial =
      document.createElement("span");

    initial.className =
      "notification-row__initial";

    initial.textContent =
      notification.actor
        .displayName
        .trim()
        .charAt(0)
        .toUpperCase();

    marker.append(initial);

    return marker;
  }


  /*
   * World notifications intentionally use a geometric
   * treatment rather than an emoji or badge.
   */

  marker.classList.add(
    "notification-row__marker--world"
  );


  const core =
    document.createElement("span");

  core.className =
    "notification-row__world-core";


  marker.append(core);


  return marker;
}


/* =========================================================
   Empty state
   ========================================================= */

function createEmptyState(): HTMLElement {
  const empty =
    document.createElement("div");

  empty.className =
    "notifications-empty";


  const title =
    document.createElement("h2");

  title.textContent =
    "Nothing new";


  const description =
    document.createElement("p");

  description.textContent =
    "Activity from your world will appear here.";


  empty.append(
    title,
    description
  );


  return empty;
}


/* =========================================================
   Event initialisation
   ========================================================= */

function initialiseNotificationEvents(
  view: HTMLElement
): void {
  view.addEventListener(
    "click",
    (event) => {
      const target =
        event.target as HTMLElement;


      const markAll =
        target.closest<HTMLButtonElement>(
          '[data-action="mark-all-read"]'
        );


      if (markAll) {
        markAllNotificationsRead(
          view,
          markAll
        );

        return;
      }


      const filter =
        target.closest<HTMLButtonElement>(
          "[data-notification-filter]"
        );


      if (filter) {
        selectFilter(
          view,
          filter
        );

        return;
      }


      const notification =
        target.closest<HTMLButtonElement>(
          "[data-notification-id]"
        );


      if (!notification) {
        return;
      }


      openNotification(
        notification
      );
    }
  );
}


/* =========================================================
   Filtering
   ========================================================= */

function selectFilter(
  view: HTMLElement,
  selected: HTMLButtonElement
): void {
  const filters =
    view.querySelectorAll<HTMLButtonElement>(
      "[data-notification-filter]"
    );


  filters.forEach(
    (filter) => {
      const active =
        filter === selected;


      filter.classList.toggle(
        "is-active",
        active
      );


      filter.setAttribute(
        "aria-selected",
        active
          ? "true"
          : "false"
      );
    }
  );


  const value =
    selected.dataset
      .notificationFilter;


  const rows =
    view.querySelectorAll<HTMLElement>(
      "[data-notification-type]"
    );


  rows.forEach(
    (row) => {
      if (
        value === "all"
      ) {
        row.hidden = false;

        return;
      }


      if (
        value === "mentions"
      ) {
        row.hidden =
          row.dataset
            .notificationType !==
          "mention" &&
          row.dataset
            .notificationType !==
          "reply";
      }
    }
  );
}


/* =========================================================
   Mark all read
   ========================================================= */

function markAllNotificationsRead(
  view: HTMLElement,
  button: HTMLButtonElement
): void {
  const unread =
    view.querySelectorAll<HTMLElement>(
      ".notification-row.is-unread"
    );


  unread.forEach(
    (row) => {
      row.classList.remove(
        "is-unread"
      );
    }
  );


  button.remove();


  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:notifications-read"
    )
  );
}


/* =========================================================
   Opening a notification
   ========================================================= */

function openNotification(
  row: HTMLButtonElement
): void {
  const notificationId =
    row.dataset.notificationId;


  if (!notificationId) {
    return;
  }


  const notification =
    notifications.find(
      (item) =>
        item.id ===
        notificationId
    );


  if (!notification) {
    return;
  }


  row.classList.remove(
    "is-unread"
  );


  if (notification.postId) {
    document.dispatchEvent(
      new CustomEvent(
        "statuzfree:open-post",
        {
          detail: {
            postId:
              notification.postId,
          },
        }
      )
    );

    return;
  }


  if (notification.actor) {
    document.dispatchEvent(
      new CustomEvent(
        "statuzfree:open-profile",
        {
          detail: {
            profileId:
              notification.actor.id,
          },
        }
      )
    );

    return;
  }


  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:open-world-event",
      {
        detail: {
          notificationId:
            notification.id,
        },
      }
    )
  );
}


/* =========================================================
   Labels
   ========================================================= */

function getTypeLabel(
  type: SocialNotification["type"]
): string {
  switch (type) {
    case "reply":
      return "Reply";

    case "mention":
      return "Mention";

    case "like":
      return "Like";

    case "repost":
      return "Repost";

    case "follow":
      return "Follow";

    case "relationship":
      return "Relationship";

    case "world_event":
      return "World";

    default:
      return "Activity";
  }
}


/* =========================================================
   Relative time
   ========================================================= */

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
