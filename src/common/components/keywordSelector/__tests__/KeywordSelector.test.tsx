import range from 'lodash/range';
import React from 'react';

import translations from '../../../../domain/app/i18n/fi.json';
import {
  KeywordDocument,
  KeywordsDocument,
} from '../../../../generated/graphql';
import { fakeKeyword, fakeKeywords } from '../../../../utils/mockDataUtils';
import {
  actWait,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import KeywordSelector, { KeywordSelectorProps } from '../KeywordSelector';

const keywordId = 'hel:123';
const keywordAtId = `https://api.hel.fi/linkedevents/v1/keyword/${keywordId}/`;
const keywordName = 'Keyword name';
const helper = 'Helper text';
const label = 'Select keyword';
const name = 'keyword';

const keyword = fakeKeyword({
  id: keywordId,
  atId: keywordAtId,
  name: { fi: keywordName },
});

const keywordResponse = { data: { keyword } };

const keywordNames = range(1, 6).map((val) => `Keyword name ${val}`);
const keywords = fakeKeywords(
  keywordNames.length,
  keywordNames.map((name) => ({ name: { fi: name } }))
);
const keywordsResponse = { data: { keywords } };

const keywordsVariables = {
  createPath: undefined,
  dataSource: 'yso',
  showAllKeywords: true,
  text: '',
};

const mocks = [
  {
    request: {
      query: KeywordDocument,
      variables: { id: keywordId, createPath: undefined },
    },
    result: keywordResponse,
  },
  {
    request: {
      query: KeywordsDocument,
      variables: keywordsVariables,
    },
    result: keywordsResponse,
  },
];

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

test('should combobox input value to be selected place option label', async () => {
  renderComponent();

  await waitFor(() => {
    expect(
      screen.queryByRole('link', {
        name: new RegExp(keywordName, 'i'),
        hidden: true,
      })
    ).toBeInTheDocument();
  });
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  renderComponent();

  await actWait();

  const inputField = screen.queryByRole('combobox', {
    name: new RegExp(helper),
  });

  expect(inputField.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = screen.queryByRole('button', {
    name: `${label}: ${translations.common.combobox.toggleButtonAriaLabel}`,
  });
  userEvent.click(toggleButton);

  expect(inputField.getAttribute('aria-expanded')).toBe('true');

  keywords.data.forEach(async (option) => {
    expect(
      screen.queryByRole('option', { hidden: true, name: option.name.fi })
    ).toBeInTheDocument();
  });
});
