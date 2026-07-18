# Astro frontend for my blog

The frontend for my blog at https://blog.sanna.ninja.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run test:e2e`        | Run all Playwright checks                        |
| `npm run test:visual`     | Compare pages with visual baselines              |
| `npm run test:a11y`       | Run axe and Content Security Policy checks       |
| `npm run test:visual:update` | Intentionally update visual baselines         |

## Browser tests

The browser tests require Node.js 22.12.0 or newer and Playwright's Chromium browser. Install the browser once after installing dependencies:

```sh
npx playwright install chromium
```

Playwright starts a deterministic local GraphQL fixture server, builds the production site against it, and tests the result through `astro preview`. Browser tests do not contact the live Drupal API. Normal development and production builds continue to use the live API unless `BLOG_API_URL` is explicitly set.

Visual coverage includes the homepage, an accessibility category, an accessibility tag, and an article at desktop and mobile sizes in both light and dark themes. The committed baselines are stored under `tests/__screenshots__`.

Run `npm run test:visual:update` only after reviewing and accepting an intentional visual change. Playwright writes transient reports, traces, actual images, and difference images to ignored directories.
