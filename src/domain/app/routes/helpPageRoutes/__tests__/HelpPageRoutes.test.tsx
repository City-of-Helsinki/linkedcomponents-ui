/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { Route, Routes } from 'react-router';

import { ROUTES } from '../../../../../constants';
import { Language } from '../../../../../types';
import { mockUnauthenticatedLoginState } from '../../../../../utils/mockLoginHooks';
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

vi.mock('swagger-ui-react');

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockUnauthenticatedLoginState();
});

let initialHeadInnerHTML: string | null = null;

beforeEach(async () => {
  const head: HTMLHeadElement | null = document.querySelector('head');
  initialHeadInnerHTML = head?.innerHTML || null;

  document.head.innerHTML = '';

  await i18n.changeLanguage('fi');
});

afterEach(() => {
  document.head.innerHTML = initialHeadInnerHTML || '';
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
  [ROUTES.INSTRUCTIONS, '/fi/help/instructions/general'],
  [ROUTES.SUPPORT, '/fi/help/support/terms-of-use'],
  [ROUTES.TECHNOLOGY, '/fi/help/technology/general'],
];

it.each(redirectCases)(
  'should redirect from  %p to %p',
  async (route, expectedRoute) => {
    await testRedirect(route, expectedRoute);
  }
);

const generalInstructionCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Help and instructions how to use the service and the API.',
      expectedRoute: '/en/help/instructions/general',
      keywords:
        'support, help, instructions, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'General',
      title: 'Support - Linked Events',
    },
  ],
  [
    'fi',
    {
      description: 'Ohjeet sovelluksen ja Linked Events -rajapinnan käyttöön',
      expectedRoute: '/fi/help/instructions/general',
      keywords:
        'tuki, apu, ohjeet, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Yleistä',
      title: 'Tuki - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Hjälp och instruktioner om hur du använder tjänsten och API: et.',
      expectedRoute: '/sv/help/instructions/general',
      keywords:
        'stöd, hjälp, instruktioner, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Allmänt',
      title: 'Stöd - Linked Events',
    },
  ],
];

it.each(generalInstructionCases)(
  'should render general instructions help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.INSTRUCTIONS_GENERAL, expectedValues);
  }
);

const platformCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Introduction to Linked Events platform and control panel.',
      expectedRoute: '/en/help/instructions/platform',

      keywords:
        'platform, help, instructions, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Platform',
      title: 'Platform - Linked Events',
    },
  ],
  [
    'fi',
    {
      description: 'Johdatus Linked Events -alustaan ja ohjauspaneeliin.',
      expectedRoute: '/fi/help/instructions/platform',
      keywords:
        'alusta, apu, ohjeet, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Alusta',
      title: 'Alusta - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Introduktion till Linked Events-plattformen och kontrollpanelen.',
      expectedRoute: '/sv/help/instructions/platform',
      keywords:
        'plattform, hjälp, instruktioner, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Plattform',
      title: 'Plattform - Linked Events',
    },
  ],
];

it.each(platformCases)(
  'should render platform help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.INSTRUCTIONS_PLATFORM, expectedValues);
  }
);

const controlPanelCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'How to use control panel and Linked events admin features.',
      expectedRoute: '/en/help/instructions/control-panel',
      keywords:
        'control, panel, help, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Control panel',
      title: 'Control panel - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Ohjauspaneelin ja Linked Eventsin järjestelmänvalvojan ominaisuuksien käyttäminen.',
      expectedRoute: '/fi/help/instructions/control-panel',
      keywords:
        'ohjauspaneeli, apu, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Hallintapaneeli',
      title: 'Hallintapaneeli - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Hur man använder kontrollpanelen och administrationsfunktioner på Linked Events.',
      expectedRoute: '/sv/help/instructions/control-panel',
      keywords:
        'kontrollpanel, hjälp, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Kontrollpanel',
      title: 'Kontrollpanel - Linked Events',
    },
  ],
];

it.each(controlPanelCases)(
  'should render control panel help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(
      language,
      ROUTES.INSTRUCTIONS_CONTROL_PANEL,
      expectedValues
    );
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
      pageTitle: 'Linked Registration instructions',
      title: 'Linked Registration instructions - Linked Events',
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
      pageTitle: 'Linked Registration -ohje',
      title: 'Linked Registration -ohje - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Linked Events är en samling mjukvarukomponenter och API-slutpunkter som möjliggör evenemnaghantering och distribution för olika evenemangsleverantörer i Finland.',
      expectedRoute: '/sv/help/instructions/registration',
      keywords:
        'linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Linked Registration instruktioner',
      title: 'Linked Registration instruktioner - Linked Events',
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
        'ukk, frågade, frågor, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
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

const generalTechnologyCases: [Language, PageValues][] = [
  [
    'en',
    {
      description:
        'More information about the technology behind Linked Events.',
      expectedRoute: '/en/help/technology/general',
      keywords:
        'technology, help, support, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'General',
      title: 'Technology - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Lisätietoja Linked Eventsin taustalla olevasta tekniikasta.',
      expectedRoute: '/fi/help/technology/general',
      keywords:
        'teknologia, apu, tuki, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Yleistä',
      title: 'Teknologia - Linked Events',
    },
  ],
  [
    'sv',
    {
      description: 'Mer information om tekniken bakom Linked Events.',
      expectedRoute: '/sv/help/technology/general',
      keywords:
        'teknologi, hjälp, stöd, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Allmänt',
      title: 'Teknologi - Linked Events',
    },
  ],
];

it.each(generalTechnologyCases)(
  'should render general technology help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.TECHNOLOGY_GENERAL, expectedValues);
  }
);

const apiCases: [Language, PageValues][] = [
  [
    'en',
    {
      description:
        'More information about the API (application protocol interface) of Linked Events.',
      expectedRoute: '/en/help/technology/api',
      keywords:
        'help, documentation, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'API',
      title: 'API - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Lisätietoja Linked Eventsin API: sta (application protocol interface).',
      expectedRoute: '/fi/help/technology/api',
      keywords:
        'apu, dokumentaatio, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Rajapinta',
      title: 'Rajapinta - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Mer information om API (application protocol interface) för Linked Events.',
      expectedRoute: '/sv/help/technology/api',
      keywords:
        'hjälp, dokumentation, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'API',
      title: 'API - Linked Events',
    },
  ],
];

it.each(apiCases)(
  'should render API help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.TECHNOLOGY_API, expectedValues);
  }
);

const imageRightsCases: [Language, PageValues][] = [
  [
    'en',
    {
      description:
        'More information about the image rights and licenses for Linked Events.',
      expectedRoute: '/en/help/technology/image-rights',
      keywords:
        'image, rights, license, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Image Rights',
      title: 'Image Rights - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Lisätietoja Linked Events -palvelun kuvaoikeuksista ja lisensseistä.',
      expectedRoute: '/fi/help/technology/image-rights',
      keywords:
        'kuva, oikeudet, lisenssi, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Kuvaoikeudet',
      title: 'Kuvaoikeudet - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Mer information om Linked Events bildrättigheter och licenser.',
      expectedRoute: '/sv/help/technology/image-rights',
      keywords:
        'bild, rättigheter, licens, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Bildrättigheter',
      title: 'Bildrättigheter - Linked Events',
    },
  ],
];

it.each(imageRightsCases)(
  'should render image rights help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(
      language,
      ROUTES.TECHNOLOGY_IMAGE_RIGHTS,
      expectedValues
    );
  }
);

const sourceCodeCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Get a deeper look for Linked Events source code in Github.',
      expectedRoute: '/en/help/technology/source-code',
      keywords:
        'source, code, help, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Source code',
      title: 'Source code - Linked Events',
    },
  ],
  [
    'fi',
    {
      description: 'Tutustu Linked Eventsin lähdekoodiin Githubissa.',
      expectedRoute: '/fi/help/technology/source-code',
      keywords:
        'lähdekoodi, apu, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Lähdekoodi',
      title: 'Lähdekoodi - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Få en djupare titt på källkoden för Linked Events i Github.',
      expectedRoute: '/sv/help/technology/source-code',
      keywords:
        'källkod, hjälp, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Källkod',
      title: 'Källkod - Linked Events',
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

const termsOfUseCases: [Language, PageValues][] = [
  [
    'en',
    {
      description: 'Linked Events service Data Privacy and Terms of Use.',
      expectedRoute: '/en/help/support/terms-of-use',
      keywords:
        'terms, of, use, linked, events, event, management, api, admin, Helsinki, Finland',
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
        'villkor, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
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
        'Skicka en felrapport eller funktionsförfrågan. Eller skicka oss lite feedback om tjänsten.',
      expectedRoute: '/sv/help/support/contact',
      keywords:
        'kontakt, formulär, bugg, rapport, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Ta kontakt',
      title: 'Ta kontakt - Linked Events',
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
      description: 'Be om tillåtelse till Linked Events-organisationen.',
      expectedRoute: '/sv/help/support/ask-permission',
      keywords:
        'fråga, tillstånd, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Begära tillgång',
      title: 'Begära tillgång - Linked Events',
    },
  ],
];

it.each(askPermissionCases)(
  'should render ask permission help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.SUPPORT_ASK_PERMISSION, expectedValues);
  }
);

const featuresCases: [Language, PageValues][] = [
  [
    'en',
    {
      description:
        'Read about Linked Events features. Get familiar with event management and Linked Events API.',
      expectedRoute: '/en/help/features',
      keywords:
        'features, linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Service features',
      title: 'Service features - Linked Events',
    },
  ],
  [
    'fi',
    {
      description:
        'Lue Linked Eventsin ominaisuuksista. Tutustu tapahtumien hallintaan ja Linked Events -rajapintaan.',
      expectedRoute: '/fi/help/features',
      keywords:
        'ominaisuudet, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Palvelun ominaisuudet',
      title: 'Palvelun ominaisuudet - Linked Events',
    },
  ],
  [
    'sv',
    {
      description:
        'Läs om Linked Eventsfunktioner. Bli bekant med event management och Linked Events API.',
      expectedRoute: '/sv/help/features',
      keywords:
        'funktioner, linked, events, evenemang, ledning, api, admin, Helsingfors, Finland',
      pageTitle: 'Tjänstens egenskaper',
      title: 'Tjänstens egenskaper - Linked Events',
    },
  ],
];

it.each(featuresCases)(
  'should render features help page, language %p',
  async (language, expectedValues) => {
    await testHelpPage(language, ROUTES.FEATURES, expectedValues);
  }
);
