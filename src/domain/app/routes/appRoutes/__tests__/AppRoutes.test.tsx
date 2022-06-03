/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import React from 'react';

import { render } from '../../../../../utils/testUtils';
import AppRoutes from '../AppRoutes';

const getWrapper = (route: string) =>
  render(<AppRoutes />, { routes: [route] });

beforeEach(() => {
  i18n.changeLanguage('fi');
});

it('user from supported locale will be redirect to App with that locale', async () => {
  getWrapper('/en/');

  expect(i18n.language).toEqual('en');
});

it('user from unsupported locale prefix will be redirect to route with support prefix', async () => {
  const { history } = getWrapper('/vi/');

  expect(i18n.language).toEqual('fi');
  expect(history.location.pathname).toContain('/fi/vi/');
});

it('user without locale prefix will be redirect to route with support prefix', async () => {
  const { history } = getWrapper('/foo-url');

  expect(i18n.language).toEqual('fi');
  expect(history.location.pathname).toContain('/fi/foo-url');
});

it('user with route with unsupport locale will be redirect to App anyway, with supported locale', async () => {
  const { history } = getWrapper('/dk/foo');

  expect(i18n.language).toEqual('fi');
  expect(history.location.pathname).toContain('/fi/dk/foo');
});
