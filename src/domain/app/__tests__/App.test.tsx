/* eslint-disable import/no-named-as-default-member */
/* eslint-disable max-len */
import { render, within } from '@testing-library/react';
import i18n from 'i18next';
import React from 'react';

import {
  act,
  configure,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import App from '../App';

configure({ defaultHidden: true });

const clearAllCookies = () =>
  document.cookie.split(';').forEach((c) => {
    document.cookie =
      c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  });

beforeEach(() => {
  jest.clearAllMocks();
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  clearAllCookies();

  i18n.changeLanguage('fi');
});

const renderApp = async () =>
  act(async () => {
    await render(<App />);
  });

const acceptAllCookieText =
  'city-of-helsinki-cookie-consents=%7B%22tunnistamo%22%3Atrue%2C%22eventForm%22%3Atrue%2C%22registrationForm%22%3Atrue%2C%22enrolmentForm%22%3Atrue%2C%22city-of-helsinki-cookie-consents%22%3Atrue%2C%22matomo%22%3Atrue%7D';
const acceptOnlyNecessaryCookieText =
  'city-of-helsinki-cookie-consents=%7B%22tunnistamo%22%3Atrue%2C%22eventForm%22%3Atrue%2C%22registrationForm%22%3Atrue%2C%22enrolmentForm%22%3Atrue%2C%22city-of-helsinki-cookie-consents%22%3Atrue%2C%22matomo%22%3Afalse%7D';

const findElement = (key: 'cookieConsentModal') => {
  switch (key) {
    case 'cookieConsentModal':
      return screen.findByTestId('cookie-consent');
  }
};

const waitCookieConsentModalToBeVisible = async () => {
  const cookieConsentModal = await findElement('cookieConsentModal');
  await within(cookieConsentModal).findByRole('heading', {
    name: 'Linked Events käyttää evästeitä',
  });

  return cookieConsentModal;
};

const waitCookieConsentModalToBeHidden = async () => {
  await waitFor(() =>
    expect(screen.queryByTestId('cookie-consent')).not.toBeInTheDocument()
  );
};

const findCookieConsentModalElement = async (
  cookieConsentModal: HTMLElement,
  key:
    | 'acceptAllButton'
    | 'acceptOnlyNecessaryButton'
    | 'enOption'
    | 'fiOption'
    | 'languageSelector'
    | 'svOption'
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
    case 'enOption':
      return within(cookieConsentModal).findByRole('link', {
        name: 'English (EN)',
      });
    case 'fiOption':
      return within(cookieConsentModal).findByRole('link', {
        name: 'Suomeksi (FI)',
      });
    case 'languageSelector':
      return within(cookieConsentModal).findByRole('button', {
        name: /Vaihda kieli. Change language. Ändra språk./i,
      });
    case 'svOption':
      return within(cookieConsentModal).findByRole('link', {
        name: 'Svenska (SV)',
      });
  }
};

it('should show cookie consent modal if consent is not saved to cookie', async () => {
  await renderApp();

  await waitCookieConsentModalToBeVisible();
});

it('should change cookie consent modal language', async () => {
  const user = userEvent.setup();
  await renderApp();

  const cookieConsentModal = await waitCookieConsentModalToBeVisible();
  const languageSelector = await findCookieConsentModalElement(
    cookieConsentModal,
    'languageSelector'
  );

  const languageElements: {
    optionKey: 'enOption' | 'fiOption' | 'svOption';
    headingText: string;
  }[] = [
    { optionKey: 'enOption', headingText: 'Linked Events uses cookies' },
    { optionKey: 'fiOption', headingText: 'Linked Events käyttää evästeitä' },
    { optionKey: 'svOption', headingText: 'Linked Events använder kakor' },
  ];

  for (const { optionKey, headingText } of languageElements) {
    await act(async () => await user.click(languageSelector));
    const languageOption = await findCookieConsentModalElement(
      cookieConsentModal,
      optionKey
    );
    await act(async () => await user.click(languageOption));

    await within(cookieConsentModal).findByRole('heading', {
      name: headingText,
    });
  }
});

it('should store consent to cookie when clicking accept all button', async () => {
  const user = userEvent.setup();

  await renderApp();

  const cookieConsentModal = await waitCookieConsentModalToBeVisible();
  const acceptAllButton = await findCookieConsentModalElement(
    cookieConsentModal,
    'acceptAllButton'
  );
  await act(async () => await user.click(acceptAllButton));

  expect(document.cookie).toEqual(expect.stringContaining(acceptAllCookieText));
  await waitCookieConsentModalToBeHidden();
});

it('should store consent to cookie when clicking accept only necessary button', async () => {
  const user = userEvent.setup();

  await renderApp();

  const cookieConsentModal = await waitCookieConsentModalToBeVisible();
  const acceptOnlyNecessaryButton = await findCookieConsentModalElement(
    cookieConsentModal,
    'acceptOnlyNecessaryButton'
  );

  await act(async () => await user.click(acceptOnlyNecessaryButton));

  expect(document.cookie).toEqual(
    expect.stringContaining(acceptOnlyNecessaryCookieText)
  );
  await waitCookieConsentModalToBeHidden();
});

it('should not show cookie consent modal if consent is saved', async () => {
  document.cookie = acceptAllCookieText;

  await renderApp();

  await waitCookieConsentModalToBeHidden();
});
