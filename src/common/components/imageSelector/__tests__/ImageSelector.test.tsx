import React from 'react';

import { ImagesDocument } from '../../../../generated/graphql';
import { fakeImages } from '../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import ImageSelector, { ImageSelectorProps } from '../ImageSelector';

const defaultProps: ImageSelectorProps = {
  onChange: jest.fn(),
  value: [],
};

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

const loadMoreImages = fakeImages(5);
const loadMoreImagesResponse = {
  data: {
    images: {
      ...loadMoreImages,
      meta: {
        ...loadMoreImages.meta,
        count: 15,
        next: 'https://api.hel.fi/linkedevents/v1/image/?page=3',
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
  {
    request: {
      query: ImagesDocument,
      variables: { createPath: undefined, page: 2, pageSize: 5 },
    },
    result: loadMoreImagesResponse,
  },
];

const renderComponent = (props?: Partial<ImageSelectorProps>) =>
  render(<ImageSelector {...defaultProps} {...props} />, { mocks });

test('should render image selector', async () => {
  renderComponent();

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => {
    expect(loadMoreButton).toBeEnabled();
  });

  images.data.forEach((image) => {
    expect(
      screen.getByRole('checkbox', { name: image.name })
    ).toBeInTheDocument();
  });
});

test('should load more images', async () => {
  renderComponent();

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => {
    expect(loadMoreButton).toBeEnabled();
  });

  userEvent.click(loadMoreButton);

  await waitFor(() => {
    expect(loadMoreButton).toBeEnabled();
  });

  loadMoreImages.data.forEach((image) => {
    expect(
      screen.getByRole('checkbox', { name: image.name })
    ).toBeInTheDocument();
  });
});

test('should call onChange', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => {
    expect(loadMoreButton).toBeEnabled();
  });

  const { name, atId } = images.data[0];

  userEvent.click(screen.getByRole('checkbox', { name }));
  expect(onChange).toBeCalledWith([atId]);
});

test('should clear value when clicking selected image', async () => {
  const onChange = jest.fn();
  const { name, atId } = images.data[0];
  renderComponent({ onChange, value: [atId] });

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => {
    expect(loadMoreButton).toBeEnabled();
  });

  userEvent.click(screen.getByRole('checkbox', { name }));
  expect(onChange).toBeCalledWith([]);
});

test('should call onChange with multiple image ids', async () => {
  const onChange = jest.fn();
  const { atId } = images.data[0];
  renderComponent({ multiple: true, onChange, value: [atId] });

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => {
    expect(loadMoreButton).toBeEnabled();
  });

  const { name, atId: atId2 } = images.data[1];
  userEvent.click(screen.getByRole('checkbox', { name }));

  expect(onChange).toBeCalledWith([atId, atId2]);
});
