import React from 'react';
import { vi } from 'vitest';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationId,
} from '../../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const mocks = [mockedOrganizationResponse, mockedUserResponse];

const route = `/fi/${ROUTES.EDIT_ORGANIZATION.replace(':id', organizationId)}`;
const routes = [route];

const defaultProps: EditButtonPanelProps = {
  id: organizationId,
  onSave: vi.fn(),
  saving: null,
};

const renderComponent = (props?: Partial<EditButtonPanelProps>) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes,
  });

const findElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.findByRole('button', { name: 'Tallenna' });
  }
};

const getElement = (key: 'backButton' | 'saveButton') => {
  switch (key) {
    case 'backButton':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna' });
  }
};

test('should route to organizations page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await user.click(getElement('backButton'));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/organizations`)
  );
});

test('should call onSave', async () => {
  const onSave = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onSave });

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());
  await user.click(saveButton);

  expect(onSave).toBeCalled();
});
