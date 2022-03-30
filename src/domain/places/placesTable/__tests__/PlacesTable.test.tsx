import { fakePlaces } from '../../../../utils/mockDataUtils';
import { act, render, screen, userEvent } from '../../../../utils/testUtils';
import { TEST_PLACE_ID } from '../../../place/constants';
import { placeNames, places } from '../../__mocks__/placesPage';
import { PLACE_SORT_OPTIONS } from '../../constants';
import PlacesTable, { PlacesTableProps } from '../PlacesTable';

const defaultProps: PlacesTableProps = {
  caption: 'Keywords table',
  places: [],
  setSort: jest.fn(),
  sort: PLACE_SORT_OPTIONS.NAME,
};

const renderComponent = (props?: Partial<PlacesTableProps>) =>
  render(<PlacesTable {...defaultProps} {...props} />);

test('should render places table', () => {
  renderComponent();

  const columnHeaders = ['ID', 'Nimi', 'Tapahtumien lkm', 'Katuosoite'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText('Ei tuloksia');
});

test('should render all places', () => {
  renderComponent({ places: places.data });

  // Test only first 2 to keep this test performant
  for (const name of placeNames.slice(0, 2)) {
    screen.getByRole('button', { name });
  }
});

test('should open edit place page by clicking keyword', () => {
  const placeName = 'Place name';
  const placeId = TEST_PLACE_ID;
  const { history } = renderComponent({
    places: fakePlaces(1, [{ name: { fi: placeName }, id: placeId }]).data,
  });

  act(() => userEvent.click(screen.getByRole('button', { name: placeName })));

  expect(history.location.pathname).toBe(`/fi/admin/places/edit/${placeId}`);
});

test('should open edit keyword page by pressing enter on row', () => {
  const placeName = 'Place name';
  const placeId = TEST_PLACE_ID;
  const { history } = renderComponent({
    places: fakePlaces(1, [{ name: { fi: placeName }, id: placeId }]).data,
  });

  act(() =>
    userEvent.type(screen.getByRole('button', { name: placeName }), '{enter}')
  );
  expect(history.location.pathname).toBe(`/fi/admin/places/edit/${placeId}`);
});

test('should call setSort when clicking sortable column header', () => {
  const setSort = jest.fn();
  renderComponent({ setSort });

  const nameButton = screen.getByRole('button', { name: 'Nimi' });
  act(() => userEvent.click(nameButton));
  expect(setSort).toBeCalledWith('-name');

  const idButton = screen.getByRole('button', { name: 'ID' });
  userEvent.click(idButton);

  expect(setSort).toBeCalledWith('id');

  const nEventsButton = screen.getByRole('button', { name: 'Tapahtumien lkm' });
  userEvent.click(nEventsButton);

  expect(setSort).toBeCalledWith('n_events');
});
