import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { Language } from '../../../../types';
import { configure, render, screen } from '../../../../utils/testUtils';
import HelpPageRoutes from '../HelpPageRoutes';

configure({ defaultHidden: true });

beforeEach(() => {
  i18n.changeLanguage('fi');
});

const renderRoute = (route: string, locale: Language = 'fi') =>
  render(<HelpPageRoutes locale={locale} />, {
    routes: [`/${locale}${route}`],
  });

it('should route to default instructions help page', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS);

  expect(history.location.pathname).toBe('/fi/help/instructions/platform');
});

it('should route to default suppoer help page', async () => {
  const { history } = renderRoute(ROUTES.SUPPORT);

  expect(history.location.pathname).toBe('/fi/help/support/terms-of-use');
});

it('should route to default technology help page', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY);

  expect(history.location.pathname).toBe('/fi/help/technology/general');
});

it('should render platform help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_PLATFORM);

  screen.getByRole('heading', { name: 'Alusta' });
  expect(history.location.pathname).toBe('/fi/help/instructions/platform');
});

it('should render general instructions help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_GENERAL, 'en');

  screen.getByRole('heading', { name: 'General' });
  expect(history.location.pathname).toBe('/en/help/instructions/general');
});

it('should render general instructions help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_GENERAL);

  screen.getByRole('heading', { name: 'Yleistä' });
  expect(history.location.pathname).toBe('/fi/help/instructions/general');
});

it('should render general instructions help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_GENERAL, 'sv');

  screen.getByRole('heading', { name: 'Allmänt' });
  expect(history.location.pathname).toBe('/sv/help/instructions/general');
});

it('should render control panel help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_CONTROL_PANEL, 'en');

  screen.getByRole('heading', { name: 'Control panel' });
  expect(history.location.pathname).toBe('/en/help/instructions/control-panel');
});

it('should render control panel help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_CONTROL_PANEL);

  screen.getByRole('heading', { name: 'Hallintapaneeli' });
  expect(history.location.pathname).toBe('/fi/help/instructions/control-panel');
});

it('should render control panel help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_CONTROL_PANEL, 'sv');

  screen.getByRole('heading', { name: 'Kontrollpanel' });
  expect(history.location.pathname).toBe('/sv/help/instructions/control-panel');
});

it('should render FAQ help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_FAQ, 'en');

  screen.getByRole('button', {
    name: 'How do I enter events into Linked Events?',
  });
  expect(history.location.pathname).toBe('/en/help/instructions/faq');
});

it('should render FAQ help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_FAQ);

  screen.getByRole('button', {
    name: 'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?',
  });
  expect(history.location.pathname).toBe('/fi/help/instructions/faq');
});

it('should render FAQ help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_FAQ, 'sv');

  screen.getByRole('button', {
    name: 'Hur anger jag evenemang i Linked Events?',
  });
  expect(history.location.pathname).toBe('/sv/help/instructions/faq');
});

it('should render general technology help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_GENERAL, 'en');

  screen.getByRole('heading', { name: 'General' });
  expect(history.location.pathname).toBe('/en/help/technology/general');
});

it('should render general technology help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_GENERAL);

  screen.getByRole('heading', { name: 'Yleistä' });
  expect(history.location.pathname).toBe('/fi/help/technology/general');
});

it('should render general technology help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_GENERAL, 'sv');

  screen.getByRole('heading', { name: 'Allmänt' });
  expect(history.location.pathname).toBe('/sv/help/technology/general');
});

it('should render API help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_API, 'en');

  screen.getByRole('heading', { name: 'API' });
  expect(history.location.pathname).toBe('/en/help/technology/api');
});

it('should render API help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_API);

  screen.getByRole('heading', { name: 'Rajapinta' });
  expect(history.location.pathname).toBe('/fi/help/technology/api');
});

it('should render API help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_API, 'sv');

  screen.getByRole('heading', { name: 'API' });
  expect(history.location.pathname).toBe('/sv/help/technology/api');
});

it('should render image rights help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_IMAGE_RIGHTS, 'en');

  screen.getByRole('heading', { name: 'Image rights' });
  expect(history.location.pathname).toBe('/en/help/technology/image-rights');
});

it('should render image rights help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_IMAGE_RIGHTS);

  screen.getByRole('heading', { name: 'Kuvaoikeudet' });
  expect(history.location.pathname).toBe('/fi/help/technology/image-rights');
});

it('should render image rights help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_IMAGE_RIGHTS, 'sv');

  screen.getByRole('heading', { name: 'Bildrättigheter' });
  expect(history.location.pathname).toBe('/sv/help/technology/image-rights');
});

it('should render source code help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_SOURCE_CODE, 'en');

  screen.getByRole('heading', { name: 'Source code' });
  expect(history.location.pathname).toBe('/en/help/technology/source-code');
});

it('should render source code help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_SOURCE_CODE);

  screen.getByRole('heading', { name: 'Lähdekoodi' });
  expect(history.location.pathname).toBe('/fi/help/technology/source-code');
});

it('should render source code help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_SOURCE_CODE, 'sv');

  screen.getByRole('heading', { name: 'Källkod' });
  expect(history.location.pathname).toBe('/sv/help/technology/source-code');
});

it('should render documentation help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_DOCUMENTATION, 'en');

  screen.getByRole('heading', { name: 'Documentation' });
  expect(history.location.pathname).toBe('/en/help/technology/documentation');
});

it('should render documentation help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_DOCUMENTATION);

  screen.getByRole('heading', { name: 'Dokumentaatio' });
  expect(history.location.pathname).toBe('/fi/help/technology/documentation');
});

it('should render documentation help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_DOCUMENTATION, 'sv');

  screen.getByRole('heading', { name: 'Dokumentation' });
  expect(history.location.pathname).toBe('/sv/help/technology/documentation');
});

it('should render terms of use help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.SUPPORT_TERMS_OF_USE, 'en');

  screen.getByRole('heading', { name: 'Terms of use' });
  expect(history.location.pathname).toBe('/en/help/support/terms-of-use');
});

it('should render terms of use help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.SUPPORT_TERMS_OF_USE);

  screen.getByRole('heading', { name: 'Käyttöehdot' });
  expect(history.location.pathname).toBe('/fi/help/support/terms-of-use');
});

it('should render terms of use help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.SUPPORT_TERMS_OF_USE, 'sv');

  screen.getByRole('heading', { name: 'Villkor' });
  expect(history.location.pathname).toBe('/sv/help/support/terms-of-use');
});

it('should render contact help page', async () => {
  const { history } = renderRoute(ROUTES.SUPPORT_CONTACT);

  screen.getByRole('heading', { name: 'Ota yhteyttä' });
  expect(history.location.pathname).toBe('/fi/help/support/contact');
});

it('should render features help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.FEATURES, 'en');

  screen.getByRole('heading', { name: 'Service features' });
  expect(history.location.pathname).toBe('/en/help/features');
});

it('should render features help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.FEATURES);

  screen.getByRole('heading', { name: 'Palvelun ominaisuudet' });
  expect(history.location.pathname).toBe('/fi/help/features');
});

it('should render features help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.FEATURES, 'sv');

  screen.getByRole('heading', { name: 'Tjänstens egenskaper' });
  expect(history.location.pathname).toBe('/sv/help/features');
});
