import {
  baseKeymap,
  chainCommands,
  exitCode,
  joinDown,
  joinUp,
  lift,
  selectParentNode,
} from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';

import {
  insertNodeLineBreak,
  liftListItemCommand,
  sinkListItemCommand,
  splitListItemCommand,
  toggleMarkBold,
  toggleMarkCode,
  toggleMarkItalic,
  wrapInBlockquote,
} from './commands';

export const listKeys = function () {
  return keymap({
    'Mod-]': sinkListItemCommand,
    'Mod-[': liftListItemCommand,
    Tab: sinkListItemCommand,
    'Shift-Tab': liftListItemCommand,
    Enter: splitListItemCommand,
  });
};
export const editorKeys = function () {
  return keymap({
    'Mod-z': undo,
    'Shift-Mod-z': redo,
    Backspace: undoInputRule,
    'Mod-y': redo,
    'Alt-ArrowUp': joinUp,
    'Alt-ArrowDown': joinDown,
    'Mod-BracketLeft': lift,
    Escape: selectParentNode,
    'Meta-b': toggleMarkBold,
    'Meta-i': toggleMarkItalic,
    'Ctrl-`': toggleMarkCode,
    'Ctrl->': wrapInBlockquote,
    'Mod-Enter': chainCommands(exitCode, insertNodeLineBreak),
    'Shift-Enter': chainCommands(exitCode, insertNodeLineBreak),
    'Ctrl-Enter': chainCommands(exitCode, insertNodeLineBreak),
  });
};

export const baseKeys = function () {
  return keymap(baseKeymap);
};
