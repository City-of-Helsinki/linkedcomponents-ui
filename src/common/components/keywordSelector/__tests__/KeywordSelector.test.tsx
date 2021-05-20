import range from 'lodash/range';
import React from 'react';

import {
  KeywordDocument,
  KeywordsDocument,
} from '../../../../generated/graphql';
import { fakeKeyword, fakeKeywords } from '../../../../utils/mockDataUtils';
import { render, screen, userEvent } from '../../../../utils/testUtils';
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
const keywordVariables = { id: keywordId, createPath: undefined };
const keywordResponse = { data: { keyword } };
const mockedKeywordResponse = {
  request: {
    query: KeywordDocument,
    variables: keywordVariables,
  },
  result: keywordResponse,
};

const keywordNames = range(1, 6).map((val) => `Keyword name ${val}`);
const keywords = fakeKeywords(
  keywordNames.length,
  keywordNames.map((name) => ({ name: { fi: name } }))
);
const keywordsVariables = {
  createPath: undefined,
  dataSource: 'yso',
  showAllKeywords: true,
  text: '',
};
const keywordsResponse = { data: { keywords } };
const mockedKeywordsResponse = {
  request: {
    query: KeywordsDocument,
    variables: keywordsVariables,
  },
  result: keywordsResponse,
};

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

test('should combobox input value to be selected place option label', async () => {
  renderComponent();

  await screen.findByRole('link', {
    name: new RegExp(keywordName, 'i'),
    hidden: true,
  });
});

test('should open menu by clickin toggle button and list of options should be visible', async () => {
  renderComponent();

  const combobox = screen.getByRole('combobox', {
    name: new RegExp(label),
  });

  expect(combobox.getAttribute('aria-expanded')).toBe('false');

  const toggleButton = screen.queryByRole('button', {
    name: new RegExp(label),
  });
  userEvent.click(toggleButton);

  expect(combobox.getAttribute('aria-expanded')).toBe('true');

  await screen.findByRole('option', { hidden: true, name: keywordNames[0] });
  keywordNames
    .slice(1)
    .forEach((name) => screen.getByRole('option', { hidden: true, name }));
});
