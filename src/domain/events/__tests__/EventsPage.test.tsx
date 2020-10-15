import { render } from '@testing-library/react';
import React from 'react';

import { actWait } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import EventsPage from '../EventsPage';

test('should show correct title', async () => {
  render(<EventsPage />);

  await actWait(300);

  const title = document.title;

  expect(title).toBe(
    `${translations.eventsPage.pageTitle} - ${translations.appName}`
  );
});
