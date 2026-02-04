/* eslint-disable import/no-named-as-default-member */
/* eslint-disable max-len */
import { render, within } from '@testing-library/react';
import { webcrypto } from 'crypto';
import i18n from 'i18next';
import { screen as shadowScreen } from 'shadow-dom-testing-library';

import { configure, userEvent, waitFor } from '../../../utils/testUtils';
import App from '../App';

configure({ defaultHidden: true });

const clearAllCookies = () =>
  document.cookie.split(';').forEach((c) => {
    document.cookie =
      c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  });

const realDateNow = Date.now.bind(global.Date);

beforeAll(() => {
  const dateNowStub = vi.fn(() => 1530518207007);

  global.Date.now = dateNowStub;
});

beforeEach(() => {
  vi.clearAllMocks();

  Object.defineProperties(global, {
    crypto: { value: webcrypto, writable: true },
  });

  clearAllCookies();

  i18n.changeLanguage('fi');
});

afterAll(() => {
  global.Date.now = realDateNow;
});

const renderApp = async () => render(<App />);

const acceptAllCookieText =
  'helfi-cookie-consents=%7B%22groups%22%3A%7B%22tunnistamo%22%3A%7B%22checksum%22%3A%22ea5a1519%22%2C%22timestamp%22%3A1530518207007%7D%2C%22userInputs%22%3A%7B%22checksum%22%3A%22e5533ab3%22%2C%22timestamp%22%3A1530518207007%7D%2C%22shared%22%3A%7B%22checksum%22%3A%223ab2ff2e%22%2C%22timestamp%22%3A1530518207007%7D%2C%22statistics%22%3A%7B%22checksum%22%3A%22caa20391%22%2C%22timestamp%22%3A1530518207007%7D%7D%7D';
const acceptOnlyNecessaryCookieText =
  'helfi-cookie-consents=%7B%22groups%22%3A%7B%22tunnistamo%22%3A%7B%22checksum%22%3A%22ea5a1519%22%2C%22timestamp%22%3A1530518207007%7D%2C%22userInputs%22%3A%7B%22checksum%22%3A%22e5533ab3%22%2C%22timestamp%22%3A1530518207007%7D%2C%22shared%22%3A%7B%22checksum%22%3A%223ab2ff2e%22%2C%22timestamp%22%3A1530518207007%7D%7D%7D';

const findCookieConsentModal = async () => {
  const regions = await shadowScreen.findAllByShadowRole('region');

  const container = regions.find(
    (region) => region.getAttribute('id') === 'hds-cc'
  );

  return container as HTMLElement;
};

const waitCookieConsentModalToBeVisible = async () => {
  const cookieConsentModal = await findCookieConsentModal();
  await within(cookieConsentModal).findByRole('heading', {
    name: 'Linked Events käyttää evästeitä',
  });

  return cookieConsentModal;
};

const waitCookieConsentModalToBeHidden = async () => {
  const regions = shadowScreen.queryAllByRole('region');
  const container = regions.find(
    (region) => region.getAttribute('id') === 'hds-cc'
  );

  await waitFor(() => expect(container).not.toBeDefined());
};

const findCookieConsentModalElement = async (
  cookieConsentModal: HTMLElement,
  key: 'acceptAllButton' | 'acceptOnlyNecessaryButton'
) => {
  switch (key) {
    case 'acceptAllButton':
      return within(cookieConsentModal).findByRole('button', {
        name: 'Hyväksy kaikki evästeet',
      });
    case 'acceptOnlyNecessaryButton':
      return within(cookieConsentModal).findByRole('button', {
        name: 'Hyväksy vain välttämättömät evästeet',
      });
  }
};

it('should show cookie consent modal if consent is not saved to cookie', async () => {
  renderApp();

  await waitCookieConsentModalToBeVisible();
});

it('should store consent to cookie when clicking accept all button', async () => {
  const user = userEvent.setup();

  renderApp();

  const cookieConsentModal = await waitCookieConsentModalToBeVisible();
  const acceptAllButton = await findCookieConsentModalElement(
    cookieConsentModal,
    'acceptAllButton'
  );
  await user.click(acceptAllButton);

  expect(document.cookie).toEqual(expect.stringContaining(acceptAllCookieText));
  await waitCookieConsentModalToBeHidden();
});

it('should store consent to cookie when clicking accept only necessary button', async () => {
  const user = userEvent.setup();

  renderApp();

  const cookieConsentModal = await waitCookieConsentModalToBeVisible();
  const acceptOnlyNecessaryButton = await findCookieConsentModalElement(
    cookieConsentModal,
    'acceptOnlyNecessaryButton'
  );

  await user.click(acceptOnlyNecessaryButton);

  expect(document.cookie).toEqual(
    expect.stringContaining(acceptOnlyNecessaryCookieText)
  );
  await waitCookieConsentModalToBeHidden();
});

it('should not show cookie consent modal if consent is saved', async () => {
  document.cookie = acceptAllCookieText;

  renderApp();

  await waitCookieConsentModalToBeHidden();
});
