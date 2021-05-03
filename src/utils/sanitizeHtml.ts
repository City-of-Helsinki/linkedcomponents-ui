import { sanitize } from 'dompurify';

import { TEXT_EDITOR_ALLOWED_TAGS } from '../domain/event/constants';

const sanitizeHtml = (html: string) =>
  sanitize(html, {
    ALLOWED_TAGS: TEXT_EDITOR_ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target'],
  }).replace(/<br\s*[/]?>/gi, '<br />');

export default sanitizeHtml;
