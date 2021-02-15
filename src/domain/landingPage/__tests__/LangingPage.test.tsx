import React from 'react';

import { actWait, render } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import LandingPage from '../LandingPage';

test('should show correct title', async () => {
  render(<LandingPage />);

  await actWait(300);

  const title = document.title;

  expect(title).toBe(translations.appName);
});
