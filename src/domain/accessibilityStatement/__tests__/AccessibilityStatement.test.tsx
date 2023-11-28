/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { Language } from '../../../types';
import {
  configure,
  render,
  screen,
  waitPageMetaDataToBeSet,
} from '../../../utils/testUtils';
import AccessibilityStatementPage from '../AccessibilityStatement';

configure({ defaultHidden: true });

let initialHeadInnerHTML: string | null = null;

beforeEach(() => {
  const head: HTMLHeadElement | null = document.querySelector('head');
  initialHeadInnerHTML = head?.innerHTML || null;

  document.head.innerHTML = '';
});

afterEach(() => {
  document.head.innerHTML = initialHeadInnerHTML || '';
  i18n.changeLanguage('fi');
});

type PageValues = {
  description: string;
  keywords: string;
  pageTitle: string;
  title: string;
};

const testCases: [Language, PageValues][] = [
  [
    'en',
    {
      description:
        'Linked Events is a collection of software components and API endpoints that enables event management and distribution for different event providers in Finland.',
      keywords:
        'linked, events, event, management, api, admin, Helsinki, Finland',
      pageTitle: 'Accessibility Statement - Linked Events',
      title: 'Accessibility of Linked Events -web service',
    },
  ],
  [
    'fi',
    {
      description:
        'Linked Events on ohjelmistokomponenttien ja API-päätepisteiden kokoelma, joka mahdollistaa tapahtumien hallinnan ja jakelun eri tapahtumapalvelujen tarjoajille Suomessa.',
      keywords:
        'linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
      pageTitle: 'Saavutettavuusseloste - Linked Events',
      title: 'Linked Events verkkopalvelun saavutettavuus',
    },
  ],
  [
    'sv',
    {
      description: '',
      keywords: '',
      pageTitle: '',
      title: 'Linked Events-nättjänstens tillgänglighet',
    },
  ],
];

it.each(testCases)(
  'should render accessibility statement page, language %p',
  async (language, expectedValues) => {
    const { description, keywords, pageTitle, title } = expectedValues;

    await i18n.changeLanguage(language);

    await render(<AccessibilityStatementPage />);

    // Swedish is not supported language at the moment
    if (language !== 'sv') {
      await waitPageMetaDataToBeSet({
        pageDescription: description,
        pageKeywords: keywords,
        pageTitle,
      });
    }
    await screen.findByRole('heading', { name: title });
  }
);
