/**
 * statuzfree
 * Shared frontend types for the simulated social network.
 *
 * These interfaces describe data received by the frontend.
 * They contain no simulation, database or AI logic.
 */


/* =========================================================
   Identifiers
   ========================================================= */

export type UserId = string;
export type PostId = string;
export type CommentId = string;


/* =========================================================
   Account types
   ========================================================= */

export type AccountType =
  | "player"
  | "character"
  | "ambient"
  | "publication"
  | "anonymous";


/* =========================================================
   Profile
   ========================================================= */

export interface SocialProfile {
  id: UserId;

  displayName: string;
  username: string;

  avatarUrl: string | null;
  bannerUrl?: string | null;

  bio?: string;

  accountType: AccountType;

  followerCount: number;
  followingCount: number;

  isFollowing?: boolean;
}


/* =========================================================
   Post author
   ========================================================= */

/**
 * Feed responses should not need to return an entire profile
 * for every post.
 *
 * This smaller representation is enough to render an author
 * inside the timeline.
 */

export interface PostAuthor {
  id: UserId;

  displayName: string;
  username: string;

  avatarUrl: string | null;

  accountType: AccountType;
}


/* =========================================================
   Engagement
   ========================================================= */

export interface EngagementMetrics {
  replies: number;
  reposts: number;
  likes: number;
}


/* =========================================================
   Viewer-specific state
   ========================================================= */

/**
 * These values describe how the current player has interacted
 * with a post.
 *
 * They are separate from the public engagement totals.
 */

export interface ViewerPostState {
  liked: boolean;
  reposted: boolean;
}


/* =========================================================
   Media
   ========================================================= */

export type MediaType =
  | "image"
  | "gif"
  | "video";


export interface PostMedia {
  id: string;

  type: MediaType;
  url: string;

  alt?: string;

  width?: number;
  height?: number;

  posterUrl?: string;
}


/* =========================================================
   Post
   ========================================================= */

export interface FeedPost {
  id: PostId;

  author: PostAuthor;

  content: string;

  createdAt: string;

  metrics: EngagementMetrics;

  viewerState: ViewerPostState;

  media?: PostMedia[];

  replyToPostId?: PostId | null;
}


/* =========================================================
   Comments / replies
   ========================================================= */

export interface PostReply {
  id: CommentId;

  postId: PostId;

  author: PostAuthor;

  content: string;

  createdAt: string;

  metrics: EngagementMetrics;

  viewerState: ViewerPostState;
}


/* =========================================================
   Feed day
   ========================================================= */

/**
 * statuzfree uses simulation days rather than calendar days.
 *
 * The backend/game service determines when a simulation day
 * begins or ends. The frontend merely displays that state.
 */

export interface SimulationDay {
  number: number;

  postsUsed: number;
  postsRequired: number;
}


/* =========================================================
   Feed response
   ========================================================= */

export interface FeedResponse {
  day: SimulationDay;

  posts: FeedPost[];

  /**
   * Cursor-based pagination allows the backend to change
   * storage/query strategies without changing the frontend.
   */
  nextCursor: string | null;
}


/* =========================================================
   Player social statistics
   ========================================================= */

export interface PlayerSocialStats {
  followers: number;
  following: number;

  aura: number;
  clout: number;
  appeal: number;
}


/* =========================================================
   Relationship
   ========================================================= */

export type PublicRelationshipState =
  | "unknown"
  | "stranger"
  | "acquaintance"
  | "friend"
  | "close_friend"
  | "rival"
  | "enemy"
  | "crush";


export interface CharacterRelationship {
  character: PostAuthor;

  state: PublicRelationshipState;

  /**
   * Public-facing progress value.
   *
   * The backend may maintain considerably more detailed
   * relationship variables. The frontend does not need
   * access to them.
   */
  progress: number;

  recentChange?: number;
}


/* =========================================================
   Notifications
   ========================================================= */

export type NotificationType =
  | "reply"
  | "mention"
  | "like"
  | "repost"
  | "follow"
  | "relationship"
  | "world_event";


export interface SocialNotification {
  id: string;

  type: NotificationType;

  actor?: PostAuthor;

  message: string;

  createdAt: string;

  read: boolean;

  postId?: PostId;
}


/* =========================================================
   Direct messages
   ========================================================= */

export interface ConversationSummary {
  id: string;

  participant: PostAuthor;

  lastMessage: string;

  lastMessageAt: string;

  unreadCount: number;
}


export interface DirectMessage {
  id: string;

  conversationId: string;

  senderId: UserId;

  content: string;

  createdAt: string;
}


/* =========================================================
   Compose requests
   ========================================================= */

/**
 * This is what the frontend eventually sends to the API.
 *
 * Notice that the browser does NOT ask the AI to generate
 * reactions. It simply creates the player's post.
 */

export interface CreatePostRequest {
  content: string;

  mediaIds?: string[];
}


export interface CreateReplyRequest {
  postId: PostId;

  content: string;
}


/* =========================================================
   Generic paginated result
   ========================================================= */

export interface PaginatedResponse<T> {
  items: T[];

  nextCursor: string | null;
}
