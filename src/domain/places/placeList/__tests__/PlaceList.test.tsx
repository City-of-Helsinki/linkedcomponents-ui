import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedPage2PlacesResponse,
  mockedPlacesResponse,
  mockedSortedPlacesResponse,
  page2PlaceNames,
  placeNames,
  sortedPlaceNames,
} from '../../__mocks__/placesPage';
import PlaceList from '../PlaceList';

configure({ defaultHidden: true });

const mocks = [
  mockedPlacesResponse,
  mockedPage2PlacesResponse,
  mockedSortedPlacesResponse,
];

const renderComponent = () => render(<PlaceList />, { mocks });

const getElement = (
  key:
    | 'page1Button'
    | 'page2Button'
    | 'searchButton'
    | 'searchInput'
    | 'sortNameButton'
) => {
  switch (key) {
    case 'page1Button':
      return screen.getByRole('button', { name: 'Sivu 1' });
    case 'page2Button':
      return screen.getByRole('button', { name: 'Sivu 2' });
    case 'searchButton':
      return screen.getByRole('button', { name: /etsi/i });
    case 'searchInput':
      return screen.getByRole('searchbox', { name: /hae paikkoja/i });
    case 'sortNameButton':
      return screen.getByRole('button', { name: /nimi/i });
  }
};

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 event should be visible.
  screen.getByRole('button', { name: placeNames[0] });

  const page2Button = getElement('page2Button');
  await act(async () => await user.click(page2Button));

  await loadingSpinnerIsNotInDocument();
  // Page 2 event should be visible.
  screen.getByRole('button', { name: page2PlaceNames[0] });
  await waitFor(() => expect(history.location.search).toBe('?page=2'));

  // Should clear page from url search if selecting the first page
  const page1Button = getElement('page1Button');
  await act(async () => await user.click(page1Button));

  await waitFor(() => expect(history.location.search).toBe(''));
});

test('should change sort order', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 keywords should be visible.
  screen.getByRole('button', { name: placeNames[0] });
  await waitFor(() => expect(history.location.search).toBe(''));

  const sortNameButton = getElement('sortNameButton');
  await act(async () => await user.click(sortNameButton));

  await loadingSpinnerIsNotInDocument();
  // Sorted keywords should be visible.
  screen.getByRole('button', { name: sortedPlaceNames[0] });
  await waitFor(() => expect(history.location.search).toBe('?sort=name'));
});

test('should search by text', async () => {
  const searchValue = 'search';
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 keywords should be visible.
  screen.getByRole('button', { name: placeNames[0] });
  await waitFor(() => expect(history.location.search).toBe(''));

  await act(
    async () => await user.type(getElement('searchInput'), searchValue)
  );
  await act(async () => await user.click(getElement('searchButton')));

  await waitFor(() =>
    expect(history.location.search).toBe(`?text=${searchValue}`)
  );
});
