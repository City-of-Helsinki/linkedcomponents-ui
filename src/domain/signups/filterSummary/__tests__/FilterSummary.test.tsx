import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { registrationId } from '../../../registration/__mocks__/registration';
import FilterSummary from '../FilterSummary';

configure({ defaultHidden: true });

const text = 'Search word';

const defaultRoute = `/fi${ROUTES.REGISTRATION_ENROLMENTS.replace(
  ':registrationId',
  registrationId
)}`;

const renderComponent = (route = defaultRoute) =>
  render(<FilterSummary />, { routes: [route] });

test('should render and remove text filter', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(`${defaultRoute}?enrolmentText=${text}`);

  const deleteFilterButton = screen.getByRole('button', {
    name: `Poista suodatusehto: ${text}`,
  });
  await user.click(deleteFilterButton);

  expect(history.location.pathname).toBe(defaultRoute);
  expect(history.location.search).toBe('');
});

test('should remove all filters with clear button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(`${defaultRoute}?enrolmentText=${text}`);

  screen.getByRole('button', { name: `Poista suodatusehto: ${text}` });

  const clearButton = screen.getByRole('button', {
    name: 'Tyhjennä hakuehdot',
  });
  await user.click(clearButton);

  expect(history.location.pathname).toBe(defaultRoute);
  expect(history.location.search).toBe('');
});
