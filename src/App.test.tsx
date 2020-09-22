import { render } from '@testing-library/react';
import React from 'react';

import App from './App';

test('renders App component', () => {
  const { getByText } = render(<App />);
  const el = getByText(/Linked components/i);

  expect(el).toBeInTheDocument();
});
