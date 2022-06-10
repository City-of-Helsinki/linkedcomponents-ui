import './style/toolbar.scss';

import {
  isBlockActive,
  isMarkActive,
  isWrapped,
} from '@aeaton/prosemirror-commands';
import { ToolbarGroup } from '@aeaton/react-prosemirror';
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

export const generateToolbar = (
  disabled: boolean,
  t: TFunction
): ToolbarGroup[] => [
  {
    id: 'marks',
    items: [
      {
        id: 'toggle-bold',
        title: t('common.textEditor.inline.bold'),
        content: icons.bold,
        action: toggleMarkBold,
        enable: (state: EditorState) => !disabled && toggleMarkBold(state),
        active: isMarkActive(schema.marks.bold),
      },
      {
        id: 'toggle-italic',
        title: t('common.textEditor.inline.italic'),
        content: icons.italic,
        action: toggleMarkItalic,
        enable: (state: EditorState) => !disabled && toggleMarkItalic(state),
        active: isMarkActive(schema.marks.italic),
      },
      {
        id: 'toggle-code',
        title: t('common.textEditor.inline.code'),
        content: icons.code,
        action: toggleMarkCode,
        enable: (state: EditorState) => !disabled && toggleMarkCode(state),
        active: isMarkActive(schema.marks.code),
      },

      {
        id: 'toggle-link',
        title: t('common.textEditor.link.link'),
        content: icons.link,
        action: toggleLink(t),
        enable: (state: EditorState) => {
          return !disabled && !state.selection.empty;
        },
        active: isMarkActive(schema.marks.link),
      },
      {
        id: 'block-bullet-list',
        title: t('common.textEditor.list.unordered'),
        content: icons.bulletList,
        action: setListTypeBullet,
        enable: (state: EditorState) => !disabled && setListTypeBullet(state),
        active: isBlockActive(schema.nodes.list, { type: 'bullet' }),
      },
      {
        id: 'block-ordered-list',
        title: t('common.textEditor.list.ordered'),
        content: icons.orderedList,
        action: setListTypeOrdered,
        enable: (state: EditorState) => !disabled && setListTypeOrdered(state),
        active: isBlockActive(schema.nodes.list, { type: 'ordered' }),
      },
      {
        id: 'outdent',
        title: t('common.textEditor.list.outdent'),
        action: liftListItemCommand,
        enable: (state: EditorState) => !disabled && liftListItemCommand(state),
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
        enable: (state: EditorState) =>
          !disabled && toggleWrapBlockquote(state),
        active: isWrapped(schema.nodes.blockquote),
      },
      {
        id: 'block-undo',
        title: t('common.textEditor.history.undo'),
        content: icons.undo,
        action: undo,
        enable: (state: EditorState) => !disabled && undo(state),
      },
      {
        id: 'block-redo',
        title: t('common.textEditor.history.redo'),
        content: icons.redo,
        action: redo,
        enable: (state: EditorState) => !disabled && redo(state),
      },
    ],
  },
];
