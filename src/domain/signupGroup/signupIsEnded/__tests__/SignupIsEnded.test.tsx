import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { registration } from '../../../registration/__mocks__/registration';
import SignupIsEnded from '../SignupIsEnded';

configure({ defaultHidden: true });

const renderComponent = () =>
  render(<SignupIsEnded registration={registration} />);

const getBackButton = () => {
  return screen.getByRole('button', { name: 'Takaisin' });
};

test('should route to search page when clicking back button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const backButton = getBackButton();
  await user.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/signups`
    )
  );
});
