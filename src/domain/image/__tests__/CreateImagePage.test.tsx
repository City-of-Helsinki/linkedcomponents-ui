import { testIds as imagePreviewTestIds } from '../../../common/components/imagePreview/ImagePreview';
import { testIds as imageUploaderTestIds } from '../../../common/components/imageUploader/ImageUploader';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  actWait,
  configure,
  fireEvent,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
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

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = () => render(<CreateImagePage />, { mocks, store });

const getElement = (
  key: 'addButton' | 'publisherInput' | 'publisherToggleButton' | 'saveButton'
) => {
  switch (key) {
    // Both add button and preview image component have same label
    case 'addButton':
      return screen.getAllByRole('button', {
        name: /Lisää kuva/i,
      })[0];
    case 'publisherInput':
      return screen.getByRole('combobox', { name: /julkaisija/i });
    case 'publisherToggleButton':
      return screen.getByRole('button', { name: /julkaisija: valikko/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillPublisherField = async () => {
  const publisherToggleButton = getElement('publisherToggleButton');
  userEvent.click(publisherToggleButton);

  const option = await screen.findByRole('option', { name: organizationName });
  userEvent.click(option);
};

const uploadImageByFile = async () => {
  const addButton = getElement('addButton');
  userEvent.click(addButton);

  const withinModal = within(screen.getByRole('dialog'));
  withinModal.getByRole('heading', { name: /Lisää kuva/i });

  const fileInput = withinModal.getByTestId(imageUploaderTestIds.input);
  Object.defineProperty(fileInput, 'files', { value: [file] });
  fireEvent.change(fileInput);
  await actWait(1000);
};

const uploadImageByUrl = async () => {
  const addButton = getElement('addButton');
  userEvent.click(addButton);

  const withinModal = within(screen.getByRole('dialog'));
  withinModal.getByRole('heading', { name: /Lisää kuva/i });

  const urlInput = withinModal.getByRole('textbox', {
    name: /kuvan url-osoite/i,
  });
  await waitFor(() => expect(urlInput).toBeEnabled());
  act(() => userEvent.click(urlInput));
  userEvent.type(urlInput, imageUrl);
  await waitFor(() => expect(urlInput).toHaveValue(imageUrl));

  const submitButton = withinModal.getByRole('button', { name: 'Lisää' });
  await waitFor(() => expect(submitButton).toBeEnabled());
  act(() => userEvent.click(submitButton));
};

test('should scroll to first validation error input field', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const publisherInput = getElement('publisherInput');
  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(publisherInput).toHaveFocus());
});

test('should create and select new image by selecting image file', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await fillPublisherField();
  await uploadImageByFile();

  await screen.findByTestId(imagePreviewTestIds.image);
});

test('should create and select new image by entering image url', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await fillPublisherField();
  await uploadImageByUrl();

  await screen.findByTestId(imagePreviewTestIds.image);
});

test('should move to images page after creating new image', async () => {
  const { history } = renderComponent();

  await loadingSpinnerIsNotInDocument();

  await fillPublisherField();
  await uploadImageByFile();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(
    () => expect(history.location.pathname).toBe(`/fi/admin/images`),
    { timeout: 10000 }
  );
});
