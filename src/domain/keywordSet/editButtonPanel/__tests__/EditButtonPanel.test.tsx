import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { TEST_DATA_SOURCE_ID } from '../../../dataSource/constants';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { keywordSet } from '../../__mocks__/editKeywordSetPage';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const mocks = [mockedOrganizationResponse, mockedUserResponse];

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultProps: EditButtonPanelProps = {
  dataSource: TEST_DATA_SOURCE_ID,
  id: keywordSet.id as string,
  onSave: jest.fn(),
  saving: null,
};

const route = `/fi/${ROUTES.EDIT_KEYWORD_SET.replace(
  ':id',
  keywordSet.id as string
)}`;
const routes = [route];

const renderComponent = (props?: Partial<EditButtonPanelProps>) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes,
  });

const getElement = (key: 'backButton' | 'saveButton') => {
  switch (key) {
    case 'backButton':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna' });
  }
};

test('should route to keyword sets page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await act(async () => await user.click(getElement('backButton')));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keyword-sets`)
  );
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onSave });

  const saveButton = getElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());
  await act(async () => await user.click(saveButton));

  expect(onSave).toBeCalled();
});
