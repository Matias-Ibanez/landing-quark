/**
 * QUARK brand mark — the three-dot atomic logo.
 * Shared across nav, footer, sidebar, etc.
 */
export function Mark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="4.5" r="2.5" fill="currentColor" />
      <circle cx="4.5" cy="15" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="15.5" cy="15" r="2.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
