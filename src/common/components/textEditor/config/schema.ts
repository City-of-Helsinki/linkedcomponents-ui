/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  blockquote,
  bold,
  code,
  doc,
  italic,
  lineBreak,
  link,
  list,
  listItem,
  paragraph,
  subscript,
  superscript,
  text,
} from '@aeaton/prosemirror-schema';
import { Schema } from 'prosemirror-model';

const schema = new Schema({
  marks: {
    bold,
    code,
    italic,
    link,
    subscript,
    superscript,
  },
  nodes: {
    text,
    doc,
    paragraph,
    lineBreak,
    blockquote,
    list,
    listItem,
  },
});

export default schema;
