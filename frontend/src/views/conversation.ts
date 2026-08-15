import type {
  DirectMessage,
  PostAuthor,
} from "../types/social";

/**
 * statuzfree
 * Direct conversation view.
 *
 * This component owns the presentation of a private
 * conversation only.
 *
 * It does not know which LLM provider generates character
 * replies. Eventually:
 *
 * frontend
 *     -> social API
 *     -> conversation service
 *     -> world context
 *     -> llm-adapter
 *     -> Gemini / NVIDIA NIM / Cloudflare
 *
 * The frontend therefore remains unchanged when providers
 * or models are swapped.
 */


/* =========================================================
   Local types
   ========================================================= */

interface ConversationData {
  id: string;
  participant: PostAuthor;
  messages: DirectMessage[];
}


/* =========================================================
   Temporary player
   ========================================================= */

const PLAYER_ID =
  "user_player_001";


/* =========================================================
   Temporary development conversations
   ========================================================= */

const mockConversations:
  Record<string, ConversationData> = {
    conversation_maya_001: {
      id: "conversation_maya_001",

      participant: {
        id: "char_maya_001",
        displayName: "Maya Collins",
        username: "mayacollins",
        avatarUrl: null,
        accountType: "character",
      },

      messages: [
        {
          id: "maya_message_001",
          conversationId:
            "conversation_maya_001",

          senderId:
            "user_player_001",

          content:
            "You saw the post?",

          createdAt:
            "2026-08-15T18:37:00.000Z",
        },

        {
          id: "maya_message_002",
          conversationId:
            "conversation_maya_001",

          senderId:
            "char_maya_001",

          content:
            "Obviously. Everyone saw it.",

          createdAt:
            "2026-08-15T18:38:00.000Z",
        },

        {
          id: "maya_message_003",
          conversationId:
            "conversation_maya_001",

          senderId:
            "user_player_001",

          content:
            "It wasn't even that serious.",

          createdAt:
            "2026-08-15T18:39:00.000Z",
        },

        {
          id: "maya_message_004",
          conversationId:
            "conversation_maya_001",

          senderId:
            "char_maya_001",

          content:
            "You really thought posting that was a good idea?",

          createdAt:
            "2026-08-15T18:41:00.000Z",
        },
      ],
    },


    conversation_daniel_001: {
      id: "conversation_daniel_001",

      participant: {
        id: "char_daniel_001",
        displayName: "Daniel Cole",
        username: "danielcole",
        avatarUrl: null,
        accountType: "character",
      },

      messages: [
        {
          id: "daniel_message_001",
          conversationId:
            "conversation_daniel_001",

          senderId:
            "char_daniel_001",

          content:
            "You around?",

          createdAt:
            "2026-08-15T17:51:00.000Z",
        },

        {
          id: "daniel_message_002",
          conversationId:
            "conversation_daniel_001",

          senderId:
            "user_player_001",

          content:
            "Yeah. What's up?",

          createdAt:
            "2026-08-15T17:54:00.000Z",
        },

        {
          id: "daniel_message_003",
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


    conversation_lena_001: {
      id: "conversation_lena_001",

      participant: {
        id: "ambient_lena_001",
        displayName: "Lena",
        username: "lenawho",
        avatarUrl: null,
        accountType: "ambient",
      },

      messages: [
        {
          id: "lena_message_001",
          conversationId:
            "conversation_lena_001",

          senderId:
            "user_player_001",

          content:
            "I might show up later.",

          createdAt:
            "2026-08-15T16:17:00.000Z",
        },

        {
          id: "lena_message_002",
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
  };


/* =========================================================
   Public renderer
   ========================================================= */

export function renderConversationView(
  root: HTMLElement,
  conversationId: string
): void {
  const conversation =
    mockConversations[
      conversationId
    ];

  if (!conversation) {
    root.replaceChildren(
      createMissingConversation()
    );

    return;
  }

  const view =
    document.createElement("section");

  view.className =
    "conversation-view";

  view.dataset.conversationId =
    conversation.id;

  view.append(
    createHeader(conversation),
    createMessageTimeline(conversation),
    createMessageComposer(conversation)
  );

  root.replaceChildren(view);

  initialiseConversation(
    view,
    conversation
  );

  scrollToLatestMessage(view);
}


/* =========================================================
   Header
   ========================================================= */

function createHeader(
  conversation: ConversationData
): HTMLElement {
  const header =
    document.createElement("header");

  header.className =
    "conversation-header";

  const back =
    document.createElement("button");

  back.type = "button";

  back.className =
    "conversation-header__back";

  back.dataset.action =
    "conversation-back";

  back.setAttribute(
    "aria-label",
    "Back to messages"
  );

  back.append(
    backIcon()
  );


  const profile =
    document.createElement("button");

  profile.type = "button";

  profile.className =
    "conversation-header__profile";

  profile.dataset.profileId =
    conversation.participant.id;


  const avatar =
    createParticipantAvatar(
      conversation.participant
    );


  const identity =
    document.createElement("div");

  identity.className =
    "conversation-header__identity";


  const name =
    document.createElement("strong");

  name.className =
    "conversation-header__name";

  name.textContent =
    conversation.participant
      .displayName;


  const username =
    document.createElement("span");

  username.className =
    "conversation-header__username";

  username.textContent =
    `@${conversation.participant.username}`;


  identity.append(
    name,
    username
  );


  profile.append(
    avatar,
    identity
  );


  const options =
    document.createElement("button");

  options.type = "button";

  options.className =
    "conversation-header__options";

  options.dataset.action =
    "conversation-options";

  options.setAttribute(
    "aria-label",
    "Conversation options"
  );

  options.append(
    moreIcon()
  );


  header.append(
    back,
    profile,
    options
  );

  return header;
}


/* =========================================================
   Participant avatar
   ========================================================= */

function createParticipantAvatar(
  participant: PostAuthor
): HTMLElement {
  const avatar =
    document.createElement("div");

  avatar.className =
    "conversation-header__avatar";


  if (participant.avatarUrl) {
    const image =
      document.createElement("img");

    image.src =
      participant.avatarUrl;

    image.alt =
      `${participant.displayName} profile picture`;

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
   Message timeline
   ========================================================= */

function createMessageTimeline(
  conversation: ConversationData
): HTMLElement {
  const timeline =
    document.createElement("div");

  timeline.className =
    "conversation-timeline";

  timeline.dataset.messageTimeline =
    "true";

  timeline.setAttribute(
    "aria-label",
    `Conversation with ${conversation.participant.displayName}`
  );


  const introduction =
    createConversationIntroduction(
      conversation.participant
    );

  timeline.append(
    introduction
  );


  const messages =
    [...conversation.messages].sort(
      (a, b) =>
        new Date(
          a.createdAt
        ).getTime() -
        new Date(
          b.createdAt
        ).getTime()
    );


  let previousMessage:
    DirectMessage | null = null;


  messages.forEach(
    (message) => {
      const messageElement =
        createMessage(
          message,
          previousMessage
        );

      timeline.append(
        messageElement
      );

      previousMessage =
        message;
    }
  );


  return timeline;
}


/* =========================================================
   Conversation introduction
   ========================================================= */

function createConversationIntroduction(
  participant: PostAuthor
): HTMLElement {
  const introduction =
    document.createElement("div");

  introduction.className =
    "conversation-introduction";


  const avatar =
    document.createElement("div");

  avatar.className =
    "conversation-introduction__avatar";


  if (participant.avatarUrl) {
    const image =
      document.createElement("img");

    image.src =
      participant.avatarUrl;

    image.alt = "";

    avatar.append(image);
  } else {
    const initial =
      document.createElement("span");

    initial.textContent =
      participant.displayName
        .trim()
        .charAt(0)
        .toUpperCase();

    avatar.append(initial);
  }


  const name =
    document.createElement("strong");

  name.textContent =
    participant.displayName;


  const username =
    document.createElement("span");

  username.textContent =
    `@${participant.username}`;


  const description =
    document.createElement("p");

  description.textContent =
    `This is the beginning of your conversation with ${participant.displayName}.`;


  introduction.append(
    avatar,
    name,
    username,
    description
  );

  return introduction;
}


/* =========================================================
   Message
   ========================================================= */

function createMessage(
  message: DirectMessage,
  previousMessage:
    DirectMessage | null
): HTMLElement {
  const outgoing =
    message.senderId ===
    PLAYER_ID;


  const wrapper =
    document.createElement("div");

  wrapper.className =
    "conversation-message";

  wrapper.classList.add(
    outgoing
      ? "conversation-message--outgoing"
      : "conversation-message--incoming"
  );

  wrapper.dataset.messageId =
    message.id;


  if (
    shouldSeparateMessages(
      message,
      previousMessage
    )
  ) {
    wrapper.classList.add(
      "conversation-message--separated"
    );
  }


  const bubble =
    document.createElement("div");

  bubble.className =
    "conversation-message__bubble";


  const content =
    document.createElement("p");

  content.className =
    "conversation-message__content";

  content.textContent =
    message.content;


  const time =
    document.createElement("time");

  time.className =
    "conversation-message__time";

  time.dateTime =
    message.createdAt;

  time.textContent =
    formatMessageTime(
      message.createdAt
    );


  bubble.append(
    content
  );


  wrapper.append(
    bubble,
    time
  );


  return wrapper;
}


/* =========================================================
   Message grouping
   ========================================================= */

function shouldSeparateMessages(
  current: DirectMessage,
  previous: DirectMessage | null
): boolean {
  if (!previous) {
    return true;
  }


  if (
    current.senderId !==
    previous.senderId
  ) {
    return true;
  }


  const currentTime =
    new Date(
      current.createdAt
    ).getTime();

  const previousTime =
    new Date(
      previous.createdAt
    ).getTime();


  return (
    currentTime -
    previousTime
  ) > 5 * 60_000;
}


/* =========================================================
   Message composer
   ========================================================= */

function createMessageComposer(
  conversation: ConversationData
): HTMLElement {
  const composer =
    document.createElement("form");

  composer.className =
    "message-composer";

  composer.dataset.messageComposer =
    "true";


  const inputWrapper =
    document.createElement("div");

  inputWrapper.className =
    "message-composer__input-wrapper";


  const textarea =
    document.createElement("textarea");

  textarea.className =
    "message-composer__input";

  textarea.rows = 1;

  textarea.maxLength =
    1000;

  textarea.placeholder =
    `Message ${conversation.participant.displayName}`;

  textarea.setAttribute(
    "aria-label",
    `Message ${conversation.participant.displayName}`
  );


  const send =
    document.createElement("button");

  send.type = "submit";

  send.className =
    "message-composer__send";

  send.disabled = true;

  send.setAttribute(
    "aria-label",
    "Send message"
  );

  send.append(
    sendIcon()
  );


  inputWrapper.append(
    textarea,
    send
  );


  composer.append(
    inputWrapper
  );


  return composer;
}


/* =========================================================
   Initialisation
   ========================================================= */

function initialiseConversation(
  view: HTMLElement,
  conversation: ConversationData
): void {
  const composer =
    view.querySelector<HTMLFormElement>(
      "[data-message-composer]"
    );

  const textarea =
    composer?.querySelector<HTMLTextAreaElement>(
      ".message-composer__input"
    );

  const send =
    composer?.querySelector<HTMLButtonElement>(
      ".message-composer__send"
    );


  if (
    composer &&
    textarea &&
    send
  ) {
    textarea.addEventListener(
      "input",
      () => {
        autoResizeTextarea(
          textarea
        );

        send.disabled =
          textarea.value
            .trim()
            .length === 0;
      }
    );


    textarea.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key !== "Enter"
        ) {
          return;
        }

        if (
          event.shiftKey
        ) {
          return;
        }

        event.preventDefault();

        if (
          textarea.value
            .trim()
            .length === 0
        ) {
          return;
        }

        submitMessage(
          view,
          conversation,
          textarea,
          send
        );
      }
    );


    composer.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        submitMessage(
          view,
          conversation,
          textarea,
          send
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
          '[data-action="conversation-back"]'
        )
      ) {
        emitConversationBack();

        return;
      }


      const profile =
        target.closest<HTMLElement>(
          "[data-profile-id]"
        );

      if (profile) {
        const profileId =
          profile.dataset.profileId;

        if (profileId) {
          emitProfileOpen(
            profileId
          );
        }

        return;
      }


      if (
        target.closest(
          '[data-action="conversation-options"]'
        )
      ) {
        emitConversationOptions(
          conversation.id
        );
      }
    }
  );
}


/* =========================================================
   Sending messages
   ========================================================= */

function submitMessage(
  view: HTMLElement,
  conversation: ConversationData,
  textarea: HTMLTextAreaElement,
  send: HTMLButtonElement
): void {
  const content =
    textarea.value.trim();


  if (!content) {
    return;
  }


  const temporaryMessage:
    DirectMessage = {
      id:
        createTemporaryMessageId(),

      conversationId:
        conversation.id,

      senderId:
        PLAYER_ID,

      content,

      createdAt:
        new Date().toISOString(),
  };


  appendOutgoingMessage(
    view,
    temporaryMessage
  );


  textarea.value = "";

  textarea.style.height =
    "auto";

  send.disabled = true;


  /*
   * This event is the future API boundary.
   *
   * The application layer will listen for it and send the
   * message to the backend.
   *
   * The frontend never calls Gemini, NIM or Cloudflare
   * directly.
   */

  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:send-message",
      {
        detail: {
          conversationId:
            conversation.id,

          participantId:
            conversation.participant.id,

          temporaryMessageId:
            temporaryMessage.id,

          content,
        },
      }
    )
  );
}


/* =========================================================
   Optimistic message
   ========================================================= */

function appendOutgoingMessage(
  view: HTMLElement,
  message: DirectMessage
): void {
  const timeline =
    view.querySelector<HTMLElement>(
      "[data-message-timeline]"
    );


  if (!timeline) {
    return;
  }


  const existing =
    timeline.querySelectorAll<HTMLElement>(
      ".conversation-message"
    );


  const last =
    existing.length > 0
      ? existing[
          existing.length - 1
        ]
      : null;


  const previousSender =
    last?.classList.contains(
      "conversation-message--outgoing"
    )
      ? PLAYER_ID
      : null;


  const previous:
    DirectMessage | null =
      previousSender
        ? {
            id: "",
            conversationId:
              message.conversationId,
            senderId:
              previousSender,
            content: "",
            createdAt:
              new Date().toISOString(),
          }
        : null;


  const element =
    createMessage(
      message,
      previous
    );


  element.classList.add(
    "is-pending"
  );


  timeline.append(
    element
  );


  scrollToLatestMessage(
    view
  );
}


/* =========================================================
   Public incoming-message helper
   ========================================================= */

/**
 * Later the API layer can call this when a character response
 * arrives.
 *
 * The source of that response remains irrelevant to this
 * component.
 */

export function appendConversationMessage(
  message: DirectMessage
): void {
  const view =
    document.querySelector<HTMLElement>(
      `.conversation-view[data-conversation-id="${message.conversationId}"]`
    );


  if (!view) {
    return;
  }


  const timeline =
    view.querySelector<HTMLElement>(
      "[data-message-timeline]"
    );


  if (!timeline) {
    return;
  }


  timeline.append(
    createMessage(
      message,
      null
    )
  );


  scrollToLatestMessage(
    view
  );
}


/* =========================================================
   Pending message acknowledgement
   ========================================================= */

export function confirmConversationMessage(
  temporaryMessageId: string,
  message: DirectMessage
): void {
  const temporary =
    document.querySelector<HTMLElement>(
      `[data-message-id="${temporaryMessageId}"]`
    );


  if (!temporary) {
    return;
  }


  const confirmed =
    createMessage(
      message,
      null
    );


  temporary.replaceWith(
    confirmed
  );
}


/* =========================================================
   Navigation events
   ========================================================= */

function emitConversationBack(): void {
  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:conversation-back"
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


function emitConversationOptions(
  conversationId: string
): void {
  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:conversation-options",
      {
        detail: {
          conversationId,
        },
      }
    )
  );
}


/* =========================================================
   Missing conversation
   ========================================================= */

function createMissingConversation(): HTMLElement {
  const missing =
    document.createElement("section");

  missing.className =
    "conversation-missing";


  const title =
    document.createElement("h1");

  title.textContent =
    "Conversation unavailable";


  const description =
    document.createElement("p");

  description.textContent =
    "This conversation could not be found.";


  const back =
    document.createElement("button");

  back.type = "button";

  back.textContent =
    "Back to messages";


  back.addEventListener(
    "click",
    emitConversationBack
  );


  missing.append(
    title,
    description,
    back
  );


  return missing;
}


/* =========================================================
   Scrolling
   ========================================================= */

function scrollToLatestMessage(
  view: HTMLElement
): void {
  const timeline =
    view.querySelector<HTMLElement>(
      "[data-message-timeline]"
    );


  if (!timeline) {
    return;
  }


  requestAnimationFrame(
    () => {
      timeline.scrollTop =
        timeline.scrollHeight;
    }
  );
}


/* =========================================================
   Textarea
   ========================================================= */

function autoResizeTextarea(
  textarea: HTMLTextAreaElement
): void {
  textarea.style.height =
    "auto";


  textarea.style.height =
    `${Math.min(
      textarea.scrollHeight,
      130
    )}px`;
}


/* =========================================================
   Formatting
   ========================================================= */

function formatMessageTime(
  isoDate: string
): string {
  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
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

function createTemporaryMessageId(): string {
  if (
    "randomUUID" in crypto
  ) {
    return `temp_${crypto.randomUUID()}`;
  }


  return (
    `temp_${Date.now()}_` +
    Math.random()
      .toString(36)
      .slice(2)
  );
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


      svg.append(
        circle
      );
    }
  );


  return svg;
}


function sendIcon(): SVGSVGElement {
  const svg =
    createSvg();


  svg.append(
    createPath(
      "M5 12h13m-5-5 5 5-5 5"
    )
  );


  return svg;
}
