import React from 'react';

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
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import {
  mockedFilteredSortedPriceGroupsResponse,
  mockedPage2PriceGroupsResponse,
  mockedPriceGroupsResponse,
  mockedSortedPriceGroupsResponse,
  page2PriceGroupDescriptions,
  priceGroupDescriptions,
  sortedPriceGroupDescriptions,
} from '../../__mocks__/priceGroupsPage';
import PriceGroupList from '../PriceGroupList';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedPriceGroupsResponse,
  mockedPage2PriceGroupsResponse,
  mockedSortedPriceGroupsResponse,
  mockedFilteredSortedPriceGroupsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const renderComponent = () => render(<PriceGroupList />, { mocks });

const getElement = (
  key:
    | 'page1Button'
    | 'page2Button'
    | 'searchButton'
    | 'searchInput'
    | 'sortByDescriptionButton'
) => {
  switch (key) {
    case 'page1Button':
      return screen.getByRole('link', { name: 'Sivu 1' });
    case 'page2Button':
      return screen.getByRole('link', { name: 'Sivu 2' });
    case 'searchButton':
      return screen.getByRole('button', { name: /etsi/i });
    case 'searchInput':
      return screen.getByRole('textbox', { name: /hae asiakasryhmiä/i });
    case 'sortByDescriptionButton':
      return screen.getByRole('button', { name: 'Kuvaus' });
  }
};

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 price group should be visible.
  screen.getByText(priceGroupDescriptions[0]);

  const page2Button = getElement('page2Button');
  await user.click(page2Button);

  await loadingSpinnerIsNotInDocument();
  // Page 2 price group should be visible.
  screen.getByText(page2PriceGroupDescriptions[0]);
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

  // Page 1 price groups should be visible.
  screen.getByText(priceGroupDescriptions[0]);
  await waitFor(() => expect(history.location.search).toBe(''));

  const sortByDescriptionButton = getElement('sortByDescriptionButton');
  await user.click(sortByDescriptionButton);

  await loadingSpinnerIsNotInDocument();
  // Sorted keywords should be visible.
  screen.getByText(sortedPriceGroupDescriptions[0]);
  await waitFor(() =>
    expect(history.location.search).toBe('?sort=-description')
  );
});

test('should search by text', async () => {
  const searchValue = priceGroupDescriptions[0];
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const searchInput = getElement('searchInput');
  fireEvent.change(searchInput, { target: { value: searchValue } });
  await user.click(getElement('searchButton'));

  await waitFor(() =>
    expect(history.location.search).toBe(
      `?text=${searchValue.replace(/ /g, '+')}`
    )
  );
});
