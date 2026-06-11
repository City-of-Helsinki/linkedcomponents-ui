function sanitizeElementId(id: string): string;
function sanitizeElementId(id: null): null;
function sanitizeElementId(id: undefined): undefined;
function sanitizeElementId(id?: string | null) {
  if (typeof id !== 'string') {
    return id;
  }

  const sanitizedId = id
    .replace(/[^A-Za-z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');

  if (!sanitizedId.length) {
    return 'id';
  }

  return /^\d/.test(sanitizedId) ? `id_${sanitizedId}` : sanitizedId;
}

export default sanitizeElementId;
