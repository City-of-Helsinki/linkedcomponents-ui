import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { toast } from 'react-toastify';

import translations from '../../../../domain/app/i18n/fi.json';
import { enterKeyPressHelper, mockFile } from '../../../../utils/testUtils';
import ImageUploader, { ImageUploaderProps, testIds } from '../ImageUploader';

const defaultProps: ImageUploaderProps = {
  onChange: jest.fn(),
};

const renderComponent = (props?: Partial<ImageUploaderProps>) =>
  render(<ImageUploader {...defaultProps} {...props} />);

test('should render ImageUploader', () => {
  renderComponent();

  expect(
    screen.getByLabelText(translations.common.imageUploader.buttonDropImage)
  ).toBeInTheDocument();
});

test('should show error message if trying to enter file with invalid type', async () => {
  toast.error = jest.fn();
  renderComponent();

  const fileInput = screen.getByTestId(testIds.input);

  const file = mockFile({ type: 'image/notsupported' });

  Object.defineProperty(fileInput, 'files', {
    value: [file],
  });

  fireEvent.change(fileInput);

  expect(toast.error).toBeCalledWith(
    translations.common.imageUploader.notAllowedFileFormat
  );
});

test('should show error message if trying to enter too large file', async () => {
  toast.error = jest.fn();
  renderComponent();

  const fileInput = screen.getByTestId(testIds.input);

  const file = mockFile({ size: 3000000 });

  Object.defineProperty(fileInput, 'files', {
    value: [file],
  });

  fireEvent.change(fileInput);

  expect(toast.error).toBeCalledWith(
    'Tiedostokoko on liian suuri. Tiedoston maksimikoko on 2 Mt'
  );
});

test('should call onChange', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const fileInput = screen.getByTestId(testIds.input);

  const file = mockFile({});

  Object.defineProperty(fileInput, 'files', {
    value: [file],
  });

  fireEvent.change(fileInput);

  expect(onChange).toBeCalledWith(file);
});

test('should open file selection dialog by clicking enter', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const fileInput = screen.getByTestId(testIds.input);
  const label = screen.getByTestId(testIds.label);
  const spy = jest.spyOn(fileInput, 'click');

  enterKeyPressHelper(label);

  expect(spy).toBeCalled();
});

test('should onChange when droping file', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const label = screen.getByTestId(testIds.label);
  const file = mockFile({});

  fireEvent.drop(label, {
    dataTransfer: {
      files: [file],
    },
  });

  expect(onChange).toBeCalledWith(file);
});

test('should show border for label by dragOver', async () => {
  renderComponent();

  const label = screen.getByTestId(testIds.label);

  fireEvent.dragOver(label);

  expect(label).toHaveClass('hover');

  fireEvent.dragLeave(label);

  expect(label).not.toHaveClass('hover');
});
