import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast } from 'react-toastify';

import { testIds } from '../../../../constants';
import translations from '../../../../domain/app/i18n/fi.json';
import {
  act,
  configure,
  fireEvent,
  mockFile,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { TEST_PIXEL_CROP } from '../contants';
import ImageUploader, { ImageUploaderProps } from '../ImageUploader';

configure({ defaultHidden: true });

const defaultProps: ImageUploaderProps = {
  onChange: jest.fn(),
};

const renderComponent = (props?: Partial<ImageUploaderProps>) =>
  render(<ImageUploader {...defaultProps} {...props} />);

const getElement = (key: 'addImageButton') => {
  switch (key) {
    case 'addImageButton':
      return screen.getByRole('button', {
        name: translations.common.imageUploader.buttonDropImage,
      });
  }
};

const findElement = (key: 'removeImageButton') => {
  switch (key) {
    case 'removeImageButton':
      return screen.findByRole('button', { name: 'Poista kuva' });
  }
};

test('should show error message if trying to enter file with invalid type', async () => {
  toast.error = jest.fn();
  renderComponent();

  const fileInput = screen.getByTestId(testIds.imageUploader.input);

  const file = mockFile({ type: 'image/notsupported' });

  Object.defineProperty(fileInput, 'files', { value: [file] });

  fireEvent.change(fileInput);

  await waitFor(() =>
    expect(toast.error).toBeCalledWith(
      translations.common.imageUploader.notAllowedFileFormat
    )
  );
});

test('should call onChange', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const fileInput = screen.getByTestId(testIds.imageUploader.input);

  const file = mockFile({});

  Object.defineProperty(fileInput, 'files', { value: [file] });

  fireEvent.change(fileInput);

  await waitFor(() =>
    expect(onChange).toBeCalledWith(file, TEST_PIXEL_CROP, null)
  );
});

test('should open file selection dialog by clicking button', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  renderComponent({ onChange });

  const fileInput = screen.getByTestId(testIds.imageUploader.input);
  const button = screen.getByRole('button', {
    name: translations.common.imageUploader.buttonDropImage,
  });
  const spy = jest.spyOn(fileInput, 'click');

  await act(async () => await user.click(button));

  expect(spy).toBeCalled();
});

test('should call onChange with empty values when unselecting an image file', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const addImageButton = getElement('addImageButton');
  const file = mockFile({});

  fireEvent.drop(addImageButton, { dataTransfer: { files: [file] } });

  await waitFor(() =>
    expect(onChange).toBeCalledWith(file, TEST_PIXEL_CROP, null)
  );

  const removeImageButton = await findElement('removeImageButton');
  await act(async () => await userEvent.click(removeImageButton));
  await waitFor(() => expect(onChange).lastCalledWith(null, null, null));
});

test('should call onChange when droping file', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const addImageButton = getElement('addImageButton');
  const file = mockFile({});

  fireEvent.drop(addImageButton, { dataTransfer: { files: [file] } });

  await waitFor(() => {
    expect(onChange).toBeCalledWith(file, TEST_PIXEL_CROP, null);
  });
});

test('should not call onChange when droping file if component is disabled', async () => {
  const onChange = jest.fn();
  renderComponent({ disabled: true, onChange });

  const addImageButton = getElement('addImageButton');
  const file = mockFile({});

  fireEvent.drop(addImageButton, { dataTransfer: { files: [file] } });

  expect(onChange).not.toBeCalled();
});

test('should show border for label by dragOver', async () => {
  renderComponent();

  const addImageButton = getElement('addImageButton');

  fireEvent.dragOver(addImageButton);

  expect(addImageButton).toHaveClass('hover');

  fireEvent.dragLeave(addImageButton);

  expect(addImageButton).not.toHaveClass('hover');
});
