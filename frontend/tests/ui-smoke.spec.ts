import {
  expect,
  test,
  type Page,
} from "@playwright/test";


/**
 * statuzfree
 * Frontend smoke and visual sanity checks.
 *
 * These tests deliberately focus on the visible UI rather
 * than backend behaviour.
 *
 * They verify that:
 *
 * - the application launches
 * - primary navigation works
 * - important views actually render
 * - the compose interface opens
 * - the layout does not contain obvious horizontal overflow
 * - JavaScript does not crash during normal navigation
 * - screenshots are produced for inspection in CI
 */


/* =========================================================
   Configuration
   ========================================================= */

const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};


const DESKTOP_VIEWPORT = {
  width: 1440,
  height: 1000,
};


/* =========================================================
   Runtime error collector
   ========================================================= */

function collectRuntimeErrors(
  page: Page
): string[] {
  const errors: string[] = [];


  page.on(
    "pageerror",
    (error) => {
      errors.push(
        error.message
      );
    }
  );


  page.on(
    "console",
    (message) => {
      if (
        message.type() ===
        "error"
      ) {
        errors.push(
          message.text()
        );
      }
    }
  );


  return errors;
}


/* =========================================================
   Network handling
   ========================================================= */

/**
 * The UI currently contains local development fixtures.
 *
 * API requests may therefore fail while the backend is not
 * running. We intercept the initial state request so those
 * expected development failures do not pollute browser logs.
 */

async function mockGameState(
  page: Page
): Promise<void> {
  await page.route(
    "**/api/v1/game/state",
    async (route) => {
      await route.fulfill({
        status: 200,

        contentType:
          "application/json",

        body:
          JSON.stringify({
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

            syncedAt:
              new Date()
                .toISOString(),
          }),
      });
    }
  );
}


/* =========================================================
   Shared setup
   ========================================================= */

test.beforeEach(
  async ({
    page,
  }) => {
    await page.setViewportSize(
      MOBILE_VIEWPORT
    );


    await mockGameState(
      page
    );
  }
);


/* =========================================================
   Application boot
   ========================================================= */

test(
  "application launches without fatal browser errors",
  async ({
    page,
  }) => {
    const errors =
      collectRuntimeErrors(
        page
      );


    await page.goto(
      "/"
    );


    await expect(
      page.locator(
        ".brand"
      )
    ).toContainText(
      "statuzfree"
    );


    await expect(
      page.locator(
        "#app"
      )
    ).toBeVisible();


    await page.waitForTimeout(
      250
    );


    expect(
      errors,
      errors.join("\n")
    ).toEqual([]);
  }
);


/* =========================================================
   Home
   ========================================================= */

test(
  "home feed renders",
  async ({
    page,
  }) => {
    await page.goto(
      "/"
    );


    await expect(
      page.locator(
        ".home-view"
      )
    ).toBeVisible();


    await expect(
      page.locator(
        ".feed-header__title"
      )
    ).toHaveText(
      "Home"
    );


    await expect(
      page.locator(
        ".feed-header__status"
      )
    ).toContainText(
      "DAY"
    );


    await expect(
      page.locator(
        ".post-card"
      ).first()
    ).toBeVisible();


    await page.screenshot({
      path:
        "test-results/screenshots/home-mobile.png",

      fullPage:
        true,
    });
  }
);


/* =========================================================
   Primary navigation
   ========================================================= */

test(
  "primary navigation renders all main sections",
  async ({
    page,
  }) => {
    await page.goto(
      "/"
    );


    const navigation =
      page.locator(
        ".bottom-nav"
      );


    await expect(
      navigation
    ).toBeVisible();


    await expect(
      navigation.locator(
        "[data-route]"
      )
    ).toHaveCount(
      5
    );


    await page.locator(
      '[data-route="/discover"]'
    ).click();


    await expect(
      page.locator(
        ".discover-view"
      )
    ).toBeVisible();


    await page.locator(
      '[data-route="/messages"]'
    ).click();


    await expect(
      page.locator(
        ".messages-view"
      )
    ).toBeVisible();


    await page.locator(
      '[data-route="/alerts"]'
    ).click();


    await expect(
      page.locator(
        ".notifications-view"
      )
    ).toBeVisible();


    await page.locator(
      '[data-route="/profile"]'
    ).click();


    await expect(
      page.locator(
        ".profile-view"
      )
    ).toBeVisible();
  }
);


/* =========================================================
   Discover
   ========================================================= */

test(
  "discover view renders trends and people",
  async ({
    page,
  }) => {
    await page.goto(
      "/discover"
    );


    await expect(
      page.locator(
        ".discover-view"
      )
    ).toBeVisible();


    await expect(
      page.locator(
        ".trending-item"
      ).first()
    ).toBeVisible();


    await expect(
      page.locator(
        ".discover-account"
      ).first()
    ).toBeVisible();


    await page.screenshot({
      path:
        "test-results/screenshots/discover-mobile.png",

      fullPage:
        true,
    });
  }
);


/* =========================================================
   Messages
   ========================================================= */

test(
  "messages view renders conversations",
  async ({
    page,
  }) => {
    await page.goto(
      "/messages"
    );


    await expect(
      page.locator(
        ".messages-view"
      )
    ).toBeVisible();


    await expect(
      page.locator(
        ".conversation-row"
      ).first()
    ).toBeVisible();


    await page.screenshot({
      path:
        "test-results/screenshots/messages-mobile.png",

      fullPage:
        true,
    });
  }
);


/* =========================================================
   Conversation
   ========================================================= */

test(
  "conversation can be opened from messages",
  async ({
    page,
  }) => {
    await page.goto(
      "/messages"
    );


    await page.locator(
      ".conversation-row"
    ).first().click();


    await expect(
      page.locator(
        ".conversation-view"
      )
    ).toBeVisible();


    await expect(
      page.locator(
        ".conversation-message"
      ).first()
    ).toBeVisible();


    await expect(
      page.locator(
        ".message-composer__input"
      )
    ).toBeVisible();


    await page.screenshot({
      path:
        "test-results/screenshots/conversation-mobile.png",

      fullPage:
        true,
    });
  }
);


/* =========================================================
   Composer
   ========================================================= */

test(
  "compose button opens post composer",
  async ({
    page,
  }) => {
    await page.goto(
      "/"
    );


    await page.locator(
      '[data-action="compose"]'
    ).click();


    await expect(
      page.locator(
        ".composer-overlay"
      )
    ).toHaveClass(
      /is-visible/
    );


    const input =
      page.locator(
        ".composer__textarea"
      );


    await expect(
      input
    ).toBeFocused();


    await input.fill(
      "Testing statuzfree."
    );


    await expect(
      page.locator(
        ".composer__submit"
      )
    ).toBeEnabled();


    await page.screenshot({
      path:
        "test-results/screenshots/composer-mobile.png",

      fullPage:
        true,
    });
  }
);


/* =========================================================
   Alerts
   ========================================================= */

test(
  "alerts render activity",
  async ({
    page,
  }) => {
    await page.goto(
      "/alerts"
    );


    await expect(
      page.locator(
        ".notifications-view"
      )
    ).toBeVisible();


    await expect(
      page.locator(
        ".notification-row"
      ).first()
    ).toBeVisible();


    await page.screenshot({
      path:
        "test-results/screenshots/alerts-mobile.png",

      fullPage:
        true,
    });
  }
);


/* =========================================================
   Profile
   ========================================================= */

test(
  "profile displays game progression",
  async ({
    page,
  }) => {
    await page.goto(
      "/profile"
    );


    await expect(
      page.locator(
        ".profile-view"
      )
    ).toBeVisible();


    await expect(
      page.locator(
        ".profile-stat"
      )
    ).toHaveCount(
      3
    );


    await expect(
      page.locator(
        ".profile-identity__names h1"
      )
    ).toBeVisible();


    await page.screenshot({
      path:
        "test-results/screenshots/profile-mobile.png",

      fullPage:
        true,
    });
  }
);


/* =========================================================
   Responsive overflow test
   ========================================================= */

test(
  "mobile pages do not overflow horizontally",
  async ({
    page,
  }) => {
    const paths = [
      "/",
      "/discover",
      "/messages",
      "/alerts",
      "/profile",
    ];


    for (
      const path of paths
    ) {
      await page.goto(
        path
      );


      const dimensions =
        await page.evaluate(
          () => ({
            scrollWidth:
              document.documentElement
                .scrollWidth,

            clientWidth:
              document.documentElement
                .clientWidth,
          })
        );


      expect(
        dimensions.scrollWidth,
        `Horizontal overflow detected on ${path}`
      ).toBeLessThanOrEqual(
        dimensions.clientWidth + 1
      );
    }
  }
);


/* =========================================================
   Desktop visual sanity check
   ========================================================= */

test(
  "desktop shell remains centred and usable",
  async ({
    page,
  }) => {
    await page.setViewportSize(
      DESKTOP_VIEWPORT
    );


    await page.goto(
      "/"
    );


    await expect(
      page.locator(
        ".home-view"
      )
    ).toBeVisible();


    const view =
      page.locator(
        ".view-root"
      );


    await expect(
      view
    ).toBeVisible();


    const box =
      await view.boundingBox();


    expect(
      box
    ).not.toBeNull();


    if (box) {
      expect(
        box.width
      ).toBeLessThanOrEqual(
        760
      );
    }


    await page.screenshot({
      path:
        "test-results/screenshots/home-desktop.png",

      fullPage:
        true,
    });
  }
);
