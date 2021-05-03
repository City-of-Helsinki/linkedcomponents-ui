import React from 'react';

import { actWait, render } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import HelpPage from '../HelpPage';

test('should show correct title', async () => {
  render(<HelpPage />);

  await actWait(300);

  const title = document.title;

  expect(title).toBe(
    `${translations.helpPage.pageTitle} - ${translations.appName}`
  );
});
