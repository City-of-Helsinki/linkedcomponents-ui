import { createMemoryHistory } from 'history';
import React from 'react';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  waitPageMetaDataToBeSet,
} from '../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedPlacesResponse,
  mockedSortedPlacesResponse,
  placeNames,
  places,
} from '../__mocks__/placesPage';
import PlacesPage from '../PlacesPage';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [
  mockedOrganizationAncestorsResponse,
  mockedPlacesResponse,
  mockedSortedPlacesResponse,
  mockedUserResponse,
];
const route = ROUTES.PLACES;

const renderComponent = ({
  mocks = defaultMocks,
  routes = [route],
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<PlacesPage />, {
    authContextValue,
    mocks,
    routes,
    ...restRenderOptions,
  });

const findElement = (key: 'title') => {
  switch (key) {
    case 'title':
      return screen.findByRole('heading', { name: 'Paikat' });
  }
};

const getElement = (
  key:
    | 'breadcrumb'
    | 'createPlaceButton'
    | 'searchInput'
    | 'sortNameButton'
    | 'table'
    | 'title'
) => {
  switch (key) {
    case 'breadcrumb':
      return screen.getByRole('navigation', { name: 'Murupolku' });
    case 'createPlaceButton':
      return screen.getByRole('button', { name: 'Lisää paikka' });
    case 'searchInput':
      return screen.getByRole('combobox', { name: 'Hae paikkoja' });
    case 'sortNameButton':
      return screen.getByRole('button', { name: /nimi/i });
    case 'table':
      return screen.getByRole('table', {
        name: 'Paikat, järjestys Tapahtumien lukumäärä, laskeva',
      });
    case 'title':
      return screen.getByRole('heading', { name: 'Paikat' });
  }
};

test('should render keywords page', async () => {
  renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();
  getElement('breadcrumb');
  getElement('createPlaceButton');
  getElement('searchInput');
  getElement('table');
  screen.getByRole('button', { name: placeNames[0] });
});

test('applies expected metadata', async () => {
  const pageTitle = 'Paikat - Linked Events';
  const pageDescription =
    'Paikkojen listaus. Selaa, suodata ja muokkaa Linked Eventsin paikkoja.';
  const pageKeywords =
    'paikka, lista, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
});

test('should open create place page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await findElement('title');
  await loadingSpinnerIsNotInDocument();

  const createKeywordButton = getElement('createPlaceButton');
  await user.click(createKeywordButton);

  expect(history.location.pathname).toBe('/fi/administration/places/create');
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const sortNameButton = getElement('sortNameButton');
  await user.click(sortNameButton);

  expect(history.location.search).toBe('?sort=name');
});

it('scrolls to place row and calls history.replace correctly (deletes placeId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { placeId: places.data[0]?.id });

  const replaceSpy = jest.spyOn(history, 'replace');

  renderComponent({ history });

  await loadingSpinnerIsNotInDocument();
  const keywordButton = screen.getByRole('button', { name: placeNames[0] });

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  await waitFor(() => expect(keywordButton).toHaveFocus());
});
