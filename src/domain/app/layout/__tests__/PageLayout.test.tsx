import React from 'react';

import { SUPPORTED_LANGUAGES } from '../../../../constants';
import { actWait, render } from '../../../../utils/testUtils';
import PageLayout from '../PageLayout';

const renderComponent = () => render(<PageLayout />);

// Rendering PageLayout creates a side effect--the document head will be
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

test('common meta date should be added', async () => {
  // This function is usually used for the helpers it returns. However, the
  // scope f the helpers is limited to `body`. As we need to assert against
  // the content of the `head`, we have to make queries without helpers. We are
  // using testing library to render for consistency.
  renderComponent();

  await actWait(50);
  const head = document.querySelector('head');

  // Keywords
  const keywordsMeta = head?.querySelector(`[name="keywords"]`);
  expect(
    keywordsMeta.outerHTML.includes(
      `content="admin, api, tapahtuma, events, helsinki, linked, hallinta"`
    )
  ).toBeTruthy();

  // Canonical url
  const canonicalLink = head?.querySelector(`[rel="canonical"]`);
  expect(canonicalLink).not.toBeNull();

  // Alternate language links
  const links = head?.querySelectorAll(`[rel="alternate"]`);
  Object.values(SUPPORTED_LANGUAGES).forEach((lang) => {
    const link = Array.from(links).find((item) =>
      item.outerHTML.includes(`hreflang="${lang.toLowerCase()}"`)
    );

    expect(link).not.toBeNull();
  });
});
