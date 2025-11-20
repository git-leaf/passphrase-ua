# Security Policy

## Reporting Security Vulnerabilities

We take the security of Mova Pass (formerly Passphrase UA) seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

Please report security vulnerabilities via:
- **GitHub Security Advisories**: [Create a new advisory](https://github.com/git-leaf/passphrase-ua/security/advisories/new)
- **Email**: If you prefer private disclosure, contact us via the email in the repository

### What to Include

When reporting a vulnerability, please include:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (critical issues prioritized)

## Security Measures

Mova Pass implements multiple security measures to protect user privacy and password security:

### 1. Cryptographically Secure Random Number Generation
- Uses Web Crypto API (`crypto.getRandomValues()`) exclusively
- Rejection sampling prevents modulo bias
- No use of insecure `Math.random()`

### 2. Client-Side Only
- All password generation happens locally in the browser
- No network requests during generation
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

### 6. Regular Audits
- Periodic security reviews
- Dependency updates
- Vulnerability scanning

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

- *No vulnerabilities reported yet*

## Additional Resources

- [Privacy Policy](/privacy)
- [Security Audit Report](docs/security-privacy-audit.md)
- [Product Requirements Document](docs/prd.md)

## Contact

For security-related questions or concerns:
- GitHub Issues: [git-leaf/passphrase-ua/issues](https://github.com/git-leaf/passphrase-ua/issues)
- Security Advisories: [git-leaf/passphrase-ua/security](https://github.com/git-leaf/passphrase-ua/security)

---

**Last Updated**: November 16, 2025

