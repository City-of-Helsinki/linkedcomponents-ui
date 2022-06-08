import {
  insertNodeOfType,
  isMarkActive,
  setListTypeOrWrapInList,
  toggleWrap,
} from '@aeaton/prosemirror-commands';
import { TFunction } from 'i18next';
import { setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import { EditorState, Transaction } from 'prosemirror-state';

import { VALIDATION_MESSAGE_KEYS } from '../../../../domain/app/i18n/constants';
import { openPrompt, TextField } from '../plugins/prompt/prompt';
import schema from './schema';
import { rUrl } from './validate';
// marks
export const toggleMarkBold = toggleMark(schema.marks.bold);
export const toggleMarkItalic = toggleMark(schema.marks.italic);
export const toggleMarkCode = toggleMark(schema.marks.code);

export const toggleLink =
  (t: TFunction) =>
  (state: EditorState, dispatch: (tr: Transaction) => void) => {
    if (isMarkActive(schema.marks.link)(state)) {
      toggleMark(schema.marks.link)(state, dispatch);
      return true;
    }

    openPrompt({
      title: t('common.textEditor.link.promptTitle'),
      fields: {
        href: new TextField({
          label: t('common.textEditor.link.linkTarget'),
          required: true,
          validate: (value: string) => {
            return rUrl.test(value) ? '' : t(VALIDATION_MESSAGE_KEYS.URL);
          },
        }),
        title: new TextField({ label: t('common.textEditor.link.linkTitle') }),
      },
      callback(attrs) {
        toggleMark(schema.marks.link, attrs)(state, dispatch);
        // view.focus();
      },
      t,
    });
  };

// nodes
export const setBlockTypeParagraph = setBlockType(schema.nodes.paragraph);
export const toggleWrapBlockquote = toggleWrap(schema.nodes.blockquote);
export const wrapInBlockquote = wrapIn(schema.nodes.blockquote);
export const setListTypeBullet = setListTypeOrWrapInList(schema.nodes.list, {
  type: 'bullet',
});
export const setListTypeOrdered = setListTypeOrWrapInList(schema.nodes.list, {
  type: 'ordered',
});
export const liftListItemCommand = liftListItem(schema.nodes.listItem);
export const sinkListItemCommand = sinkListItem(schema.nodes.listItem); // TODO: same list type
export const splitListItemCommand = splitListItem(schema.nodes.listItem);
export const insertNodeLineBreak = insertNodeOfType(schema.nodes.lineBreak);
