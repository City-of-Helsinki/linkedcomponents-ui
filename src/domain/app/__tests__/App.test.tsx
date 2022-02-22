/* eslint-disable max-len */
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { configure, render, screen, userEvent } from '../../../utils/testUtils';
import App from '../App';

configure({ defaultHidden: true });

const getCookie = jest.fn();
const setCookie = jest.fn();

Object.defineProperty(document, 'cookie', {
  get: getCookie,
  set: setCookie,
});

beforeEach(() => {
  clear();
  jest.clearAllMocks();
  getCookie.mockImplementation(() => '');
});

const renderApp = () => render(<App />);

const texts = {
  acceptCheckbox: /olen lukenut ja hyväksyn palvelun käyttöehdot/i,
  acceptAllButton: /kaikki/i,
  acceptOnlyNecessaryButton: /vain välttämättömät/i,
  declinedButton: 'En hyväksy',
  modalTitle: 'Linked Events käyttöehdot ja evästeet',
};

const getElement = (
  key:
    | 'acceptAllButton'
    | 'acceptOnlyNecessaryButton'
    | 'acceptCheckbox'
    | 'declineButton'
    | 'modalTitle'
) => {
  switch (key) {
    case 'acceptAllButton':
      return screen.getByRole('button', { name: texts.acceptAllButton });
    case 'acceptOnlyNecessaryButton':
      return screen.getByRole('button', {
        name: texts.acceptOnlyNecessaryButton,
      });
    case 'acceptCheckbox':
      return screen.getByRole('checkbox', { name: texts.acceptCheckbox });
    case 'declineButton':
      return screen.getByRole('button', { name: texts.declinedButton });
    case 'modalTitle':
      return screen.getByRole('heading', { name: texts.modalTitle });
  }
};

it('should show cookie consent modal if consent is not saved to cookie', async () => {
  renderApp();
  getElement('modalTitle');
});

it('should not show cookie consent modal if consent is saved', async () => {
  getCookie.mockImplementation(() => {
    return 'CONSENT={"required":true,"tracking":true,"acceptedAt":"2021-12-12T00:00:00.000Z"}';
  });
  renderApp();
  expect(
    screen.queryByRole('heading', { name: texts.modalTitle })
  ).not.toBeInTheDocument();
});

it('should close cookie consent modal by clicking Decline button', async () => {
  advanceTo('2021-12-12');
  renderApp();

  const acceptCheckbox = getElement('acceptCheckbox');
  userEvent.click(acceptCheckbox);

  const declineButton = getElement('declineButton');
  userEvent.click(declineButton);

  expect(setCookie).toBeCalledWith(
    'CONSENT={"required":false,"tracking":false,"acceptedAt":"2021-12-12T00:00:00.000Z"};expires=Mon, 12 Dec 2022 00:00:00 GMT;path=/'
  );
});

it('should store consent to cookie when clicing accept only necessary button', async () => {
  advanceTo('2021-12-12');
  renderApp();

  const acceptCheckbox = getElement('acceptCheckbox');
  userEvent.click(acceptCheckbox);

  const acceptOnlyNecessaryButton = getElement('acceptOnlyNecessaryButton');
  userEvent.click(acceptOnlyNecessaryButton);

  expect(setCookie).toBeCalledWith(
    'CONSENT={"required":true,"tracking":false,"acceptedAt":"2021-12-12T00:00:00.000Z"};expires=Mon, 12 Dec 2022 00:00:00 GMT;path=/'
  );
});

it('should store consent to cookie when clicing accept all button', async () => {
  advanceTo('2021-12-12');
  renderApp();

  const acceptCheckbox = getElement('acceptCheckbox');
  userEvent.click(acceptCheckbox);

  const acceptAllButton = getElement('acceptAllButton');
  userEvent.click(acceptAllButton);

  expect(setCookie).toBeCalledWith(
    'CONSENT={"required":true,"tracking":true,"acceptedAt":"2021-12-12T00:00:00.000Z"};expires=Mon, 12 Dec 2022 00:00:00 GMT;path=/'
  );
});
