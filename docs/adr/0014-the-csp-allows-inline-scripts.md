# The Content Security Policy allows inline scripts

The production Content Security Policy has `script-src 'self' 'unsafe-inline'`. Every page is prerendered to static HTML, and Next.js writes [inline scripts of its own](https://nextjs.org/docs/app/guides/content-security-policy#how-nonces-work-in-nextjs) into it: in the built HTML of Next.js 16.4.6, each page's React Server Components payload is a series of `self.__next_f.push(...)` scripts. So blocking inline scripts would stop the page from hydrating. `'unsafe-eval'` is allowed only in development, where [React uses `eval`](https://nextjs.org/docs/app/guides/content-security-policy#development-environment); the production bundles contain none.

What is left to stop an injected script is that no input reaches the HTML unescaped: React escapes all text, the app renders no raw HTML (`dangerouslySetInnerHTML`), and no server writes anything a visitor types or puts in the URL into the HTML, because every page is static and the Secret is made in the browser ([ADR-0004](0004-generation-runs-only-in-the-browser.md)).

## Considered options

- **A nonce per request.** Rejected: Next.js reads the nonce from the request, so [every page must be rendered dynamically](https://nextjs.org/docs/app/guides/content-security-policy#nonces). Pages would lose static prerendering and the CDN cache, and the service worker could no longer keep pages offline ([ADR-0011](0011-offline-through-a-hand-written-service-worker.md)), because a cached page would carry a stale nonce.
- **Next.js's [experimental Subresource Integrity](https://nextjs.org/docs/app/guides/content-security-policy#subresource-integrity-experimental).** Rejected: it adds `integrity` hashes to the external script files only. Built with it on Next.js 16.4.6, a page's inline payload scripts carry no hash or nonce, so a policy without `'unsafe-inline'` still blocks them.
- **Hashes of the inline scripts.** Rejected for now: the payload scripts differ on every page and every build, and Next.js has no built-in way to hash them (its Subresource Integrity covers files only, above). It would need a post-build step that hashes each page's scripts and writes a CSP header per page, which is a custom build step to trust and keep working through Next.js upgrades.

## Consequences

- An HTML injection bug would run script. Code that puts raw HTML into the page needs a review against this decision.
- Revisit when Next.js can hash the inline scripts of statically rendered pages.
