import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
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

test('should route to features help page', async () => {
  const { history } = renderComponent();

  const keywordsLink = screen.getByRole('link', { name: 'Avainsanat' });
  userEvent.click(keywordsLink);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/admin/keywords')
  );
});
