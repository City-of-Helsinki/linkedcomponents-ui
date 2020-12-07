import React from 'react';

import { ImagesDocument } from '../../../../../../generated/graphql';
import { fakeImages } from '../../../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../../utils/testUtils';
import translations from '../../../../../app/i18n/fi.json';
import AddImageForm, { AddImageFormProps } from '../AddImageForm';

const images = fakeImages(5);
const imagesResponse = {
  data: {
    images: {
      ...images,
      meta: {
        ...images.meta,
        count: 15,
        next: 'https://api.hel.fi/linkedevents/v1/image/?page=2',
      },
    },
  },
};

const mocks = [
  {
    request: {
      query: ImagesDocument,
      variables: { createPath: undefined, pageSize: 5 },
    },
    result: imagesResponse,
  },
];

const defaultProps: AddImageFormProps = {
  onCancel: jest.fn(),
  onFileChange: jest.fn(),
  onSubmit: jest.fn(),
};

const renderComponent = (props?: Partial<AddImageFormProps>) =>
  render(<AddImageForm {...defaultProps} {...props} />, { mocks });

test('should render add image form', () => {
  renderComponent();

  const titles = [
    translations.event.form.image.titleUseImportedImage,
    translations.event.form.image.titleImportFromHardDisk,
    translations.event.form.image.titleImportFromInternet,
  ];

  titles.forEach((name) => {
    expect(screen.queryByRole('heading', { name }));
  });

  const buttons = [translations.common.cancel, translations.common.add];

  buttons.forEach((name) => {
    expect(screen.queryByRole('button', { name }));
  });
});

test('submit button should be disabled by default', async () => {
  renderComponent();

  await waitFor(() => {
    expect(
      screen.queryByRole('button', { name: translations.common.add })
    ).toBeDisabled();
  });
});

test('should call onCancel', async () => {
  const onCancel = jest.fn();
  renderComponent({ onCancel });

  userEvent.click(
    screen.queryByRole('button', { name: translations.common.cancel })
  );

  expect(onCancel).toBeCalled();
});

test('should call onSubmit with existing image', async () => {
  const onSubmit = jest.fn();
  renderComponent({ onSubmit });

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });
  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
  });

  await waitFor(() => {
    expect(loadMoreButton).toBeEnabled();
  });

  expect(urlInput).toBeEnabled();

  userEvent.click(screen.getByRole('checkbox', { name: images.data[0].name }));

  expect(urlInput).toBeDisabled();

  const addButton = screen.queryByRole('button', {
    name: translations.common.add,
  });

  await waitFor(() => {
    expect(addButton).toBeEnabled();
  });

  userEvent.click(addButton);

  await waitFor(() => {
    expect(onSubmit).toBeCalledWith({
      selectedImage: [images.data[0].atId],
      url: '',
    });
  });
});

test('should validate url', async () => {
  renderComponent();

  const invalidUrlText = 'invalid url';
  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
  });

  expect(urlInput).toBeEnabled();

  userEvent.type(urlInput, invalidUrlText);

  userEvent.tab();

  const addButton = screen.queryByRole('button', {
    name: translations.common.add,
  });

  await waitFor(() => {
    expect(
      screen.getByText(translations.form.validation.string.url)
    ).toBeInTheDocument();
  });

  expect(addButton).toBeDisabled();
});

test('should call onSubmit with image url', async () => {
  const onSubmit = jest.fn();
  renderComponent({ onSubmit });

  const url = 'http://test.com';
  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });
  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
  });

  await waitFor(() => {
    expect(loadMoreButton).toBeEnabled();
  });

  expect(urlInput).toBeEnabled();

  userEvent.type(urlInput, url);

  expect(
    screen.getByRole('checkbox', { name: images.data[0].name })
  ).toBeDisabled();

  const addButton = screen.queryByRole('button', {
    name: translations.common.add,
  });

  await waitFor(() => {
    expect(addButton).toBeEnabled();
  });

  userEvent.click(addButton);

  await waitFor(() => {
    expect(onSubmit).toBeCalledWith({
      selectedImage: [],
      url,
    });
  });
});
