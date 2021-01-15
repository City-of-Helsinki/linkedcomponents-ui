import React from 'react';

import translations from '../../../../domain/app/i18n/fi.json';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import FeedbackButton from '../FeedbackButton';

const renderComponent = () =>
  render(<FeedbackButton />, {
    routes: ['/fi/events'],
  });

test('should call window open when clicking feedback link', () => {
  window.open = jest.fn();
  renderComponent();

  userEvent.click(
    screen.getByRole('button', { name: translations.common.feedback.text })
  );

  expect(window.open).toBeCalledWith(translations.common.feedback.url, '_self');
});
