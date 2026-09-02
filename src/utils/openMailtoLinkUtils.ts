// createdBy arrives from the API as "Firstname Lastname - email@domain.fi", so
// the address has to be picked out of a display string. Non-global on purpose:
// only the first match is used, and a global regex cannot be safely hoisted.
//
// sonar typescript:S8786 (super-linear backtracking) is accepted here, not
// fixed: unanchored scanning for a TLD-terminated address is inherently
// quadratic, and the input is short server-generated metadata rendered
// client-side for an admin. Anchoring would need whitespace tokenisation and
// would stop matching addresses followed by punctuation.
const EMAIL_IN_CREATED_BY = /[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Z]{2,}/i; // NOSONAR

const parseEmailFromCreatedBy = (
  createdBy: string | null | undefined
): string => createdBy?.match(EMAIL_IN_CREATED_BY)?.[0] ?? '';

const openMailtoLink = (targetEmail: string, subject: string): void => {
  // "&" or "#" in an event name would otherwise truncate the subject silently.
  // The address is escaped only for the sub-delimiters RFC 6068 requires in an
  // addr-spec, so internationalised addresses pass through unchanged.
  const address = targetEmail.replace(/[&?#%;=]/g, (c) =>
    encodeURIComponent(c)
  );
  window.location.href = `mailto:${address}?subject=${encodeURIComponent(
    subject
  )}`;
};

export { openMailtoLink, parseEmailFromCreatedBy };
