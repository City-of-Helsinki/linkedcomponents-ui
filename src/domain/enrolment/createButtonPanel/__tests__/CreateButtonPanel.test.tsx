import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { registration } from '../../../enrolments/__mocks__/enrolmentsPage';
import CreateButtonPanel, {
  CreateButtonPanelProps,
} from '../CreateButtonPanel';

configure({ defaultHidden: true });

const defaultProps: CreateButtonPanelProps = {
  registration,
  onSave: jest.fn(),
};

const renderComponent = ({
  props,
  route = `/fi/${ROUTES.CREATE_REGISTRATION.replace(
    ':registrationId',
    registration.id
  )}`,
}: {
  props?: Partial<CreateButtonPanelProps>;
  route?: string;
} = {}) =>
  render(<CreateButtonPanel {...defaultProps} {...props} />, {
    routes: [route],
  });

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
      `/fi/registrations/${registration.id}/enrolments`
    )
  );
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const { history } = renderComponent({
    route: `/fi${ROUTES.CREATE_REGISTRATION.replace(
      ':registrationId',
      registration.id
    )}?returnPath=${ROUTES.EDIT_REGISTRATION.replace(':id', registration.id)}`,
  });

  const backButton = getElement('back');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registration.id}`
    )
  );
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  renderComponent({ props: { onSave } });

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  expect(onSave).toBeCalled();
});
