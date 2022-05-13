import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  act,
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
import SearchPanel from '../SearchPanel';

configure({ defaultHidden: true });

const getElement = (key: 'searchInput') => {
  switch (key) {
    case 'searchInput':
      return screen.getByRole('searchbox', {
        name: /hae osallistujia/i,
      });
  }
};

const defaultRoute = `${ROUTES.REGISTRATION_ENROLMENTS.replace(
  ':registrationId',
  registrationId
)}`;

const mocks = [mockedEventResponse, mockedUserResponse];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = (route: string = defaultRoute) =>
  render(<SearchPanel registration={registration} />, {
    mocks,
    routes: [route],
    store,
  });

test('should initialize search panel input', async () => {
  const searchValue = 'search';
  renderComponent(`${defaultRoute}?enrolmentText=${searchValue}`);

  const searchInput = getElement('searchInput');
  await waitFor(() => expect(searchInput).toHaveValue(searchValue));
});

test('should search enrolments with correct search params', async () => {
  const values = { text: 'search' };
  const user = userEvent.setup();
  const { history } = renderComponent();

  // Text filtering
  const searchInput = getElement('searchInput');
  await act(async () => await user.type(searchInput, values.text));
  await waitFor(() => expect(searchInput).toHaveValue(values.text));

  const searchButton = screen.getAllByRole('button', {
    name: /etsi osallistujia/i,
  })[1];
  await act(async () => await user.click(searchButton));

  expect(history.location.pathname).toBe(
    `/registrations/${registrationId}/enrolments`
  );
  expect(history.location.search).toBe('?enrolmentText=search');
});
