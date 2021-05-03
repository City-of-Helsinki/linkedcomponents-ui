import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import Footer from '../Footer';

configure({ defaultHidden: true });

beforeEach(() => {
  i18n.changeLanguage('fi');
});

const renderComponent = (route = '/fi') =>
  render(<Footer />, { routes: [route] });

test('matches snapshot', async () => {
  i18n.changeLanguage('sv');
  const { container } = renderComponent('/sv');

  screen.getByRole('link', { name: 'Evenemang' });
  expect(container.firstChild).toMatchSnapshot();
});

test('should show navigation links and should route to correct page after clicking link', async () => {
  const { history } = renderComponent();
  const links = [
    {
      name: translations.navigation.tabs.events,
      url: `/fi${ROUTES.EVENTS}`,
    },
    {
      name: translations.navigation.searchEvents,
      url: `/fi${ROUTES.SEARCH}`,
    },
    {
      name: translations.navigation.tabs.help,
      url: `/fi${ROUTES.HELP}`,
    },
  ];

  links.forEach(({ name, url }) => {
    const link = screen.getByRole('link', { name });

    userEvent.click(link);

    expect(history.location.pathname).toBe(url);
  });
});

test('should show feedback link and link should have correct href', async () => {
  renderComponent();
  const feedbackLink = screen.getByRole('link', {
    name: translations.common.feedback.text,
  });

  expect((feedbackLink as HTMLAnchorElement).href).toBe(
    'https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/osallistu-ja-vaikuta/palaute/anna-palautetta'
  );
});
