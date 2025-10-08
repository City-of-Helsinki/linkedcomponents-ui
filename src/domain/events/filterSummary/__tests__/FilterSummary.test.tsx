/* eslint-disable max-len */
import {
  mockedPlaceResponse,
  placeId,
  placeName,
} from '../../../../common/components/placeSelector/__mocks__/placeSelector';
import { ROUTES } from '../../../../constants';
import { EventStatus } from '../../../../generated/graphql';
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
const publisherId = organizations.data[0]?.id;
const publisherName = organizations.data[0]?.name as string;

const text = 'Search word';
const end = '2021-10-13';
const start = '2021-10-05';
const type = EVENT_TYPE.General;

const mocks = [mockedOrganizationsResponse, mockedPlaceResponse];

const renderComponent = (route = `/fi${ROUTES.SEARCH}`) =>
  render(<FilterSummary />, { mocks, routes: [route] });

test('should render and remove text filter', async () => {
  const { history } = renderComponent(
    `/fi${ROUTES.SEARCH}?x_full_text=${text}`
  );

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: `Poista suodatusehto: ${text}`,
    expectedPathname: '/fi/search',
    history,
  });
});

test('should render and remove place filter', async () => {
  const { history } = renderComponent(`/fi${ROUTES.SEARCH}?place=${placeId}`);

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: `Poista suodatusehto: ${placeName}`,
    expectedPathname: '/fi/search',
    history,
  });
});

test('should render and remove publisher filter', async () => {
  const { history } = renderComponent(
    `/fi${ROUTES.SEARCH}?publisher=${publisherId}`
  );

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: `Poista suodatusehto: ${publisherName}`,
    expectedPathname: '/fi/search',
    history,
  });
});

test('should render and remove date filter', async () => {
  const { history } = renderComponent(
    `/fi${ROUTES.SEARCH}?end=${end}&start=${start}`
  );

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: `Poista suodatusehto: 5.10.2021 - 13.10.2021`,
    expectedPathname: '/fi/search',
    history,
  });
});

test('should render and remove event status filter', async () => {
  const { history } = renderComponent(
    `/fi${ROUTES.SEARCH}?eventStatus=${EventStatus.EventCancelled}`
  );

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: 'Poista suodatusehto: Peruutettu',
    expectedPathname: '/fi/search',
    history,
  });
});

test('should render and remove type filter', async () => {
  const { history } = renderComponent(`/fi${ROUTES.SEARCH}?type=${type}`);

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: 'Poista suodatusehto: Tapahtuma',
    expectedPathname: '/fi/search',
    history,
  });
});

test('should remove all filters with clear button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(
    `/fi${ROUTES.SEARCH}?x_full_text=${text}&place=${placeId}&publisher=${publisherId}&end=${end}&start=${start}&type=${type}&eventStatus=${EventStatus.EventCancelled}`
  );

  screen.getByRole('button', {
    name: `Poista suodatusehto: ${text}`,
  });
  await screen.findByRole('button', {
    name: `Poista suodatusehto: ${placeName}`,
  });
  await screen.findByRole('button', {
    name: `Poista suodatusehto: ${publisherName}`,
  });
  screen.getByRole('button', {
    name: `Poista suodatusehto: 5.10.2021 - 13.10.2021`,
  });

  screen.getByRole('button', {
    name: `Poista suodatusehto: Peruutettu`,
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
