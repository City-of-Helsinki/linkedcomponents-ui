import React from 'react';

import { fakeImages } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { TEST_IMAGE_ID } from '../../../image/constants';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { imageNames, images } from '../../__mocks__/imagesPage';
import { IMAGE_SORT_OPTIONS } from '../../constants';
import ImagesTable, { ImagesTableProps } from '../ImagesTable';

configure({ defaultHidden: true });

const imageName = 'Image name';
const imageId = TEST_IMAGE_ID;

const defaultProps: ImagesTableProps = {
  caption: 'Images table',
  images: [],
  setSort: vi.fn(),
  sort: IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC,
};

const mocks = [mockedOrganizationAncestorsResponse];

const renderComponent = (props?: Partial<ImagesTableProps>) =>
  render(<ImagesTable {...defaultProps} {...props} />, { mocks });

test('should render images table', () => {
  renderComponent();

  const columnHeaders = [
    'Kuva',
    'ID',
    'Nimi',
    'Viimeksi muokattu Järjestetty laskevaan järjestykseen',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should render all images', () => {
  renderComponent({ images: images.data });

  for (const name of imageNames) {
    screen.getByRole('button', { name });
  }
});

test('should open edit image page by clicking keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    images: fakeImages(1, [{ name: imageName, id: imageId }]).data,
  });

  await user.click(screen.getByRole('button', { name: imageName }));

  expect(history.location.pathname).toBe(
    `/fi/administration/images/edit/${imageId}`
  );
});

test('should open edit keyword page by pressing enter on row', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    images: fakeImages(1, [{ name: imageName, id: imageId }]).data,
  });

  await user.type(screen.getByRole('button', { name: imageName }), '{enter}');

  expect(history.location.pathname).toBe(
    `/fi/administration/images/edit/${imageId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = vi.fn();
  const user = userEvent.setup();

  renderComponent({ setSort });

  const lastModifiedButton = screen.getByRole('button', {
    name: 'Viimeksi muokattu Järjestetty laskevaan järjestykseen',
  });
  await user.click(lastModifiedButton);
  expect(setSort).toBeCalledWith('last_modified_time');
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({
    images: fakeImages(1, [{ name: imageName, id: imageId }]).data,
  });

  const withinRow = within(screen.getByRole('button', { name: imageName }));
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa kuvaa/i,
  });

  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/images/edit/${imageId}`
    )
  );
});
