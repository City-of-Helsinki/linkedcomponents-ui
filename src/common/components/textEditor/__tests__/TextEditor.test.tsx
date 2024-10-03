/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import {
  configure,
  pasteToTextEditor,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import TextEditor, { TextEditorProps } from '../TextEditor';

configure({ defaultHidden: true });

const label = 'Text editor label';

const defaultProps: TextEditorProps = {
  id: 'text-editor-1',
  label,
  onBlur: vi.fn<any>(),
  onChange: vi.fn(),
  value: '',
};

const renderComponent = (props?: Partial<TextEditorProps>) =>
  render(<TextEditor {...defaultProps} {...props} />);

test('should call onChange', async () => {
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const onChange = vi.fn();
  renderComponent({ onChange });

  const editor = await screen.findByLabelText(
    /tekstimuotoilueditori. muokkausalue: main/i
  );

  pasteToTextEditor(editor, 'test');

  expect(onChange).lastCalledWith(expect.stringContaining('<p>test</p>'));

  const undoButton = screen.getByRole('button', { name: /peru/i });

  await userEvent.click(undoButton);
  expect(onChange).lastCalledWith('');
});
