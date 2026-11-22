/**
 * Generator errors
 *
 * Every failure a generator reports carries a code the UI translates,
 * so no English message text ever reaches the user.
 */

export type GeneratorErrorCode =
  | "invalid-length"
  | "no-character-classes"
  | "invalid-word-count"
  | "invalid-separator"
  | "separator-required"
  | "separator-in-words"
  | "wordlist-unavailable"
  | "unexpected"

export class GeneratorError extends Error {
  constructor(
    readonly code: GeneratorErrorCode,
    message: string,
  ) {
    super(message)
    this.name = "GeneratorError"
  }
}

/** The code for any thrown value; anything that isn't a GeneratorError is unexpected. */
export function errorCodeOf(error: unknown): GeneratorErrorCode {
  return error instanceof GeneratorError ? error.code : "unexpected"
}
