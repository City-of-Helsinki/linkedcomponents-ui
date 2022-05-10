import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import ErrorTemplate from '../ErrorTemplate';

configure({ defaultHidden: true });

const renderComponent = () =>
  render(<ErrorTemplate buttons={<div>Buttons</div>} text={'Lorem ipsum'} />, {
    routes: ['/fi/events'],
  });

test('should render component', () => {
  const { container } = renderComponent();

  expect(container).toMatchSnapshot();
});

test('should route to contact page when clicking feedback link', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await act(
    async () =>
      await user.click(screen.getByRole('button', { name: 'Anna palautetta' }))
  );

  expect(history.location.pathname).toBe('/fi/help/support/contact');
});
