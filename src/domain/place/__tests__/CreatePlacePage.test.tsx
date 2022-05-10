import { MockedResponse } from '@apollo/client/testing';

import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
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

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [mockedOrganizationResponse, mockedUserResponse];

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreatePlacePage />, { mocks, store });

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
      return screen.getByRole('textbox', { name: /nimi \(suomeksi\)/i });
    case 'originIdInput':
      return screen.getByRole('textbox', { name: /lähdetunniste/i });
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
  await act(async () => await user.type(originIdInput, placeValues.originId));

  const publisherToggleButton = getElement('publisherToggleButton');
  await act(async () => await user.click(publisherToggleButton));
  const option = await screen.findByRole('option', { name: organizationName });
  await act(async () => await user.click(option));

  const nameInput = getElement('nameInput');
  await act(async () => await user.type(nameInput, placeValues.name));
};

test('should focus to first validation error when trying to save new place', async () => {
  global.HTMLFormElement.prototype.submit = () => jest.fn();
  const user = userEvent.setup();
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const originIdInput = getElement('originIdInput');
  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  await waitFor(() => expect(originIdInput).toHaveFocus());
  await act(async () => await user.type(originIdInput, placeValues.originId));

  const publisherToggleButton = getElement('publisherToggleButton');
  await act(async () => await user.click(saveButton));
  await waitFor(() => expect(publisherToggleButton).toHaveFocus());

  await act(async () => await user.click(publisherToggleButton));
  const option = await screen.findByRole('option', { name: organizationName });
  await act(async () => await user.click(option));

  const nameInput = getElement('nameInput');
  await act(async () => await user.click(saveButton));
  await waitFor(() => expect(nameInput).toHaveFocus());
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
  await act(async () => await user.click(saveButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/places`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreatePlaceResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
