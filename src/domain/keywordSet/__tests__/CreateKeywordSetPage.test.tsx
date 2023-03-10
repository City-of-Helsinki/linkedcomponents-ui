/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import {
  mockedKeywordResponse as mockedKeywordSelectorKeywordResponse,
  mockedKeywordsResponse as mockedKeywordSelectorKeywordsResponse,
} from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
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
  keywordSetValues,
  mockedCreateKeywordSetResponse,
  mockedInvalidCreateKeywordSetResponse,
} from '../__mocks__/createKeywordSetPage';
import CreateKeywordSetPage from '../CreateKeywordSetPage';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [
  mockedKeywordSelectorKeywordResponse,
  mockedKeywordSelectorKeywordsResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<CreateKeywordSetPage />, { authContextValue, mocks });

const findElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.findByRole('button', { name: /tallenna/i });
  }
};

const getElement = (
  key:
    | 'keywordsToggleButton'
    | 'nameInput'
    | 'originIdInput'
    | 'saveButton'
    | 'usageToggleButton'
) => {
  switch (key) {
    case 'keywordsToggleButton':
      return screen.getByRole('button', { name: /avainsanat/i });
    case 'nameInput':
      return screen.getByLabelText(/nimi \(suomeksi\)/i);
    case 'originIdInput':
      return screen.getByLabelText(/lähdetunniste/i);
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
    case 'usageToggleButton':
      return screen.getByRole('button', { name: /käyttötarkoitus/i });
  }
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  await user.type(getElement('originIdInput'), keywordSetValues.originId);
  await user.type(getElement('nameInput'), keywordSetValues.name);

  await user.click(getElement('keywordsToggleButton'));
  const keywordsOption = await screen.findByRole(
    'option',
    { name: getValue(keywordSetValues.keyword?.name?.fi, '') },
    { timeout: 10000 }
  );
  await user.click(keywordsOption);

  await user.click(getElement('usageToggleButton'));
  const usageOption = await screen.findByRole(
    'option',
    { name: 'Yleinen' },
    { timeout: 10000 }
  );
  await user.click(usageOption);
};

test('applies expected metadata', async () => {
  const pageTitle = 'Lisää avainsanaryhmä - Linked Events';
  const pageDescription = 'Lisää uusi avainsanaryhmä Linked Eventsiin.';
  const pageKeywords =
    'lisää, uusi, avainsana, ryhmä, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
});

test('should focus to first validation error when trying to save new keyword set', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  const originIdInput = getElement('originIdInput');
  await user.click(saveButton);
  await waitFor(() => expect(originIdInput).toHaveFocus());
  await user.type(originIdInput, keywordSetValues.originId);

  const nameInput = getElement('nameInput');
  await user.click(saveButton);
  await waitFor(() => expect(nameInput).toHaveFocus());
  await user.type(nameInput, keywordSetValues.name);

  const keywordsToggleButton = getElement('keywordsToggleButton');
  await user.click(saveButton);

  await waitFor(() => expect(keywordsToggleButton).toHaveFocus());
});

test('should move to keywords page after creating new keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateKeywordSetResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await fillInputValues();

  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keyword-sets`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateKeywordSetResponse]);

  await loadingSpinnerIsNotInDocument();

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await fillInputValues();

  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
