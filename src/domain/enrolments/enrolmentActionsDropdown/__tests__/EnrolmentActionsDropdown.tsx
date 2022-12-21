import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { AuthContextProps } from '../../../auth/types';
import {
  enrolment,
  mockedCancelEnrolmentResponse,
} from '../../../enrolment/__mocks__/editEnrolmentPage';
import { EnrolmentPageProvider } from '../../../enrolment/enrolmentPageContext/EnrolmentPageContext';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { registration } from '../../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import EnrolmentActionsDropdown, {
  EnrolmentActionsDropdownProps,
} from '../EnrolmentActionsDropdown';

configure({ defaultHidden: true });

const defaultProps: EnrolmentActionsDropdownProps = {
  enrolment,
  registration,
};

const defaultMocks = [
  mockedCancelEnrolmentResponse,
  mockedEventResponse,
  mockedUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const route = `/fi${ROUTES.REGISTRATION_ENROLMENTS.replace(
  ':registrationId',
  registration.id as string
)}`;

const renderComponent = ({
  authContextValue,
  mocks = defaultMocks,
  props,
}: {
  authContextValue?: AuthContextProps;
  mocks?: MockedResponse[];
  props?: Partial<EnrolmentActionsDropdownProps>;
} = {}) =>
  render(
    <EnrolmentPageProvider>
      <EnrolmentActionsDropdown {...defaultProps} {...props} />
    </EnrolmentPageProvider>,
    {
      authContextValue,
      mocks,
      routes: [route],
    }
  );

const getElement = (key: 'cancel' | 'edit' | 'menu' | 'toggle') => {
  switch (key) {
    case 'cancel':
      return screen.getByRole('button', { name: 'Peruuta osallistuminen' });
    case 'edit':
      return screen.getByRole('button', { name: 'Muokkaa tietoja' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await act(async () => await user.click(toggleButton));
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent({ authContextValue });

  const toggleButton = await openMenu();
  await act(async () => await user.click(toggleButton));
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons', async () => {
  renderComponent({ authContextValue });

  await openMenu();

  const enabledButtons = [getElement('cancel'), getElement('edit')];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('should route to edit enrolment page when clicking edit button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const editButton = getElement('edit');
  await act(async () => await user.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments/edit/${enrolment.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should try to cancel enrolment when clicking cancel button', async () => {
  const user = userEvent.setup();
  renderComponent({ authContextValue });

  await openMenu();

  const cancelButton = getElement('cancel');
  await act(async () => await user.click(cancelButton));

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await act(async () => await user.click(cancelEventButton));

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
