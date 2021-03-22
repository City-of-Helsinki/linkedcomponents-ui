import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { Language } from '../../../../types';
import { render, screen } from '../../../../utils/testUtils';
import HelpPageRoutes from '../HelpPageRoutes';

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

  await screen.findByRole('heading', { name: 'Alusta' });
  expect(history.location.pathname).toBe('/fi/help/instructions/platform');
});

it('should render general instructions help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_GENERAL, 'en');

  await screen.findByRole('heading', { name: 'Instructions' });
  expect(history.location.pathname).toBe('/en/help/instructions/general');
});

it('should render general instructions help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_GENERAL);

  await screen.findByRole('heading', { name: 'Ohjeet' });
  expect(history.location.pathname).toBe('/fi/help/instructions/general');
});

it('should render general instructions help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_GENERAL, 'sv');

  await screen.findByRole('heading', { name: 'Instruktioner' });
  expect(history.location.pathname).toBe('/sv/help/instructions/general');
});

it('should render control panel help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_CONTROL_PANEL, 'en');

  await screen.findByRole('heading', { name: 'Control panel' });
  expect(history.location.pathname).toBe('/en/help/instructions/control-panel');
});

it('should render control panel help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_CONTROL_PANEL);

  await screen.findByRole('heading', { name: 'Hallintapaneeli' });
  expect(history.location.pathname).toBe('/fi/help/instructions/control-panel');
});

it('should render control panel help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_CONTROL_PANEL, 'sv');

  await screen.findByRole('heading', { name: 'Kontrollpanel' });
  expect(history.location.pathname).toBe('/sv/help/instructions/control-panel');
});

it('should render FAQ help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_FAQ, 'en');

  await screen.findByRole('button', {
    name: 'How do I enter events into Linked Events?',
  });
  expect(history.location.pathname).toBe('/en/help/instructions/faq');
});

it('should render FAQ help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_FAQ);

  await screen.findByRole('button', {
    name: 'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?',
  });
  expect(history.location.pathname).toBe('/fi/help/instructions/faq');
});

it('should render FAQ help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_FAQ, 'sv');

  await screen.findByRole('button', {
    name: 'Hur anger jag evenemang i Linked Events?',
  });
  expect(history.location.pathname).toBe('/sv/help/instructions/faq');
});

it('should render general technology help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_GENERAL, 'en');

  await screen.findByRole('heading', { name: 'Technology' });
  expect(history.location.pathname).toBe('/en/help/technology/general');
});

it('should render general technology help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_GENERAL);

  await screen.findByRole('heading', { name: 'Teknologia' });
  expect(history.location.pathname).toBe('/fi/help/technology/general');
});

it('should render general technology help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_GENERAL, 'sv');

  await screen.findByRole('heading', { name: 'Teknologi' });
  expect(history.location.pathname).toBe('/sv/help/technology/general');
});

it('should render API help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_API, 'en');

  await screen.findByRole('heading', { name: 'API' });
  expect(history.location.pathname).toBe('/en/help/technology/api');
});

it('should render API help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_API);

  await screen.findByRole('heading', { name: 'Rajapinta' });
  expect(history.location.pathname).toBe('/fi/help/technology/api');
});

it('should render API help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_API, 'sv');

  await screen.findByRole('heading', { name: 'API' });
  expect(history.location.pathname).toBe('/sv/help/technology/api');
});

it('should render image rights help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_IMAGE_RIGHTS, 'en');

  await screen.findByRole('heading', { name: 'Image rights' });
  expect(history.location.pathname).toBe('/en/help/technology/image-rights');
});

it('should render image rights help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_IMAGE_RIGHTS);

  await screen.findByRole('heading', { name: 'Kuvaoikeudet' });
  expect(history.location.pathname).toBe('/fi/help/technology/image-rights');
});

it('should render image rights help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_IMAGE_RIGHTS, 'sv');

  await screen.findByRole('heading', { name: 'Bildrättigheter' });
  expect(history.location.pathname).toBe('/sv/help/technology/image-rights');
});

it('should render source code help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_SOURCE_CODE, 'en');

  await screen.findByRole('heading', { name: 'Source code' });
  expect(history.location.pathname).toBe('/en/help/technology/source-code');
});

it('should render source code help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_SOURCE_CODE);

  await screen.findByRole('heading', { name: 'Lähdekoodi' });
  expect(history.location.pathname).toBe('/fi/help/technology/source-code');
});

it('should render source code help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_SOURCE_CODE, 'sv');

  await screen.findByRole('heading', { name: 'Källkod' });
  expect(history.location.pathname).toBe('/sv/help/technology/source-code');
});

it('should render documentation help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_DOCUMENTATION, 'en');

  await screen.findByRole('heading', { name: 'Documentation' });
  expect(history.location.pathname).toBe('/en/help/technology/documentation');
});

it('should render documentation help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_DOCUMENTATION);

  await screen.findByRole('heading', { name: 'Dokumentaatio' });
  expect(history.location.pathname).toBe('/fi/help/technology/documentation');
});

it('should render documentation help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_DOCUMENTATION, 'sv');

  await screen.findByRole('heading', { name: 'Dokumentation' });
  expect(history.location.pathname).toBe('/sv/help/technology/documentation');
});

it('should render terms of use help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.SUPPORT_TERMS_OF_USE, 'en');

  await screen.findByRole('heading', { name: 'Terms of use' });
  expect(history.location.pathname).toBe('/en/help/support/terms-of-use');
});

it('should render terms of use help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.SUPPORT_TERMS_OF_USE);

  await screen.findByRole('heading', { name: 'Käyttöehdot' });
  expect(history.location.pathname).toBe('/fi/help/support/terms-of-use');
});

it('should render terms of use help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.SUPPORT_TERMS_OF_USE, 'sv');

  await screen.findByRole('heading', { name: 'Användarvillkor' });
  expect(history.location.pathname).toBe('/sv/help/support/terms-of-use');
});

it('should render contact help page', async () => {
  const { history } = renderRoute(ROUTES.SUPPORT_CONTACT);

  await screen.findByRole('heading', { name: 'Ota yhteyttä' });
  expect(history.location.pathname).toBe('/fi/help/support/contact');
});

it('should render features help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.FEATURES, 'en');

  await screen.findByRole('heading', { name: 'Service features' });
  expect(history.location.pathname).toBe('/en/help/features');
});

it('should render features help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.FEATURES);

  await screen.findByRole('heading', { name: 'Palvelun ominaisuudet' });
  expect(history.location.pathname).toBe('/fi/help/features');
});

it('should render features help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.FEATURES, 'sv');

  await screen.findByRole('heading', { name: 'Servicefunktioner' });
  expect(history.location.pathname).toBe('/sv/help/features');
});
