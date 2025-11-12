# Password Generators

This directory contains secure, client-side password and passphrase generation logic.

## Design Principles

1. **Security First**: All random generation uses `window.crypto.getRandomValues()` (Web Crypto API)
2. **Pure Functions**: All core logic is pure and testable
3. **Separation of Concerns**: Generation logic is completely separate from UI
4. **Type Safety**: Full TypeScript with strict mode, no `any` types
5. **Zero Dependencies**: No external libraries for crypto (uses browser built-ins)

## Architecture

### Core Modules

#### `random-password.ts`
Generates random character-based passwords with configurable options.

**Features:**
- Cryptographically secure random generation (Web Crypto API)
- Configurable character sets (lowercase, uppercase, numbers, symbols)
- Custom symbol sets
- Exclude ambiguous characters option
- Entropy calculation
- Comprehensive validation

**Example:**
```typescript
import { generateRandomPassword } from '@/lib/generators/random-password';

const result = generateRandomPassword({
  length: 16,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
});

console.log(result.password); // "K9#mP2@xL5qR8vWt"
console.log(result.entropy);  // 105.2 bits
```

#### `entropy.ts`
Utilities for calculating password strength, time-to-crack, and cost estimates.

**Features:**
- Strength assessment based on entropy
- Time to crack estimates (average case)
- Cost to crack estimates
- Human-readable formatting
- Scientific notation for large numbers

**Example:**
```typescript
import { assessStrength, calculateTimeToCrack } from '@/lib/generators/entropy';

const strength = assessStrength(77.5);
console.log(strength.label); // "Strong"

const timeToCrack = calculateTimeToCrack(77.5, 1e12);
console.log(timeToCrack.formatted); // "192 million years"
```

#### `types.ts`
Shared types and error classes for all generators.

**Features:**
- Common interfaces for generator results
- Type-safe generation methods
- Custom error classes for validation and crypto errors

### File Organization

```
lib/generators/
├── index.ts              # Barrel export for clean imports
├── random-password.ts    # Random password generation
├── entropy.ts            # Strength and entropy utilities
├── types.ts              # Shared types
└── README.md             # This file
```

## Security Considerations

### Random Number Generation

The generators use `window.crypto.getRandomValues()` for all random operations. This is a cryptographically secure pseudo-random number generator (CSPRNG) provided by the browser.

**Key Points:**
- **Never use `Math.random()`** - It's not cryptographically secure
- **Rejection sampling** - Used to avoid modulo bias
- **Web Crypto API only** - No custom crypto implementations

### Entropy Calculation

Entropy measures the randomness/unpredictability of a password:

```
entropy = length × log₂(charset_size)
```

For Diceware passphrases:
```
entropy = word_count × log₂(dictionary_size)
```

**Industry Standards:**
- < 40 bits: Weak
- 40-60 bits: Fair (minimum for basic security)
- 60-80 bits: Strong (secure for most uses)
- 80+ bits: Very Strong (highly secure)

### No Data Persistence

**Important:** Passwords are never logged, stored, or transmitted. All generation happens in-memory and results are discarded after use.

## Usage

### Basic Random Password

```typescript
import { generateRandomPassword, DEFAULT_CONFIG } from '@/lib/generators';

// Use default configuration (16 chars, all types)
const result = generateRandomPassword(DEFAULT_CONFIG);
```

### Custom Configuration

```typescript
import { generateRandomPassword } from '@/lib/generators';

const result = generateRandomPassword({
  length: 24,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeAmbiguous: true,
});
```

### Strength Assessment

```typescript
import { assessStrength } from '@/lib/generators';

const strength = assessStrength(105.2);
console.log(strength.level);      // "very-strong"
console.log(strength.label);      // "Very Strong"
console.log(strength.color);      // "bg-emerald-600"
console.log(strength.percentage); // 92.5
```

### Time and Cost Estimates

```typescript
import { 
  calculateTimeToCrack, 
  calculateCostToCrack,
  GUESS_RATES 
} from '@/lib/generators';

// Time to crack with offline GPU cluster
const time = calculateTimeToCrack(77.5, GUESS_RATES.OFFLINE_CLUSTER);
console.log(time.formatted); // "192 million years"

// Cost to crack
const cost = calculateCostToCrack(77.5, 0.01);
console.log(cost.formatted); // "$1.47B"
```

## Error Handling

The generators throw typed errors for invalid configurations:

```typescript
import { generateRandomPassword, GeneratorConfigError } from '@/lib/generators';

try {
  const result = generateRandomPassword({
    length: 8,
    includeLowercase: false,
    includeUppercase: false,
    includeNumbers: false,
    includeSymbols: false, // No character types selected!
  });
} catch (error) {
  if (error instanceof GeneratorConfigError) {
    console.error('Invalid configuration:', error.message);
  }
}
```

## Testing

All generator functions are pure and easily testable:

```typescript
import { buildCharset, CHARSETS } from '@/lib/generators';

describe('buildCharset', () => {
  it('should include lowercase when enabled', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });
    
    expect(charset).toBe(CHARSETS.LOWERCASE);
  });
  
  it('should exclude ambiguous characters when enabled', () => {
    const charset = buildCharset({
      length: 16,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: true,
    });
    
    expect(charset).not.toContain('l');
    expect(charset).not.toContain('o');
  });
});
```

## Future Enhancements

- Diceware passphrase generator (`diceware.ts`)
- Memorable password generator (`memorable.ts`)
- BIP39 mnemonic generator (`bip39.ts`)
- Custom dictionary support (`dictionary-loader.ts`)
- Password strength checker (`strength-checker.ts`)

## References

- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [NIST SP 800-63B (Digital Identity Guidelines)](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [EFF Dice-Generated Passphrases](https://www.eff.org/dice)
- [Original Diceware](https://theworld.com/~reinhold/diceware.html)

