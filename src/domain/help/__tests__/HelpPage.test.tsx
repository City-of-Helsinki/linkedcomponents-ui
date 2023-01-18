import React from 'react';

import { render, waitFor } from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import HelpPage from '../HelpPage';

test('should show correct title', async () => {
  render(<HelpPage />);

  await waitFor(() =>
    expect(document.title).toBe(
      `${translations.helpPage.pageTitle} - ${translations.appName}`
    )
  );
});
