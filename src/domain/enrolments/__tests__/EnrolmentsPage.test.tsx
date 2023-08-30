/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';
import { createMemoryHistory } from 'history';
import React from 'react';

import { ROUTES } from '../../../constants';
import { AttendeeStatus } from '../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import { fakeEnrolments } from '../../../utils/mockDataUtils';
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
  registrationId,
} from '../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  attendees,
  getMockedAttendeesResponse,
  mockedSendMessageResponse,
  sendMessageValues,
} from '../__mocks__/enrolmentsPage';
import EnrolmentsPage from '../EnrolmentsPage';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const route = ROUTES.REGISTRATION_ENROLMENTS.replace(
  ':registrationId',
  registrationId
);

const defaultMocks = [
  mockedNotFoundRegistrationResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationResponse,
  mockedUserResponse,
  getMockedAttendeesResponse(attendees),
  getMockedAttendeesResponse(fakeEnrolments(0), {
    attendeeStatus: AttendeeStatus.Waitlisted,
  }),
];

beforeEach(() => jest.clearAllMocks());

const findElement = (key: 'createEnrolmentButton') => {
  switch (key) {
    case 'createEnrolmentButton':
      return screen.findByRole('button', { name: /lisää osallistuja/i });
  }
};
const getElement = (
  key:
    | 'attendeeTable'
    | 'createEnrolmentButton'
    | 'menu'
    | 'toggle'
    | 'waitingListTable'
) => {
  switch (key) {
    case 'attendeeTable':
      return screen.getByRole('table', { name: /osallistujat/i });
    case 'createEnrolmentButton':
      return screen.getByRole('button', { name: /lisää osallistuja/i });
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
  renderWithRoute(<EnrolmentsPage />, {
    authContextValue,
    mocks,
    routes: [route],
    path: ROUTES.REGISTRATION_ENROLMENTS,
    ...renderOptions,
  });

test('should render enrolments page', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument(10000);

  await findElement('createEnrolmentButton');
  getElement('attendeeTable');
  getElement('waitingListTable');
});

test('scrolls to enrolment table row and calls history.replace correctly (deletes enrolmentId from state)', async () => {
  const history = createMemoryHistory();
  history.push(route, { enrolmentId: attendees.data[0].id });

  const replaceSpy = jest.spyOn(history, 'replace');

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
  const enrolmentRowButton = screen.getAllByRole('button', {
    name: attendeeName,
  })[0];
  await waitFor(() => expect(enrolmentRowButton).toHaveFocus());
});

test("should show not found page if registration doesn't exist", async () => {
  renderComponent(undefined, {
    routes: [
      ROUTES.REGISTRATION_ENROLMENTS.replace(':registrationId', 'not-exist'),
    ],
  });

  await screen.findByText(
    'Etsimääsi sisältöä ei löydy. Kirjaudu sisään tai palaa kotisivulle.'
  );
});

test('should move to create enrolment page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();
  await loadingSpinnerIsNotInDocument(10000);

  const createButton = await findElement('createEnrolmentButton');
  await waitFor(() => expect(createButton).toBeEnabled(), { timeout: 5000 });
  await user.click(createButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/registrations/${registrationId}/enrolments/create`
    )
  );
});

test('should send message to participants', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = jest
    .fn()
    .mockImplementation(() => []);

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
    /editorin muokkausalue: main/i
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
