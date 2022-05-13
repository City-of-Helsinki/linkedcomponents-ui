import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { EVENT_TYPE } from '../../../event/constants';
import FilterSummary from '../FilterSummary';

configure({ defaultHidden: true });

const text = 'Search word';
const type = EVENT_TYPE.General;

const renderComponent = (route = `/fi${ROUTES.REGISTRATIONS}`) =>
  render(<FilterSummary />, { routes: [route] });

test('should render and remove text filter', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(
    `/fi${ROUTES.REGISTRATIONS}?text=${text}`
  );

  const deleteFilterButton = screen.getByRole('button', {
    name: `Poista suodatusehto: ${text}`,
  });
  await act(async () => await user.click(deleteFilterButton));

  expect(history.location.pathname).toBe('/fi/registrations');
  expect(history.location.search).toBe('');
});

test('should render and remove event type filter', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(
    `/fi${ROUTES.REGISTRATIONS}?eventType=${type}`
  );

  const deleteFilterButton = screen.getByRole('button', {
    name: `Poista suodatusehto: Tapahtuma`,
  });
  await act(async () => await user.click(deleteFilterButton));

  expect(history.location.pathname).toBe('/fi/registrations');
  expect(history.location.search).toBe('');
});

test('should remove all filters with clear button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(
    `/fi${ROUTES.REGISTRATIONS}?eventType=${type}&text=${text}`
  );

  screen.getByRole('button', { name: `Poista suodatusehto: ${text}` });

  screen.getByRole('button', { name: `Poista suodatusehto: Tapahtuma` });

  const clearButton = screen.getByRole('button', {
    name: 'Tyhjennä hakuehdot',
  });
  await act(async () => await user.click(clearButton));

  expect(history.location.pathname).toBe('/fi/registrations');
  expect(history.location.search).toBe('');
});
