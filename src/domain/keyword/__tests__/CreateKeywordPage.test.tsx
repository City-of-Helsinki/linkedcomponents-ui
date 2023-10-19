import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import getValue from '../../../utils/getValue';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  waitPageMetaDataToBeSet,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywordValues,
  mockedCreateKeywordResponse,
  mockedFilteredKeywordsResponse,
  mockedInvalidCreateKeywordResponse,
  mockedKeywordsResponse,
  replacingKeyword,
} from '../__mocks__/createKeyword';
import CreateKeywordPage from '../CreateKeywordPage';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [
  mockedKeywordsResponse,
  mockedFilteredKeywordsResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<CreateKeywordPage />, { authContextValue, mocks });

const getElement = (
  key: 'nameInput' | 'replacedByInput' | 'replacedByToggleButton' | 'saveButton'
) => {
  switch (key) {
    case 'nameInput':
      return screen.getByLabelText(/nimi \(suomeksi\)/i);
    case 'replacedByInput':
      return screen.getByRole('combobox', { name: /korvaus/i });
    case 'replacedByToggleButton':
      return screen.getByRole('button', { name: /korvaus: valikko/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  const nameInput = getElement('nameInput');
  await user.type(nameInput, keywordValues.name);

  const replacedByToggleButton = getElement('replacedByToggleButton');
  await user.click(replacedByToggleButton);

  const replacingKeywordOption = await screen.findByRole('option', {
    name: getValue(replacingKeyword?.name?.fi, ''),
    hidden: true,
  });
  await user.click(replacingKeywordOption);
};

test('form should be disabled if user is not authenticated', async () => {
  render(<CreateKeywordPage />, { mocks: defaultMocks });

  await loadingSpinnerIsNotInDocument();
  const nameInput = getElement('nameInput');
  expect(nameInput).toHaveAttribute('readOnly');
});

test('applies expected metadata', async () => {
  const pageTitle = 'Lisää avainsana - Linked Events';
  const pageDescription = 'Lisää uusi avainsana Linked Eventsiin.';
  const pageKeywords =
    'lisää, uusi, avainsana, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
});

test('should focus to first validation error when trying to save new keyword', async () => {
  global.HTMLFormElement.prototype.submit = () => vi.fn();
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const nameInput = getElement('nameInput');
  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should move to keywords page after creating new keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateKeywordResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keywords`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateKeywordResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
