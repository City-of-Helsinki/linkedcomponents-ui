import React from 'react';

import { actWait, render, screen } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import LandingPage from '../LandingPage';

test('should show correct title', async () => {
  render(<LandingPage />);

  await actWait(300);

  const title = document.title;

  expect(title).toBe(translations.appName);
});

test('should render landing page', async () => {
  render(<LandingPage />);

  screen.getByText('+35M tapahtumaa vuodessa');
  screen.getByText('25 000 × Y/Z digipalvelua asiakkaana');
  screen.getByText('+2 500 tapahtumatuottajaa');
});
