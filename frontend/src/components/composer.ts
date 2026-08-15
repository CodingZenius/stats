import type {
  CreatePostRequest,
} from "../types/social";

/**
 * statuzfree
 * Post composer.
 *
 * This component collects the player's post and emits a
 * frontend event containing a CreatePostRequest.
 *
 * It does not advance the simulation day, calculate stats,
 * create NPC reactions or communicate with an LLM.
 */


/* =========================================================
   Configuration
   ========================================================= */

const MAX_POST_LENGTH = 500;


/* =========================================================
   Public API
   ========================================================= */

export function openComposer(): void {
  if (
    document.querySelector(
      ".composer-overlay"
    )
  ) {
    return;
  }

  const composer =
    createComposer();

  document.body.append(composer);

  requestAnimationFrame(() => {
    composer.classList.add(
      "is-visible"
    );

    const textarea =
      composer.querySelector<HTMLTextAreaElement>(
        ".composer__textarea"
      );

    textarea?.focus();
  });
}


export function closeComposer(): void {
  const overlay =
    document.querySelector<HTMLElement>(
      ".composer-overlay"
    );

  if (!overlay) {
    return;
  }

  overlay.classList.remove(
    "is-visible"
  );

  window.setTimeout(() => {
    overlay.remove();
  }, 180);
}


/* =========================================================
   Composer construction
   ========================================================= */

function createComposer(): HTMLElement {
  const overlay =
    document.createElement("div");

  overlay.className =
    "composer-overlay";

  overlay.setAttribute(
    "role",
    "presentation"
  );

  const panel =
    document.createElement("section");

  panel.className = "composer";

  panel.setAttribute(
    "role",
    "dialog"
  );

  panel.setAttribute(
    "aria-modal",
    "true"
  );

  panel.setAttribute(
    "aria-labelledby",
    "composer-title"
  );

  panel.append(
    createHeader(),
    createBody(),
    createFooter()
  );

  overlay.append(panel);

  initialiseComposer(
    overlay,
    panel
  );

  return overlay;
}


/* =========================================================
   Header
   ========================================================= */

function createHeader(): HTMLElement {
  const header =
    document.createElement("header");

  header.className =
    "composer__header";

  const closeButton =
    document.createElement("button");

  closeButton.type = "button";

  closeButton.className =
    "composer__close";

  closeButton.dataset.action =
    "close-composer";

  closeButton.setAttribute(
    "aria-label",
    "Close composer"
  );

  closeButton.append(
    closeIcon()
  );

  const title =
    document.createElement("h2");

  title.id = "composer-title";
  title.className =
    "composer__title";

  title.textContent =
    "New post";

  const spacer =
    document.createElement("div");

  spacer.className =
    "composer__header-spacer";

  header.append(
    closeButton,
    title,
    spacer
  );

  return header;
}


/* =========================================================
   Body
   ========================================================= */

function createBody(): HTMLElement {
  const body =
    document.createElement("div");

  body.className =
    "composer__body";

  const avatar =
    document.createElement("div");

  avatar.className =
    "composer__avatar";

  /*
   * Temporary player avatar.
   *
   * This will later be populated from the player's profile
   * returned by the frontend API.
   */

  const initial =
    document.createElement("span");

  initial.textContent = "A";

  initial.setAttribute(
    "aria-hidden",
    "true"
  );

  avatar.append(initial);

  const editor =
    document.createElement("div");

  editor.className =
    "composer__editor";

  const identity =
    document.createElement("div");

  identity.className =
    "composer__identity";

  const displayName =
    document.createElement("span");

  displayName.className =
    "composer__display-name";

  displayName.textContent =
    "Alex Mercer";

  const username =
    document.createElement("span");

  username.className =
    "composer__username";

  username.textContent =
    "@alexm";

  identity.append(
    displayName,
    username
  );

  const textarea =
    document.createElement("textarea");

  textarea.className =
    "composer__textarea";

  textarea.name = "post";

  textarea.placeholder =
    "What's happening?";

  textarea.maxLength =
    MAX_POST_LENGTH;

  textarea.rows = 1;

  textarea.setAttribute(
    "aria-label",
    "Post content"
  );

  editor.append(
    identity,
    textarea
  );

  body.append(
    avatar,
    editor
  );

  return body;
}


/* =========================================================
   Footer
   ========================================================= */

function createFooter(): HTMLElement {
  const footer =
    document.createElement("footer");

  footer.className =
    "composer__footer";

  const tools =
    document.createElement("div");

  tools.className =
    "composer__tools";

  const mediaButton =
    createToolButton(
      "Add media",
      "media",
      mediaIcon()
    );

  const gifButton =
    createToolButton(
      "Add GIF",
      "gif",
      gifIcon()
    );

  tools.append(
    mediaButton,
    gifButton
  );

  const controls =
    document.createElement("div");

  controls.className =
    "composer__controls";

  const counter =
    document.createElement("span");

  counter.className =
    "composer__counter";

  counter.dataset.composerCounter =
    "true";

  counter.textContent =
    `${MAX_POST_LENGTH}`;

  const postButton =
    document.createElement("button");

  postButton.type = "button";

  postButton.className =
    "composer__submit";

  postButton.dataset.action =
    "submit-post";

  postButton.textContent =
    "Post";

  postButton.disabled = true;

  controls.append(
    counter,
    postButton
  );

  footer.append(
    tools,
    controls
  );

  return footer;
}


/* =========================================================
   Tool buttons
   ========================================================= */

function createToolButton(
  label: string,
  action: string,
  icon: SVGSVGElement
): HTMLButtonElement {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "composer__tool";

  button.dataset.action =
    action;

  button.setAttribute(
    "aria-label",
    label
  );

  button.append(icon);

  return button;
}


/* =========================================================
   Behaviour
   ========================================================= */

function initialiseComposer(
  overlay: HTMLElement,
  panel: HTMLElement
): void {
  const textarea =
    panel.querySelector<HTMLTextAreaElement>(
      ".composer__textarea"
    );

  const submit =
    panel.querySelector<HTMLButtonElement>(
      '[data-action="submit-post"]'
    );

  const close =
    panel.querySelector<HTMLButtonElement>(
      '[data-action="close-composer"]'
    );

  const counter =
    panel.querySelector<HTMLElement>(
      "[data-composer-counter]"
    );

  if (
    !textarea ||
    !submit ||
    !close ||
    !counter
  ) {
    throw new Error(
      "Composer could not initialise."
    );
  }

  textarea.addEventListener(
    "input",
    () => {
      handleInput(
        textarea,
        submit,
        counter
      );
    }
  );

  submit.addEventListener(
    "click",
    () => {
      submitPost(textarea);
    }
  );

  close.addEventListener(
    "click",
    closeComposer
  );

  overlay.addEventListener(
    "click",
    (event) => {
      if (
        event.target === overlay
      ) {
        closeComposer();
      }
    }
  );

  document.addEventListener(
    "keydown",
    handleEscape,
    {
      once: false,
    }
  );
}


/* =========================================================
   Input handling
   ========================================================= */

function handleInput(
  textarea: HTMLTextAreaElement,
  submit: HTMLButtonElement,
  counter: HTMLElement
): void {
  autoResize(textarea);

  const content =
    textarea.value;

  const remaining =
    MAX_POST_LENGTH -
    content.length;

  counter.textContent =
    `${remaining}`;

  counter.classList.toggle(
    "is-low",
    remaining <= 50
  );

  counter.classList.toggle(
    "is-critical",
    remaining <= 15
  );

  submit.disabled =
    content.trim().length === 0;
}


function autoResize(
  textarea: HTMLTextAreaElement
): void {
  textarea.style.height =
    "auto";

  textarea.style.height =
    `${Math.min(
      textarea.scrollHeight,
      240
    )}px`;
}


/* =========================================================
   Submission
   ========================================================= */

function submitPost(
  textarea: HTMLTextAreaElement
): void {
  const content =
    textarea.value.trim();

  if (!content) {
    return;
  }

  const request:
    CreatePostRequest = {
      content,
    };

  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:create-post",
      {
        detail: request,
      }
    )
  );

  closeComposer();
}


/* =========================================================
   Keyboard handling
   ========================================================= */

function handleEscape(
  event: KeyboardEvent
): void {
  if (
    event.key !== "Escape"
  ) {
    return;
  }

  if (
    !document.querySelector(
      ".composer-overlay"
    )
  ) {
    return;
  }

  closeComposer();

  document.removeEventListener(
    "keydown",
    handleEscape
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


function closeIcon(): SVGSVGElement {
  const svg = createSvg();

  svg.append(
    createPath(
      "M6 6l12 12M18 6 6 18"
    )
  );

  return svg;
}


function mediaIcon(): SVGSVGElement {
  const svg = createSvg();

  svg.append(
    createPath(
      "M4 5h16v14H4Z"
    ),
    createPath(
      "m5 17 5-5 3 3 2-2 4 4"
    )
  );

  const circle =
    document.createElementNS(
      SVG_NAMESPACE,
      "circle"
    );

  circle.setAttribute(
    "cx",
    "15.5"
  );

  circle.setAttribute(
    "cy",
    "9"
  );

  circle.setAttribute(
    "r",
    "1.5"
  );

  svg.append(circle);

  return svg;
}


function gifIcon(): SVGSVGElement {
  const svg = createSvg();

  const rect =
    document.createElementNS(
      SVG_NAMESPACE,
      "rect"
    );

  rect.setAttribute(
    "x",
    "3"
  );

  rect.setAttribute(
    "y",
    "6"
  );

  rect.setAttribute(
    "width",
    "18"
  );

  rect.setAttribute(
    "height",
    "12"
  );

  rect.setAttribute(
    "rx",
    "3"
  );

  svg.append(rect);

  const text =
    document.createElementNS(
      SVG_NAMESPACE,
      "text"
    );

  text.setAttribute(
    "x",
    "12"
  );

  text.setAttribute(
    "y",
    "14.2"
  );

  text.setAttribute(
    "text-anchor",
    "middle"
  );

  text.setAttribute(
    "font-size",
    "6"
  );

  text.setAttribute(
    "font-weight",
    "700"
  );

  text.textContent = "GIF";

  svg.append(text);

  return svg;
}
