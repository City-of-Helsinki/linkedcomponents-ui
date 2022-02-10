import React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import Breadcrumb from '../Breadcrumb';

const renderComponent = () =>
  render(
    <Breadcrumb>
      <Breadcrumb.Item to="/">Etusivu</Breadcrumb.Item>
      <Breadcrumb.Item active={true}>Avainsanat</Breadcrumb.Item>
    </Breadcrumb>
  );

test('should render breadcrumb', () => {
  renderComponent();
  screen.getByRole('navigation', { name: /Murupolku/i });
  screen.getByRole('link', { name: /Etusivu/i });
  screen.getByText(/Avainsanat/i);
});
