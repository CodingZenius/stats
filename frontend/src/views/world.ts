/**
 * statuzfree
 * World view.
 *
 * This screen makes the simulation feel larger than the
 * player's own timeline.
 *
 * It displays:
 * - current world
 * - simulated time
 * - trending conversations
 * - notable people
 * - developing stories
 * - background social activity
 *
 * The frontend does not generate any of this state.
 * Eventually this data comes from the world-state service.
 */


/* =========================================================
   Types
   ========================================================= */

interface WorldSummary {
  id: string;
  name: string;
  location: string;
  population: number;
  online: number;
  day: number;
  period: string;
}

interface WorldTrend {
  id: string;
  title: string;
  category: string;
  posts: number;
  momentum: "rising" | "steady" | "falling";
}

interface WorldPerson {
  id: string;
  displayName: string;
  username: string;
  description: string;
  influence: number;
}

interface WorldStory {
  id: string;
  publication: string;
  headline: string;
  summary: string;
  createdAt: string;
  attention: number;
}

interface WorldPulse {
  id: string;
  text: string;
  createdAt: string;
}


/* =========================================================
   Temporary world data
   ========================================================= */

const world: WorldSummary = {
  id: "world_northside_001",
  name: "Northside",
  location: "United States",
  population: 203481,
  online: 18642,
  day: 1,
  period: "Evening",
};


const trends: WorldTrend[] = [
  {
    id: "trend_001",
    title: "Friday night",
    category: "Northside",
    posts: 3842,
    momentum: "rising",
  },

  {
    id: "trend_002",
    title: "Campus election",
    category: "University",
    posts: 2141,
    momentum: "rising",
  },

  {
    id: "trend_003",
    title: "Maya Collins",
    category: "People",
    posts: 1377,
    momentum: "steady",
  },

  {
    id: "trend_004",
    title: "The library incident",
    category: "Northside",
    posts: 964,
    momentum: "rising",
  },

  {
    id: "trend_005",
    title: "Northside football",
    category: "Sport",
    posts: 621,
    momentum: "falling",
  },
];


const people: WorldPerson[] = [
  {
    id: "char_maya_001",
    displayName: "Maya Collins",
    username: "mayacollins",
    description:
      "People keep quoting her latest post.",
    influence: 81,
  },

  {
    id: "char_daniel_001",
    displayName: "Daniel Cole",
    username: "danielcole",
    description:
      "Appearing in several conversations tonight.",
    influence: 64,
  },

  {
    id: "ambient_lena_001",
    displayName: "Lena",
    username: "lenawho",
    description:
      "Getting attention after being mentioned by several accounts.",
    influence: 39,
  },
];


const stories: WorldStory[] = [
  {
    id: "story_001",
    publication: "Campus Wire",
    headline:
      "Students react as Friday event draws unexpected attention",
    summary:
      "Conversation around tonight's gathering has spread beyond the original group of students.",
    createdAt:
      "2026-08-15T18:51:00.000Z",
    attention: 78,
  },

  {
    id: "story_002",
    publication: "Northside Daily",
    headline:
      "Campus election debate intensifies ahead of vote",
    summary:
      "Several candidates are facing renewed scrutiny after posts circulated this afternoon.",
    createdAt:
      "2026-08-15T17:46:00.000Z",
    attention: 61,
  },
];


const pulses: WorldPulse[] = [
  {
    id: "pulse_001",
    text:
      "More people are mentioning tonight's event.",
    createdAt:
      "2026-08-15T18:58:00.000Z",
  },

  {
    id: "pulse_002",
    text:
      "A previously unknown account is gaining attention.",
    createdAt:
      "2026-08-15T18:53:00.000Z",
  },

  {
    id: "pulse_003",
    text:
      "Conversation around the campus election is accelerating.",
    createdAt:
      "2026-08-15T18:47:00.000Z",
  },

  {
    id: "pulse_004",
    text:
      "Several people have deleted posts from earlier today.",
    createdAt:
      "2026-08-15T18:38:00.000Z",
  },
];


/* =========================================================
   Public renderer
   ========================================================= */

export function renderWorldView(
  root: HTMLElement
): void {
  const view =
    document.createElement("section");

  view.className =
    "world-view";

  view.dataset.worldId =
    world.id;


  view.append(
    createWorldHeader(),
    createWorldStatus(),
    createWorldPulse(),
    createTrends(),
    createPeople(),
    createStories()
  );


  initialiseWorldEvents(
    view
  );


  root.replaceChildren(
    view
  );
}


/* =========================================================
   Header
   ========================================================= */

function createWorldHeader(): HTMLElement {
  const header =
    document.createElement("header");

  header.className =
    "world-header";


  const heading =
    document.createElement("div");

  heading.className =
    "world-header__heading";


  const eyebrow =
    document.createElement("span");

  eyebrow.className =
    "world-header__eyebrow";

  eyebrow.textContent =
    "YOUR WORLD";


  const title =
    document.createElement("h1");

  title.textContent =
    world.name;


  const location =
    document.createElement("p");

  location.textContent =
    world.location;


  heading.append(
    eyebrow,
    title,
    location
  );


  const time =
    document.createElement("div");

  time.className =
    "world-header__time";


  const day =
    document.createElement("strong");

  day.textContent =
    `Day ${world.day}`;


  const period =
    document.createElement("span");

  period.textContent =
    world.period;


  time.append(
    day,
    period
  );


  header.append(
    heading,
    time
  );


  return header;
}


/* =========================================================
   World status
   ========================================================= */

function createWorldStatus(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "world-status";


  section.append(
    createStatusItem(
      "Population",
      formatCount(
        world.population
      )
    ),

    createStatusItem(
      "Active now",
      formatCount(
        world.online
      )
    ),

    createStatusItem(
      "Activity",
      calculateActivityLevel()
    )
  );


  return section;
}


function createStatusItem(
  label: string,
  value: string
): HTMLElement {
  const item =
    document.createElement("div");

  item.className =
    "world-status__item";


  const valueElement =
    document.createElement("strong");

  valueElement.textContent =
    value;


  const labelElement =
    document.createElement("span");

  labelElement.textContent =
    label;


  item.append(
    valueElement,
    labelElement
  );


  return item;
}


/* =========================================================
   World pulse
   ========================================================= */

function createWorldPulse(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "world-section world-pulse";


  section.append(
    createSectionHeader(
      "World pulse",
      "What is changing right now"
    )
  );


  const list =
    document.createElement("div");

  list.className =
    "world-pulse__list";


  pulses.forEach(
    (pulse) => {
      const row =
        document.createElement("div");

      row.className =
        "world-pulse__item";


      const indicator =
        document.createElement("span");

      indicator.className =
        "world-pulse__indicator";

      indicator.setAttribute(
        "aria-hidden",
        "true"
      );


      const content =
        document.createElement("div");

      content.className =
        "world-pulse__content";


      const text =
        document.createElement("p");

      text.textContent =
        pulse.text;


      const time =
        document.createElement("time");

      time.dateTime =
        pulse.createdAt;

      time.textContent =
        formatRelativeTime(
          pulse.createdAt
        );


      content.append(
        text,
        time
      );


      row.append(
        indicator,
        content
      );


      list.append(
        row
      );
    }
  );


  section.append(
    list
  );


  return section;
}


/* =========================================================
   Trends
   ========================================================= */

function createTrends(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "world-section world-trends";


  section.append(
    createSectionHeader(
      "Trending",
      "Conversations spreading through your world"
    )
  );


  const list =
    document.createElement("div");

  list.className =
    "world-trends__list";


  trends.forEach(
    (trend, index) => {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "world-trend";

      button.dataset.trendId =
        trend.id;


      const rank =
        document.createElement("span");

      rank.className =
        "world-trend__rank";

      rank.textContent =
        String(
          index + 1
        ).padStart(
          2,
          "0"
        );


      const content =
        document.createElement("div");

      content.className =
        "world-trend__content";


      const category =
        document.createElement("span");

      category.className =
        "world-trend__category";

      category.textContent =
        trend.category;


      const title =
        document.createElement("strong");

      title.className =
        "world-trend__title";

      title.textContent =
        trend.title;


      const metadata =
        document.createElement("span");

      metadata.className =
        "world-trend__metadata";

      metadata.textContent =
        `${formatCount(
          trend.posts
        )} posts · ${getMomentumText(
          trend.momentum
        )}`;


      content.append(
        category,
        title,
        metadata
      );


      const momentum =
        document.createElement("span");

      momentum.className =
        `world-trend__momentum world-trend__momentum--${trend.momentum}`;

      momentum.setAttribute(
        "aria-label",
        trend.momentum
      );


      button.append(
        rank,
        content,
        momentum
      );


      list.append(
        button
      );
    }
  );


  section.append(
    list
  );


  return section;
}


/* =========================================================
   People
   ========================================================= */

function createPeople(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "world-section world-people";


  section.append(
    createSectionHeader(
      "People gaining attention",
      "Profiles moving through the conversation"
    )
  );


  const list =
    document.createElement("div");

  list.className =
    "world-people__list";


  people.forEach(
    (person) => {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "world-person";

      button.dataset.profileId =
        person.id;


      const avatar =
        document.createElement("div");

      avatar.className =
        "world-person__avatar";

      avatar.textContent =
        person.displayName
          .charAt(0)
          .toUpperCase();


      const content =
        document.createElement("div");

      content.className =
        "world-person__content";


      const identity =
        document.createElement("div");

      identity.className =
        "world-person__identity";


      const name =
        document.createElement("strong");

      name.textContent =
        person.displayName;


      const username =
        document.createElement("span");

      username.textContent =
        `@${person.username}`;


      identity.append(
        name,
        username
      );


      const description =
        document.createElement("p");

      description.textContent =
        person.description;


      content.append(
        identity,
        description
      );


      const influence =
        document.createElement("div");

      influence.className =
        "world-person__influence";


      const score =
        document.createElement("strong");

      score.textContent =
        person.influence.toString();


      const label =
        document.createElement("span");

      label.textContent =
        "influence";


      influence.append(
        score,
        label
      );


      button.append(
        avatar,
        content,
        influence
      );


      list.append(
        button
      );
    }
  );


  section.append(
    list
  );


  return section;
}


/* =========================================================
   Stories
   ========================================================= */

function createStories(): HTMLElement {
  const section =
    document.createElement("section");

  section.className =
    "world-section world-stories";


  section.append(
    createSectionHeader(
      "Developing stories",
      "Publications covering events in your world"
    )
  );


  const list =
    document.createElement("div");

  list.className =
    "world-stories__list";


  stories.forEach(
    (story) => {
      const article =
        document.createElement("button");

      article.type = "button";

      article.className =
        "world-story";

      article.dataset.storyId =
        story.id;


      const publication =
        document.createElement("span");

      publication.className =
        "world-story__publication";

      publication.textContent =
        story.publication;


      const headline =
        document.createElement("h3");

      headline.textContent =
        story.headline;


      const summary =
        document.createElement("p");

      summary.textContent =
        story.summary;


      const footer =
        document.createElement("div");

      footer.className =
        "world-story__footer";


      const time =
        document.createElement("time");

      time.dateTime =
        story.createdAt;

      time.textContent =
        formatRelativeTime(
          story.createdAt
        );


      const attention =
        document.createElement("span");

      attention.textContent =
        `${story.attention}% attention`;


      footer.append(
        time,
        attention
      );


      article.append(
        publication,
        headline,
        summary,
        footer
      );


      list.append(
        article
      );
    }
  );


  section.append(
    list
  );


  return section;
}


/* =========================================================
   Section header
   ========================================================= */

function createSectionHeader(
  title: string,
  description: string
): HTMLElement {
  const header =
    document.createElement("header");

  header.className =
    "world-section__header";


  const heading =
    document.createElement("h2");

  heading.textContent =
    title;


  const text =
    document.createElement("p");

  text.textContent =
    description;


  header.append(
    heading,
    text
  );


  return header;
}


/* =========================================================
   Events
   ========================================================= */

function initialiseWorldEvents(
  view: HTMLElement
): void {
  view.addEventListener(
    "click",
    (event) => {
      const target =
        event.target as HTMLElement;


      const profile =
        target.closest<HTMLElement>(
          "[data-profile-id]"
        );


      if (
        profile?.dataset.profileId
      ) {
        document.dispatchEvent(
          new CustomEvent(
            "statuzfree:open-profile",
            {
              detail: {
                profileId:
                  profile.dataset.profileId,
              },
            }
          )
        );

        return;
      }


      const trend =
        target.closest<HTMLElement>(
          "[data-trend-id]"
        );


      if (
        trend?.dataset.trendId
      ) {
        document.dispatchEvent(
          new CustomEvent(
            "statuzfree:open-trend",
            {
              detail: {
                trendId:
                  trend.dataset.trendId,
              },
            }
          )
        );

        return;
      }


      const story =
        target.closest<HTMLElement>(
          "[data-story-id]"
        );


      if (
        story?.dataset.storyId
      ) {
        document.dispatchEvent(
          new CustomEvent(
            "statuzfree:open-story",
            {
              detail: {
                storyId:
                  story.dataset.storyId,
              },
            }
          )
        );
      }
    }
  );
}


/* =========================================================
   Activity calculation
   ========================================================= */

function calculateActivityLevel(): string {
  const ratio =
    world.online /
    world.population;


  if (ratio >= 0.12) {
    return "Very high";
  }


  if (ratio >= 0.07) {
    return "High";
  }


  if (ratio >= 0.03) {
    return "Normal";
  }


  return "Quiet";
}


/* =========================================================
   Momentum
   ========================================================= */

function getMomentumText(
  momentum: WorldTrend["momentum"]
): string {
  switch (momentum) {
    case "rising":
      return "rising";

    case "falling":
      return "slowing";

    case "steady":
    default:
      return "steady";
  }
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
      (value / 1_000)
        .toFixed(
          value >= 10_000
            ? 0
            : 1
        )
        .replace(
          /\.0$/,
          ""
        );


    return `${result}K`;
  }


  const result =
    (value / 1_000_000)
      .toFixed(1)
      .replace(
        /\.0$/,
        ""
      );


  return `${result}M`;
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


  return `${days}d`;
}
