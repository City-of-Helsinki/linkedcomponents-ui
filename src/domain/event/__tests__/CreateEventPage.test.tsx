import { render } from '@testing-library/react';
import React from 'react';

import { actWait } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import CreateEventPage from '../CreateEventPage';

test('should show correct title', async () => {
  render(<CreateEventPage />);

  await actWait(300);

  const title = document.title;

  expect(title).toBe(
    `${translations.createEventPage.pageTitle} - ${translations.appName}`
  );
});
