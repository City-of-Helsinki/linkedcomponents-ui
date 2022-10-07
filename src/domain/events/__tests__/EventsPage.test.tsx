import { createMemoryHistory } from 'history';
import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  draftEventsCount,
  mockedBaseDraftEventsResponse,
  mockedBasePublicEventsResponse,
  mockedBaseWaitingApprovalEventsResponse,
  mockedDraftEventsResponse,
  mockedPublicEventsResponse,
  mockedSortedWaitingApprovalEventsResponse,
  mockedWaitingApprovalEventsResponse,
  publicEventsCount,
  waitingApprovalEvents,
  waitingApprovalEventsCount,
} from '../__mocks__/eventPage';
import EventsPage from '../EventsPage';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const mocks = [
  mockedBaseWaitingApprovalEventsResponse,
  mockedWaitingApprovalEventsResponse,
  mockedSortedWaitingApprovalEventsResponse,
  mockedBasePublicEventsResponse,
  mockedPublicEventsResponse,
  mockedBaseDraftEventsResponse,
  mockedDraftEventsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const renderComponent = (renderOptions: CustomRenderOptions = {}) =>
  render(<EventsPage />, { authContextValue, mocks, ...renderOptions });

beforeEach(() => jest.clearAllMocks());

const getElement = (
  key:
    | 'createEventButton'
    | 'draftsTab'
    | 'eventCardType'
    | 'publishedTab'
    | 'sortName'
    | 'waitingApprovalTab'
    | 'waitingApprovalTable'
) => {
  switch (key) {
    case 'createEventButton':
      return screen.getByRole('button', { name: /lisää uusi tapahtuma/i });
    case 'draftsTab':
      return screen.getByRole('tab', {
        name: `Luonnokset (${draftEventsCount})`,
      });
    case 'eventCardType':
      return screen.getByRole('radio', { name: /korttinäkymä/i });
    case 'publishedTab':
      return screen.getByRole('tab', {
        name: `Julkaistut (${publicEventsCount})`,
      });
    case 'sortName':
      return screen.getByRole('button', { name: 'Nimi' });
    case 'waitingApprovalTab':
      return screen.getByRole('tab', {
        name: `Odottaa (${waitingApprovalEventsCount})`,
      });
    case 'waitingApprovalTable':
      return screen.getByRole('table', {
        name: /hyväksyntää odottavat tapahtumat, järjestys viimeksi muokattu, laskeva/i,
      });
  }
};

const findElement = (
  key: 'draftsTable' | 'publishedTable' | 'sortOrderButton'
) => {
  switch (key) {
    case 'draftsTable':
      return screen.findByRole('table', {
        name: /luonnokset, järjestys viimeksi muokattu, laskeva/i,
      });
    case 'publishedTable':
      return screen.findByRole('table', {
        name: /julkaistut tapahtumat, järjestys viimeksi muokattu, laskeva/i,
      });
    case 'sortOrderButton':
      return screen.findByRole('button', { name: 'Lajitteluperuste' });
  }
};

test('should show correct title, description and keywords', async () => {
  const pageTitle = 'Omat tapahtumat - Linked Events';
  const pageDescription =
    'Tapahtumien listaus. Hallinnoi tapahtumia: selaa ja muokkaa tapahtumia.';
  const pageKeywords =
    'minun, luetteloni, muokkaa, päivitä, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  renderComponent();

  await waitFor(() => expect(document.title).toEqual(pageTitle));

  const head = document.querySelector('head');
  const description = head?.querySelector('[name="description"]');
  const keywords = head?.querySelector('[name="keywords"]');
  const ogTitle = head?.querySelector('[property="og:title"]');
  const ogDescription = head?.querySelector('[property="og:description"]');

  expect(ogTitle).toHaveAttribute('content', pageTitle);
  expect(description).toHaveAttribute('content', pageDescription);
  expect(keywords).toHaveAttribute('content', pageKeywords);
  expect(ogDescription).toHaveAttribute('content', pageDescription);
});

test('should render events page', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  getElement('waitingApprovalTab');
  getElement('publishedTab');
  getElement('draftsTab');
  getElement('waitingApprovalTable');
});

test('should open create event page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  const createEventButton = getElement('createEventButton');
  await act(async () => await user.click(createEventButton));

  expect(history.location.pathname).toBe('/fi/events/create');
});

test('should change list type to event card', async () => {
  const user = userEvent.setup();

  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);
  expect(
    screen.queryByRole('button', { name: 'Listteluperuste' })
  ).not.toBeInTheDocument();

  const eventCardTypeRadio = getElement('eventCardType');
  await act(async () => await user.click(eventCardTypeRadio));

  await findElement('sortOrderButton');
});

test('should change active tab to published', async () => {
  const user = userEvent.setup();

  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  getElement('waitingApprovalTable');

  const publishedTab = getElement('publishedTab');
  await act(async () => await user.click(publishedTab));

  await findElement('publishedTable');
});

test('should change active tab to drafts', async () => {
  const user = userEvent.setup();

  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  const draftsTab = getElement('draftsTab');
  await act(async () => await user.click(draftsTab));

  await findElement('draftsTable');
});

test('should add sort parameter to search query', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  const sortNameButton = getElement('sortName');
  await act(async () => await user.click(sortNameButton));

  expect(history.location.search).toBe('?sort=name');
});

it('scrolls to event table row and calls history.replace correctly (deletes eventId from state)', async () => {
  const route = '/fi/events';
  const search = '?dateTypes=tomorrow,this_week';
  const history = createMemoryHistory();
  history.push(
    { search, pathname: route },
    { eventId: waitingApprovalEvents.data[0]?.id }
  );

  const replaceSpy = jest.spyOn(history, 'replace');

  renderComponent({ history, routes: [route] });

  await loadingSpinnerIsNotInDocument(10000);

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: search },
      {}
    )
  );

  const eventRowButton = screen.getByRole('button', {
    name: waitingApprovalEvents.data[0]?.name?.fi as string,
  });
  await waitFor(() => expect(eventRowButton).toHaveFocus());
});
