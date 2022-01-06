import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import HelpPageLayout from '../HelpPageLayout';

configure({ defaultHidden: true });

const route = `/fi${ROUTES.INSTRUCTIONS_CONTROL_PANEL}`;
const renderComponent = () =>
  render(<HelpPageLayout>Content</HelpPageLayout>, {
    routes: [route],
  });

test('should render help page layout', async () => {
  renderComponent();

  screen.getByRole('button', { name: 'Ohjeet' });
  screen.getByRole('button', { name: 'Teknologia' });
  screen.getByRole('button', { name: 'Tuki' });
  screen.getByRole('link', { name: 'Palvelun ominaisuudet' });

  // Instruction sub-levels should be visible as well. Test only 1 of them to improve performace
  screen.getByRole('link', { name: 'Hallintapaneeli', hidden: false });

  // Other sub-levels shouldn't be visible
  expect(
    screen.queryByRole('link', { name: 'Ota yhteyttä', hidden: false })
  ).not.toBeInTheDocument();
});

test('should router to features help page', async () => {
  const { history } = renderComponent();

  const featuresLink = screen.getByRole('link', {
    name: 'Palvelun ominaisuudet',
  });
  userEvent.click(featuresLink);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/help/features')
  );
});

test('should router to platform help page', async () => {
  const { history } = renderComponent();

  const platformLink = screen.getByRole('link', { name: 'Alusta' });
  userEvent.click(platformLink);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/help/instructions/platform')
  );
});
