import React from 'react';

import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import {
  mockedPage2RegistrationsResponse,
  mockedRegistrationsResponse,
} from '../__mocks__/registrationList';
import RegistrationList from '../RegistrationList';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedPage2RegistrationsResponse,
  mockedRegistrationsResponse,
  mockedUserResponse,
];

const getElement = (key: 'page1' | 'page2') => {
  switch (key) {
    case 'page1':
      return screen.getByRole('link', { name: 'Sivu 1' });
    case 'page2':
      return screen.getByRole('link', { name: 'Sivu 2' });
  }
};

const renderComponent = () => render(<RegistrationList />, { mocks });

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  const page2Button = getElement('page2');
  await user.click(page2Button);

  await loadingSpinnerIsNotInDocument();
  // Page 2 event should be visible.
  await waitFor(() => expect(history.location.search).toBe('?page=2'));

  // Should clear page from url search if selecting the first page
  const page1Button = getElement('page1');
  await user.click(page1Button);

  await waitFor(() => expect(history.location.search).toBe(''));
});
