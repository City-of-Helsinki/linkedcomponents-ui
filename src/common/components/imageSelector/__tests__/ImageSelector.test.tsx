import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  images,
  loadMoreImages,
  mockedImagesReponse,
  mockedLoadMoreImagesResponse,
  publisher,
} from '../__mocks__/imageSelector';
import ImageSelector, { ImageSelectorProps } from '../ImageSelector';

configure({ defaultHidden: true });

const defaultProps: ImageSelectorProps = {
  onChange: jest.fn(),
  publisher,
  value: [],
};

const mocks = [mockedImagesReponse, mockedLoadMoreImagesResponse];

const renderComponent = (props?: Partial<ImageSelectorProps>) =>
  render(<ImageSelector {...defaultProps} {...props} />, { mocks });

test('should render image selector', async () => {
  renderComponent();

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });
  await waitFor(() => expect(loadMoreButton).toBeEnabled());

  images.data.forEach((image) => {
    screen.getByRole('checkbox', { name: image.name });
  });
});

test('should load more images', async () => {
  const user = userEvent.setup();
  renderComponent();

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => expect(loadMoreButton).toBeEnabled());
  await act(async () => await user.click(loadMoreButton));

  await waitFor(() => expect(loadMoreButton).toBeEnabled());

  for (const image of loadMoreImages.data) {
    await screen.findByRole(
      'checkbox',
      { name: image.name },
      { timeout: 5000 }
    );
  }
});

test('should call onChange', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onChange });

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => expect(loadMoreButton).toBeEnabled());

  const { name, atId } = images.data[0];

  await act(
    async () => await user.click(screen.getByRole('checkbox', { name }))
  );
  expect(onChange).toBeCalledWith([atId]);
});

test('should clear value when clicking selected image', async () => {
  const onChange = jest.fn();
  const { name, atId } = images.data[0];
  const user = userEvent.setup();
  renderComponent({ onChange, value: [atId] });

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => expect(loadMoreButton).toBeEnabled());

  await act(
    async () => await user.click(screen.getByRole('checkbox', { name }))
  );
  expect(onChange).toBeCalledWith([]);
});

test('should call onChange with multiple image ids', async () => {
  const onChange = jest.fn();
  const { atId } = images.data[0];
  const user = userEvent.setup();
  renderComponent({ multiple: true, onChange, value: [atId] });

  const loadMoreButton = screen.getByRole('button', { name: /näytä lisää/i });

  await waitFor(() => expect(loadMoreButton).toBeEnabled());

  const { name, atId: atId2 } = images.data[1];
  await act(
    async () => await user.click(screen.getByRole('checkbox', { name }))
  );

  expect(onChange).toBeCalledWith([atId, atId2]);
});
