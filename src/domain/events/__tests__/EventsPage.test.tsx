import React from 'react';

import { actWait, render } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import EventsPage from '../EventsPage';

test('should show correct title if user is not logged in', async () => {
  render(<EventsPage />);

  await actWait(300);

  const title = document.title;

  expect(title).toBe(
    `${translations.notSigned.pageTitle} - ${translations.appName}`
  );
});
