import type {
  ConversationSummary,
  DirectMessage,
  PostAuthor,
} from "../types/social";

/**
 * statuzfree
 * Messages view.
 *
 * This surface renders conversations between the player and
 * simulated characters.
 *
 * The frontend owns only presentation and user interaction.
 * AI responses, relationship effects, moderation decisions,
 * persistence and world-state updates belong to backend
 * services.
 */


/* =========================================================
   Temporary development types
   ========================================================= */

interface MockConversation {
  summary: ConversationSummary;
  participant: PostAuthor;
  messages: DirectMessage[];
}


/* =========================================================
   Temporary development data
   ========================================================= */

const conversations: MockConversation[] = [
  {
    participant: {
      id: "char_maya_001",
      displayName: "Maya Collins",
      username: "mayacollins",
      avatarUrl: null,
      accountType: "character",
    },

    summary: {
      id: "conversation_maya_001",

      participant: {
        id: "char_maya_001",
        displayName: "Maya Collins",
        username: "mayacollins",
        avatarUrl: null,
        accountType: "character",
      },

      lastMessage:
        "You really thought posting that was a good idea?",

      lastMessageAt:
        "2026-08-15T18:41:00.000Z",

      unreadCount: 2,
    },

    messages: [
      {
        id: "message_maya_001",
        conversationId: "conversation_maya_001",
        senderId: "char_maya_001",
        content:
          "You really thought posting that was a good idea?",
        createdAt:
          "2026-08-15T18:41:00.000Z",
      },
    ],
  },

  {
    participant: {
      id: "char_daniel_001",
      displayName: "Daniel Cole",
      username: "danielcole",
      avatarUrl: null,
      accountType: "character",
    },

    summary: {
      id: "conversation_daniel_001",

      participant: {
        id: "char_daniel_001",
        displayName: "Daniel Cole",
        username: "danielcole",
        avatarUrl: null,
        accountType: "character",
      },

      lastMessage:
        "I'm telling you, people are already talking.",

      lastMessageAt:
        "2026-08-15T17:58:00.000Z",

      unreadCount: 0,
    },

    messages: [
      {
        id: "message_daniel_001",
        conversationId:
          "conversation_daniel_001",
        senderId:
          "char_daniel_001",
        content:
          "I'm telling you, people are already talking.",
        createdAt:
          "2026-08-15T17:58:00.000Z",
      },
    ],
  },

  {
    participant: {
      id: "ambient_lena_001",
      displayName: "Lena",
      username: "lenawho",
      avatarUrl: null,
      accountType: "ambient",
    },

    summary: {
      id: "conversation_lena_001",

      participant: {
        id: "ambient_lena_001",
        displayName: "Lena",
        username: "lenawho",
        avatarUrl: null,
        accountType: "ambient",
      },

      lastMessage:
        "Wait, are you actually going tonight?",

      lastMessageAt:
        "2026-08-15T16:20:00.000Z",

      unreadCount: 1,
    },

    messages: [
      {
        id: "message_lena_001",
        conversationId:
          "conversation_lena_001",
        senderId:
          "ambient_lena_001",
        content:
          "Wait, are you actually going tonight?",
        createdAt:
          "2026-08-15T16:20:00.000Z",
      },
    ],
  },
];


/* =========================================================
   Public renderer
   ========================================================= */

export function renderMessagesView(
  root: HTMLElement
): void {
  const view =
    document.createElement("section");

  view.className = "messages-view";

  view.append(
    createMessagesHeader(),
    createConversationList()
  );

  initialiseMessageEvents(view);

  root.replaceChildren(view);
}


/* =========================================================
   Header
   ========================================================= */

function createMessagesHeader(): HTMLElement {
  const header =
    document.createElement("header");

  header.className =
    "messages-header";

  const text =
    document.createElement("div");

  text.className =
    "messages-header__text";

  const eyebrow =
    document.createElement("span");

  eyebrow.className =
    "messages-header__eyebrow";

  eyebrow.textContent =
    "PRIVATE";

  const title =
    document.createElement("h1");

  title.textContent =
    "Messages";

  const description =
    document.createElement("p");

  description.textContent =
    "Private conversations from your world.";

  text.append(
    eyebrow,
    title,
    description
  );

  const newMessage =
    document.createElement("button");

  newMessage.type = "button";

  newMessage.className =
    "messages-header__new";

  newMessage.dataset.action =
    "new-message";

  newMessage.setAttribute(
    "aria-label",
    "Start new conversation"
  );

  newMessage.append(
    composeIcon()
  );

  header.append(
    text,
    newMessage
  );

  return header;
}


/* =========================================================
   Conversation list
   ========================================================= */

function createConversationList(): HTMLElement {
  const container =
    document.createElement("div");

  container.className =
    "conversation-list";

  if (
    conversations.length === 0
  ) {
    container.append(
      createEmptyMessagesState()
    );

    return container;
  }

  const sorted =
    [...conversations].sort(
      (a, b) =>
        new Date(
          b.summary.lastMessageAt
        ).getTime() -
        new Date(
          a.summary.lastMessageAt
        ).getTime()
    );

  sorted.forEach(
    (conversation) => {
      container.append(
        createConversationRow(
          conversation
        )
      );
    }
  );

  return container;
}


/* =========================================================
   Conversation row
   ========================================================= */

function createConversationRow(
  conversation: MockConversation
): HTMLElement {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "conversation-row";

  button.dataset.conversationId =
    conversation.summary.id;

  button.setAttribute(
    "aria-label",
    `Open conversation with ${conversation.participant.displayName}`
  );

  const avatar =
    createAvatar(
      conversation.participant
    );

  const body =
    document.createElement("div");

  body.className =
    "conversation-row__body";

  const top =
    document.createElement("div");

  top.className =
    "conversation-row__top";

  const identity =
    document.createElement("div");

  identity.className =
    "conversation-row__identity";

  const name =
    document.createElement("strong");

  name.className =
    "conversation-row__name";

  name.textContent =
    conversation.participant.displayName;

  const username =
    document.createElement("span");

  username.className =
    "conversation-row__username";

  username.textContent =
    `@${conversation.participant.username}`;

  identity.append(
    name,
    username
  );

  const time =
    document.createElement("time");

  time.className =
    "conversation-row__time";

  time.dateTime =
    conversation.summary.lastMessageAt;

  time.textContent =
    formatRelativeTime(
      conversation.summary.lastMessageAt
    );

  top.append(
    identity,
    time
  );

  const bottom =
    document.createElement("div");

  bottom.className =
    "conversation-row__bottom";

  const preview =
    document.createElement("p");

  preview.className =
    "conversation-row__preview";

  preview.textContent =
    conversation.summary.lastMessage;

  bottom.append(preview);

  if (
    conversation.summary.unreadCount > 0
  ) {
    const unread =
      document.createElement("span");

    unread.className =
      "conversation-row__unread";

    unread.textContent =
      conversation.summary.unreadCount.toString();

    unread.setAttribute(
      "aria-label",
      `${conversation.summary.unreadCount} unread messages`
    );

    bottom.append(unread);

    button.classList.add(
      "has-unread"
    );
  }

  body.append(
    top,
    bottom
  );

  button.append(
    avatar,
    body
  );

  return button;
}


/* =========================================================
   Avatar
   ========================================================= */

function createAvatar(
  participant: PostAuthor
): HTMLElement {
  const avatar =
    document.createElement("div");

  avatar.className =
    "conversation-row__avatar";

  if (
    participant.avatarUrl
  ) {
    const image =
      document.createElement("img");

    image.src =
      participant.avatarUrl;

    image.alt =
      `${participant.displayName} profile picture`;

    image.loading =
      "lazy";

    avatar.append(image);

    return avatar;
  }

  const initial =
    document.createElement("span");

  initial.textContent =
    participant.displayName
      .trim()
      .charAt(0)
      .toUpperCase();

  avatar.append(initial);

  return avatar;
}


/* =========================================================
   Empty state
   ========================================================= */

function createEmptyMessagesState(): HTMLElement {
  const empty =
    document.createElement("div");

  empty.className =
    "messages-empty";

  const title =
    document.createElement("h2");

  title.textContent =
    "No conversations yet";

  const description =
    document.createElement("p");

  description.textContent =
    "Private conversations will appear here when you start talking to people.";

  empty.append(
    title,
    description
  );

  return empty;
}


/* =========================================================
   Event handling
   ========================================================= */

function initialiseMessageEvents(
  view: HTMLElement
): void {
  view.addEventListener(
    "click",
    (event) => {
      const target =
        event.target as HTMLElement;

      const newMessage =
        target.closest<HTMLButtonElement>(
          '[data-action="new-message"]'
        );

      if (newMessage) {
        emitNewConversation();

        return;
      }

      const conversation =
        target.closest<HTMLButtonElement>(
          "[data-conversation-id]"
        );

      if (!conversation) {
        return;
      }

      const conversationId =
        conversation.dataset
          .conversationId;

      if (!conversationId) {
        return;
      }

      emitConversationOpen(
        conversationId
      );
    }
  );
}


/* =========================================================
   Conversation events
   ========================================================= */

function emitConversationOpen(
  conversationId: string
): void {
  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:open-conversation",
      {
        detail: {
          conversationId,
        },
      }
    )
  );
}


function emitNewConversation(): void {
  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:new-conversation"
    )
  );
}


/* =========================================================
   Formatting
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


function composeIcon(): SVGSVGElement {
  const svg =
    createSvg();

  svg.append(
    createPath(
      "M5 19h4L19 9l-4-4L5 15v4Z"
    ),
    createPath(
      "m13.5 6.5 4 4"
    )
  );

  return svg;
}
