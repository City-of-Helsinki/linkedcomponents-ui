import React from 'react';

import { ROUTES } from '../../../../constants';
import { configure, render, screen } from '../../../../utils/testUtils';
import AdminPageLayout from '../AdminPageLayout';

configure({ defaultHidden: true });

const route = `/fi${ROUTES.KEYWORDS}`;
const renderComponent = () =>
  render(<AdminPageLayout>Content</AdminPageLayout>, {
    routes: [route],
  });

test('should render help page layout', async () => {
  renderComponent();

  screen.getByRole('button', { name: 'Hallinta' });
  screen.getByRole('link', { name: 'Avainsanat' });
});
