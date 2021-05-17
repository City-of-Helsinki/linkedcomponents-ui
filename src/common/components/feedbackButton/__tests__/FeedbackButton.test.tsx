import React from 'react';

import translations from '../../../../domain/app/i18n/fi.json';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import FeedbackButton from '../FeedbackButton';

const renderComponent = () =>
  render(<FeedbackButton />, {
    routes: ['/fi/events'],
  });

test('should route to contact page when clicking feedback link', () => {
  const { history } = renderComponent();

  userEvent.click(
    screen.getByRole('button', { name: translations.common.feedback.text })
  );

  expect(history.location.pathname).toBe('/fi/help/support/contact');
});
