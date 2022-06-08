import './style/toolbar.scss';

import {
  isBlockActive,
  isMarkActive,
  isWrapped,
} from '@aeaton/prosemirror-commands';
import { TFunction } from 'i18next';
import { redo, undo } from 'prosemirror-history';
import { EditorState } from 'prosemirror-state';

import {
  liftListItemCommand,
  setListTypeBullet,
  setListTypeOrdered,
  toggleLink,
  toggleMarkBold,
  toggleMarkCode,
  toggleMarkItalic,
  toggleWrapBlockquote,
} from './commands';
import { icons } from './icons';
import schema from './schema';

export const generateToolbar = (t: TFunction) => [
  {
    id: 'marks',
    items: [
      {
        id: 'toggle-bold',
        title: t('common.textEditor.inline.bold'),
        content: icons.bold,
        action: toggleMarkBold,
        enable: toggleMarkBold,
        active: isMarkActive(schema.marks.bold),
      },
      {
        id: 'toggle-italic',
        title: t('common.textEditor.inline.italic'),
        content: icons.italic,
        action: toggleMarkItalic,
        enable: toggleMarkItalic,
        active: isMarkActive(schema.marks.italic),
      },
      {
        id: 'toggle-code',
        title: t('common.textEditor.inline.code'),
        content: icons.code,
        action: toggleMarkCode,
        enable: toggleMarkCode,
        active: isMarkActive(schema.marks.code),
      },

      {
        id: 'toggle-link',
        title: t('common.textEditor.link.link'),
        content: icons.link,
        action: toggleLink(t),
        enable: (state: EditorState) => {
          return !state.selection.empty;
        },
        active: isMarkActive(schema.marks.link),
      },
      {
        id: 'block-bullet-list',
        title: t('common.textEditor.list.unordered'),
        content: icons.bulletList,
        action: setListTypeBullet,
        enable: setListTypeBullet,
        active: isBlockActive(schema.nodes.list, { type: 'bullet' }),
      },
      {
        id: 'block-ordered-list',
        title: t('common.textEditor.list.ordered'),
        content: icons.orderedList,
        action: setListTypeOrdered,
        enable: setListTypeOrdered,
        active: isBlockActive(schema.nodes.list, { type: 'ordered' }),
      },
      {
        id: 'outdent',
        title: t('common.textEditor.list.outdent'),
        action: liftListItemCommand,
        enable: liftListItemCommand,
        content: icons.outdent,
      },
    ],
  },
  {
    id: 'history',
    items: [
      {
        id: 'block-blockquote',
        title: t('common.textEditor.blocktype.blockquote'),
        content: icons.blockquote,
        action: toggleWrapBlockquote,
        enable: toggleWrapBlockquote,
        active: isWrapped(schema.nodes.blockquote),
      },
      {
        id: 'block-undo',
        title: t('common.textEditor.history.undo'),
        content: icons.undo,
        action: undo,
        enable: undo,
      },
      {
        id: 'block-redo',
        title: t('common.textEditor.history.redo'),
        content: icons.redo,
        action: redo,
        enable: redo,
      },
    ],
  },
];
