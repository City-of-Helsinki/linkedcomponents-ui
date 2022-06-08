import {
  IconArrowRedo,
  IconArrowUndo,
  IconLink,
  IconTextBold,
  IconTextItalic,
  IconTextTool,
} from 'hds-react';

import IconCode from '../../../../icons/IconCode';
import IconList from '../../../../icons/IconList';
import IconListOrdered from '../../../../icons/IconListOrdered';
import IconListOutdent from '../../../../icons/IconOutdent';
import IconQuoteLeft from '../../../../icons/IconQuoteLeft';

export const icons = {
  blockquote: <IconQuoteLeft size="xs" aria-hidden={true} />,
  bold: <IconTextBold size="xs" aria-hidden={true} />,
  bulletList: <IconList size="xs" aria-hidden={true} />,
  code: <IconCode size="xs" aria-hidden={true} />,
  italic: <IconTextItalic size="xs" aria-hidden={true} />,
  link: <IconLink size="xs" aria-hidden={true} />,
  orderedList: <IconListOrdered size="xs" aria-hidden={true} />,
  outdent: <IconListOutdent size="xs" aria-hidden={true} />,
  paragraph: <IconTextTool size="xs" aria-hidden={true} />,
  redo: <IconArrowRedo size="xs" aria-hidden={true} />,
  undo: <IconArrowUndo size="xs" aria-hidden={true} />,
};
