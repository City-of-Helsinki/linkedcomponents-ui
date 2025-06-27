import { createMemoryHistory } from 'history';

import { ROUTES } from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationsResponse } from '../../organizations/__mocks__/organizationsPage';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  eventNames,
  events,
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
} from '../__mocks__/eventSearchPage';
import EventSearchPage from '../EventSearchPage';

let initialHeadInnerHTML: string | null = null;

configure({ defaultHidden: true });

afterEach(() => {
  document.head.innerHTML = initialHeadInnerHTML || '';
  vi.resetAllMocks();
});

beforeEach(() => {
  const head: HTMLHeadElement | null = document.querySelector('head');
  initialHeadInnerHTML = head?.innerHTML || null;

  document.head.innerHTML = '';
  mockAuthenticatedLoginState();
});

const route = `${ROUTES.SEARCH}?x_full_text=${searchText}`;
const mocks = [
  mockedEventsResponse,
  mockedOrganizationsResponse,
  mockedPlacesResponse,
  mockedUserResponse,
];

const renderComponent = () =>
  render(<EventSearchPage />, { mocks, routes: [route] });

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription:
      'Hae tapahtumia Linked Eventsistä. Voit suodattaa tuloksia päivämäärän, paikan ja tyypin mukaan.',
    expectedKeywords:
      'haku, suodatus, päivämäärä, paikka, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Etsi tapahtumia - Linked Events',
  });
});

test('should render events in the event list', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  screen.getByRole('heading', { name: eventNames[0] });
  screen.getByRole('heading', { name: eventNames[1] });
});

it('scrolls to event card and calls history.replace correctly (deletes eventId from state)', async () => {
  const route = ROUTES.SEARCH;
  const history = createMemoryHistory();
  const search = `?x_full_text=${searchText}`;

  history.push({ search, pathname: route }, { eventId: events.data[0]?.id });

  const replaceSpy = vi.spyOn(history, 'replace');

  render(<EventSearchPage />, {
    history,
    mocks,
    routes: [route],
  });

  await loadingSpinnerIsNotInDocument();

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: search },
      {},
      { replace: true, state: {} }
    )
  );

  const eventCardCTA = screen.getByRole('link', {
    name: `Siirry tapahtumasivulle: ${eventNames[0]}`,
  });

  await waitFor(() => expect(eventCardCTA).toHaveFocus());
});
