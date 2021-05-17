import React from 'react';

import translations from '../../../../domain/app/i18n/fi.json';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import ErrorTemplate from '../ErrorTemplate';

const renderComponent = () =>
  render(<ErrorTemplate buttons={<div>Buttons</div>} text={'Lorem ipsum'} />, {
    routes: ['/fi/events'],
  });

test('should render component', () => {
  const { container } = renderComponent();

  expect(container).toMatchSnapshot();
});

test('should route to contact page when clicking feedback link', () => {
  const { history } = renderComponent();

  userEvent.click(
    screen.getByRole('button', { name: translations.common.feedback.text })
  );

  expect(history.location.pathname).toBe('/fi/help/support/contact');
});
