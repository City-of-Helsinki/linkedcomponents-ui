import React from 'react';

import {
  mockedPlaceResponse,
  placeId,
  placeName,
} from '../../../../common/components/placeSelector/__mocks__/placeSelector';
import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { EVENT_TYPE } from '../../../event/constants';
import FilterSummary from '../FilterSummary';

configure({ defaultHidden: true });

const text = 'Search word';
const end = '2021-10-13';
const start = '2021-10-05';
const type = EVENT_TYPE.General;

const mocks = [mockedPlaceResponse];

const renderComponent = (route = `/fi${ROUTES.SEARCH}`) =>
  render(<FilterSummary />, { mocks, routes: [route] });

test('should render and remove text filter', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(`/fi${ROUTES.SEARCH}?text=${text}`);

  const deleteFilterButton = screen.getByRole('button', {
    name: `Poista suodatusehto: ${text}`,
  });
  await user.click(deleteFilterButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe('');
});

test('should render and remove place filter', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(`/fi${ROUTES.SEARCH}?place=${placeId}`);

  const deleteFilterButton = await screen.findByRole('button', {
    name: `Poista suodatusehto: ${placeName}`,
  });
  await user.click(deleteFilterButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe('');
});

test('should render and remove date filter', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(
    `/fi${ROUTES.SEARCH}?end=${end}&start=${start}`
  );

  const deleteFilterButton = screen.getByRole('button', {
    name: `Poista suodatusehto: 5.10.2021 - 13.10.2021`,
  });
  await user.click(deleteFilterButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe('');
});

test('should render and remove type filter', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(`/fi${ROUTES.EVENTS}?type=${type}`);

  const deleteFilterButton = screen.getByRole('button', {
    name: `Poista suodatusehto: Tapahtuma`,
  });
  await user.click(deleteFilterButton);

  expect(history.location.pathname).toBe('/fi/events');
  expect(history.location.search).toBe('');
});

test('should remove all filters with clear button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(
    `/fi${ROUTES.SEARCH}?text=${text}&place=${placeId}&end=${end}&start=${start}&type=${type}`
  );

  screen.getByRole('button', {
    name: `Poista suodatusehto: ${text}`,
  });
  await screen.findByRole('button', {
    name: `Poista suodatusehto: ${placeName}`,
  });
  screen.getByRole('button', {
    name: `Poista suodatusehto: 5.10.2021 - 13.10.2021`,
  });
  screen.getByRole('button', {
    name: `Poista suodatusehto: Tapahtuma`,
  });

  const clearButton = screen.getByRole('button', {
    name: 'Tyhjennä hakuehdot',
  });
  await user.click(clearButton);

  expect(history.location.pathname).toBe('/fi/search');
  expect(history.location.search).toBe('');
});
