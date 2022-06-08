import './style/gapcursor.css';

import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';

import isTestEnv from '../../../../utils/isTestEnv';
import { baseKeys, editorKeys, listKeys } from './keys';
import { rules } from './rules';

const plugins = [
  history(),
  listKeys(),
  editorKeys(),
  baseKeys(),
  rules(),
  dropCursor(),
  gapCursor(),
];
if (!isTestEnv) {
  document.execCommand('enableObjectResizing', false, 'false');
  document.execCommand('enableInlineTableEditing', false, 'false');
}

export default plugins;
