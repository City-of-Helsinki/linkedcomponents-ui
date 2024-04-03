import React from 'react';

import { actWait, configure, render, screen } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import LandingPage from '../LandingPage';

configure({ defaultHidden: true });

test('should show correct title', async () => {
  render(<LandingPage />);

  await actWait(300);

  const title = document.title;

  expect(title).toBe(translations.appName);
});

test('should render landing page', async () => {
  render(<LandingPage />);

  screen.getByRole('heading', { name: '35 000 tapahtumaa vuodessa' });
  screen.getByRole('heading', { name: '25 tapahtumasivustoa' });
  screen.getByRole('heading', { name: '60 000 riviä koodia' });

  screen.getByRole('link', {
    name: new RegExp(translations.landingPage.myHelsinkiTitle),
  });
  screen.getByRole('link', {
    name: new RegExp(translations.landingPage.tapahtumatHelTitle),
  });

  screen.getByRole('heading', {
    name: translations.landingPage.titleServices,
  });
});
