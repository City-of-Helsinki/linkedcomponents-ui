import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import CookieConsentModal, {
  CookieContentModalProps,
} from '../CookieConsentModal';

configure({ defaultHidden: true });

const defaultProps: CookieContentModalProps = {
  isOpen: true,
  saveConsentToCookie: jest.fn(),
};

const route = '/fi';

const renderComponent = (props?: Partial<CookieContentModalProps>) =>
  render(<CookieConsentModal {...defaultProps} {...props} />, {
    routes: [route],
  });

const getElement = (
  key:
    | 'acceptAllButton'
    | 'acceptCheckbox'
    | 'declineButton'
    | 'englishOption'
    | 'languageMenuButton'
    | 'onlyRequiredButton'
) => {
  switch (key) {
    case 'acceptAllButton':
      return screen.getByRole('button', { name: /kaikki/i });
    case 'acceptCheckbox':
      return screen.getByRole('checkbox', {
        name: /olen lukenut ja hyväksyn palvelun käyttöehdot/i,
      });
    case 'declineButton':
      return screen.getByRole('button', { name: /en hyväksy/i });
    case 'englishOption':
      return screen.getByRole('link', { name: /in english/i });
    case 'languageMenuButton':
      return screen.getByRole('button', { name: /suomi - kielivalikko/i });
    case 'onlyRequiredButton':
      return screen.getByRole('button', { name: /vain välttämättömät/i });
  }
};

it('should change UI language to English', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  expect(history.location.pathname).toBe(route);
  const languageMenuButton = getElement('languageMenuButton');

  await act(async () => await user.click(languageMenuButton));
  const englishOption = getElement('englishOption');
  await act(async () => await user.click(englishOption));

  expect(history.location.pathname).toBe('/en');
});

it('should call saveConsentToCookie after clicking only decline button', async () => {
  const saveConsentToCookie = jest.fn();
  const user = userEvent.setup();
  renderComponent({ saveConsentToCookie });

  const acceptCheckbox = getElement('acceptCheckbox');
  await act(async () => await user.click(acceptCheckbox));

  const declineButton = getElement('declineButton');
  await act(async () => await user.click(declineButton));

  expect(saveConsentToCookie).toBeCalledWith({
    required: false,
    tracking: false,
  });
});

it('should call saveConsentToCookie after clicking only required button', async () => {
  const saveConsentToCookie = jest.fn();
  const user = userEvent.setup();
  renderComponent({ saveConsentToCookie });

  const acceptCheckbox = getElement('acceptCheckbox');
  await act(async () => await user.click(acceptCheckbox));

  const onlyRequiredButton = getElement('onlyRequiredButton');
  await act(async () => await user.click(onlyRequiredButton));

  expect(saveConsentToCookie).toBeCalledWith({
    required: true,
    tracking: false,
  });
});

it('should call saveConsentToCookie after clicking accept all button', async () => {
  const saveConsentToCookie = jest.fn();
  const user = userEvent.setup();
  renderComponent({ saveConsentToCookie });

  const acceptCheckbox = getElement('acceptCheckbox');
  await act(async () => await user.click(acceptCheckbox));

  const acceptAllButton = getElement('acceptAllButton');
  await act(async () => await user.click(acceptAllButton));

  expect(saveConsentToCookie).toBeCalledWith({
    required: true,
    tracking: true,
  });
});
