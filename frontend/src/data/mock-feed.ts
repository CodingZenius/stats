import type {
  FeedResponse,
  FeedPost,
  PostAuthor,
} from "../types/social";

/**
 * statuzfree
 * Temporary frontend-only simulation data.
 *
 * This file lets us build and test the complete feed UI before
 * the real API exists.
 *
 * Delete this module once the frontend is connected to the
 * statuzfree social service.
 */


/* =========================================================
   Mock accounts
   ========================================================= */

const player: PostAuthor = {
  id: "user_player_001",
  displayName: "Alex Mercer",
  username: "alexm",
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


const northsideWatch: PostAuthor = {
  id: "ambient_northside_001",
  displayName: "northsidewatch",
  username: "northsidewatch",
  avatarUrl: null,
  accountType: "ambient",
};


const anonymousUser: PostAuthor = {
  id: "anonymous_001",
  displayName: "somebody",
  username: "user481927",
  avatarUrl: null,
  accountType: "anonymous",
};


/* =========================================================
   Mock posts
   ========================================================= */

const posts: FeedPost[] = [
  {
    id: "post_001",

    author: maya,

    content:
      "Everybody suddenly has an opinion now that people are actually talking about what happened.",

    createdAt: "2026-08-15T09:42:00.000Z",

    metrics: {
      replies: 18,
      reposts: 31,
      likes: 284,
    },

    viewerState: {
      liked: false,
      reposted: false,
    },
  },

  {
    id: "post_002",

    author: northsideWatch,

    content:
      "The funniest part is watching people pretend they weren't discussing this all week.",

    createdAt: "2026-08-15T09:49:00.000Z",

    metrics: {
      replies: 7,
      reposts: 12,
      likes: 96,
    },

    viewerState: {
      liked: false,
      reposted: false,
    },
  },

  {
    id: "post_003",

    author: campusWire,

    content:
      "Students are reacting after several posts concerning last night's incident began circulating this morning. More information is expected later today.",

    createdAt: "2026-08-15T10:03:00.000Z",

    metrics: {
      replies: 46,
      reposts: 128,
      likes: 741,
    },

    viewerState: {
      liked: false,
      reposted: false,
    },
  },

  {
    id: "post_004",

    author: player,

    content:
      "Some of you are making this sound much deeper than it actually was.",

    createdAt: "2026-08-15T10:11:00.000Z",

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

  {
    id: "post_005",

    author: anonymousUser,

    content:
      "bro posts one sentence and somehow the entire timeline starts fighting",

    createdAt: "2026-08-15T10:16:00.000Z",

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

  {
    id: "post_006",

    author: daniel,

    content:
      "There are definitely two completely different versions of this story going around.",

    createdAt: "2026-08-15T10:24:00.000Z",

    metrics: {
      replies: 13,
      reposts: 17,
      likes: 205,
    },

    viewerState: {
      liked: false,
      reposted: false,
    },
  },
];


/* =========================================================
   Feed
   ========================================================= */

export const mockFeed: FeedResponse = {
  day: {
    number: 1,

    /**
     * The player has currently made one of the three posts
     * required to advance the simulation to Day 2.
     */
    postsUsed: 1,
    postsRequired: 3,
  },

  posts,

  nextCursor: null,
};


/* =========================================================
   Development helpers
   ========================================================= */

/**
 * Returns a fresh copy rather than exposing the original mock
 * objects directly.
 *
 * This prevents UI experiments such as likes and reposts from
 * permanently mutating our source fixture.
 */
export function getMockFeed(): FeedResponse {
  return structuredClone(mockFeed);
}
