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
  onBlur: jest.fn(),
  onChange: jest.fn(),
  value: '',
};

const renderComponent = (props?: Partial<TextEditorProps>) =>
  render(<TextEditor {...defaultProps} {...props} />);

test('should call onChange', async () => {
  global.Range.prototype.getClientRects = jest
    .fn()
    .mockImplementation(() => []);

  const onChange = jest.fn();
  renderComponent({ onChange });

  const editor = await screen.findByLabelText(/editorin muokkausalue: main/i);

  pasteToTextEditor(editor, 'test');

  expect(onChange).lastCalledWith(expect.stringContaining('<p>test</p>'));

  const undoButton = screen.getByRole('button', { name: /peru/i });

  await userEvent.click(undoButton);
  expect(onChange).lastCalledWith('');
});
