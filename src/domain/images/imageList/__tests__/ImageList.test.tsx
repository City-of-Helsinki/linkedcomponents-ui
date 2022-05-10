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
  imageNames,
  mockedImagesResponse,
  mockedPage2ImagesResponse,
  mockedSortedImagesResponse,
  page2ImageNames,
  sortedImageNames,
} from '../../__mocks__/imagesPage';
import ImageList from '../ImageList';

configure({ defaultHidden: true });

const mocks = [
  mockedImagesResponse,
  mockedPage2ImagesResponse,
  mockedSortedImagesResponse,
];

const renderComponent = () => render(<ImageList />, { mocks });

const getElement = (
  key:
    | 'page1Button'
    | 'page2Button'
    | 'searchButton'
    | 'searchInput'
    | 'sortLastModifiedButton'
) => {
  switch (key) {
    case 'page1Button':
      return screen.getByRole('button', { name: 'Sivu 1' });
    case 'page2Button':
      return screen.getByRole('button', { name: 'Sivu 2' });
    case 'searchButton':
      return screen.getByRole('button', { name: /etsi/i });
    case 'searchInput':
      return screen.getByRole('searchbox', { name: /hae kuvia/i });
    case 'sortLastModifiedButton':
      return screen.getByRole('button', { name: /viimeksi muokattu/i });
  }
};

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 event should be visible.
  screen.getByRole('button', { name: imageNames[0] });

  const page2Button = getElement('page2Button');
  await act(async () => await user.click(page2Button));

  await loadingSpinnerIsNotInDocument();
  // Page 2 event should be visible.
  screen.getByRole('button', { name: page2ImageNames[0] });
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
  screen.getByRole('button', { name: imageNames[0] });
  await waitFor(() => expect(history.location.search).toBe(''));

  const sortLastModifiedButton = getElement('sortLastModifiedButton');
  await act(async () => await user.click(sortLastModifiedButton));

  await loadingSpinnerIsNotInDocument();
  // Sorted keywords should be visible.
  screen.getByRole('button', { name: sortedImageNames[0] });
  await waitFor(() =>
    expect(history.location.search).toBe('?sort=last_modified_time')
  );
});

test('should search by text', async () => {
  const searchValue = 'search';
  const user = userEvent.setup();

  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 keywords should be visible.
  screen.getByRole('button', { name: imageNames[0] });
  await waitFor(() => expect(history.location.search).toBe(''));

  await act(
    async () => await user.type(getElement('searchInput'), searchValue)
  );
  await act(async () => await user.click(getElement('searchButton')));

  await waitFor(() =>
    expect(history.location.search).toBe(`?text=${searchValue}`)
  );
});
