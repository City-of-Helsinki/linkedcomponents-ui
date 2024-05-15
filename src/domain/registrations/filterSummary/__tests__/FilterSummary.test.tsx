import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  shouldDisplayAndRemoveFilter,
  userEvent,
} from '../../../../utils/testUtils';
import { EVENT_TYPE } from '../../../event/constants';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../../organizations/__mocks__/organizationsPage';
import FilterSummary from '../FilterSummary';

configure({ defaultHidden: true });

const text = 'Search word';
const type = EVENT_TYPE.General;
const publisherId = organizations.data[0]?.id;
const publisherName = organizations.data[0]?.name as string;

const mocks = [mockedOrganizationsResponse];

const renderComponent = (route = `/fi${ROUTES.REGISTRATIONS}`) =>
  render(<FilterSummary />, { routes: [route], mocks });

test('should render and remove text filter', async () => {
  const { history } = renderComponent(
    `/fi${ROUTES.REGISTRATIONS}?text=${text}`
  );

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: `Poista suodatusehto: ${text}`,
    expectedPathname: '/fi/registrations',
    history,
  });
});

test('should render and remove event type filter', async () => {
  const { history } = renderComponent(
    `/fi${ROUTES.REGISTRATIONS}?eventType=${type}`
  );

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: 'Poista suodatusehto: Tapahtuma',
    expectedPathname: '/fi/registrations',
    history,
  });
});

test('should render and remove publisher filter', async () => {
  const { history } = renderComponent(
    `/fi${ROUTES.REGISTRATIONS}?publisher=${publisherId}`
  );

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: `Poista suodatusehto: ${publisherName}`,
    expectedPathname: '/fi/registrations',
    history,
  });
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
  await user.click(clearButton);

  expect(history.location.pathname).toBe('/fi/registrations');
  expect(history.location.search).toBe('');
});
