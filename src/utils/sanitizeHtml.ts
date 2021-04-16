import sanitize from 'sanitize-html';

import { TEXT_EDITOR_ALLOWED_TAGS } from '../domain/event/constants';

const sanitizeHtml = (html: string) =>
  sanitize(html, {
    allowedTags: TEXT_EDITOR_ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'target'],
    },
  });

export default sanitizeHtml;
