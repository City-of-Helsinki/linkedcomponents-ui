import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import Footer from '../Footer';

configure({ defaultHidden: true });

beforeEach(() => {
  i18n.changeLanguage('fi');
});

const renderComponent = (route = '/fi') =>
  render(<Footer />, { routes: [route] });

// TODO: Swedish language is disabled at the moment, so skip this test
test.skip('matches snapshot', async () => {
  i18n.changeLanguage('sv');
  const { container } = renderComponent('/sv');

  screen.getByRole('link', { name: 'Evenemang' });
  expect(container.firstChild).toMatchSnapshot();
});

test('should show navigation links and should route to correct page after clicking link', async () => {
  setFeatureFlags({ SHOW_ADMIN: true, SHOW_REGISTRATION: true });
  const user = userEvent.setup();
  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /etsi tapahtumia/i, url: `/fi${ROUTES.SEARCH}` },
    { name: /ilmoittautuminen/i, url: `/fi${ROUTES.REGISTRATIONS}` },
    { name: /hallinta/i, url: `/fi${ROUTES.ADMIN}` },
    { name: /tuki/i, url: `/fi${ROUTES.HELP}` },
  ];
  for (const { name, url } of links) {
    const link = screen.getByRole('link', { name });

    await act(async () => await user.click(link));

    await waitFor(() => expect(history.location.pathname).toBe(url));
  }
});

test('should not show keywords and registrations link when those features are disabled', async () => {
  setFeatureFlags({ SHOW_ADMIN: false, SHOW_REGISTRATION: false });
  const user = userEvent.setup();

  const { history } = renderComponent();
  const links = [
    { name: /tapahtumat/i, url: `/fi${ROUTES.EVENTS}` },
    { name: /etsi tapahtumia/i, url: `/fi${ROUTES.SEARCH}` },
    { name: /tuki/i, url: `/fi${ROUTES.HELP}` },
  ];

  for (const { name, url } of links) {
    const link = screen.getAllByRole('link', { name })[0];

    await act(async () => await user.click(link));

    await waitFor(() => expect(history.location.pathname).toBe(url));
  }

  expect(
    screen.queryByRole('link', { name: /hallinta/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: /ilmoittautuminen/i })
  ).not.toBeInTheDocument();
});

test('should show feedback link and link should have correct href', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const feedbackLink = screen.getByRole('link', { name: /anna palautetta/i });
  await act(async () => await user.click(feedbackLink));

  expect(history.location.pathname).toBe('/fi/help/support/contact');
});
