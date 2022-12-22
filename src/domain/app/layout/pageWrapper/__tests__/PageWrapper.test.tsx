import React from 'react';

import {
  render,
  waitPageMetaDataToBeSet,
} from '../../../../../utils/testUtils';
import translations from '../../../i18n/fi.json';
import PageWrapper, { PageWrapperProps } from '../PageWrapper';

const getWrapper = (props?: Partial<PageWrapperProps>) =>
  render(<PageWrapper {...props} />);

// Rendering PageWrapper creates a side effect--the document head will be
// mutated. This mutation will persist between tests. This can be problematic:
// (1) other test suites asserting against `document.head` may receive
//     unexpected initial conditions
// (2) this test suite may receive unexpected initial conditions if
//     `EventPageMeta` is rendered as part of some other test suite (likely)
// To combat these conditions, we are manually managing the `head` in setup and
// teardown.
let initialHeadInnerHTML: string | null = null;

beforeEach(() => {
  const head: HTMLHeadElement | null = document.querySelector('head');
  initialHeadInnerHTML = head?.innerHTML || null;

  document.head.innerHTML = '';
});

afterEach(() => {
  document.head.innerHTML = initialHeadInnerHTML || '';
});

const pageDescription = translations.appDescription;
const pageKeywords =
  'linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

test('applies expected metadata', async () => {
  const pageTitle = translations.appName;

  // This function is usually used for the helpers it returns. However, the
  // scope f the helpers is limited to `body`. As we need to assert against
  // the content of the `head`, we have to make queries without helpers. We are
  // using testing library to render for consistency.
  getWrapper();

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
});

test('applies custom page title', async () => {
  const pageTitle = translations.appName;
  const fullPageTitle = `${pageTitle} - ${translations.appName}`;

  getWrapper({ title: pageTitle });

  await waitPageMetaDataToBeSet({
    pageDescription,
    pageKeywords,
    pageTitle: fullPageTitle,
  });
});
