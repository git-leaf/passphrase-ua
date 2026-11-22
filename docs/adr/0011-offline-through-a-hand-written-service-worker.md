# The app works offline through a hand-written service worker

After the first visit, a service worker (`public/sw.js`) keeps the pages, their build files and every Wordlist, so Mova Pass opens and generates any Secret with no connection. The page hands the worker its list of URLs once the worker is ready; the worker downloads them in the background. While online, pages and Wordlists come from the network first, so a new deploy reaches visitors at once; hashed build files come from the cache. This amends [ADR-0006](0006-wordlists-are-static-files-loaded-on-demand.md): the page still loads only the Wordlist in use, but every visitor now downloads all of them (about 840 KB) in the background.

Offline use backs the advice to generate in airplane mode, and the README, FAQ and privacy page promise it. A hand-written worker of about a hundred lines is plain JavaScript that runs exactly as written, with no build step and nothing new to trust.

## Considered options

- **A service-worker library (Serwist, Workbox).** Rejected: each adds packages and a build plugin, for caching rules that fit in one short file.
- **Bundle every Wordlist into the JavaScript.** Rejected for the reasons in ADR-0006; the worker gets the same offline result without slowing the first page load.
- **Claim offline use only after a Wordlist has been used once.** Rejected: nobody can predict which Wordlist they will need offline.

## Consequences

- A service worker stays installed in visitors' browsers after it is removed from the site. Turning it off means shipping a `sw.js` that clears the cache and unregisters itself, not deleting the file.
- Changing the caching rules means changing the cache version in `sw.js`, so the old cache is cleared on the next visit.
- A new page must be added to the offline list in `app/components/offline-support.tsx`; a page test fails if any route in `app/` is missing.
- The worker's rules are tested by running `sw.js` against fake Cache Storage and network (`app/__tests__/service-worker.test.ts`). That test lives in `app/` because anything in `public/` is published.
