/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ellipsis,
  emDash,
  InputRule,
  inputRules,
  smartQuotes,
  textblockTypeInputRule,
  wrappingInputRule,
} from 'prosemirror-inputrules';

import schema from './schema';

const __spreadArray =
  (this && (this as any).__spreadArray) ||
  function (to: InputRule[], from: readonly InputRule[]) {
    for (let i = 0, il = from.length, j = to.length; i < il; i += 1, j += 1)
      to[j] = from[i];
    return to;
  };

export const rules = function () {
  return inputRules({
    rules: __spreadArray(__spreadArray([], smartQuotes), [
      ellipsis,
      emDash,
      // > blockquote
      wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote),
      // 1. ordered list
      wrappingInputRule(
        /^(\d+)\.\s$/,
        schema.nodes.list,
        function (match) {
          return { type: 'ordered', start: +match[1] };
        },
        function (match, node) {
          return node.childCount + Number(node.attrs.start) === +match[1];
        }
      ),
      // * bullet list
      wrappingInputRule(/^\s*\*\s$/, schema.nodes.list, function () {
        return { type: 'bullet' };
      }),
      // ``` code block
      textblockTypeInputRule(/^```$/, schema.nodes.codeBlock),
    ]),
  });
};
