import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast } from 'react-toastify';

import translations from '../../../../domain/app/i18n/fi.json';
import { mockFile } from '../../../../utils/testUtils';
import ImageUploader, { ImageUploaderProps, testIds } from '../ImageUploader';

const defaultProps: ImageUploaderProps = {
  onChange: jest.fn(),
};

const renderComponent = (props?: Partial<ImageUploaderProps>) =>
  render(<ImageUploader {...defaultProps} {...props} />);

test('should render ImageUploader', () => {
  renderComponent();

  expect(
    screen.getByRole('button', {
      name: translations.common.imageUploader.buttonDropImage,
    })
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

  await waitFor(() => {
    expect(toast.error).toBeCalledWith(
      translations.common.imageUploader.notAllowedFileFormat
    );
  });
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

  await waitFor(() => {
    expect(toast.error).toBeCalledWith(
      'Tiedostokoko on liian suuri. Tiedoston maksimikoko on 2 Mt'
    );
  });
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

  await waitFor(() => {
    expect(onChange).toBeCalledWith(file);
  });
});

test('should open file selection dialog by clicking button', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  renderComponent({ onChange });

  const fileInput = screen.getByTestId(testIds.input);
  const button = screen.getByRole('button', {
    name: translations.common.imageUploader.buttonDropImage,
  });
  const spy = jest.spyOn(fileInput, 'click');

  await act(async () => await user.click(button));

  expect(spy).toBeCalled();
});

test('should call onChange when droping file', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const button = screen.getByRole('button', {
    name: translations.common.imageUploader.buttonDropImage,
  });
  const file = mockFile({});

  fireEvent.drop(button, {
    dataTransfer: {
      files: [file],
    },
  });

  await waitFor(() => {
    expect(onChange).toBeCalledWith(file);
  });
});

test('should not call onChange when droping file if component is disabled', async () => {
  const onChange = jest.fn();
  renderComponent({ disabled: true, onChange });

  const button = screen.getByRole('button', {
    name: translations.common.imageUploader.buttonDropImage,
  });
  const file = mockFile({});

  fireEvent.drop(button, {
    dataTransfer: {
      files: [file],
    },
  });

  expect(onChange).not.toBeCalledWith(file);
});

test('should show border for label by dragOver', async () => {
  renderComponent();

  const button = screen.getByRole('button', {
    name: translations.common.imageUploader.buttonDropImage,
  });

  fireEvent.dragOver(button);

  expect(button).toHaveClass('hover');

  fireEvent.dragLeave(button);

  expect(button).not.toHaveClass('hover');
});
