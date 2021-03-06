import React from 'react';

import { SUPPORTED_LANGUAGES } from '../../../../constants';
import {
  actWait,
  render,
  screen,
  userEvent,
  within,
} from '../../../../utils/testUtils';
import translations from '../../i18n/fi.json';
import PageLayout from '../PageLayout';

const getWrapper = () => render(<PageLayout />);

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

test('alternate language links should be added', async () => {
  // This function is usually used for the helpers it returns. However, the
  // scope f the helpers is limited to `body`. As we need to assert against
  // the content of the `head`, we have to make queries without helpers. We are
  // using testing library to render for consistency.
  getWrapper();

  await actWait(50);
  const head = document.querySelector('head');

  const links = head?.querySelectorAll(`[rel="alternate"]`);

  if (links) {
    Object.values(SUPPORTED_LANGUAGES).forEach((lang) => {
      const link = Array.from(links).find((item) =>
        item.outerHTML.includes(`hreflang="${lang.toLowerCase()}"`)
      );

      expect(link).toBeDefined();
    });
  }
});

test('menu should be opened by clicking menu button', async () => {
  global.innerWidth = 500;
  getWrapper();

  const withinHeader = within(screen.getByRole('banner'));
  const button = withinHeader.getByRole('button', {
    name: translations.navigation.menuToggleAriaLabel,
  });

  expect(withinHeader.queryByRole('navigation')).not.toBeInTheDocument();

  userEvent.click(button);

  expect(withinHeader.getByRole('navigation')).toBeInTheDocument();
});
