import React from 'react';
import { toast } from 'react-toastify';

import { ROUTES } from '../../../../constants';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { registration } from '../../__mocks__/enrolmentsPage';
import SearchPanel from '../SearchPanel';

configure({ defaultHidden: true });

const getElement = (key: 'createButton' | 'searchInput') => {
  switch (key) {
    case 'createButton':
      return screen.getByRole('button', { name: /lisää osallistuja/i });
    case 'searchInput':
      return screen.getByRole('searchbox', {
        name: /hae osallistujia/i,
      });
  }
};

const defaultRoute = `${ROUTES.REGISTRATION_ENROLMENTS.replace(
  ':registrationId',
  registration.id
)}`;

const renderComponent = (route: string = defaultRoute) =>
  render(<SearchPanel registration={registration} />, { routes: [route] });

test('should initialize search panel input', async () => {
  const searchValue = 'search';
  renderComponent(`${defaultRoute}?text=${searchValue}`);

  const searchInput = getElement('searchInput');
  await waitFor(() => expect(searchInput).toHaveValue(searchValue));
});

test('should search enrolments with correct search params', async () => {
  const values = { text: 'search' };

  const { history } = renderComponent();

  // Text filtering
  const searchInput = getElement('searchInput');
  userEvent.type(searchInput, values.text);
  await waitFor(() => expect(searchInput).toHaveValue(values.text));

  const searchButton = screen.getAllByRole('button', {
    name: /etsi osallistujia/i,
  })[1];
  act(() => userEvent.click(searchButton));

  expect(history.location.pathname).toBe(
    `/registrations/${registration.id}/enrolments`
  );
  expect(history.location.search).toBe('?text=search');
});

test('should show toast error message when trying to create new enrolment', async () => {
  toast.error = jest.fn();
  const { history } = renderComponent();

  const createButton = getElement('createButton');
  act(() => userEvent.click(createButton));

  expect(history.location.pathname).toBe(
    `/registrations/${registration.id}/enrolments/create`
  );
});
