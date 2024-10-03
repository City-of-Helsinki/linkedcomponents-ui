/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';
import { createMemoryHistory } from 'history';

import { ROUTES } from '../../../constants';
import { AttendeeStatus } from '../../../generated/graphql';
import { fakeSignups } from '../../../utils/mockDataUtils';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  fireEvent,
  loadingSpinnerIsNotInDocument,
  pasteToTextEditor,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedNotFoundRegistrationResponse } from '../../registration/__mocks__/editRegistrationPage';
import {
  mockedRegistrationResponse,
  registration,
  registrationId,
} from '../../registration/__mocks__/registration';
import { mockedRegistrationUserResponse } from '../../user/__mocks__/user';
import {
  attendees,
  getMockedAttendeesResponse,
  mockedSendMessageResponse,
  sendMessageValues,
} from '../__mocks__/signupsPage';
import SignupsPage from '../SignupsPage';
import { shouldExportSignupsAsExcel } from './testUtils';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const route = ROUTES.REGISTRATION_SIGNUPS.replace(
  ':registrationId',
  registrationId
);

const defaultMocks = [
  mockedNotFoundRegistrationResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationResponse,
  mockedRegistrationUserResponse,
  getMockedAttendeesResponse({ signupsResponse: attendees }),
  getMockedAttendeesResponse({
    signupsResponse: fakeSignups(0),
    overrideVariables: {
      attendeeStatus: AttendeeStatus.Waitlisted,
    },
  }),
];

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

const findCreateSignupButton = () =>
  screen.findByRole('button', { name: /lisää osallistuja/i });

const getElement = (
  key:
    | 'attendeeTable'
    | 'createSignupButton'
    | 'exportAsExcel'
    | 'menu'
    | 'toggle'
    | 'waitingListTable'
) => {
  switch (key) {
    case 'attendeeTable':
      return screen.getByRole('table', { name: /osallistujat/i });
    case 'createSignupButton':
      return screen.getByRole('button', { name: /lisää osallistuja/i });
    case 'exportAsExcel':
      return screen.getByRole('button', {
        name: 'Lataa osallistujalista (Excel)',
      });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'toggle':
      return screen.getAllByRole('button', { name: /valinnat/i })[0];
    case 'waitingListTable':
      return screen.getByRole('table', { name: /jonopaikat/i });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await user.click(toggleButton);
  const menu = getElement('menu');

  return { menu, toggleButton };
};

const renderComponent = (
  mocks: MockedResponse[] = defaultMocks,
  renderOptions?: CustomRenderOptions
) =>
  renderWithRoute(<SignupsPage />, {
    mocks,
    routes: [route],
    path: ROUTES.REGISTRATION_SIGNUPS,
    ...renderOptions,
  });

test('should render signups page', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  await findCreateSignupButton();
  getElement('attendeeTable');
  getElement('waitingListTable');
});

test('scrolls to signup table row and calls history.replace correctly (deletes signupId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { signupId: attendees.data[0].id });

  const replaceSpy = vi.spyOn(history, 'replace');

  renderComponent(undefined, { history });

  await loadingSpinnerIsNotInDocument(10000);

  await waitFor(() =>
    expect(replaceSpy).toHaveBeenCalledWith(
      { hash: '', pathname: route, search: '' },
      {},
      { replace: true, state: {} }
    )
  );

  const attendeeName = [
    attendees.data[0].firstName,
    attendees.data[0].lastName,
  ].join(' ');
  const signupLink = screen.getByRole('link', { name: attendeeName });
  await waitFor(() => expect(signupLink).toHaveFocus());
});

test("should show not found page if registration doesn't exist", async () => {
  renderComponent(undefined, {
    routes: [
      ROUTES.REGISTRATION_SIGNUPS.replace(':registrationId', 'not-exist'),
    ],
  });

  await screen.findByText(
    'Etsimääsi sisältöä ei löydy. Kirjaudu sisään tai palaa kotisivulle.'
  );
});

test('should move to create signup page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();
  await loadingSpinnerIsNotInDocument(10000);

  const createButton = await findCreateSignupButton();
  await waitFor(() => expect(createButton).toBeEnabled(), { timeout: 5000 });
  await user.click(createButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/registrations/${registrationId}/signup-group/create`
    )
  );
});

test('should send message to participants', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedSendMessageResponse]);

  await loadingSpinnerIsNotInDocument(10000);
  const { menu } = await openMenu();
  const sendMessageButton = await within(menu).findByRole('button', {
    name: 'Lähetä viesti',
  });
  await user.click(sendMessageButton);

  const withinModal = within(
    screen.getByRole('dialog', { name: 'Lähetä viesti osallistujille' })
  );
  const subjectInput = withinModal.getByLabelText(/Otsikko/i);
  const messageInput = await withinModal.findByLabelText(
    /tekstimuotoilueditori. muokkausalue: main/i
  );
  fireEvent.change(subjectInput, {
    target: { value: sendMessageValues.subject },
  });
  pasteToTextEditor(messageInput, sendMessageValues.body);

  const confirmSendMessageButton = withinModal.getByRole('button', {
    name: 'Lähetä viesti',
  });
  await user.click(confirmSendMessageButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});

test('should route to attendance list page when clicking mark present button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedSendMessageResponse,
  ]);

  await loadingSpinnerIsNotInDocument(10000);
  const { menu } = await openMenu();

  const markPresentButton = await within(menu).findByRole('button', {
    name: 'Merkkaa läsnäolijat',
  });

  await user.click(markPresentButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/attendance-list`
    )
  );
});

test('should export signups as an excel after clicking export as excel button', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument(10000);
  await openMenu();
  const exportAsExcelButton = getElement('exportAsExcel');
  await shouldExportSignupsAsExcel({ exportAsExcelButton, registration });
});
