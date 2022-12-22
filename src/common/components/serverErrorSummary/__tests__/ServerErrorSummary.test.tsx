import { render, screen } from '@testing-library/react';
import React from 'react';

import ServerErrorSummary from '../ServerErrorSummary';

it('should render server error without label', async () => {
  render(
    <ServerErrorSummary
      errors={[
        { label: '', message: 'Kaikkia päivitettäviä objekteja ei löytynyt.' },
      ]}
    />
  );
  screen.getByText('Kaikkia päivitettäviä objekteja ei löytynyt.');
});

it('should render server error with label', () => {
  render(
    <ServerErrorSummary
      errors={[
        {
          label: 'Tapahtuman otsikko suomeksi',
          message: 'Nimi on pakollinen.',
        },
      ]}
    />
  );

  screen.getByText('Nimi on pakollinen.');
});
