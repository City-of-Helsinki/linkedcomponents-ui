import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { render, screen, userEvent, waitFor } from '../../../utils/testUtils';
import App from '../App';

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
  acceptChechbox: /olen lukenut ja hyväksyt palvelun käyttöehdot/i,
  acceptAllButton: /kaikki/i,
  acceptOnlyNecessaryButton: /vain välttämättömät/i,
  declinedButton: 'En hyväksy',
  modalTitle: 'Linked Events käyttöehdot ja evästeet',
};

it('renders without crashing', () => {
  renderApp();
});

it('should show cookie consent modal if consent is saved to cookie', async () => {
  renderApp();
  await screen.findByRole('heading', { name: texts.modalTitle });
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
  renderApp();
  await screen.findByRole('heading', { name: texts.modalTitle });
  const declineButton = screen.getByRole('button', {
    name: texts.declinedButton,
  });
  userEvent.click(declineButton);

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', { name: texts.modalTitle })
    ).not.toBeInTheDocument();
  });
});

it('should close cookie consent modal by clicking Decline button', async () => {
  renderApp();
  await screen.findByRole('heading', { name: texts.modalTitle });
  const declineButton = screen.getByRole('button', {
    name: texts.declinedButton,
  });
  userEvent.click(declineButton);

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', { name: texts.modalTitle })
    ).not.toBeInTheDocument();
  });
});

it('should store consent to cookie when clicing accept only necessary button', async () => {
  advanceTo('2021-12-12');
  renderApp();

  await screen.findByRole('heading', { name: texts.modalTitle });
  const acceptCheckbox = screen.getByRole('checkbox', {
    name: texts.acceptChechbox,
  });
  userEvent.click(acceptCheckbox);

  const acceptOnlyNecessaryButton = await screen.findByRole('button', {
    name: texts.acceptOnlyNecessaryButton,
  });
  userEvent.click(acceptOnlyNecessaryButton);

  expect(setCookie).toBeCalledWith(
    'CONSENT={"required":true,"tracking":false,"acceptedAt":"2021-12-12T00:00:00.000Z"};expires=Mon, 12 Dec 2022 00:00:00 GMT;path=/'
  );
});

it('should store consent to cookie when clicing accept all button', async () => {
  advanceTo('2021-12-12');
  renderApp();

  await screen.findByRole('heading', { name: texts.modalTitle });
  const acceptCheckbox = screen.getByRole('checkbox', {
    name: texts.acceptChechbox,
  });
  userEvent.click(acceptCheckbox);

  const acceptAllButton = await screen.findByRole('button', {
    name: texts.acceptAllButton,
  });
  userEvent.click(acceptAllButton);

  expect(setCookie).toBeCalledWith(
    'CONSENT={"required":true,"tracking":true,"acceptedAt":"2021-12-12T00:00:00.000Z"};expires=Mon, 12 Dec 2022 00:00:00 GMT;path=/'
  );
});
