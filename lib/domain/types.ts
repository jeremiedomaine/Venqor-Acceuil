export type VenqorDomain = {
  id: string
  slug: string
  name: string
  address: string | null
  coverImageUrl: string | null
}

export type DomainErrorCode =
  | "UNAUTHENTICATED"
  | "NO_PROFILE"
  | "DOMAIN_NOT_FOUND"

export class DomainError extends Error {
  readonly code: DomainErrorCode

  constructor(code: DomainErrorCode, message: string) {
    super(message)
    this.name = "DomainError"
    this.code = code
  }
}
