# Options that differ from the defaults live in the URL

A generator page's URL holds its Generation method's Options query: only the options that differ from the defaults, under short keys (`/uk?words=5&sep=_`, `/en/password?length=24&symbols=0`). A configuration can be bookmarked and shared, and the Secret never enters the URL ([ADR-0004](0004-generation-runs-only-in-the-browser.md)).

- **Keys.** Passphrase: `words`, `lang` and `list` (the Wordlist's language and id), `translit`, `sep`, `caps`, `number`. Password: `length`, `lower`, `upper`, `numbers`, `symbols`, `unambiguous`. Switches are `1` or `0`. A custom Separator is written as the Separator itself, so `sep=+!` and `sep=_` read alike.
- **Reading.** Each value that is unknown or invalid reads as its default on its own, so one bad value doesn't discard the rest. A query that turns off every character class gets the default classes back, because an empty Character set can't make a Password.
- **Writing.** The URL follows the options with `history.replaceState`, so changing an option adds no history entry and Back leaves the page. It waits until the options have settled for 300 ms: browsers limit how often history may change, and Next.js [patches `replaceState`](https://github.com/vercel/next.js/blob/v16.4.6/packages/next/src/client/components/app-router.tsx) in an effect of its router that runs after the page's own effects, so an earlier write would drop the router's history state and break Back. The query applies the first time a Generation method is shown; after that the Generator session holds the options and the URL mirrors it.
- **Unseen characters.** A Separator from the URL may not contain control, format (zero-width, bidi override) or space characters other than the plain space, so a shared link can't make the shown Passphrase differ from the copied one.

## Considered options

- **Remember options in `localStorage`.** Rejected: invisible, tied to one browser, and impossible to share. The URL replaces it.
- **`pushState` on every change.** Rejected: dragging a slider would fill the history, and Back would step through options instead of leaving.
- **Reject the whole query when any value is invalid.** Rejected: a typo in one value would silently drop every other option.

## Consequences

- The keys are a contract with bookmarks: renaming one needs the old key read as well.
- Defaults that change, as #19 may make them per language, change what a URL without a key means.
- Query parameters the page doesn't own, such as `utm_*`, are dropped when it rewrites the URL.
- The Attacker settings are not options of a Generation method, so they stay out of the URL: the Generator session keeps them while the visitor moves between pages, and a reload or shared link starts from the default Attacker model.
