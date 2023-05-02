import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import {
  keywordAtId,
  keywordName,
  keywordNames,
  mockedKeywordResponse,
  mockedKeywordsResponse,
} from '../__mocks__/keywordSelector';
import KeywordSelector, { KeywordSelectorProps } from '../KeywordSelector';

configure({ defaultHidden: true });

const helper = 'Helper text';
const label = 'Select keyword';
const name = 'keyword';

const mocks = [mockedKeywordResponse, mockedKeywordsResponse];

const clearButtonAriaLabel = 'Poista kaikki';
const selectedItemRemoveButtonAriaLabel = 'Poista valinta';

const defaultProps: KeywordSelectorProps = {
  clearButtonAriaLabel,
  helper,
  label,
  multiselect: true,
  name,
  selectedItemRemoveButtonAriaLabel,
  value: [keywordAtId],
};

const renderComponent = (props?: Partial<KeywordSelectorProps>) =>
  render(<KeywordSelector {...defaultProps} {...props} />, { mocks });

test('should combobox input value to be selected keyword option label', async () => {
  renderComponent();

  await screen.findByText(keywordName, undefined, { timeout: 2000 });
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  const user = userEvent.setup();
  renderComponent();

  const combobox = screen.getByRole('combobox', { name: new RegExp(label) });

  expect(combobox.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = screen.getByRole('button', { name: new RegExp(label) });
  await user.click(toggleButton);

  expect(combobox.getAttribute('aria-expanded')).toBe('true');

  await screen.findByRole('option', { hidden: true, name: keywordName });
  keywordNames.forEach((name) =>
    screen.getByRole('option', { hidden: true, name })
  );
});
