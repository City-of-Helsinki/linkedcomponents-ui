import i18n from 'i18next';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { Language } from '../../../../types';
import {
  configure,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import HelpPageRoutes from '../HelpPageRoutes';

configure({ defaultHidden: true });

let initialHeadInnerHTML: string | null = null;

beforeEach(() => {
  const head: HTMLHeadElement | null = document.querySelector('head');
  initialHeadInnerHTML = head?.innerHTML || null;

  document.head.innerHTML = '';

  i18n.changeLanguage('fi');
});

afterEach(() => {
  document.head.innerHTML = initialHeadInnerHTML || '';
});

const shouldHaveCorrectMetaData = async ({
  description: pageDescription,
  keywords: pageKeywords,
  title: pageTitle,
}: {
  description: string;
  keywords: string;
  title: string;
}) => {
  await waitFor(() => expect(document.title).toEqual(pageTitle));

  const head = document.querySelector('head');
  const description = head?.querySelector('[name="description"]');
  const keywords = head?.querySelector('[name="keywords"]');
  const ogTitle = head?.querySelector('[property="og:title"]');
  const ogDescription = head?.querySelector('[property="og:description"]');
  const twitterTitle = head?.querySelector('[property="twitter:title"]');
  const twitterDescription = head?.querySelector(
    '[property="twitter:description"]'
  );

  expect(description).toHaveAttribute('content', pageDescription);
  expect(keywords).toHaveAttribute('content', pageKeywords);
  expect(ogTitle).toHaveAttribute('content', pageTitle);
  expect(ogDescription).toHaveAttribute('content', pageDescription);
  expect(twitterTitle).toHaveAttribute('content', pageTitle);
  expect(twitterDescription).toHaveAttribute('content', pageDescription);
};

const renderRoute = (route: string, locale: Language = 'fi') =>
  render(<HelpPageRoutes locale={locale} />, {
    routes: [`/${locale}${route}`],
  });

it('should route to default instructions help page', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS);

  expect(history.location.pathname).toBe('/fi/help/instructions/general');
});

it('should route to default support help page', async () => {
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
  await shouldHaveCorrectMetaData({
    description: 'Johdatus Linked Events -alustaan ja ohjauspaneeliin.',
    keywords:
      'alusta, apu, ohjeet, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Alusta - Linked Events',
  });
  expect(history.location.pathname).toBe('/fi/help/instructions/platform');
});

it('should render general instructions help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_GENERAL, 'en');

  screen.getByRole('heading', { name: 'General' });
  await shouldHaveCorrectMetaData({
    description: 'Help and instructions how to use the service and the API.',
    keywords:
      'support, help, instructions, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'Support - Linked Events',
  });
  expect(history.location.pathname).toBe('/en/help/instructions/general');
});

it('should render general instructions help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_GENERAL);

  screen.getByRole('heading', { name: 'Yleistä' });
  await shouldHaveCorrectMetaData({
    description: 'Ohjeet sovelluksen ja Linked Events -rajapinnan käyttöön',
    keywords:
      'tuki, apu, ohjeet, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Tuki - Linked Events',
  });
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
  await shouldHaveCorrectMetaData({
    description: 'How to use control panel and Linked events admin features.',
    keywords:
      'control, panel, help, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'Control panel - Linked Events',
  });
  expect(history.location.pathname).toBe('/en/help/instructions/control-panel');
});

it('should render control panel help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_CONTROL_PANEL);

  screen.getByRole('heading', { name: 'Hallintapaneeli' });
  await shouldHaveCorrectMetaData({
    description:
      'Ohjauspaneelin ja Linked Eventsin järjestelmänvalvojan ominaisuuksien käyttäminen.',
    keywords:
      'ohjauspaneeli, apu, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Hallintapaneeli - Linked Events',
  });
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
  await shouldHaveCorrectMetaData({
    description: 'Frequently asked questions about Linked Events.',
    keywords:
      'faq, asked, questions, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'Frequently asked questions - Linked Events',
  });
  expect(history.location.pathname).toBe('/en/help/instructions/faq');
});

it('should render FAQ help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.INSTRUCTIONS_FAQ);

  screen.getByRole('button', {
    name: 'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?',
  });
  await shouldHaveCorrectMetaData({
    description: 'Linked Eventsin usen kysytyt kysymykset.',
    keywords:
      'ukk, kysytyt, kysymykset, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Usein kysytyt kysymykset - Linked Events',
  });
  expect(history.location.pathname).toBe('/fi/help/instructions/faq');
});

// Add this when Swedish is supported
it.skip('should render FAQ help page in Swedish', async () => {
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
  await shouldHaveCorrectMetaData({
    description: 'More information about the technology behind Linked Events.',
    keywords:
      'technology, help, support, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'Technology - Linked Events',
  });
  expect(history.location.pathname).toBe('/en/help/technology/general');
});

it('should render general technology help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_GENERAL);

  screen.getByRole('heading', { name: 'Yleistä' });
  await shouldHaveCorrectMetaData({
    description: 'Lisätietoja Linked Eventsin taustalla olevasta tekniikasta.',
    keywords:
      'teknologia, apu, tuki, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Teknologia - Linked Events',
  });
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
  await shouldHaveCorrectMetaData({
    description:
      'More information about the API (application protocol interface) of Linked Events.',
    keywords:
      'help, documentation, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'API - Linked Events',
  });
  expect(history.location.pathname).toBe('/en/help/technology/api');
});

it('should render API help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_API);

  screen.getByRole('heading', { name: 'Rajapinta' });
  await shouldHaveCorrectMetaData({
    description:
      'Lisätietoja Linked Eventsin API: sta (application protocol interface).',
    keywords:
      'apu, dokumentaatio, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Rajapinta - Linked Events',
  });
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
  await shouldHaveCorrectMetaData({
    description: 'Get a deeper look for Linked Events source code in Github.',
    keywords:
      'source, code, help, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'Source code - Linked Events',
  });
  expect(history.location.pathname).toBe('/en/help/technology/source-code');
});

it('should render source code help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_SOURCE_CODE);

  screen.getByRole('heading', { name: 'Lähdekoodi' });
  await shouldHaveCorrectMetaData({
    description: 'Tutustu Linked Eventsin lähdekoodiin Githubissa.',
    keywords:
      'lähdekoodi, apu, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Lähdekoodi - Linked Events',
  });
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

  await screen.findByRole(
    'heading',
    { name: 'Documentation' },
    { timeout: 10000 }
  );
  await shouldHaveCorrectMetaData({
    description: 'Read more about Linked Events documentation and API design.',
    keywords:
      'documentation, help, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'Documentation - Linked Events',
  });

  expect(history.location.pathname).toBe('/en/help/technology/documentation');
});

it('should render documentation help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.TECHNOLOGY_DOCUMENTATION);

  await screen.findByRole(
    'heading',
    { name: 'Dokumentaatio' },
    { timeout: 10000 }
  );
  await shouldHaveCorrectMetaData({
    description:
      'Lue lisää Linked Eventsin dokumentaatiosta ja API-suunnittelusta.',
    keywords:
      'dokumentaatio, apu, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Dokumentaatio - Linked Events',
  });
  expect(history.location.pathname).toBe('/fi/help/technology/documentation');
});

it('should render documentation help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.TECHNOLOGY_DOCUMENTATION, 'sv');

  await screen.findByRole(
    'heading',
    { name: 'Dokumentation' },
    { timeout: 10000 }
  );
  expect(history.location.pathname).toBe('/sv/help/technology/documentation');
});

it('should render terms of use help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.SUPPORT_TERMS_OF_USE, 'en');

  screen.getByRole('heading', { name: 'Terms of use' });
  await shouldHaveCorrectMetaData({
    description: 'Linked Events service terms and restrictions.',
    keywords:
      'terms, of, use, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'Terms of use - Linked Events',
  });
  expect(history.location.pathname).toBe('/en/help/support/terms-of-use');
});

it('should render terms of use help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.SUPPORT_TERMS_OF_USE);

  screen.getByRole('heading', { name: 'Käyttöehdot' });
  await shouldHaveCorrectMetaData({
    description: 'Linked Eventsin palvelusehdot ja rajoitukset.',
    keywords:
      'käyttöehdot, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Käyttöehdot - Linked Events',
  });
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
  await shouldHaveCorrectMetaData({
    description:
      'Lähetä virheraportti tai ominaisuuspyyntö. Tai lähetä meille palautetta palvelusta.',
    keywords:
      'ota yhteyttä, lomake, vika, ilmoita, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Ota yhteyttä - Linked Events',
  });
  expect(history.location.pathname).toBe('/fi/help/support/contact');
});

it('should render features help page in English', async () => {
  i18n.changeLanguage('en');
  const { history } = renderRoute(ROUTES.FEATURES, 'en');

  screen.getByRole('heading', { name: 'Service features' });
  await shouldHaveCorrectMetaData({
    description:
      'Read about Linked Events features. Get familiar with event management and Linked Events API.',
    keywords:
      'features, linked, events, event, management, api, admin, Helsinki, Finland',
    title: 'Service features - Linked Events',
  });
  expect(history.location.pathname).toBe('/en/help/features');
});

it('should render features help page in Finnish', async () => {
  const { history } = renderRoute(ROUTES.FEATURES);

  screen.getByRole('heading', { name: 'Palvelun ominaisuudet' });
  await shouldHaveCorrectMetaData({
    description:
      'Lue Linked Eventsin ominaisuuksista. Tutustu tapahtumien hallintaan ja Linked Events -rajapintaan.',
    keywords:
      'ominaisuudet, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    title: 'Palvelun ominaisuudet - Linked Events',
  });
  expect(history.location.pathname).toBe('/fi/help/features');
});

it('should render features help page in Swedish', async () => {
  i18n.changeLanguage('sv');
  const { history } = renderRoute(ROUTES.FEATURES, 'sv');

  screen.getByRole('heading', { name: 'Tjänstens egenskaper' });
  expect(history.location.pathname).toBe('/sv/help/features');
});
