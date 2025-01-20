import { MockedResponse } from '@apollo/client/testing';

import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationName,
} from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedCreatePlaceResponse,
  mockedInvalidCreatePlaceResponse,
  placeValues,
} from '../__mocks__/createPlacePage';
import CreatePlacePage from '../CreatePlacePage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreatePlacePage />, { mocks });

const getElement = (
  key: 'nameInput' | 'originIdInput' | 'publisherToggleButton' | 'saveButton'
) => {
  switch (key) {
    case 'nameInput':
      return screen.getByLabelText(/nimi \(suomeksi\)/i);
    case 'originIdInput':
      return screen.getByLabelText(/lähdetunniste/i);
    case 'publisherToggleButton':
      return screen.getByRole('combobox', { name: /julkaisija/i });
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
  renderComponent(defaultMocks);

  await shouldApplyExpectedMetaData({
    expectedDescription: 'Lisää uusi paikka Linked Eventsiin.',
    expectedKeywords:
      'lisää, uusi, paikka, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Lisää paikka - Linked Events',
  });
});

test('should focus to first validation error when trying to save new place', async () => {
  global.HTMLFormElement.prototype.submit = () => vi.fn();
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
