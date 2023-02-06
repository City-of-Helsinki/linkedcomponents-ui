import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  actWait,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  waitPageMetaDataToBeSet,
} from '../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationName,
} from '../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedCreatePlaceResponse,
  mockedInvalidCreatePlaceResponse,
  placeValues,
} from '../__mocks__/createPlacePage';
import CreatePlacePage from '../CreatePlacePage';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [mockedOrganizationResponse, mockedUserResponse];

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreatePlacePage />, { authContextValue, mocks });

const getElement = (
  key:
    | 'nameInput'
    | 'originIdInput'
    | 'publisherInput'
    | 'publisherToggleButton'
    | 'saveButton'
) => {
  switch (key) {
    case 'nameInput':
      return screen.getByLabelText(/nimi \(suomeksi\)/i);
    case 'originIdInput':
      return screen.getByLabelText(/lähdetunniste/i);
    case 'publisherInput':
      return screen.getByRole('combobox', { name: /julkaisija/i });
    case 'publisherToggleButton':
      return screen.getByRole('button', { name: /julkaisija: valikko/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  const originIdInput = getElement('originIdInput');
  await user.type(originIdInput, placeValues.originId);

  const publisherToggleButton = getElement('publisherToggleButton');
  await user.click(publisherToggleButton);
  const option = await screen.findByRole('option', { name: organizationName });
  await user.click(option);

  const nameInput = getElement('nameInput');
  await user.type(nameInput, placeValues.name);
};

test('applies expected metadata', async () => {
  const pageTitle = 'Lisää paikka - Linked Events';
  const pageDescription = 'Lisää uusi paikka Linked Eventsiin.';
  const pageKeywords =
    'lisää, uusi, paikka, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
  await actWait(10);
});

test('should focus to first validation error when trying to save new place', async () => {
  global.HTMLFormElement.prototype.submit = () => jest.fn();
  const user = userEvent.setup();
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const originIdInput = getElement('originIdInput');
  const publisherToggleButton = getElement('publisherToggleButton');
  const saveButton = getElement('saveButton');

  await user.click(saveButton);
  await waitFor(() => expect(originIdInput).toHaveFocus());

  await user.type(originIdInput, placeValues.originId);
  await user.click(saveButton);
  await waitFor(() => expect(publisherToggleButton).toHaveFocus());
});

test('should move to places page after creating new place', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreatePlaceResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/places`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreatePlaceResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
