import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import CreateButtonPanel, {
  CreateButtonPanelProps,
} from '../CreateButtonPanel';

configure({ defaultHidden: true });

const defaultProps: CreateButtonPanelProps = {
  disabled: false,
  registration,
  onSave: jest.fn(),
  saving: false,
};

const mocks = [mockedEventResponse, mockedUserResponse];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = ({
  props,
  route = `/fi/${ROUTES.CREATE_REGISTRATION.replace(
    ':registrationId',
    registrationId
  )}`,
}: {
  props?: Partial<CreateButtonPanelProps>;
  route?: string;
} = {}) =>
  render(<CreateButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const findElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.findByRole('button', { name: 'Tallenna osallistuja' });
  }
};

const getElement = (key: 'back' | 'saveButton') => {
  switch (key) {
    case 'back':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna osallistuja' });
  }
};

test('should route to enrolments page when clicking back button', async () => {
  const { history } = renderComponent();

  const backButton = getElement('back');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/enrolments`
    )
  );
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const { history } = renderComponent({
    route: `/fi${ROUTES.CREATE_REGISTRATION.replace(
      ':registrationId',
      registrationId
    )}?returnPath=${ROUTES.EDIT_REGISTRATION.replace(':id', registrationId)}`,
  });

  const backButton = getElement('back');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registrationId}`
    )
  );
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  renderComponent({ props: { onSave } });

  const saveButton = await findElement('saveButton');
  userEvent.click(saveButton);

  expect(onSave).toBeCalled();
});
