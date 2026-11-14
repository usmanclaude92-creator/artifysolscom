/** A blog post opened from the Control Center's "Preview" button carries `?preview=<token>`. Such a page must not count as traffic. */
export const previewTokenFromSearch = (search: string): string | null => {
  const t = new URLSearchParams(search).get('preview');
  return t && /^[A-Za-z0-9_-]{20,100}$/.test(t) ? t : null;
};
