import { render, screen } from '@testing-library/react';
import React from 'react';

import ExternalLink from '../ExternalLink';

test('should add info that link is opened in a new tab', () => {
  render(<ExternalLink href="http://testsite.com">Avaa linkki</ExternalLink>);

  expect(
    screen.getByRole('link', {
      name: 'Avaa linkki (avataan uudessa välilehdessä)',
    })
  ).toBeInTheDocument();
});
