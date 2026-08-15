/**
 * statuzfree
 * Frontend game-state contract.
 *
 * IMPORTANT:
 *
 * This is NOT the simulation engine.
 *
 * The frontend may read this state and temporarily update
 * optimistic UI values, but it does not decide:
 *
 * - follower growth
 * - Aura changes
 * - Clout changes
 * - Appeal changes
 * - relationship progression
 * - who becomes popular
 * - which characters post
 * - what becomes a trend
 * - world events
 * - AI character behaviour
 *
 * Those decisions eventually belong to backend services.
 *
 * This module gives the frontend one predictable representation
 * of the current player/session/world state.
 */


/* =========================================================
   Primitive identifiers
   ========================================================= */

export type PlayerId = string;

export type CharacterId = string;

export type WorldId = string;

export type PostId = string;

export type ConversationId = string;


/* =========================================================
   Player progression
   ========================================================= */

export interface PlayerProgression {
  aura: number;

  clout: number;

  appeal: number;

  followers: number;

  following: number;
}


/* =========================================================
   Relationship
   ========================================================= */

export type RelationshipAttitude =
  | "hostile"
  | "negative"
  | "neutral"
  | "positive"
  | "close";


export interface CharacterRelationship {
  characterId: CharacterId;

  /**
   * Internal relationship score.
   *
   * Backend simulation owns the authoritative value.
   */
  score: number;

  attitude: RelationshipAttitude;

  interactions: number;

  lastInteractionAt: string | null;
}


/* =========================================================
   Player
   ========================================================= */

export interface PlayerState {
  id: PlayerId;

  displayName: string;

  username: string;

  avatarUrl: string | null;

  bio: string;

  progression: PlayerProgression;

  relationships:
    Record<
      CharacterId,
      CharacterRelationship
    >;
}


/* =========================================================
   World
   ========================================================= */

export type WorldActivity =
  | "quiet"
  | "normal"
  | "high"
  | "very-high";


export interface WorldState {
  id: WorldId;

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

  activity: WorldActivity;
}


/* =========================================================
   Session
   ========================================================= */

export interface SessionState {
  sessionId: string;

  startedAt: string;

  lastSyncedAt: string | null;

  authenticated: boolean;

  initialised: boolean;
}


/* =========================================================
   UI state
   ========================================================= */

export type MainRoute =
  | "/"
  | "/discover"
  | "/world"
  | "/messages"
  | "/alerts"
  | "/profile";


export interface UIState {
  route: MainRoute;

  previousRoute:
    MainRoute | null;

  activePostId:
    PostId | null;

  activeProfileId:
    string | null;

  activeConversationId:
    ConversationId | null;

  composerOpen: boolean;

  networkStatus:
    | "online"
    | "offline"
    | "syncing";
}


/* =========================================================
   Root frontend state
   ========================================================= */

export interface GameState {
  session: SessionState;

  player: PlayerState;

  world: WorldState;

  ui: UIState;
}


/* =========================================================
   Initial state
   ========================================================= */

const initialState: GameState = {
  session: {
    sessionId:
      createSessionId(),

    startedAt:
      new Date().toISOString(),

    lastSyncedAt:
      null,

    authenticated:
      false,

    initialised:
      false,
  },


  player: {
    id:
      "user_player_001",

    displayName:
      "Alex",

    username:
      "alex",

    avatarUrl:
      null,

    bio:
      "Apparently people have started paying attention.",

    progression: {
      aura: 42,

      clout: 31,

      appeal: 58,

      followers: 2184,

      following: 147,
    },

    relationships: {},
  },


  world: {
    id:
      "world_northside_001",

    name:
      "Northside",

    country:
      "United States",

    locationName:
      null,

    day:
      1,

    period:
      "evening",

    population:
      203481,

    online:
      18642,

    activity:
      "high",
  },


  ui: {
    route:
      "/",

    previousRoute:
      null,

    activePostId:
      null,

    activeProfileId:
      null,

    activeConversationId:
      null,

    composerOpen:
      false,

    networkStatus:
      navigator.onLine
        ? "online"
        : "offline",
  },
};


/* =========================================================
   Store
   ========================================================= */

let state:
  GameState =
  cloneState(
    initialState
  );


/* =========================================================
   Subscribers
   ========================================================= */

export type GameStateListener = (
  state: Readonly<GameState>,
  previousState: Readonly<GameState>
) => void;


const listeners =
  new Set<GameStateListener>();


/* =========================================================
   Get state
   ========================================================= */

export function getGameState():
  Readonly<GameState> {
  return state;
}


/* =========================================================
   Subscribe
   ========================================================= */

export function subscribeGameState(
  listener: GameStateListener
): () => void {
  listeners.add(
    listener
  );


  return () => {
    listeners.delete(
      listener
    );
  };
}


/* =========================================================
   State update
   ========================================================= */

/**
 * Intended for frontend/session state only.
 *
 * Do not use this function to invent simulation results.
 */

export function updateGameState(
  updater:
    (
      current:
        Readonly<GameState>
    ) => GameState
): void {
  const previousState =
    state;


  const nextState =
    updater(
      previousState
    );


  if (
    nextState ===
    previousState
  ) {
    return;
  }


  state =
    nextState;


  notify(
    previousState
  );
}


/* =========================================================
   Replace authoritative state
   ========================================================= */

/**
 * Used when the backend returns a fresh authoritative
 * player/world snapshot.
 */

export function replaceGameState(
  nextState: GameState
): void {
  const previousState =
    state;


  state =
    cloneState(
      nextState
    );


  notify(
    previousState
  );
}


/* =========================================================
   Apply server snapshot
   ========================================================= */

export interface ServerGameSnapshot {
  player?: PlayerState;

  world?: WorldState;

  syncedAt?: string;
}


export function applyServerSnapshot(
  snapshot: ServerGameSnapshot
): void {
  updateGameState(
    (current) => ({
      ...current,

      session: {
        ...current.session,

        initialised:
          true,

        lastSyncedAt:
          snapshot.syncedAt ??
          new Date().toISOString(),
      },

      player:
        snapshot.player ??
        current.player,

      world:
        snapshot.world ??
        current.world,
    })
  );
}


/* =========================================================
   Navigation state
   ========================================================= */

export function setRoute(
  route: MainRoute
): void {
  updateGameState(
    (current) => {
      if (
        current.ui.route ===
        route
      ) {
        return current as GameState;
      }


      return {
        ...current,

        ui: {
          ...current.ui,

          previousRoute:
            current.ui.route,

          route,

          activePostId:
            null,

          activeConversationId:
            null,
        },
      };
    }
  );
}


/* =========================================================
   Active profile
   ========================================================= */

export function setActiveProfile(
  profileId: string | null
): void {
  updateGameState(
    (current) => ({
      ...current,

      ui: {
        ...current.ui,

        activeProfileId:
          profileId,
      },
    })
  );
}


/* =========================================================
   Active post
   ========================================================= */

export function setActivePost(
  postId: PostId | null
): void {
  updateGameState(
    (current) => ({
      ...current,

      ui: {
        ...current.ui,

        activePostId:
          postId,
      },
    })
  );
}


/* =========================================================
   Active conversation
   ========================================================= */

export function setActiveConversation(
  conversationId:
    ConversationId | null
): void {
  updateGameState(
    (current) => ({
      ...current,

      ui: {
        ...current.ui,

        activeConversationId:
          conversationId,
      },
    })
  );
}


/* =========================================================
   Composer
   ========================================================= */

export function setComposerOpen(
  open: boolean
): void {
  updateGameState(
    (current) => ({
      ...current,

      ui: {
        ...current.ui,

        composerOpen:
          open,
      },
    })
  );
}


/* =========================================================
   Network state
   ========================================================= */

export function setNetworkStatus(
  status:
    UIState["networkStatus"]
): void {
  updateGameState(
    (current) => {
      if (
        current.ui.networkStatus ===
        status
      ) {
        return current as GameState;
      }


      return {
        ...current,

        ui: {
          ...current.ui,

          networkStatus:
            status,
        },
      };
    }
  );
}


/* =========================================================
   Optimistic relationship cache
   ========================================================= */

/**
 * This only stores a relationship value already returned
 * by the backend.
 *
 * It does not calculate relationship progression.
 */

export function cacheRelationship(
  relationship:
    CharacterRelationship
): void {
  updateGameState(
    (current) => ({
      ...current,

      player: {
        ...current.player,

        relationships: {
          ...current.player.relationships,

          [relationship.characterId]:
            relationship,
        },
      },
    })
  );
}


/* =========================================================
   Optimistic progression snapshot
   ========================================================= */

/**
 * Accepts progression calculated elsewhere.
 *
 * This function deliberately contains no scoring formula.
 */

export function setPlayerProgression(
  progression:
    PlayerProgression
): void {
  updateGameState(
    (current) => ({
      ...current,

      player: {
        ...current.player,

        progression: {
          ...progression,
        },
      },
    })
  );
}


/* =========================================================
   Player identity
   ========================================================= */

export interface PlayerIdentityUpdate {
  displayName?: string;

  username?: string;

  avatarUrl?:
    string | null;

  bio?: string;
}


export function updatePlayerIdentity(
  update:
    PlayerIdentityUpdate
): void {
  updateGameState(
    (current) => ({
      ...current,

      player: {
        ...current.player,

        ...update,
      },
    })
  );
}


/* =========================================================
   Reset
   ========================================================= */

export function resetGameState():
  void {
  const previousState =
    state;


  state =
    cloneState(
      initialState
    );


  state.session.sessionId =
    createSessionId();


  state.session.startedAt =
    new Date().toISOString();


  notify(
    previousState
  );
}


/* =========================================================
   Notification
   ========================================================= */

function notify(
  previousState:
    Readonly<GameState>
): void {
  const snapshot =
    state;


  listeners.forEach(
    (listener) => {
      try {
        listener(
          snapshot,
          previousState
        );
      } catch (error) {
        console.error(
          "[statuzfree] game-state listener failed",
          error
        );
      }
    }
  );


  document.dispatchEvent(
    new CustomEvent(
      "statuzfree:state-change",
      {
        detail: {
          state:
            snapshot,

          previousState,
        },
      }
    )
  );
}


/* =========================================================
   Browser connectivity
   ========================================================= */

function initialiseConnectivity():
  void {
  window.addEventListener(
    "online",
    () => {
      setNetworkStatus(
        "online"
      );
    }
  );


  window.addEventListener(
    "offline",
    () => {
      setNetworkStatus(
        "offline"
      );
    }
  );
}


initialiseConnectivity();


/* =========================================================
   Clone
   ========================================================= */

function cloneState(
  source: GameState
): GameState {
  if (
    typeof structuredClone ===
    "function"
  ) {
    return structuredClone(
      source
    );
  }


  return JSON.parse(
    JSON.stringify(
      source
    )
  ) as GameState;
}


/* =========================================================
   Session ID
   ========================================================= */

function createSessionId():
  string {
  if (
    typeof crypto !==
      "undefined" &&
    "randomUUID" in crypto
  ) {
    return (
      `session_` +
      crypto.randomUUID()
    );
  }


  return (
    `session_${Date.now()}_` +
    Math.random()
      .toString(36)
      .slice(2)
  );
}
