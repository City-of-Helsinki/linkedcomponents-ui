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
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { place } from '../../__mocks__/editPlacePage';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultProps: EditButtonPanelProps = {
  id: place.id as string,
  onSave: jest.fn(),
  publisher: TEST_PUBLISHER_ID,
  saving: null,
};

const route = `/fi/${ROUTES.EDIT_PLACE.replace(':id', place.id as string)}`;

const renderComponent = (props?: Partial<EditButtonPanelProps>) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes: [route],
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

test('should route to places page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await user.click(getElement('backButton'));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/places`)
  );
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onSave });

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());
  await user.click(saveButton);

  expect(onSave).toBeCalled();
});
