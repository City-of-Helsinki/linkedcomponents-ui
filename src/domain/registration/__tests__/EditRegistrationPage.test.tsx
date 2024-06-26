import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  openDropdownMenu,
  renderWithRoute,
  screen,
  shouldDeleteInstance,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import {
  mockedDefaultPriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
} from '../../priceGroup/__mocks__/priceGroups';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  event,
  mockedDeleteRegistrationResponse,
  mockedInvalidUpdateRegistrationResponse,
  mockedNotFoundRegistrationResponse,
  mockedRegistrationResponse,
  mockedUpdatedRegistationResponse,
  mockedUpdateRegistrationResponse,
  registrationId,
} from '../__mocks__/editRegistrationPage';
import EditRegistrationPage from '../EditRegistrationPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const baseMocks = [
  mockedDefaultPriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_REGISTRATION.replace(':id', registrationId);

const renderComponent = (
  mocks: MockedResponse[] = baseMocks,
  renderOptions?: CustomRenderOptions
) =>
  renderWithRoute(<EditRegistrationPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_REGISTRATION,
    ...renderOptions,
  });

const findUpdateButton = () => {
  return screen.findByRole('button', { name: 'Tallenna muutokset' });
};

const findMinimumAttendeeCapacityInput = () => {
  return screen.findByRole('spinbutton', { name: /paikkojen vähimmäismäärä/i });
};

test('should show link to event page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const eventLink = await screen.findByRole('link', {
    name: getValue(event.name?.fi, ''),
  });
  await user.click(eventLink);

  expect(history.location.pathname).toBe(
    `/fi${ROUTES.EDIT_EVENT.replace(':id', event.id)}`
  );
});

test('should move to registrations page after deleting registration', async () => {
  const mocks = [...baseMocks, mockedDeleteRegistrationResponse];
  const { history } = renderComponent(mocks);

  await openDropdownMenu();

  await shouldDeleteInstance({
    confirmDeleteButtonLabel: 'Poista ilmoittautuminen',
    deleteButtonLabel: 'Poista ilmoittautuminen',
    expectedNotificationText: 'Ilmoittautuminen on poistettu',
    expectedUrl: `/fi/registrations`,
    history,
  });
});

test('should update registration', async () => {
  const mocks = [
    ...baseMocks,
    mockedUpdateRegistrationResponse,
    mockedUpdatedRegistationResponse,
  ];
  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const updateButton = await findUpdateButton();
  await user.click(updateButton);

  await loadingSpinnerIsNotInDocument(30000);
  await screen.findByText('23.8.2021 12.00');
});

test('should scroll to first error when validation error is thrown', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const minimumAttendeeCapacityInput = await findMinimumAttendeeCapacityInput();
  await user.clear(minimumAttendeeCapacityInput);
  await user.type(minimumAttendeeCapacityInput, '-1');

  const updateButton = await findUpdateButton();
  await user.click(updateButton);

  await waitFor(() => expect(minimumAttendeeCapacityInput).toHaveFocus());
});

test('should show "not found" page if registration doesn\'t exist', async () => {
  renderComponent([mockedNotFoundRegistrationResponse, mockedUserResponse], {
    routes: [ROUTES.EDIT_REGISTRATION.replace(':id', 'not-exist')],
  });

  await screen.findByText(
    'Etsimääsi sisältöä ei löydy. Kirjaudu sisään tai palaa kotisivulle.'
  );
});

test('should show server errors', async () => {
  const mocks = [...baseMocks, mockedInvalidUpdateRegistrationResponse];
  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const updateButton = await findUpdateButton();
  await user.click(updateButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
