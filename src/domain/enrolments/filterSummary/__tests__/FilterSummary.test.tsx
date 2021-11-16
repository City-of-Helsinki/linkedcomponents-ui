import React from 'react';

import { ROUTES } from '../../../../constants';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import { registrationId } from '../../../registration/__mocks__/registration';
import FilterSummary from '../FilterSummary';

const text = 'Search word';

const defaultRoute = `/fi${ROUTES.REGISTRATION_ENROLMENTS.replace(
  ':registrationId',
  registrationId
)}`;

const renderComponent = (route = defaultRoute) =>
  render(<FilterSummary />, { routes: [route] });

test('should render and remove text filter', async () => {
  const { history } = renderComponent(`${defaultRoute}?text=${text}`);

  const deleteFilterButton = screen.getByRole('button', {
    name: `Poista suodatusehto: ${text}`,
  });
  userEvent.click(deleteFilterButton);

  expect(history.location.pathname).toBe(defaultRoute);
  expect(history.location.search).toBe('');
});

test('should remove all filters with clear button', async () => {
  const { history } = renderComponent(`${defaultRoute}?text=${text}`);

  screen.getByRole('button', { name: `Poista suodatusehto: ${text}` });

  const clearButton = screen.getByRole('button', {
    name: 'Tyhjennä hakuehdot',
  });
  userEvent.click(clearButton);

  expect(history.location.pathname).toBe(defaultRoute);
  expect(history.location.search).toBe('');
});
