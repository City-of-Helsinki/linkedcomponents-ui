import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import { mockedRegistrationUserResponse } from '../../../user/__mocks__/user';
import CreateSignupGroupButtonPanel, {
  CreateSignupGroupButtonPanelProps,
} from '../CreateSignupGroupButtonPanel';

configure({ defaultHidden: true });

const defaultProps: CreateSignupGroupButtonPanelProps = {
  disabled: false,
  onCreate: jest.fn(),
  registration,
  saving: null,
};

const mocks = [
  mockedEventResponse,
  mockedOrganizationAncestorsResponse,
  mockedRegistrationUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const renderComponent = ({
  props,
  route = `/fi/${ROUTES.CREATE_REGISTRATION.replace(
    ':registrationId',
    registrationId
  )}`,
}: {
  props?: Partial<CreateSignupGroupButtonPanelProps>;
  route?: string;
} = {}) =>
  render(<CreateSignupGroupButtonPanel {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes: [route],
  });

const findSaveButton = () =>
  screen.findByRole('button', { name: 'Tallenna osallistujat' });

const getElement = (key: 'back' | 'saveButton') => {
  switch (key) {
    case 'back':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna osallistujat' });
  }
};

test('should route to signups page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const backButton = getElement('back');
  await user.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/signups`
    )
  );
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({
    route: `/fi${ROUTES.CREATE_REGISTRATION.replace(
      ':registrationId',
      registrationId
    )}?returnPath=${ROUTES.EDIT_REGISTRATION.replace(':id', registrationId)}`,
  });

  const backButton = getElement('back');
  await user.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registrationId}`
    )
  );
});

test('should call onCreate', async () => {
  const onCreate = jest.fn();
  const user = userEvent.setup();
  renderComponent({ props: { onCreate } });

  const saveButton = await findSaveButton();
  await waitFor(() => expect(saveButton).toBeEnabled());
  await user.click(saveButton);

  expect(onCreate).toBeCalled();
});
