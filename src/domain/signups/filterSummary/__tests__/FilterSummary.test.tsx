import React from 'react';

import { ROUTES } from '../../../../constants';
import {
  configure,
  render,
  screen,
  shouldDisplayAndRemoveFilter,
  userEvent,
} from '../../../../utils/testUtils';
import { registrationId } from '../../../registration/__mocks__/registration';
import FilterSummary from '../FilterSummary';

configure({ defaultHidden: true });

const text = 'Search word';

const defaultRoute = `/fi${ROUTES.REGISTRATION_SIGNUPS.replace(
  ':registrationId',
  registrationId
)}`;

const renderComponent = (route = defaultRoute) =>
  render(<FilterSummary />, { routes: [route] });

test('should render and remove text filter', async () => {
  const { history } = renderComponent(`${defaultRoute}?signupText=${text}`);

  await shouldDisplayAndRemoveFilter({
    deleteButtonLabel: `Poista suodatusehto: ${text}`,
    expectedPathname: defaultRoute,
    history,
  });
});

test('should remove all filters with clear button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent(`${defaultRoute}?signupText=${text}`);

  screen.getByRole('button', { name: `Poista suodatusehto: ${text}` });

  const clearButton = screen.getByRole('button', {
    name: 'Tyhjennä hakuehdot',
  });
  await user.click(clearButton);

  expect(history.location.pathname).toBe(defaultRoute);
  expect(history.location.search).toBe('');
});
