/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { Route, Routes } from 'react-router';

import { ROUTES } from '../../../../../constants';
import { Language } from '../../../../../types';
import { mockAuthenticatedLoginState } from '../../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  waitFor,
  waitPageMetaDataToBeSet,
} from '../../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../../organization/__mocks__/organizationAncestors';
import { mockedOrganizationsResponse } from '../../../../organizations/__mocks__/organizationsPage';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
import HelpPageRoutes from '../HelpPageRoutes';

configure({ defaultHidden: true });

let initialHeadInnerHTML: string | null = null;

beforeEach(async () => {
  const head: HTMLHeadElement | null = document.querySelector('head');
  initialHeadInnerHTML = head?.innerHTML || null;

  document.head.innerHTML = '';

  await i18n.changeLanguage('fi');

  mockAuthenticatedLoginState();
});

afterEach(() => {
  document.head.innerHTML = initialHeadInnerHTML || '';

  vi.resetAllMocks();
});

const mocks = [
  mockedOrganizationAncestorsResponse,
  mockedOrganizationsResponse,
  mockedUserResponse,
];

const renderRoute = (route: string, locale: Language = 'fi') =>
  render(
    <Routes>
      <Route
        path={`/:locale/*`}
        element={
          <Routes>
            <Route path={`${ROUTES.HELP}/*`} element={<HelpPageRoutes />} />
          </Routes>
        }
      />
    </Routes>,
    { mocks, routes: [`/${locale}${route}`] }
  );

const shouldHaveCorrectMetaData = async ({
  description: pageDescription,
  keywords: pageKeywords,
  title: pageTitle,
}: {
  description: string;
  keywords: string;
  title: string;
}) => {
  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
};

type PageValues = {
  description: string;
  expectedRoute: string;
  pageTitle: string;
  keywords: string;
  title: string;
};

const testHelpPage = async (
  language: Language,
  route: ROUTES,
  expectedValues: PageValues
) => {
  const { description, expectedRoute, keywords, pageTitle, title } =
    expectedValues;

  await i18n.changeLanguage(language);

  const { history } = await renderRoute(route, language);
  await shouldHaveCorrectMetaData({
    description,
    keywords,
    title,
  });
  await screen.findByRole('heading', { name: pageTitle });
  expect(history.location.pathname).toBe(expectedRoute);
};

const testRedirect = async (route: ROUTES, expectedRoute: string) => {
  const { history } = renderRoute(route);

  await waitFor(() => expect(history.location.pathname).toBe(expectedRoute));
};

const redirectCases: [ROUTES, string][] = [
  [ROUTES.SUPPORT, '/fi/help/support/service-information'],
  [ROUTES.INSTRUCTIONS, '/fi/help/instructions/events'],
  [ROUTES.TECHNOLOGY, '/fi/help/technology/source-code'],
];

it.each(redirectCases)(
  'should redirect from  %p to %p',
  async (route, expectedRoute) => {
    await testRedirect(route, expectedRoute);
  }
);

const serviceInformationCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Introduction to Linked Events platform and UI.',
      expectedRoute: '/en/help/support/service-information',

      keywords:
        'service information, help, instructions, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Information about the service',
      title: 'Information about the service - Linked Events',
    },
  ],
  [
    'fi',
    {
      description: 'Johdatus Linked Events -alustaan ja ohjauspaneeliin.',
      expectedRoute: '/fi/help/support/service-information',
      keywords:
        'tietoa palvelusta, apu, ohjeet, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Tietoa palvelusta',
      title: 'Tietoa palvelusta - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Introduktion till Linked Events plattform och kontrollpanel.',
      expectedRoute: '/sv/help/support/service-information',
      keywords:
        'kunskap om tjänsten, hjälp, instruktioner, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Kunskap om tjänsten',
      title: 'Kunskap om tjänsten - Linked Events',
    },
  ],
];

it.each(serviceInformationCases)(
  'should render platform help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(
      language,
      ROUTES.SUPPORT_SERVICE_INFORMATION,
      expectedValues
    );
  }
);

const termsOfUseCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Linked Events service Data Privacy and Terms of Use.',
      expectedRoute: '/en/help/support/terms-of-use',
      keywords:
        'terms of use, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Data Privacy and Terms of Use',
      title: 'Data Privacy and Terms of Use - Linked Events',
    },
  ],
  [
    'fi',
    {
      description: 'Linked Eventsin tietosuoja ja käyttöehdot.',
      expectedRoute: '/fi/help/support/terms-of-use',
      keywords:
        'käyttöehdot, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Tietosuoja ja käyttöehdot',
      title: 'Tietosuoja ja käyttöehdot - Linked Events',
    },
  ],
  [
    'sv',
    {
      description: 'Dataskydd och användarvillkor för Linked Events.',
      expectedRoute: '/sv/help/support/terms-of-use',
      keywords:
        'användarvillkor, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Dataskydd och användarvillkor',
      title: 'Dataskydd och användarvillkor - Linked Events',
    },
  ],
];

it.each(termsOfUseCases)(
  'should render terms of use help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.SUPPORT_TERMS_OF_USE, expectedValues);
  }
);

const contactCases: [Language, PageValues][] = [
  [
    'en',
    {
      description:
        'Send a bug report or feature request. Or send us some feedback about the service.',
      expectedRoute: '/en/help/support/contact',
      keywords:
        'contact, form, bug, report, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Contact us',
      title: 'Contact us - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Lähetä virheraportti tai ominaisuuspyyntö. Tai lähetä meille palautetta palvelusta.',
      expectedRoute: '/fi/help/support/contact',
      keywords:
        'ota yhteyttä, lomake, vika, ilmoita, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Ota yhteyttä',
      title: 'Ota yhteyttä - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Skicka en felrapport eller en funktionsförfrågan. Eller ge oss feedback om tjänsten.',
      expectedRoute: '/sv/help/support/contact',
      keywords:
        'kontakt, formulär, bugg, rapport, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Kontakta oss',
      title: 'Kontakta oss - Linked Events',
    },
  ],
];

it.each(contactCases)(
  'should render contact help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.SUPPORT_CONTACT, expectedValues);
  }
);

const askPermissionCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Ask permission to Linked Events organisation.',
      expectedRoute: '/en/help/support/ask-permission',
      keywords:
        'ask, permission, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Request access',
      title: 'Request access - Linked Events',
    },
  ],
  [
    'fi',
    {
      description: 'Pyydä oikeudet Linked Events -organisaatioon.',
      expectedRoute: '/fi/help/support/ask-permission',
      keywords:
        'kysy, oikeudet, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Pyydä käyttöoikeutta',
      title: 'Pyydä käyttöoikeutta - Linked Events',
    },
  ],
  [
    'sv',
    {
      description: 'Be om tillstånd för Linked Events organisation.',
      expectedRoute: '/sv/help/support/ask-permission',
      keywords:
        'fråga, tillstånd, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Begär åtkomst',
      title: 'Begär åtkomst - Linked Events',
    },
  ],
];

it.each(askPermissionCases)(
  'should render ask permission help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.SUPPORT_ASK_PERMISSION, expectedValues);
  }
);

const eventsInstructionsCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'How to use UI and Linked events admin features.',
      expectedRoute: '/en/help/instructions/events',
      keywords:
        'instructions for content production, help, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Instructions for content production',
      title: 'Instructions for content production - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Käyttöliittymän ja Linked Eventsin järjestelmänvalvojan ominaisuuksien käyttäminen.',
      expectedRoute: '/fi/help/instructions/events',
      keywords:
        'sisällöntuotannon ohjeet, apu, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Sisällöntuotannon ohjeet',
      title: 'Sisällöntuotannon ohjeet - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Hur man använder användargränssnittet och administrationsfunktioner på Linked Events.',
      expectedRoute: '/sv/help/instructions/events',
      keywords:
        'instruktioner för innehållsproduktion, hjälp, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Instruktioner för innehållsproduktion',
      title: 'Instruktioner för innehållsproduktion - Linked Events',
    },
  ],
];

it.each(eventsInstructionsCases)(
  'should render events instructions help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.INSTRUCTIONS_EVENTS, expectedValues);
  }
);

const registrationInstructionsCases: [Language, PageValues][] = [
  [
    'en',
    {
      description:
        'Linked Events is a collection of software components and API endpoints that enables event management and distribution for different event providers in Finland.',
      expectedRoute: '/en/help/instructions/registration',
      keywords:
        'linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Registration instructions',
      title: 'Registration instructions - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Linked Events on ohjelmistokomponenttien ja API-päätepisteiden kokoelma, joka mahdollistaa tapahtumien hallinnan ja jakelun eri tapahtumapalvelujen tarjoajille Suomessa.',
      expectedRoute: '/fi/help/instructions/registration',
      keywords:
        'linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Ilmoittautumisen ohjeet',
      title: 'Ilmoittautumisen ohjeet - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Linked Events är en samling programvarukomponenter och API-slutpunkter som möjliggör hantering och distribution av evenemang för olika evenemangsleverantörer i Finland.',
      expectedRoute: '/sv/help/instructions/registration',
      keywords:
        'linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Registreringsinstruktioner',
      title: 'Registreringsinstruktioner - Linked Events',
    },
  ],
];

it.each(registrationInstructionsCases)(
  'should render Registration instructions help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(
      language,
      ROUTES.INSTRUCTIONS_REGISTRATION,
      expectedValues
    );
  }
);

const faqCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Frequently asked questions about Linked Events.',
      expectedRoute: '/en/help/instructions/faq',
      keywords:
        'faq, asked, questions, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Frequently asked questions',
      title: 'Frequently asked questions - Linked Events',
    },
  ],
  [
    'fi',
    {
      description: 'Linked Eventsin usen kysytyt kysymykset.',
      expectedRoute: '/fi/help/instructions/faq',
      keywords:
        'ukk, kysytyt, kysymykset, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Usein kysytyt kysymykset',
      title: 'Usein kysytyt kysymykset - Linked Events',
    },
  ],
  [
    'sv',
    {
      description: 'Vanliga frågor om Linked Events.',
      expectedRoute: '/sv/help/instructions/faq',
      keywords:
        'faq, frågade, frågor, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Vanliga frågor',
      title: 'Vanliga frågor - Linked Events',
    },
  ],
];

it.each(faqCases)(
  'should render FAQ help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.INSTRUCTIONS_FAQ, expectedValues);
  }
);

const sourceCodeCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Get a deeper look for Linked Events source code in Github.',
      expectedRoute: '/en/help/technology/source-code',
      keywords:
        'technology, source code, image, rights, license, help, support, documentation, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Source code and API',
      title: 'Source code and API - Linked Events',
    },
  ],
  [
    'fi',
    {
      description: 'Tutustu Linked Eventsin lähdekoodiin Githubissa.',
      expectedRoute: '/fi/help/technology/source-code',
      keywords:
        'teknologia, lähdekoodi, kuva, oikeudet, lisenssi, apu, tuki, dokumentaatio, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Lähdekoodi ja rajapinta',
      title: 'Lähdekoodi ja rajapinta - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Ta en djupare titt på källkoden för Linked Events i Github.',
      expectedRoute: '/sv/help/technology/source-code',
      keywords:
        'teknologi, källkod, bild, rättigheter, licens, hjälp, stöd, dokumentation, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Källkod och API',
      title: 'Källkod och API - Linked Events',
    },
  ],
];

it.each(sourceCodeCases)(
  'should render source code help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.TECHNOLOGY_SOURCE_CODE, expectedValues);
  }
);

const documentationCases: [Language, PageValues][] = [
  [
    'en',
    {
      description:
        'Read more about Linked Events documentation and API design.',
      expectedRoute: '/en/help/technology/documentation',

      keywords:
        'documentation, help, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Documentation',
      title: 'Documentation - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Lue lisää Linked Eventsin dokumentaatiosta ja API-suunnittelusta.',
      expectedRoute: '/fi/help/technology/documentation',
      keywords:
        'dokumentaatio, apu, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Dokumentaatio',
      title: 'Dokumentaatio - Linked Events',
    },
  ],
  [
    'sv',
    {
      description: 'Läs mer om Linked Events dokumentation och API-design.',
      expectedRoute: '/sv/help/technology/documentation',
      keywords:
        'dokumentation, hjälp, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Dokumentation',
      title: 'Dokumentation - Linked Events',
    },
  ],
];

it.each(documentationCases)(
  'should render documentation help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(
      language,
      ROUTES.TECHNOLOGY_DOCUMENTATION,
      expectedValues
    );
  }
);
