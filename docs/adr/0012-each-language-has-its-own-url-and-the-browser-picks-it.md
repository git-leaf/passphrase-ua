# Each language has its own URLs, and the browser picks one at the root

Every page is pre-rendered once per language under a language prefix: `/uk` and `/en` are the Passphrase generator, then `/uk/password`, `/uk/learn` and `/uk/privacy`, and the same for English. Search engines index each language separately, and each page links its other version with `hreflang`. The root `/`, and the old `/privacy` URL, are small static pages whose script sends the visitor on: to the language they last chose with the language toggle, else their browser's language, else English.

The [Next.js internationalization guide](https://nextjs.org/docs/app/guides/internationalization) redirects in a Proxy by the `Accept-Language` header instead. We pick the language in the browser because only the browser knows the visitor's saved choice, because a Proxy is server code on every request when the site is otherwise static files ([ADR-0004](0004-generation-runs-only-in-the-browser.md)), and because a static root page works offline from the service worker's cache ([ADR-0011](0011-offline-through-a-hand-written-service-worker.md)), where a server redirect can't.

## Considered options

- **Redirect in a Proxy by `Accept-Language`.** Rejected for the reasons above. It would also save the visitor a brief blank page before the redirect.
- **Redirect in `next.config` with a `has` condition on the `Accept-Language` header.** Rejected: matching a weighted language list with one regular expression is fragile, and it still ignores the saved choice.
- **Keep one URL and pick the language after the page loads, as before.** Rejected: search engines saw only English, `<html lang>` was always `en`, and Ukrainian visitors saw English first.

## Consequences

- The language toggle links to the same page in the other language and saves the choice in `localStorage`, which only the root and the old `/privacy` URL read.
- `hreflang`'s `x-default` is the root for the home page, which picks a language for the visitor, and the English page for the others, as [Google describes](https://developers.google.com/search/docs/specialty/international/localized-versions#xdefault).
- Without JavaScript, the root shows a link to each language instead of redirecting.
- The URLs are hard to change once search engines and visitors' bookmarks hold them; a moved page needs a redirect, as `/privacy` has.
