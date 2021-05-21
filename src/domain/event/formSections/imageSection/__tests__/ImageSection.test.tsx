import { Formik } from 'formik';
import React from 'react';

import { testIds as imagePreviewTestIds } from '../../../../../common/components/imagePreview/ImagePreview';
import { testIds as imageUploaderTestIds } from '../../../../../common/components/imageUploader/ImageUploader';
import { fakeAuthenticatedStoreState } from '../../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  fireEvent,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { cache } from '../../../../app/apollo/apolloClient';
import translations from '../../../../app/i18n/fi.json';
import { DEFAULT_LICENSE_TYPE } from '../../../../image/constants';
import { EVENT_FIELDS, IMAGE_DETAILS_FIELDS } from '../../../constants';
import {
  eventType,
  file,
  imageAtId,
  images,
  imageUrl,
  mockedImageResponse,
  mockedImagesResponse,
  mockedOrganizationsResponse,
  mockedUploadImage1Response,
  mockedUploadImage2Response,
  mockedUserResponse,
  publisher,
} from '../__mocks__/imageSection';
import ImageSection from '../ImageSection';

configure({ defaultHidden: true });

const mocks = [
  mockedImagesResponse,
  mockedImageResponse,
  mockedUploadImage1Response,
  mockedUploadImage2Response,
  mockedOrganizationsResponse,
  mockedUserResponse,
];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

afterEach(() => cache.reset());

const renderComponent = (images = []) =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.TYPE]: eventType,
        [EVENT_FIELDS.IMAGES]: images,
        [EVENT_FIELDS.IMAGE_DETAILS]: {
          [IMAGE_DETAILS_FIELDS.ALT_TEXT]: '',
          [IMAGE_DETAILS_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
          [IMAGE_DETAILS_FIELDS.NAME]: '',
          [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: '',
        },
        [EVENT_FIELDS.PUBLISHER]: publisher,
      }}
      onSubmit={jest.fn()}
    >
      <ImageSection />
    </Formik>,
    { mocks, store }
  );

const getElement = (
  key:
    | 'addButton'
    | 'modalHeading'
    | 'removeButton'
    | 'submitButton'
    | 'urlInput'
) => {
  switch (key) {
    // Both add button and preview image component have same label
    case 'addButton':
      return screen.getAllByRole('button', {
        name: translations.event.form.buttonAddImage[eventType],
      })[0];
    case 'modalHeading':
      return screen.getByRole('heading', {
        name: translations.event.form.modalTitleImage[eventType],
      });
    // Both remove button and preview image component have same label
    case 'removeButton':
      return screen.getAllByRole('button', {
        name: translations.event.form.buttonRemoveImage[eventType],
      })[0];
    case 'submitButton':
      return screen.getByRole('button', {
        name: translations.common.add,
      });
    case 'urlInput':
      return screen.getByRole('textbox', {
        name: translations.event.form.image.labelUrl,
      });
  }
};

test('should select existing image', async () => {
  renderComponent();

  const addButton = getElement('addButton');
  userEvent.click(addButton);

  getElement('modalHeading');

  const imageCheckbox = await screen.findByRole('checkbox', {
    name: images.data[0].name,
  });
  userEvent.click(imageCheckbox);

  const submitButton = screen.getByRole('button', {
    name: translations.common.add,
  });
  await waitFor(() => expect(submitButton).toBeEnabled());
  act(() => userEvent.click(submitButton));

  await screen.findByTestId(imagePreviewTestIds.image);
});

test('should remove image', async () => {
  renderComponent([imageAtId]);

  await screen.findByTestId(imagePreviewTestIds.image);
  // Both add button and preview image component have same label
  const removeButton = getElement('removeButton');
  userEvent.click(removeButton);

  await waitFor(() =>
    expect(
      screen.queryByTestId(imagePreviewTestIds.image)
    ).not.toBeInTheDocument()
  );
});

test('should create and select new image by selecting image file', async () => {
  renderComponent();

  const addButton = getElement('addButton');
  userEvent.click(addButton);

  getElement('modalHeading');

  const fileInput = screen.getByTestId(imageUploaderTestIds.input);
  Object.defineProperty(fileInput, 'files', { value: [file] });
  fireEvent.change(fileInput);

  await screen.findByTestId(imagePreviewTestIds.image);
});

test('should create and select new image by entering image url', async () => {
  renderComponent();

  const addButton = getElement('addButton');
  userEvent.click(addButton);

  getElement('modalHeading');

  const urlInput = getElement('urlInput');
  await waitFor(() => expect(urlInput).toBeEnabled());
  act(() => userEvent.click(urlInput));
  userEvent.type(urlInput, imageUrl);
  await waitFor(() => expect(urlInput).toHaveValue(imageUrl));

  const submitButton = getElement('submitButton');
  await waitFor(() => expect(submitButton).toBeEnabled());
  act(() => userEvent.click(submitButton));

  await screen.findByTestId(imagePreviewTestIds.image);
});
