import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import ErrorPage from '../ErrorPage';

configure({ defaultHidden: true });

const renderComponent = () =>
  render(<ErrorPage signInPath="" text={'Lorem ipsum'} />, {
    routes: ['/fi/events'],
  });

test('should render component', () => {
  const { container } = renderComponent();

  expect(container).toMatchSnapshot();
});

test('should route to contact page when clicking feedback link', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await user.click(screen.getByRole('button', { name: 'Anna palautetta' }));

  expect(history.location.pathname).toBe('/fi/help/support/contact');
});
