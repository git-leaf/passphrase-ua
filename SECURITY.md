# Security Policy

## Reporting Security Vulnerabilities

We take the security of Mova Pass seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

Report security vulnerabilities privately through a [GitHub security advisory](https://github.com/git-leaf/passphrase-ua/security/advisories/new). Please don't open a public issue for them.

### What to Include

When reporting a vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgement**: Within 7 days, best effort
- **Fix Timeline**: Depends on severity (critical issues prioritized)

## Security Measures

Mova Pass implements multiple security measures to protect user privacy and password security:

### 1. Cryptographically Secure Random Number Generation

- Uses Web Crypto API (`crypto.getRandomValues()`) exclusively
- Rejection sampling prevents modulo bias
- No use of insecure `Math.random()`

### 2. Client-Side Only

- All password generation happens locally in the browser
- No Secret is ever sent over the network; the only request a generation can make downloads a Wordlist the first time it's used
- No server-side processing
- Verifiable in browser DevTools (Network tab)

### 3. No Data Collection

- No passwords stored (even temporarily)
- No user accounts or authentication
- No analytics or tracking
- No cookies (except functional localStorage for settings)

### 4. Security Headers

- Content Security Policy (CSP) to prevent XSS
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options to prevent clickjacking
- X-Content-Type-Options to prevent MIME sniffing

### 5. Open Source

- Full source code available for audit
- Transparent generation algorithms
- Community review encouraged

### 6. Automated Checks

- Every pull request and every push to `main` is scanned for committed secrets (gitleaks)
- Pull requests that add a dependency with a known vulnerability of high or critical severity fail (dependency review)
- CodeQL scans the code on every pull request, every push to `main` and weekly
- Dependabot proposes dependency and GitHub Actions updates weekly, each version at least 7 days old

## Threat Model

**What we protect:** the Secrets people generate, their privacy, and the integrity of the code they run.

**We assume** the visitor's device and browser are not compromised and up to date, and that they store the Secret somewhere safe afterwards. Malware on the device can read any Secret, from any generator.

| Threat                                  | Mitigation                                                                                                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Predictable random numbers              | Only `crypto.getRandomValues()`, with rejection sampling ([ADR-0005](docs/adr/0005-web-crypto-is-the-only-source-of-randomness.md))                                                        |
| Malicious script injected into the page | React's escaping, no raw HTML, and a Content Security Policy (which still allows inline scripts, and `eval` in production; see [#26](https://github.com/git-leaf/passphrase-ua/issues/26)) |
| Interception in transit                 | HTTPS with HSTS; a Secret is never sent over the network ([ADR-0004](docs/adr/0004-generation-runs-only-in-the-browser.md))                                                                |
| Compromised dependency                  | Few dependencies, a committed lockfile, a 7-day wait on new versions and dependency review in CI ([ADR-0003](docs/adr/0003-automatic-dependency-updates.md))                               |
| Other apps reading the clipboard        | Copying happens only when the visitor asks; the advice below covers clearing it                                                                                                            |

## Security Best Practices for Users

### When Using Mova Pass

1. **Use HTTPS**: Always access the site via HTTPS
2. **Verify the Domain**: Ensure you're on the correct domain
3. **Check Browser Security**: Use an up-to-date, secure browser
4. **Network Security**: For maximum security, use offline/airplane mode
5. **Copy Carefully**: Be aware of clipboard managers and screen recorders

### After Generation

1. **Store Securely**: Use a password manager to store generated passwords
2. **Clear Clipboard**: Clear your clipboard after pasting the password
3. **Never Share**: Don't share passwords via insecure channels
4. **Unique Passwords**: Use different passwords for different accounts

## Out of Scope

The following are considered out of scope for security reports:

- Browser vulnerabilities (report to browser vendors)
- Operating system vulnerabilities
- Issues requiring physical access to user's device
- Social engineering attacks
- Theoretical attacks without practical exploitation
- Issues in dependencies (report to upstream projects first)

## Supported Versions

We support the latest version deployed to production. Older versions are not maintained.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Security Acknowledgments

We appreciate security researchers who help keep our users safe. Contributors will be acknowledged here (with permission):

- _No vulnerabilities reported yet_

## Additional Resources

- [Privacy Policy](https://movapass.net/en/privacy)

---

**Last Updated**: November 22, 2026
