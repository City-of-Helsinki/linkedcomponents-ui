import { testIds } from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  fireEvent,
  loadingSpinnerIsNotInDocument,
  mockFile,
  render,
  screen,
  shouldApplyExpectedMetaData,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationName,
} from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  file,
  mockedUploadImageByFileResponse,
  mockedUploadImageByUrlResponse,
} from '../__mocks__/createImagePage';
import { mockedUpdateImageResponse } from '../__mocks__/editImagePage';
import CreateImagePage from '../CreateImagePage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedOrganizationAncestorsResponse,
  mockedOrganizationResponse,
  mockedUpdateImageResponse,
  mockedUploadImageByFileResponse,
  mockedUploadImageByUrlResponse,
  mockedUserResponse,
];

const renderComponent = () => render(<CreateImagePage />, { mocks });

const getElement = (
  key: 'addButton' | 'publisherToggleButton' | 'saveButton'
) => {
  switch (key) {
    // Both add button and preview image component have same label
    case 'addButton':
      return screen.getAllByRole('button', { name: /Lisää kuva/i })[0];
    case 'publisherToggleButton':
      return screen.getByRole('combobox', { name: /julkaisija/i });
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

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription: 'Lisää uusi kuva Linked Eventsiin.',
    expectedKeywords:
      'lisää, uusi, kuva, muokkaa, lataa, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Lisää kuva - Linked Events',
  });
});

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const publisherToggleButton = getElement('publisherToggleButton');
  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() => expect(publisherToggleButton).toHaveFocus());
});

test('should create and select new image by selecting image file', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await fillPublisherField();
  await uploadImageByFile();

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

test('should prevent upload on a file name that is too long', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await fillPublisherField();

  const addButton = getElement('addButton');
  await user.click(addButton);

  const dialog = await screen.findByRole('dialog');
  const withinModal = within(dialog);
  withinModal.getByRole('heading', { name: /Lisää kuva/i });

  const fileInput = withinModal.getByTestId(testIds.imageUploader.input);
  const fileName = 'a'.repeat(255);
  const fileWithLongName = mockFile({ name: fileName });
  Object.defineProperty(fileInput, 'files', { value: [fileWithLongName] });
  fireEvent.change(fileInput);
  await screen.findByRole('alert', {
    name: 'Tiedoston nimi on liian pitkä. Nimi voi olla enintään 200 merkkiä.',
  });
});
