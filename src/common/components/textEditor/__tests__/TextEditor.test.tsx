import React from 'react';

import {
  pasteToTextEditor,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import TextEditor, { TextEditorProps } from '../TextEditor';

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

test('should call onChange', () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const editor = screen.getByRole('textbox', { name: label });

  pasteToTextEditor(editor, 'test');
  expect(onChange).toBeCalledWith('<p>test</p>\n');

  const undoButton = screen.getByTitle(/peruuta/i);
  userEvent.click(undoButton);
  expect(onChange).toBeCalledWith('');
});
