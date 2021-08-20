/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import TestController from 'testcafe';

import {
  getErrorMessage,
  screenContext,
  withinContext,
} from '../utils/testcafe.utils';

export const findLandingPage = async (t: TestController) => {
  const within = withinContext(t);
  const screen = screenContext(t);

  await t.expect(screen.findByRole('main').exists).ok(await getErrorMessage(t));

  const withinLandingPage = () => {
    return within(screen.getByRole('main'));
  };

  const selectors = {
    createEventButton() {
      return withinLandingPage().findByRole('button', {
        name: /lisää tekemistä/i,
      });
    },
    searchEventsButton() {
      return withinLandingPage().findByTestId('landing-page-search-button');
    },
  };

  const actions = {
    async clickCreateEventButton() {
      const result = await t.click(selectors.createEventButton());
      return result;
    },
    async clickSearchEventsButton() {
      const result = await t.click(selectors.searchEventsButton());
      return result;
    },
  };

  return {
    actions,
  };
};
