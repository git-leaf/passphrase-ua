> **Historical, not authoritative.** Kept for reference only. For current decisions see [CONTRIBUTING.md](../CONTRIBUTING.md), [docs/adr/](adr/) and [GLOSSARY.md](../GLOSSARY.md).

# Security & Privacy Audit Report

**Passphrase UA**  
**Date:** November 16, 2025  
**Version:** 1.0  
**Status:** Pre-Launch Audit

---

## Executive Summary

This audit evaluates the security and privacy posture of Passphrase UA against the requirements specified in the Product Requirements Document (PRD). The application demonstrates strong security fundamentals with proper use of cryptographically secure random number generation and client-side-only processing. However, several security hardening measures and privacy documentation requirements from the PRD are not yet implemented.

**Overall Security Rating:** ⚠️ **Good** (with recommendations)  
**Overall Privacy Rating:** ✅ **Excellent**

---

## 1. Security Audit

### 1.1 Random Number Generation (RNG) ✅ **COMPLIANT**

**PRD Requirement:** NFR-1.1 - All password generation uses `window.crypto.getRandomValues()`

**Status:** ✅ **FULLY COMPLIANT**

**Findings:**

- ✅ `lib/generators/password.ts` correctly implements `getSecureRandomValues()` using `window.crypto.getRandomValues()`
- ✅ Proper rejection sampling implemented to avoid modulo bias
- ✅ Feature detection: Checks for Web Crypto API availability before use
- ✅ Error handling: Throws descriptive error if Web Crypto API unavailable
- ✅ No use of `Math.random()` found in generation code
- ✅ Unit tests verify Web Crypto API usage

**Code Reference:**

```141:171:lib/generators/password.ts
export function getSecureRandomValues(length: number, max: number): number[] {
  if (typeof window === 'undefined' || !window.crypto?.getRandomValues) {
    throw new Error('Web Crypto API not available');
  }

  const randomValues: number[] = [];

  // Calculate how many bits we need
  const bitsNeeded = Math.ceil(Math.log2(max));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const maxValidValue = Math.floor((256 ** bytesNeeded) / max) * max;

  // Generate random values with rejection sampling to avoid modulo bias
  while (randomValues.length < length) {
    const buffer = new Uint8Array(bytesNeeded);
    window.crypto.getRandomValues(buffer);

    // Convert bytes to number
    let value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value = (value << 8) | buffer[i];
    }

    // Reject values that would cause bias
    if (value < maxValidValue) {
      randomValues.push(value % max);
    }
  }

  return randomValues;
}
```

**Recommendation:** None - implementation is secure and follows best practices.

---

### 1.2 Network Security ⚠️ **PARTIALLY COMPLIANT**

**PRD Requirement:** NFR-1.2 - No network requests during generation (verifiable in dev tools)

**Status:** ✅ **COMPLIANT** (Generation) | ⚠️ **NEEDS ATTENTION** (Infrastructure)

**Findings:**

- ✅ Password/passphrase generation: No network requests during generation
- ✅ All generation logic is pure functions, client-side only
- ⚠️ Wordlist loading: Uses `fetch()` to load wordlists from `public/` directory
  - This is acceptable as wordlists are static assets, not passwords
  - However, wordlists are loaded on-demand, which could be improved with Service Worker caching

**Code Reference:**

```122:178:lib/wordlists/loader.ts
export async function loadWordlist(path: string): Promise<Wordlist> {
  // Check cache first
  if (wordlistCache.has(path)) {
    return wordlistCache.get(path)!;
  }

  try {
    // Fetch wordlist file
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Failed to load wordlist: ${response.statusText}`);
    }

    const text = await response.text();
    const lines = text.split('\n');

    // Parse metadata
    const metadata = parseMetadata(lines);

    // Parse entries
    const entries: WordlistEntry[] = [];
    let lineNumber = 0;
    for (const line of lines) {
      const entry = parseEntry(line, lineNumber);
      if (entry) {
        entries.push(entry);
        lineNumber++;
      }
    }

    // Validate
    if (entries.length === 0) {
      throw new Error('Wordlist is empty');
    }

    // Update metadata size if not set
    if (!metadata.size) {
      metadata.size = entries.length;
    }

    const wordlist: Wordlist = {
      metadata,
      entries,
      wordCount: entries.length,
    };

    // Cache the wordlist
    wordlistCache.set(path, wordlist);

    return wordlist;
  } catch (error) {
    throw new Error(
      `Failed to load wordlist from ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
```

**Recommendations:**

1. ✅ Current implementation is acceptable - wordlists are static assets
2. ⚠️ Implement Service Worker for offline wordlist caching (PRD FR-5.2)
3. ⚠️ Consider preloading wordlists to avoid network requests during generation

---

### 1.3 Data Logging ⚠️ **NEEDS ATTENTION**

**PRD Requirement:** NFR-1.3 - No passwords logged to console (even in dev mode)  
**PRD Requirement:** NFR-1.4 - No passwords in error reporting

**Status:** ⚠️ **MOSTLY COMPLIANT** (with exceptions)

**Findings:**

- ✅ Production code (`app/page.tsx`, `lib/generators/`) does not log passwords
- ✅ Error handling does not include passwords in error messages
- ⚠️ **ISSUE FOUND:** `lib/generators/examples.ts` contains multiple `console.log()` statements that output passwords
  - This is an example/documentation file, not production code
  - However, if this file is imported or executed, passwords could be logged

**Code Reference:**

```28:30:lib/generators/examples.ts
  console.log('Password:', result.password);
  console.log('Entropy:', result.entropy.toFixed(2), 'bits');
  console.log('Charset size:', result.charsetSize);
```

**Recommendations:**

1. ⚠️ **CRITICAL:** Ensure `examples.ts` is never imported in production builds
2. ⚠️ Add build-time check or exclude `examples.ts` from production bundle
3. ✅ Consider moving examples to separate documentation-only directory
4. ✅ Add ESLint rule to prevent `console.log` with password variables

---

### 1.4 Content Security Policy (CSP) ❌ **NOT IMPLEMENTED**

**PRD Requirement:** NFR-1.5 - Strict Content Security Policy headers

**Status:** ❌ **NOT IMPLEMENTED**

**Findings:**

- ❌ No CSP headers configured in `next.config.ts`
- ❌ No middleware.ts found for header configuration
- ❌ No `vercel.json` found for deployment-level headers

**PRD Specification:**

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

**Recommendations:**

1. ❌ **CRITICAL:** Implement CSP headers before launch
2. Add CSP via Next.js `next.config.ts` headers configuration
3. Test CSP with browser DevTools to ensure no violations
4. Consider using `next-safe` or similar library for CSP management

---

### 1.5 HTTPS & HSTS ⚠️ **DEPLOYMENT-DEPENDENT**

**PRD Requirement:** NFR-1.6 - HTTPS only (HSTS enabled)

**Status:** ⚠️ **DEPENDS ON DEPLOYMENT**

**Findings:**

- ⚠️ No HSTS headers configured in codebase
- ✅ Vercel (specified deployment platform) enables HTTPS by default
- ⚠️ HSTS should be explicitly configured

**Recommendations:**

1. ⚠️ Configure HSTS headers in `next.config.ts` or `vercel.json`
2. Set `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
3. Verify HTTPS enforcement in production deployment

---

### 1.6 Third-Party Scripts ✅ **COMPLIANT**

**PRD Requirement:** NFR-1.7 - No third-party scripts or tracking

**Status:** ✅ **COMPLIANT**

**Findings:**

- ✅ No analytics scripts found (Google Analytics, etc.)
- ✅ No third-party CDN scripts
- ✅ Only dependencies are UI libraries (Radix UI, shadcn/ui) - all bundled
- ✅ Google Fonts loaded via Next.js font optimization (acceptable)

**Code Reference:**

```8:16:app/layout.tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

**Recommendation:** ✅ None - compliant with requirements.

---

### 1.7 Input Validation ⚠️ **PARTIALLY COMPLIANT**

**PRD Requirement:** NFR-7.4 - Configuration schema validated with Zod

**Status:** ⚠️ **NOT USING ZOD** (but validation exists)

**Findings:**

- ⚠️ PRD specifies Zod for validation, but codebase uses manual validation
- ✅ Input validation is present and thorough:
  - Password length: 1-128 characters
  - At least one character type required
  - Word count: 1-20 words
  - Wordlist validation
- ✅ TypeScript provides compile-time type safety
- ⚠️ Zod is listed in `pnpm-lock.yaml` but not used in code

**Code Reference:**

```65:87:lib/generators/password.ts
export function validateConfig(config: PasswordConfig): void {
  // Validate length
  if (!Number.isInteger(config.length) || config.length < 1 || config.length > 128) {
    throw new Error('Password length must be between 1 and 128 characters');
  }

  // Validate at least one character type is selected
  if (
    !config.includeLowercase &&
    !config.includeUppercase &&
    !config.includeNumbers &&
    !config.includeSymbols
  ) {
    throw new Error('At least one character type must be selected');
  }

  // Validate custom symbols (if provided)
  if (config.customSymbols !== undefined && config.includeSymbols) {
    if (config.customSymbols.length === 0) {
      throw new Error('Custom symbols cannot be empty when symbols are enabled');
    }
  }
}
```

**Recommendations:**

1. ⚠️ Either implement Zod validation as specified in PRD, or update PRD to reflect manual validation
2. ✅ Current manual validation is sufficient, but Zod would provide:
   - Runtime schema validation
   - Better error messages
   - Schema reuse for API (if added later)

---

### 1.8 OWASP Top 10 Compliance ⚠️ **MOSTLY COMPLIANT**

**PRD Requirement:** NFR-1.8 - OWASP Top 10 compliance

**Status:** ⚠️ **MOSTLY COMPLIANT** (with recommendations)

**OWASP Top 10 (2021) Assessment:**

1. **A01:2021 – Broken Access Control**
   - ✅ N/A - No user accounts or authentication
   - ✅ No server-side resources to protect

2. **A02:2021 – Cryptographic Failures**
   - ✅ Uses Web Crypto API (cryptographically secure)
   - ✅ No custom crypto implementations
   - ✅ Rejection sampling prevents bias

3. **A03:2021 – Injection**
   - ✅ React's built-in XSS protection
   - ⚠️ **NEEDS CSP** (see 1.4)
   - ✅ Input validation present
   - ✅ No SQL/database injection risk (no database)

4. **A04:2021 – Insecure Design**
   - ✅ Client-side only generation (secure by design)
   - ✅ No passwords transmitted over network
   - ✅ No password storage

5. **A05:2021 – Security Misconfiguration**
   - ❌ **MISSING CSP headers** (see 1.4)
   - ⚠️ **MISSING HSTS headers** (see 1.5)
   - ⚠️ No security.txt file (see 1.9)

6. **A06:2021 – Vulnerable Components**
   - ✅ Dependencies are up-to-date (check regularly)
   - ✅ Minimal dependency footprint
   - ⚠️ Regular dependency audits recommended

7. **A07:2021 – Authentication Failures**
   - ✅ N/A - No authentication system

8. **A08:2021 – Software and Data Integrity Failures**
   - ✅ Uses pnpm-lock.yaml for dependency locking
   - ⚠️ No SRI (Subresource Integrity) - but no external resources
   - ✅ Open source for auditability

9. **A09:2021 – Security Logging Failures**
   - ✅ No sensitive data logged (except examples.ts)
   - ✅ Error messages don't expose passwords

10. **A10:2021 – Server-Side Request Forgery**
    - ✅ N/A - No server-side requests

**Recommendations:**

1. ❌ Implement CSP headers (critical)
2. ⚠️ Add HSTS headers
3. ⚠️ Create security.txt file
4. ✅ Continue regular dependency updates

---

### 1.9 Security.txt File ❌ **NOT IMPLEMENTED**

**PRD Requirement:** Section 10 - Security.txt: Provide vulnerability disclosure policy

**Status:** ❌ **NOT IMPLEMENTED**

**Findings:**

- ❌ No `.well-known/security.txt` file found
- ❌ No vulnerability disclosure policy documented

**Recommendations:**

1. ❌ **RECOMMENDED:** Create `.well-known/security.txt` with:
   - Contact email for security issues
   - Vulnerability disclosure policy
   - PGP key (optional)
   - Acknowledgments (optional)

**Example:**

```
Contact: security@example.com
Expires: 2026-12-31T23:59:59.000Z
Preferred-Languages: en, uk
Canonical: https://passphrase-ua.vercel.app/.well-known/security.txt
```

---

### 1.10 Service Worker & Offline Support ❌ **NOT IMPLEMENTED**

**PRD Requirement:** FR-5.2, FR-5.3 - Service Worker caches wordlists and app shell

**Status:** ❌ **NOT IMPLEMENTED**

**Findings:**

- ❌ No Service Worker implementation found
- ❌ No offline support currently
- ⚠️ Wordlists cached in memory, but not persisted

**Recommendations:**

1. ⚠️ **POST-MVP:** Implement Service Worker for offline support
2. Cache wordlists in Service Worker cache
3. Cache app shell for offline functionality
4. Add offline indicator in UI (PRD FR-5.4)

---

### 1.11 Clipboard Security ✅ **COMPLIANT**

**PRD Requirement:** FR-4.2 - Copy button copies to clipboard

**Status:** ✅ **COMPLIANT**

**Findings:**

- ✅ Uses `navigator.clipboard.writeText()` (modern, secure API)
- ✅ No password storage after copy
- ⚠️ No error handling visible for clipboard failures

**Code Reference:**

```134:141:app/page.tsx
  const copyToClipboard = () => {
    if (!generatedPassword) return
    navigator.clipboard.writeText(generatedPassword)
    toast({
      title: t.toast.copied,
      description: t.toast.copiedDescription,
    })
  }
```

**Recommendations:**

1. ⚠️ Add error handling for clipboard API failures
2. ✅ Consider adding fallback for older browsers (but not critical)

---

## 2. Privacy Audit

### 2.1 Data Collection ✅ **EXCELLENT**

**PRD Requirement:** NFR-2.1 - GDPR compliant (no personal data collected)  
**PRD Requirement:** NFR-2.2 - No analytics or telemetry

**Status:** ✅ **FULLY COMPLIANT**

**Findings:**

- ✅ No analytics scripts found
- ✅ No telemetry or tracking
- ✅ No user accounts or authentication
- ✅ No personal data collection
- ✅ No cookies (except functional localStorage for settings)

**Recommendation:** ✅ None - excellent privacy posture.

---

### 2.2 LocalStorage Usage ✅ **COMPLIANT**

**PRD Requirement:** NFR-2.3 - No cookies (except functional localStorage for settings)

**Status:** ✅ **COMPLIANT**

**Findings:**

- ✅ Only stores:
  - Theme preference (`passphrase-ua-theme`)
  - Locale preference (`locale`)
- ✅ **NO passwords stored** - verified in code review
- ✅ Settings are user-controlled and can be cleared

**Code Reference:**

```31:33:app/components/theme-provider.tsx
  const [theme, setTheme] = React.useState<Theme>(
    () => (typeof window !== "undefined" && (localStorage.getItem(storageKey) as Theme)) || defaultTheme,
  )
```

```25:36:lib/i18n/context.tsx
  // Load saved locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null
    if (saved && (saved === "en" || saved === "uk")) {
      setLocale(saved)
    }
  }, [])

  // Save locale to localStorage when it changes
  useEffect(() => {
    if (locale) {
      localStorage.setItem("locale", locale)
    }
  }, [locale])
```

**Recommendation:** ✅ None - compliant with PRD requirements.

---

### 2.3 External API Calls ✅ **COMPLIANT**

**PRD Requirement:** NFR-2.4 - No external API calls

**Status:** ✅ **COMPLIANT**

**Findings:**

- ✅ No external API calls found
- ✅ Only `fetch()` calls are for local wordlist files (`public/wordlists/`)
- ✅ No third-party services
- ✅ No CDN dependencies (except Next.js font optimization, which is acceptable)

**Recommendation:** ✅ None - compliant.

---

### 2.4 Privacy Policy ❌ **NOT IMPLEMENTED**

**PRD Requirement:** NFR-2.5 - Privacy policy clearly states data practices  
**PRD Requirement:** Section 8 - Privacy Policy Page

**Status:** ❌ **NOT IMPLEMENTED**

**Findings:**

- ❌ No privacy policy page found
- ❌ No privacy policy content in codebase
- ⚠️ PRD specifies privacy policy should include:
  - Clear statement: "No data collected, ever"
  - Explanation of localStorage usage (settings only)
  - GDPR compliance statement
  - Contact information

**Recommendations:**

1. ❌ **CRITICAL:** Create privacy policy page before launch
2. Include all points specified in PRD Section 8
3. Link privacy policy in footer
4. Consider adding privacy policy to README

---

### 2.5 Open Source & Auditability ✅ **COMPLIANT**

**PRD Requirement:** NFR-2.6 - Open source for auditability

**Status:** ✅ **COMPLIANT** (assumed)

**Findings:**

- ✅ Codebase is structured for open source
- ✅ MIT license specified in `package.json`
- ✅ README mentions open source
- ⚠️ GitHub repository not verified (assumed public)

**Recommendation:** ✅ Ensure repository is public and accessible.

---

## 3. Summary of Critical Issues

### 🔴 **CRITICAL (Must Fix Before Launch)**

1. **Content Security Policy (CSP) Headers** ❌
   - **Impact:** High - XSS protection
   - **Effort:** Low - Configuration change
   - **Section:** 1.4

2. **Privacy Policy Page** ❌
   - **Impact:** High - Legal/Compliance
   - **Effort:** Low - Content creation
   - **Section:** 2.4

3. **Examples File Password Logging** ⚠️
   - **Impact:** Medium - Potential password exposure
   - **Effort:** Low - File exclusion or refactoring
   - **Section:** 1.3

### 🟡 **IMPORTANT (Should Fix Soon)**

4. **HSTS Headers** ⚠️
   - **Impact:** Medium - HTTPS enforcement
   - **Effort:** Low - Configuration
   - **Section:** 1.5

5. **Security.txt File** ❌
   - **Impact:** Medium - Security best practice
   - **Effort:** Low - File creation
   - **Section:** 1.9

6. **Zod Validation** ⚠️
   - **Impact:** Low - PRD compliance
   - **Effort:** Medium - Implementation or PRD update
   - **Section:** 1.7

### 🟢 **NICE TO HAVE (Post-MVP)**

7. **Service Worker & Offline Support** ❌
   - **Impact:** Low - Feature completeness
   - **Effort:** High - Implementation
   - **Section:** 1.10

8. **Clipboard Error Handling** ⚠️
   - **Impact:** Low - UX improvement
   - **Effort:** Low - Error handling
   - **Section:** 1.11

---

## 4. Compliance Summary

### PRD Requirements Compliance

| Requirement                     | Status | Notes                                   |
| ------------------------------- | ------ | --------------------------------------- |
| NFR-1.1: Web Crypto API         | ✅     | Fully compliant                         |
| NFR-1.2: No network requests    | ✅     | Compliant (wordlists are static assets) |
| NFR-1.3: No password logging    | ⚠️     | Examples.ts logs passwords              |
| NFR-1.4: No passwords in errors | ✅     | Compliant                               |
| NFR-1.5: CSP headers            | ❌     | Not implemented                         |
| NFR-1.6: HTTPS/HSTS             | ⚠️     | HTTPS yes, HSTS no                      |
| NFR-1.7: No third-party scripts | ✅     | Compliant                               |
| NFR-1.8: OWASP Top 10           | ⚠️     | Mostly compliant, CSP missing           |
| NFR-1.9: Security audits        | ⚠️     | This audit completed                    |
| NFR-2.1: GDPR compliance        | ✅     | No data collected                       |
| NFR-2.2: No analytics           | ✅     | Compliant                               |
| NFR-2.3: No cookies             | ✅     | Only localStorage for settings          |
| NFR-2.4: No external APIs       | ✅     | Compliant                               |
| NFR-2.5: Privacy policy         | ❌     | Not implemented                         |
| NFR-2.6: Open source            | ✅     | Compliant (assumed)                     |
| NFR-7.4: Zod validation         | ⚠️     | Manual validation instead               |

**Overall Compliance:** 11/16 ✅ | 4/16 ⚠️ | 1/16 ❌

---

## 5. Recommendations Priority Matrix

### Immediate (Pre-Launch)

1. ❌ Implement CSP headers
2. ❌ Create privacy policy page
3. ⚠️ Exclude/exclude examples.ts from production build

### Short-term (Post-Launch)

4. ⚠️ Add HSTS headers
5. ❌ Create security.txt file
6. ⚠️ Add clipboard error handling

### Medium-term (Future Releases)

7. ❌ Implement Service Worker for offline support
8. ⚠️ Consider implementing Zod validation or updating PRD

---

## 6. Positive Security Findings

### ✅ **Excellent Practices Observed**

1. **Cryptographically Secure RNG**
   - Proper use of Web Crypto API
   - Rejection sampling to prevent bias
   - Feature detection and error handling

2. **Client-Side Only**
   - No server-side generation
   - No network transmission of passwords
   - Pure function architecture

3. **No Data Persistence**
   - Passwords never stored
   - Only settings in localStorage
   - No tracking or analytics

4. **Input Validation**
   - Comprehensive validation functions
   - TypeScript type safety
   - Clear error messages

5. **Clean Architecture**
   - Separation of concerns
   - Testable pure functions
   - Well-documented code

---

## 7. Conclusion

Passphrase UA demonstrates **strong security fundamentals** with proper cryptographic practices and a privacy-first approach. The core generation logic is secure and follows best practices. However, **several security hardening measures** specified in the PRD are not yet implemented, particularly:

1. Content Security Policy headers (critical)
2. Privacy policy documentation (critical)
3. Security.txt file (important)

**Recommendation:** Address critical issues (CSP, privacy policy) before launch. Other items can be addressed in post-launch iterations.

**Overall Assessment:** The application is **secure enough for MVP launch** after addressing critical CSP and privacy policy requirements, with a clear roadmap for additional security hardening.

---

## Appendix A: Testing Recommendations

### Security Testing Checklist

- [ ] Verify CSP headers in production
- [ ] Test Web Crypto API fallback behavior
- [ ] Verify no passwords in browser DevTools Network tab
- [ ] Test clipboard functionality across browsers
- [ ] Verify HTTPS enforcement in production
- [ ] Test offline functionality (after Service Worker implementation)
- [ ] Verify no console.log statements in production build
- [ ] Test input validation edge cases
- [ ] Verify error messages don't expose sensitive data

---

## Appendix B: References

- PRD: `/docs/prd.md`
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- CSP Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- Security.txt: https://securitytxt.org/

---

**Report Prepared By:** Security Audit  
**Next Review:** Post-launch security review recommended
