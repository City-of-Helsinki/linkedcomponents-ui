import React from 'react';

import { render } from '../../../../utils/testUtils';
import LoadingSpinner from '../LoadingSpinner';

it('render spinner if isLoading is true', () => {
  const { container } = render(<LoadingSpinner isLoading={true} />);
  expect((container.firstChild?.firstChild as HTMLElement).classList).toContain(
    'loadingSpinner'
  );
});

it('render child component if isLoading is false', () => {
  const { container } = render(
    <LoadingSpinner isLoading={false}>
      <div className="component"></div>
    </LoadingSpinner>
  );
  expect((container.firstChild as HTMLElement).classList).toContain(
    'component'
  );
});
