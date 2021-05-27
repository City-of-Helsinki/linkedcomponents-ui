import React from 'react';

import { ROUTES } from '../../../../constants';
import { configure, render, screen } from '../../../../utils/testUtils';
import HelpPageLayout from '../HelpPageLayout';

configure({ defaultHidden: true });

test.each([
  `/fi${ROUTES.INSTRUCTIONS_CONTROL_PANEL}`,
  `/fi${ROUTES.INSTRUCTIONS_FAQ}`,
])('should render help page layout, route %p', async (route) => {
  render(<HelpPageLayout>Content</HelpPageLayout>, { routes: [route] });

  screen.getByRole('link', { name: 'Ohjeet' });
  screen.getByRole('link', { name: 'Teknologia' });
  screen.getByRole('link', { name: 'Tuki' });
  screen.getByRole('link', { name: 'Palvelun ominaisuudet' });

  // Instruction sub-levels should be visible as well. Test only 1 of them to improve performace
  screen.getByRole('link', { name: 'Hallintapaneeli', hidden: false });

  // Other sub-levels shouldn't be visible
  expect(
    screen.queryByRole('link', { name: 'Ota yhteyttä', hidden: false })
  ).not.toBeInTheDocument();
});
