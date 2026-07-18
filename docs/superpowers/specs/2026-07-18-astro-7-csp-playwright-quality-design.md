# Astro 7 CSP and Playwright Quality Design

## Objective

Adopt the Astro 7 runtime requirement and Content Security Policy support, then add deterministic production-mode visual regression and accessibility tests for the blog's four representative page types.

## Scope

The implementation will:

- declare Node.js 22.12.0 or newer as the supported runtime;
- enable Astro's production Content Security Policy support;
- make the Drupal GraphQL endpoint configurable while retaining the current live endpoint as the default;
- add Playwright tests using Chromium;
- add deterministic GraphQL fixtures served by a local mock server;
- cover the homepage, a category page, a tag page, and an article page;
- add desktop and mobile screenshots in light and dark themes;
- scan all four routes with axe-core using WCAG 2 Level A and AA rules;
- verify the generated CSP and detect browser-side CSP errors;
- document test and snapshot-update commands.

Adding a continuous-integration workflow is outside this scope. The test commands will be suitable for later CI use.

## Runtime and Production Configuration

`package.json` will declare `engines.node` as `>=22.12.0`, matching Astro 7's minimum runtime.

Astro's `security.csp` support will be enabled in `astro.config.mjs`. Tests will exercise a production build and preview server because Astro does not support its CSP feature in development mode. Astro-generated hashes will authorize the project's bundled and inline scripts and styles. Additional CSP sources or exceptions will only be added when required by a resource the site intentionally loads; broad script exceptions will not be introduced.

The GraphQL client will read its endpoint from a project-specific environment variable and fall back to `https://drupal.ampere.corrupted.pw/graphql`. Normal development and production builds therefore continue to use live Drupal unless the variable is explicitly set. Test orchestration will set it to the local mock server.

## Test Architecture

Playwright will start the following services for the test run:

1. A local GraphQL mock server with deterministic fixture responses.
2. A production Astro build configured to use that mock endpoint.
3. An Astro preview server serving the generated output.

The production build will run once per test session. Playwright will reuse the preview server across tests and shut down managed processes when the run completes.

The mock server will identify the GraphQL operations currently used by the application and return a compact dataset containing:

- homepage page content;
- articles across the site's categories;
- at least one article with the selected tag;
- one complete representative accessibility article;
- the Article type fields used by the compatibility query.

The chosen stable routes will be the homepage (`/`), an accessibility category page (`/accessibility/`), an accessibility tag page (`/tags/accessibility/`), and the fixed mocked accessibility article route. The exact article slug and fixture content will be declared together in the mock fixture so they cannot drift independently.

Unsupported GraphQL operations will return an explicit GraphQL error and non-matching requests will be logged. This ensures application query changes fail visibly instead of producing incomplete pages.

## Visual Regression Coverage

Playwright will use Chromium with two viewport projects:

- a fixed desktop viewport;
- a fixed mobile viewport.

Each of the four routes will be captured in light and dark themes at both viewport sizes, producing 16 committed baseline screenshots. Tests will use reduced motion, a stable locale and timezone, bundled project fonts, and explicit theme state to minimize environmental variation. Screenshots will wait for the page and fonts to be ready before capture.

Visual tests will compare current full-page output with committed baselines. On failure, Playwright will preserve expected, actual, and difference images in its transient test output.

## Accessibility and CSP Coverage

The accessibility suite will run `@axe-core/playwright` against each representative route in Chromium. Scans will include WCAG 2 Level A and AA tags and will fail if axe reports any violation. Existing violations revealed by the representative fixtures will be fixed rather than suppressed. A rule may only be excluded if it is demonstrated to be an axe false positive and the reason is documented next to the exclusion.

CSP coverage will:

- assert that generated pages include Astro's Content Security Policy meta element;
- collect browser console and page errors;
- fail when a CSP violation is reported;
- exercise the theme toggle so the principal inline client behavior is verified under the policy.

## Commands and Artifacts

The project will expose these commands:

- `npm run test:e2e` runs all Playwright tests;
- `npm run test:visual` runs visual regression tests;
- `npm run test:a11y` runs axe and CSP checks;
- `npm run test:visual:update` intentionally refreshes visual baselines.

Committed artifacts will include Playwright configuration, test helpers, deterministic mock fixtures, tests, and screenshot baselines. Playwright reports, traces, actual screenshots, differences, and other transient output will be ignored by Git. Failure output will remain available locally for diagnosis.

The README will explain prerequisites, the production build and mock-server relationship, each command, and the deliberate baseline-update workflow.

## Acceptance Criteria

- `npm run build` succeeds against the normal production configuration.
- The built HTML includes an effective Astro-generated CSP.
- The theme toggle works without CSP violations.
- The mock build does not contact the live Drupal API.
- All four representative routes render from deterministic fixture data.
- Sixteen visual regression snapshots pass in Chromium.
- Axe reports no WCAG 2 A/AA violations on the four representative routes.
- Test failures retain useful Playwright diagnostic artifacts.
- The documented commands work from a clean dependency installation.

