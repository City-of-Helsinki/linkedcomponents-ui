import { createMemoryHistory } from 'history';

import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
  shouldClickListPageCreateButton,
  shouldSortListPageTable,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedOrganizationsResponse } from '../../organizations/__mocks__/organizationsPage';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  draftEventsCount,
  mockedBaseDraftEventsResponse,
  mockedBaseOwnPublishedEventsResponse,
  mockedBasePublicEventsResponse,
  mockedBaseWaitingApprovalEventsResponse,
  mockedDraftEventsResponse,
  mockedOwnPublishedEventsResponse,
  mockedPublicEventsResponse,
  mockedSortedWaitingApprovalEventsResponse,
  mockedWaitingApprovalEventsResponse,
  ownPublishedEventsCount,
  publicEventsCount,
  waitingApprovalEvents,
  waitingApprovalEventsCount,
} from '../__mocks__/eventsPage';
import EventsPage from '../EventsPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedBaseWaitingApprovalEventsResponse,
  mockedWaitingApprovalEventsResponse,
  mockedSortedWaitingApprovalEventsResponse,
  mockedBasePublicEventsResponse,
  mockedPublicEventsResponse,
  mockedBaseOwnPublishedEventsResponse,
  mockedOwnPublishedEventsResponse,
  mockedBaseDraftEventsResponse,
  mockedDraftEventsResponse,
  mockedOrganizationResponse,
  mockedOrganizationsResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const renderComponent = (renderOptions: CustomRenderOptions = {}) =>
  render(<EventsPage />, { mocks, ...renderOptions });

beforeEach(() => {
  vi.clearAllMocks();
});

const getElement = (
  key:
    | 'draftsTab'
    | 'eventCardType'
    | 'ownPublishedTab'
    | 'publishedTab'
    | 'waitingApprovalTab'
    | 'waitingApprovalTable'
) => {
  switch (key) {
    case 'draftsTab':
      return screen.getByRole('tab', {
        name: `Luonnokset (${draftEventsCount})`,
      });
    case 'eventCardType':
      return screen.getByRole('radio', { name: /korttinäkymä/i });
    case 'ownPublishedTab':
      return screen.getByRole('tab', {
        name: `Omat julkaistut (${ownPublishedEventsCount})`,
      });
    case 'publishedTab':
      return screen.getByRole('tab', {
        name: `Julkaistut (${publicEventsCount})`,
      });
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
  key:
    | 'draftsTable'
    | 'ownPublishedTable'
    | 'publishedTable'
    | 'sortOrderButton'
) => {
  switch (key) {
    case 'draftsTable':
      return screen.findByRole('table', {
        name: /luonnokset, järjestys viimeksi muokattu, laskeva/i,
      });
    case 'ownPublishedTable':
      return screen.findByRole('table', {
        name: /omat julkaistut tapahtumat, järjestys viimeksi muokattu, laskeva/i,
      });
    case 'publishedTable':
      return screen.findByRole('table', {
        name: /julkaistut tapahtumat, järjestys viimeksi muokattu, laskeva/i,
      });
    case 'sortOrderButton':
      return screen.findByRole('combobox', { name: /lajitteluperuste/i });
  }
};

test('should show correct title, description and keywords', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Tapahtumien listaus. Hallinnoi tapahtumia: selaa ja muokkaa tapahtumia.',
    expectedKeywords:
      'minun, luetteloni, muokkaa, päivitä, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Omat tapahtumat - Linked Events',
  });
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
  const { history } = renderComponent();

  await shouldClickListPageCreateButton({
    createButtonLabel: /lisää uusi tapahtuma/i,
    expectedPathname: '/fi/events/create',
    history,
  });
});

test('should change list type to event card', async () => {
  const user = userEvent.setup();

  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);
  expect(
    screen.queryByRole('button', { name: 'Listteluperuste' })
  ).not.toBeInTheDocument();

  const eventCardTypeRadio = getElement('eventCardType');
  await user.click(eventCardTypeRadio);

  await findElement('sortOrderButton');
});

test('should change active tab to published', async () => {
  const user = userEvent.setup();

  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  const publishedTab = getElement('publishedTab');
  await user.click(publishedTab);

  await findElement('publishedTable');
});

test('should change active tab to own published', async () => {
  const user = userEvent.setup();

  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  const ownPublishedTab = getElement('ownPublishedTab');
  await user.click(ownPublishedTab);

  await findElement('ownPublishedTable');
});

test('should change active tab to drafts', async () => {
  const user = userEvent.setup();

  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  const draftsTab = getElement('draftsTab');
  await user.click(draftsTab);

  await findElement('draftsTable');
});

test('should add sort parameter to search query', async () => {
  const { history } = renderComponent();

  await shouldSortListPageTable({
    columnHeader: 'Nimi',
    expectedSearch: '?sort=name',
    history,
  });
});

it('scrolls to event table row and calls history.replace correctly (deletes eventId from state)', async () => {
  const route = '/fi/events';
  const search = '?dateTypes=tomorrow,this_week';
  const history = createMemoryHistory();
  history.push(
    { search, pathname: route },
    { eventId: waitingApprovalEvents.data[0]?.id }
  );

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent({ history, routes: [route] });

  await loadingSpinnerIsNotInDocument(10000);

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: search },
      {},
      { replace: true, state: {} }
    )
  );

  const eventLink = screen.getByRole('link', {
    name: getValue(waitingApprovalEvents.data[0]?.name?.fi, ''),
  });
  await waitFor(() => expect(eventLink).toHaveFocus());
});
