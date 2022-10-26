import React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import Breadcrumb from '../Breadcrumb';

const renderComponent = () =>
  render(
    <Breadcrumb
      items={[
        { label: 'Etusivu', to: '/' },
        { active: true, label: 'Avainsanat' },
      ]}
    />
  );

test('should render breadcrumb', () => {
  renderComponent();
  screen.getByRole('navigation', { name: /Murupolku/i });
  screen.getByRole('link', { name: /Etusivu/i });
  screen.getByText(/Avainsanat/i);
});
