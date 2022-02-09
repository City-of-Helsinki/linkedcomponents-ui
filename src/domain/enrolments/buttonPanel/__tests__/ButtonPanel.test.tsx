import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { StoreState } from '../../../../types';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { registration } from '../../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import ButtonPanel, { ButtonPanelProps } from '../ButtonPanel';

configure({ defaultHidden: true });

const defaultProps: ButtonPanelProps = {
  registration,
};

const mocks = [mockedUserResponse];

const renderComponent = ({
  props,
  route = `/fi/${ROUTES.EDIT_REGISTRATION}`,
  store,
}: {
  props?: Partial<ButtonPanelProps>;
  route?: string;
  store?: Store<StoreState, AnyAction>;
} = {}) =>
  render(<ButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const getElement = (key: 'back') => {
  switch (key) {
    case 'back':
      return screen.getByRole('button', { name: /takaisin/i });
  }
};

test('should route to edit registration page when clicking back button', async () => {
  const { history } = renderComponent();

  const backButton = getElement('back');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registration.id}`
    )
  );
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const { history } = renderComponent({
    route: `/fi${ROUTES}?returnPath=${ROUTES.REGISTRATIONS}`,
  });

  const backButton = getElement('back');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations')
  );
  expect(history.location.search).toBe(``);
});
