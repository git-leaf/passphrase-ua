# The theme is applied by a blocking script file

Every page loads `public/theme.js` as a plain, render-blocking `<script src>` in `<head>` (`app/components/root-document.tsx`). It reads the stored theme, falls back to the OS theme when none is stored, the value is invalid or storage is blocked, and puts the `light` or `dark` class on `<html>` before the first paint. The pages are static HTML ([ADR-0014](0014-the-csp-allows-inline-scripts.md)), so without it the theme would only be known after hydration and dark-mode visitors would see a light flash. The theme provider takes over after hydration: it applies the visitor's choices and, while "System" is chosen, follows OS theme changes.

A file under `script-src 'self'` keeps working whether or not the CSP keeps `'unsafe-inline'`, and keeps the app free of raw HTML, which ADR-0014 relies on to stop injected script.

## Considered options

- **An inline script through `dangerouslySetInnerHTML`**, as [next-themes](https://github.com/pacocoursey/next-themes) does. Rejected: it saves the request but adds the app's only raw HTML, and it breaks if ADR-0014 is revisited, since a hash in `script-src` makes browsers [ignore `'unsafe-inline'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src#unsafe_inline_script) and the theme script would need its own hash.
- **CSS `prefers-color-scheme` without a script.** Rejected: it covers "System", but not a visitor who chose dark on a light OS, who would still see a light flash.

## Consequences

- The script delays the first paint by one request. On a first visit it loads alongside the stylesheet, which blocks the paint too; afterwards browsers keep it for a day (`next.config.ts`), so a changed `theme.js` can reach visitors up to a day late. A stale copy can at worst flash the wrong theme until the provider applies it again.
- The storage key and the themes are written in both `theme.js` and `app/components/theme-provider.tsx`, because `theme.js` has no build step; a change to one needs the same change to the other.
- The script runs on pages without the theme provider (the language picker and the 404 page). There "System" follows the OS theme at load, not live.
- The script is tested by running it against a fake window (`app/__tests__/theme-script.test.ts`), next to the service worker's test, because anything in `public/` is published.
