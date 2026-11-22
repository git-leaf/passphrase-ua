// Applies the chosen theme before the first paint, so dark-mode visitors see no light flash.
// A file loaded from <head> (app/components/root-document.tsx), so the CSP allows it as 'self'
// whether or not inline scripts are allowed (docs/adr/0014). Plain JavaScript with no build step.
// Tests: app/__tests__/theme-script.test.ts
// The storage key and the themes are shared with app/components/theme-provider.tsx.

// A block, so its names stay out of the page's global scope
{
  let theme = "system"
  try {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") theme = stored
  } catch {
    // Storage is blocked (cookies off, a sandboxed frame): follow the OS
  }
  if (theme === "system") theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  document.documentElement.classList.add(theme)
}
