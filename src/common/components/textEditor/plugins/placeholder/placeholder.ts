import './placeholder.scss';

import { TFunction } from 'i18next';
import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

const placeholder = (t: TFunction, placeholderKey?: string) => {
  const update = (view: EditorView) => {
    /* istanbul ignore else */
    if (view.state.doc.textContent) {
      view.dom.removeAttribute('data-placeholder');
    } else if (placeholderKey) {
      view.dom.setAttribute('data-placeholder', t(placeholderKey));
    }
  };

  return new Plugin({
    view(view) {
      update(view);

      return { update };
    },
  });
};

export default placeholder;
