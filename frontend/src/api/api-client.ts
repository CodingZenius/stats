/**
 * statuzfree
 * Frontend API client.
 *
 * This file is the HTTP boundary between the UI and backend.
 *
 * The UI must never:
 *
 * - contain Gemini API keys
 * - contain NVIDIA NIM API keys
 * - contain Cloudflare credentials
 * - call an LLM provider directly
 * - calculate authoritative game progression
 * - access PostgreSQL directly
 *
 * Browser -> statuzfree backend -> game services / llm-adapter
 */


/* =========================================================
   Configuration
   ========================================================= */

const DEFAULT_API_BASE_URL =
  "/api/v1";


const REQUEST_TIMEOUT_MS =
  15_000;


const MAX_RETRIES =
  2;


/* =========================================================
   API errors
   ========================================================= */

export class ApiError extends Error {
  readonly status:
    number;

  readonly code:
    string | null;

  readonly details:
    unknown;


  constructor(
    message: string,
    options: {
      status?: number;
      code?: string | null;
      details?: unknown;
    } = {}
  ) {
    super(
      message
    );


    this.name =
      "ApiError";


    this.status =
      options.status ?? 0;


    this.code =
      options.code ?? null;


    this.details =
      options.details ?? null;
  }
}


/* =========================================================
   Common response contracts
   ========================================================= */

export interface ApiResponse<T> {
  data: T;

  requestId?: string;
}


interface ApiErrorResponse {
  error?: {
    code?: string;

    message?: string;

    details?: unknown;
  };
}


/* =========================================================
   Game snapshot
   ========================================================= */

export interface GameSnapshotResponse {
  player: {
    id: string;

    displayName: string;

    username: string;

    avatarUrl: string | null;

    bio: string;

    progression: {
      aura: number;

      clout: number;

      appeal: number;

      followers: number;

      following: number;
    };
  };


  world: {
    id: string;

    name: string;

    country: string;

    locationName: string | null;

    day: number;

    period:
      | "morning"
      | "afternoon"
      | "evening"
      | "night";

    population: number;

    online: number;

    activity:
      | "quiet"
      | "normal"
      | "high"
      | "very-high";
  };


  syncedAt: string;
}


/* =========================================================
   Feed contracts
   ========================================================= */

export interface ApiAuthor {
  id: string;

  displayName: string;

  username: string;

  avatarUrl: string | null;

  accountType:
    | "player"
    | "character"
    | "publication"
    | "anonymous"
    | "ambient";
}


export interface ApiPost {
  id: string;

  author: ApiAuthor;

  content: string;

  createdAt: string;

  metrics: {
    replies: number;

    reposts: number;

    likes: number;
  };

  viewerState: {
    liked: boolean;

    reposted: boolean;
  };
}


export interface FeedResponse {
  posts:
    ApiPost[];

  cursor:
    string | null;

  hasMore:
    boolean;
}


/* =========================================================
   Create post
   ========================================================= */

export interface CreatePostRequest {
  content: string;

  clientRequestId?: string;
}


export interface CreatePostResponse {
  post:
    ApiPost;

  progressionEvent?: {
    auraDelta?: number;

    cloutDelta?: number;

    appealDelta?: number;

    followerDelta?: number;
  };
}


/* =========================================================
   Replies
   ========================================================= */

export interface ApiReply
  extends ApiPost {
  postId: string;
}


export interface PostThreadResponse {
  post:
    ApiPost;

  replies:
    ApiReply[];

  cursor:
    string | null;

  hasMore:
    boolean;
}


export interface CreateReplyRequest {
  content: string;

  clientRequestId?: string;
}


export interface CreateReplyResponse {
  reply:
    ApiReply;
}


/* =========================================================
   Post interaction
   ========================================================= */

export type PostInteraction =
  | "like"
  | "repost";


export interface InteractionResponse {
  postId: string;

  interaction:
    PostInteraction;

  active: boolean;

  metrics: {
    replies: number;

    reposts: number;

    likes: number;
  };
}


/* =========================================================
   Profile contracts
   ========================================================= */

export interface ProfileResponse {
  id: string;

  displayName: string;

  username: string;

  avatarUrl: string | null;

  bio: string;

  accountType:
    ApiAuthor["accountType"];

  followers: number;

  following: number;

  viewerRelationship?: {
    score: number;

    attitude:
      | "hostile"
      | "negative"
      | "neutral"
      | "positive"
      | "close";

    interactions: number;
  };
}


/* =========================================================
   Messages
   ========================================================= */

export interface ConversationSummary {
  id: string;

  participant:
    ApiAuthor;

  lastMessage: string;

  lastMessageAt: string;

  unreadCount: number;
}


export interface ConversationsResponse {
  conversations:
    ConversationSummary[];
}


export interface ApiMessage {
  id: string;

  conversationId: string;

  senderId: string;

  content: string;

  createdAt: string;

  status:
    | "sending"
    | "sent"
    | "failed";
}


export interface ConversationResponse {
  id: string;

  participant:
    ApiAuthor;

  messages:
    ApiMessage[];

  cursor:
    string | null;

  hasMore:
    boolean;
}


export interface SendMessageRequest {
  content: string;

  clientRequestId?: string;
}


export interface SendMessageResponse {
  message:
    ApiMessage;

  /**
   * Character response may be returned immediately when
   * available. The backend may later move this to an async
   * event stream without changing the UI contract greatly.
   */
  characterReply?:
    ApiMessage;
}


/* =========================================================
   Alerts
   ========================================================= */

export interface ApiAlert {
  id: string;

  type:
    | "like"
    | "repost"
    | "reply"
    | "follow"
    | "mention"
    | "relationship"
    | "progression"
    | "world";

  text: string;

  createdAt: string;

  read: boolean;

  actor?:
    ApiAuthor;

  postId?:
    string;

  profileId?:
    string;
}


export interface AlertsResponse {
  alerts:
    ApiAlert[];

  unreadCount:
    number;
}


/* =========================================================
   World
   ========================================================= */

export interface WorldTrendResponse {
  id: string;

  title: string;

  category: string;

  posts: number;

  momentum:
    | "rising"
    | "steady"
    | "falling";
}


export interface WorldPersonResponse {
  id: string;

  displayName: string;

  username: string;

  description: string;

  influence: number;
}


export interface WorldStoryResponse {
  id: string;

  publication: string;

  headline: string;

  summary: string;

  createdAt: string;

  attention: number;
}


export interface WorldPulseResponse {
  id: string;

  text: string;

  createdAt: string;
}


export interface WorldResponse {
  world:
    GameSnapshotResponse["world"];

  trends:
    WorldTrendResponse[];

  people:
    WorldPersonResponse[];

  stories:
    WorldStoryResponse[];

  pulses:
    WorldPulseResponse[];
}


/* =========================================================
   Request options
   ========================================================= */

interface RequestOptions {
  method?:
    "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

  body?:
    unknown;

  signal?:
    AbortSignal;

  retry?:
    boolean;
}


/* =========================================================
   API client
   ========================================================= */

class StatuzfreeApiClient {
  private readonly baseUrl:
    string;


  constructor(
    baseUrl =
      DEFAULT_API_BASE_URL
  ) {
    this.baseUrl =
      baseUrl.replace(
        /\/+$/,
        ""
      );
  }


  /* =======================================================
     Game
     ======================================================= */

  getGameSnapshot(
    signal?: AbortSignal
  ): Promise<GameSnapshotResponse> {
    return this.request(
      "/game/state",
      {
        signal,
      }
    );
  }


  /* =======================================================
     Feed
     ======================================================= */

  getFeed(
    options: {
      cursor?: string;
      limit?: number;
      signal?: AbortSignal;
    } = {}
  ): Promise<FeedResponse> {
    const params =
      new URLSearchParams();


    if (options.cursor) {
      params.set(
        "cursor",
        options.cursor
      );
    }


    if (options.limit) {
      params.set(
        "limit",
        options.limit.toString()
      );
    }


    return this.request(
      buildPath(
        "/feed",
        params
      ),
      {
        signal:
          options.signal,
      }
    );
  }


  createPost(
    payload:
      CreatePostRequest,
    signal?: AbortSignal
  ): Promise<CreatePostResponse> {
    return this.request(
      "/posts",
      {
        method:
          "POST",

        body:
          payload,

        signal,

        retry:
          false,
      }
    );
  }


  getPostThread(
    postId: string,
    signal?: AbortSignal
  ): Promise<PostThreadResponse> {
    return this.request(
      `/posts/${encodeURIComponent(
        postId
      )}`,
      {
        signal,
      }
    );
  }


  createReply(
    postId: string,
    payload:
      CreateReplyRequest,
    signal?: AbortSignal
  ): Promise<CreateReplyResponse> {
    return this.request(
      `/posts/${encodeURIComponent(
        postId
      )}/replies`,
      {
        method:
          "POST",

        body:
          payload,

        signal,

        retry:
          false,
      }
    );
  }


  setPostInteraction(
    postId: string,
    interaction:
      PostInteraction,
    active: boolean,
    signal?: AbortSignal
  ): Promise<InteractionResponse> {
    return this.request(
      `/posts/${encodeURIComponent(
        postId
      )}/interactions/${interaction}`,
      {
        method:
          active
            ? "PUT"
            : "DELETE",

        signal,

        retry:
          false,
      }
    );
  }


  /* =======================================================
     Profiles
     ======================================================= */

  getProfile(
    profileId: string,
    signal?: AbortSignal
  ): Promise<ProfileResponse> {
    return this.request(
      `/profiles/${encodeURIComponent(
        profileId
      )}`,
      {
        signal,
      }
    );
  }


  /* =======================================================
     Messages
     ======================================================= */

  getConversations(
    signal?: AbortSignal
  ): Promise<ConversationsResponse> {
    return this.request(
      "/messages",
      {
        signal,
      }
    );
  }


  getConversation(
    conversationId: string,
    signal?: AbortSignal
  ): Promise<ConversationResponse> {
    return this.request(
      `/messages/${encodeURIComponent(
        conversationId
      )}`,
      {
        signal,
      }
    );
  }


  sendMessage(
    conversationId: string,
    payload:
      SendMessageRequest,
    signal?: AbortSignal
  ): Promise<SendMessageResponse> {
    return this.request(
      `/messages/${encodeURIComponent(
        conversationId
      )}`,
      {
        method:
          "POST",

        body:
          payload,

        signal,

        retry:
          false,
      }
    );
  }


  /* =======================================================
     Alerts
     ======================================================= */

  getAlerts(
    signal?: AbortSignal
  ): Promise<AlertsResponse> {
    return this.request(
      "/alerts",
      {
        signal,
      }
    );
  }


  markAlertRead(
    alertId: string,
    signal?: AbortSignal
  ): Promise<void> {
    return this.request(
      `/alerts/${encodeURIComponent(
        alertId
      )}/read`,
      {
        method:
          "PUT",

        signal,

        retry:
          false,
      }
    );
  }


  /* =======================================================
     World
     ======================================================= */

  getWorld(
    signal?: AbortSignal
  ): Promise<WorldResponse> {
    return this.request(
      "/world",
      {
        signal,
      }
    );
  }


  /* =======================================================
     Generic request
     ======================================================= */

  private async request<T>(
    path: string,
    options:
      RequestOptions = {}
  ): Promise<T> {
    const method =
      options.method ??
      "GET";


    const retryAllowed =
      options.retry ??
      isRetryableMethod(
        method
      );


    const attempts =
      retryAllowed
        ? MAX_RETRIES + 1
        : 1;


    let lastError:
      unknown = null;


    for (
      let attempt = 0;
      attempt < attempts;
      attempt += 1
    ) {
      try {
        return await this.performRequest<T>(
          path,
          {
            ...options,
            method,
          }
        );
      } catch (error) {
        lastError =
          error;


        if (
          !shouldRetry(
            error,
            attempt,
            attempts
          )
        ) {
          throw error;
        }


        await delay(
          retryDelay(
            attempt
          ),
          options.signal
        );
      }
    }


    throw normaliseError(
      lastError
    );
  }


  /* =======================================================
     HTTP execution
     ======================================================= */

  private async performRequest<T>(
    path: string,
    options:
      RequestOptions
  ): Promise<T> {
    const controller =
      new AbortController();


    const timeout =
      window.setTimeout(
        () => {
          controller.abort(
            new DOMException(
              "Request timed out.",
              "TimeoutError"
            )
          );
        },
        REQUEST_TIMEOUT_MS
      );


    const removeExternalAbort =
      forwardAbortSignal(
        options.signal,
        controller
      );


    try {
      const headers =
        new Headers();


      headers.set(
        "Accept",
        "application/json"
      );


      const hasBody =
        options.body !==
        undefined;


      if (hasBody) {
        headers.set(
          "Content-Type",
          "application/json"
        );
      }


      const response =
        await fetch(
          `${this.baseUrl}${path}`,
          {
            method:
              options.method ??
              "GET",

            headers,

            body:
              hasBody
                ? JSON.stringify(
                    options.body
                  )
                : undefined,

            signal:
              controller.signal,

            credentials:
              "same-origin",
          }
        );


      if (!response.ok) {
        throw await createApiError(
          response
        );
      }


      if (
        response.status ===
        204
      ) {
        return undefined as T;
      }


      const contentType =
        response.headers.get(
          "content-type"
        );


      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new ApiError(
          "The server returned an invalid response.",
          {
            status:
              response.status,

            code:
              "INVALID_RESPONSE",
          }
        );
      }


      const payload =
        await response.json();


      /*
       * Backend may return either:
       *
       * { data: ... }
       *
       * or the resource directly.
       *
       * Supporting both keeps the frontend boundary flexible
       * while the backend contract is still being built.
       */

      if (
        isWrappedResponse<T>(
          payload
        )
      ) {
        return payload.data;
      }


      return payload as T;
    } catch (error) {
      if (
        error instanceof
        ApiError
      ) {
        throw error;
      }


      if (
        error instanceof
          DOMException &&
        (
          error.name ===
            "AbortError" ||
          error.name ===
            "TimeoutError"
        )
      ) {
        throw new ApiError(
          error.name ===
            "TimeoutError"
            ? "The request timed out."
            : "The request was cancelled.",
          {
            code:
              error.name ===
                "TimeoutError"
                ? "REQUEST_TIMEOUT"
                : "REQUEST_ABORTED",
          }
        );
      }


      throw new ApiError(
        "Unable to reach statuzfree.",
        {
          code:
            "NETWORK_ERROR",

          details:
            error,
        }
      );
    } finally {
      window.clearTimeout(
        timeout
      );


      removeExternalAbort();
    }
  }
}


/* =========================================================
   Singleton
   ========================================================= */

export const apiClient =
  new StatuzfreeApiClient();


/* =========================================================
   API error parser
   ========================================================= */

async function createApiError(
  response: Response
): Promise<ApiError> {
  let payload:
    ApiErrorResponse | null =
    null;


  try {
    payload =
      await response.json() as
        ApiErrorResponse;
  } catch {
    payload =
      null;
  }


  const message =
    payload?.error?.message ??
    getDefaultHttpMessage(
      response.status
    );


  return new ApiError(
    message,
    {
      status:
        response.status,

      code:
        payload?.error?.code ??
        null,

      details:
        payload?.error?.details ??
        null,
    }
  );
}


/* =========================================================
   Retry policy
   ========================================================= */

function isRetryableMethod(
  method: string
): boolean {
  return (
    method === "GET" ||
    method === "HEAD"
  );
}


function shouldRetry(
  error: unknown,
  attempt: number,
  attempts: number
): boolean {
  if (
    attempt >=
    attempts - 1
  ) {
    return false;
  }


  if (
    !(error instanceof ApiError)
  ) {
    return true;
  }


  if (
    error.code ===
      "REQUEST_ABORTED"
  ) {
    return false;
  }


  if (
    error.code ===
      "NETWORK_ERROR" ||
    error.code ===
      "REQUEST_TIMEOUT"
  ) {
    return true;
  }


  return (
    error.status === 408 ||
    error.status === 429 ||
    error.status >= 500
  );
}


/* =========================================================
   Backoff
   ========================================================= */

function retryDelay(
  attempt: number
): number {
  const base =
    350 *
    2 ** attempt;


  const jitter =
    Math.random() *
    180;


  return (
    base +
    jitter
  );
}


/* =========================================================
   Abort forwarding
   ========================================================= */

function forwardAbortSignal(
  external:
    AbortSignal | undefined,
  controller:
    AbortController
): () => void {
  if (!external) {
    return () => {};
  }


  if (external.aborted) {
    controller.abort(
      external.reason
    );


    return () => {};
  }


  const handler =
    () => {
      controller.abort(
        external.reason
      );
    };


  external.addEventListener(
    "abort",
    handler,
    {
      once: true,
    }
  );


  return () => {
    external.removeEventListener(
      "abort",
      handler
    );
  };
}


/* =========================================================
   Delay
   ========================================================= */

function delay(
  milliseconds: number,
  signal?: AbortSignal
): Promise<void> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      if (
        signal?.aborted
      ) {
        reject(
          new ApiError(
            "The request was cancelled.",
            {
              code:
                "REQUEST_ABORTED",
            }
          )
        );

        return;
      }


      const timeout =
        window.setTimeout(
          () => {
            cleanup();

            resolve();
          },
          milliseconds
        );


      const abort =
        () => {
          window.clearTimeout(
            timeout
          );


          cleanup();


          reject(
            new ApiError(
              "The request was cancelled.",
              {
                code:
                  "REQUEST_ABORTED",
              }
            )
          );
        };


      const cleanup =
        () => {
          signal?.removeEventListener(
            "abort",
            abort
          );
        };


      signal?.addEventListener(
        "abort",
        abort,
        {
          once: true,
        }
      );
    }
  );
}


/* =========================================================
   Response helpers
   ========================================================= */

function isWrappedResponse<T>(
  value: unknown
): value is ApiResponse<T> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    "data" in value
  );
}


/* =========================================================
   HTTP messages
   ========================================================= */

function getDefaultHttpMessage(
  status: number
): string {
  switch (status) {
    case 400:
      return "The request was invalid.";

    case 401:
      return "Authentication is required.";

    case 403:
      return "This action is unavailable.";

    case 404:
      return "The requested resource was not found.";

    case 409:
      return "The request conflicts with the current game state.";

    case 429:
      return "The service is temporarily busy.";

    case 500:
      return "The server encountered an error.";

    case 502:
    case 503:
    case 504:
      return "The service is temporarily unavailable.";

    default:
      return `Request failed with status ${status}.`;
  }
}


/* =========================================================
   Error normalisation
   ========================================================= */

function normaliseError(
  error: unknown
): ApiError {
  if (
    error instanceof ApiError
  ) {
    return error;
  }


  if (
    error instanceof Error
  ) {
    return new ApiError(
      error.message,
      {
        details:
          error,
      }
    );
  }


  return new ApiError(
    "An unknown request error occurred.",
    {
      details:
        error,
    }
  );
}


/* =========================================================
   URL helper
   ========================================================= */

function buildPath(
  path: string,
  params:
    URLSearchParams
): string {
  const query =
    params.toString();


  if (!query) {
    return path;
  }


  return `${path}?${query}`;
}
