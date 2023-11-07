import React from 'react';

import { fakePlaces } from '../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PLACE_ID } from '../../../place/constants';
import { placeNames, places } from '../../__mocks__/placesPage';
import { PLACE_SORT_OPTIONS } from '../../constants';
import PlacesTable, { PlacesTableProps } from '../PlacesTable';

configure({ defaultHidden: true });

const placeName = 'Place name';
const placeId = TEST_PLACE_ID;

const defaultProps: PlacesTableProps = {
  caption: 'Keywords table',
  places: [],
  setSort: vi.fn(),
  sort: PLACE_SORT_OPTIONS.NAME,
};

const mocks = [mockedOrganizationAncestorsResponse];

const renderComponent = (props?: Partial<PlacesTableProps>) =>
  render(<PlacesTable {...defaultProps} {...props} />, { mocks });

test('should render places table', () => {
  renderComponent();

  const columnHeaders = ['ID', 'Nimi', 'Tapahtumien lkm', 'Katuosoite'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should render all places', () => {
  renderComponent({ places: places.data });

  // Test only first 2 to keep this test performant
  for (const name of placeNames.slice(0, 2)) {
    screen.getByRole('button', { name });
  }
});

test('should open edit place page by clicking keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    places: fakePlaces(1, [{ name: { fi: placeName }, id: placeId }]).data,
  });

  await user.click(screen.getByRole('button', { name: placeName }));

  expect(history.location.pathname).toBe(
    `/fi/administration/places/edit/${placeId}`
  );
});

test('should open edit keyword page by pressing enter on row', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    places: fakePlaces(1, [{ name: { fi: placeName }, id: placeId }]).data,
  });

  await user.type(screen.getByRole('button', { name: placeName }), '{enter}');
  expect(history.location.pathname).toBe(
    `/fi/administration/places/edit/${placeId}`
  );
});

test('should call setSort when clicking sortable column header', async () => {
  const setSort = vi.fn();
  const user = userEvent.setup();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', {
    name: 'Nimi',
  });
  await user.click(nameButton);
  await waitFor(() => expect(setSort).toBeCalledWith('-name'));

  const idButton = screen.getByRole('button', { name: 'ID' });
  await user.click(idButton);

  await waitFor(() => expect(setSort).toBeCalledWith('id'));

  const nEventsButton = screen.getByRole('button', { name: 'Tapahtumien lkm' });
  await user.click(nEventsButton);

  await waitFor(() => expect(setSort).toBeCalledWith('n_events'));
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({
    places: fakePlaces(1, [{ name: { fi: placeName }, id: placeId }]).data,
  });

  const withinRow = within(screen.getByRole('button', { name: placeName }));
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa paikkaa/i,
  });
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/places/edit/${placeId}`
    )
  );
});
