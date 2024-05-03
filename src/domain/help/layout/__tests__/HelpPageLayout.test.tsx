import React from 'react';

import { ROUTES } from '../../../../constants';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import HelpPageLayout from '../HelpPageLayout';

configure({ defaultHidden: true });

beforeEach(async () => {
  mockAuthenticatedLoginState();
});

const mocks = [mockedUserResponse];

const route = `/fi${ROUTES.SUPPORT_SERVICE_INFORMATION}`;

const renderComponent = () =>
  render(<HelpPageLayout>Content</HelpPageLayout>, {
    mocks,
    routes: [route],
  });

test('should render help page layout', async () => {
  renderComponent();

  screen.getByRole('button', { name: 'Tietoa palvelusta' });
  screen.getByRole('button', { name: 'Ohjeet' });
  screen.getByRole('button', { name: 'Teknologia' });

  // Support sub-levels should be visible as well. Test only 1 of them to improve performace
  screen.getByRole('link', { name: 'Käyttöehdot', hidden: false });

  // Other sub-levels shouldn't be visible
  expect(
    screen.queryByRole('link', { name: 'Dokumentaatio', hidden: false })
  ).not.toBeInTheDocument();
});

test('should route to service information help page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const platformLink = screen.getByRole('link', { name: 'Tietoa palvelusta' });
  await user.click(platformLink);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      '/fi/help/support/service-information'
    )
  );
});
