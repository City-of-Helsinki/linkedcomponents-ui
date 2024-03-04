import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  fireEvent,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import {
  imageNames,
  mockedFilteredImagesResponse,
  mockedImagesResponse,
  mockedPage2ImagesResponse,
  mockedSortedImagesResponse,
  page2ImageNames,
  sortedImageNames,
} from '../../__mocks__/imagesPage';
import ImageList from '../ImageList';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedFilteredImagesResponse,
  mockedImagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedPage2ImagesResponse,
  mockedSortedImagesResponse,
  mockedUserResponse,
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
      return screen.getByRole('link', { name: 'Sivu 1' });
    case 'page2Button':
      return screen.getByRole('link', { name: 'Sivu 2' });
    case 'searchButton':
      return screen.getByRole('button', { name: /etsi/i });
    case 'searchInput':
      return screen.getByRole('combobox', { name: /hae kuvia/i });
    case 'sortLastModifiedButton':
      return screen.getByRole('button', { name: /viimeksi muokattu/i });
  }
};

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 event should be visible.
  screen.getByText(imageNames[0]);

  const page2Button = getElement('page2Button');
  await user.click(page2Button);

  await loadingSpinnerIsNotInDocument();
  // Page 2 event should be visible.
  screen.getByText(page2ImageNames[0]);
  await waitFor(() => expect(history.location.search).toBe('?page=2'));

  // Should clear page from url search if selecting the first page
  const page1Button = getElement('page1Button');
  await user.click(page1Button);

  await waitFor(() => expect(history.location.search).toBe(''));
});

test('should change sort order', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 keywords should be visible.
  screen.getByText(imageNames[0]);
  await waitFor(() => expect(history.location.search).toBe(''));

  const sortLastModifiedButton = getElement('sortLastModifiedButton');
  await user.click(sortLastModifiedButton);

  await loadingSpinnerIsNotInDocument();
  // Sorted keywords should be visible.
  screen.getByText(sortedImageNames[0]);
  await waitFor(() =>
    expect(history.location.search).toBe('?sort=last_modified_time')
  );
});

test('should search by text', async () => {
  const searchValue = imageNames[0];
  const user = userEvent.setup();

  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  await waitFor(() => expect(history.location.search).toBe(''));

  const searchInput = getElement('searchInput');
  fireEvent.change(searchInput, { target: { value: searchValue } });
  await user.click(getElement('searchButton'));

  await waitFor(() =>
    expect(history.location.search).toBe(
      `?text=${searchValue.replace(/ /g, '+')}`
    )
  );
});
