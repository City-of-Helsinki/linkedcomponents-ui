import React from 'react';

import {
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

it('should change UI language to English', () => {
  const { history } = renderComponent();

  expect(history.location.pathname).toBe(route);
  const languageMenuButton = getElement('languageMenuButton');

  userEvent.click(languageMenuButton);
  const englishOption = getElement('englishOption');
  userEvent.click(englishOption);

  expect(history.location.pathname).toBe('/en');
});

it('should call saveConsentToCookie after clicking only decline button', () => {
  const saveConsentToCookie = jest.fn();
  renderComponent({ saveConsentToCookie });

  const acceptCheckbox = getElement('acceptCheckbox');
  userEvent.click(acceptCheckbox);

  const declineButton = getElement('declineButton');
  userEvent.click(declineButton);

  expect(saveConsentToCookie).toBeCalledWith({
    required: false,
    tracking: false,
  });
});

it('should call saveConsentToCookie after clicking only required button', () => {
  const saveConsentToCookie = jest.fn();
  renderComponent({ saveConsentToCookie });

  const acceptCheckbox = getElement('acceptCheckbox');
  userEvent.click(acceptCheckbox);

  const onlyRequiredButton = getElement('onlyRequiredButton');
  userEvent.click(onlyRequiredButton);

  expect(saveConsentToCookie).toBeCalledWith({
    required: true,
    tracking: false,
  });
});

it('should call saveConsentToCookie after clicking accept all button', () => {
  const saveConsentToCookie = jest.fn();
  renderComponent({ saveConsentToCookie });

  const acceptCheckbox = getElement('acceptCheckbox');
  userEvent.click(acceptCheckbox);

  const acceptAllButton = getElement('acceptAllButton');
  userEvent.click(acceptAllButton);

  expect(saveConsentToCookie).toBeCalledWith({
    required: true,
    tracking: true,
  });
});
