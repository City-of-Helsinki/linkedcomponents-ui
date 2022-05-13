import { createMemoryHistory } from 'history';
import React from 'react';

import { ROUTES } from '../../../constants';
import {
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  waitFor,
} from '../../../utils/testUtils';
import {
  eventNames,
  events,
  mockedEventsResponse,
  mockedPlacesResponse,
  searchText,
} from '../__mocks__/eventSearchPage';
import EventSearchPage from '../EventSearchPage';

const route = `${ROUTES.SEARCH}?text=${searchText}`;
const mocks = [mockedEventsResponse, mockedPlacesResponse];

const renderComponent = () =>
  render(<EventSearchPage />, { mocks, routes: [route] });

let initialHeadInnerHTML: string | null = null;

beforeEach(() => {
  const head: HTMLHeadElement | null = document.querySelector('head');
  initialHeadInnerHTML = head?.innerHTML || null;

  document.head.innerHTML = '';
});

afterEach(() => {
  document.head.innerHTML = initialHeadInnerHTML || '';
});

test('applies expected metadata', async () => {
  const pageTitle = 'Etsi tapahtumia - Linked Events';
  const pageDescription =
    'Hae tapahtumia Linked Eventsistä. Voit suodattaa tuloksia päivämäärän, paikan ja tyypin mukaan.';
  const pageKeywords =
    'haku, suodatus, päivämäärä, paikka, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  renderComponent();
  await loadingSpinnerIsNotInDocument();

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

test('should render events in the event list', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await screen.getByRole('heading', { name: eventNames[0] });
  await screen.getByRole('heading', { name: eventNames[1] });
});

test('should render events in the event list', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await screen.getByRole('heading', { name: eventNames[0] });
  await screen.getByRole('heading', { name: eventNames[1] });
});

it('scrolls to event card and calls history.replace correctly (deletes eventId from state)', async () => {
  const route = ROUTES.SEARCH;
  const history = createMemoryHistory();
  const search = `?text=${searchText}`;

  history.push({ search, pathname: route }, { eventId: events.data[0].id });

  const replaceSpy = jest.spyOn(history, 'replace');

  render(<EventSearchPage />, {
    history,
    mocks,
    routes: [route],
  });

  await loadingSpinnerIsNotInDocument();

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: search },
      {}
    )
  );

  const eventCard = screen.getByRole('link', { name: eventNames[0] });
  await waitFor(() => expect(eventCard).toHaveFocus());
});
