import React from 'react';

import { testIds } from '../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  actWait,
  configure,
  fireEvent,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  waitPageMetaDataToBeSet,
  within,
} from '../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationName,
} from '../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  file,
  imageUrl,
  mockedUploadImageByFileResponse,
  mockedUploadImageByUrlResponse,
} from '../__mocks__/createImagePage';
import { mockedUpdateImageResponse } from '../__mocks__/editImagePage';
import CreateImagePage from '../CreateImagePage';

configure({ defaultHidden: true });

const mocks = [
  mockedOrganizationResponse,
  mockedUpdateImageResponse,
  mockedUploadImageByFileResponse,
  mockedUploadImageByUrlResponse,
  mockedUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const renderComponent = () =>
  render(<CreateImagePage />, { authContextValue, mocks });

const getElement = (
  key: 'addButton' | 'publisherInput' | 'publisherToggleButton' | 'saveButton'
) => {
  switch (key) {
    // Both add button and preview image component have same label
    case 'addButton':
      return screen.getAllByRole('button', { name: /Lisää kuva/i })[0];
    case 'publisherInput':
      return screen.getByRole('combobox', { name: /julkaisija/i });
    case 'publisherToggleButton':
      return screen.getByRole('button', { name: /julkaisija: valikko/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillPublisherField = async () => {
  const user = userEvent.setup();
  const publisherToggleButton = getElement('publisherToggleButton');
  await user.click(publisherToggleButton);

  const option = await screen.findByRole('option', { name: organizationName });
  await user.click(option);
};

const uploadImageByFile = async () => {
  const user = userEvent.setup();

  const addButton = getElement('addButton');
  await user.click(addButton);

  const dialog = await screen.findByRole('dialog');
  const withinModal = within(dialog);
  withinModal.getByRole('heading', { name: /Lisää kuva/i });

  const fileInput = withinModal.getByTestId(testIds.imageUploader.input);
  Object.defineProperty(fileInput, 'files', { value: [file] });
  fireEvent.change(fileInput);

  const submitButton = withinModal.getByRole('button', { name: 'Lisää' });
  await waitFor(() => expect(submitButton).toBeEnabled());
  await user.click(submitButton);
};

const uploadImageByUrl = async () => {
  const user = userEvent.setup();

  const addButton = getElement('addButton');
  await user.click(addButton);

  const dialog = await screen.findByRole('dialog');
  const withinModal = within(dialog);
  withinModal.getByRole('heading', { name: /Lisää kuva/i });

  const urlInput = withinModal.getByLabelText(/kuvan url-osoite/i);
  await waitFor(() => expect(urlInput).toBeEnabled());
  await user.type(urlInput, imageUrl);

  const submitButton = withinModal.getByRole('button', { name: 'Lisää' });
  await waitFor(() => expect(submitButton).toBeEnabled());
  await user.click(submitButton);
};

test('applies expected metadata', async () => {
  const pageTitle = 'Lisää kuva - Linked Events';
  const pageDescription = 'Lisää uusi kuva Linked Eventsiin.';
  const pageKeywords =
    'lisää, uusi, kuva, muokkaa, lataa, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi';

  renderComponent();
  await loadingSpinnerIsNotInDocument();

  await waitPageMetaDataToBeSet({ pageDescription, pageKeywords, pageTitle });
  await actWait(10);
});

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const publisherInput = getElement('publisherInput');
  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() => expect(publisherInput).toHaveFocus());
});

test('should create and select new image by selecting image file', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await fillPublisherField();
  await uploadImageByFile();

  await screen.findByTestId(testIds.imagePreview.image);
});

test('should create and select new image by entering image url', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await fillPublisherField();
  await uploadImageByUrl();

  await screen.findByTestId(testIds.imagePreview.image);
});

test('should move to images page after creating new image', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  await fillPublisherField();
  await uploadImageByFile();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(
    () => expect(history.location.pathname).toBe(`/fi/administration/images`),
    { timeout: 10000 }
  );
});
