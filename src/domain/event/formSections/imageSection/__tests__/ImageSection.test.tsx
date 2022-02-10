import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';

import { testIds as imagePreviewTestIds } from '../../../../../common/components/imagePreview/ImagePreview';
import { testIds as imageUploaderTestIds } from '../../../../../common/components/imageUploader/ImageUploader';
import { ImageDocument } from '../../../../../generated/graphql';
import { fakeImage } from '../../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  fireEvent,
  getMockReduxStore,
  mockString,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { DEFAULT_LICENSE_TYPE } from '../../../../image/constants';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
import { EVENT_FIELDS, IMAGE_DETAILS_FIELDS } from '../../../constants';
import { ImageDetails } from '../../../types';
import { publicEventSchema } from '../../../utils';
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
  publisher,
} from '../__mocks__/imageSection';
import ImageSection from '../ImageSection';

configure({ defaultHidden: true });

const defaultMocks = [
  mockedImagesResponse,
  mockedImageResponse,
  mockedUploadImage1Response,
  mockedUploadImage2Response,
  mockedOrganizationsResponse,
  mockedUserResponse,
];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

type InitialValues = {
  [EVENT_FIELDS.TYPE]: string;
  [EVENT_FIELDS.IMAGES]: string[];
  [EVENT_FIELDS.IMAGE_DETAILS]: ImageDetails;
  [EVENT_FIELDS.IS_IMAGE_EDITABLE]: boolean;
  [EVENT_FIELDS.PUBLISHER]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.TYPE]: eventType,
  [EVENT_FIELDS.IMAGES]: [],
  [EVENT_FIELDS.IMAGE_DETAILS]: {
    [IMAGE_DETAILS_FIELDS.ALT_TEXT]: '',
    [IMAGE_DETAILS_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
    [IMAGE_DETAILS_FIELDS.NAME]: '',
    [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: '',
  },
  [EVENT_FIELDS.IS_IMAGE_EDITABLE]: true,
  [EVENT_FIELDS.PUBLISHER]: publisher,
};

const renderComponent = (
  initialValues?: Partial<InitialValues>,
  mocks: MockedResponse[] = defaultMocks
) =>
  render(
    <Formik
      initialValues={{
        ...defaultInitialValues,
        ...initialValues,
      }}
      onSubmit={jest.fn()}
      validationSchema={publicEventSchema}
    >
      <ImageSection />
    </Formik>,
    { mocks, store }
  );

const getElement = (
  key:
    | 'addButton'
    | 'altTextInput'
    | 'modalHeading'
    | 'nameInput'
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
    case 'altTextInput':
      return screen.getByRole('textbox', {
        name: /kuvan vaihtoehtoinen teksti ruudunlukijoille/i,
      });
    case 'modalHeading':
      return screen.getByRole('heading', {
        name: translations.event.form.modalTitleImage[eventType],
      });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /kuvateksti/i });
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
  renderComponent({ [EVENT_FIELDS.IMAGES]: [imageAtId] });

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

test('should show validation error if image alt text is too long', async () => {
  const altText = mockString(161);
  const image = fakeImage({ altText, publisher });
  const imageVariables = { createPath: undefined, id: image.id };
  const imageResponse = { data: { image } };
  const mockedImageResponse: MockedResponse = {
    request: {
      query: ImageDocument,
      variables: imageVariables,
    },
    result: imageResponse,
  };
  renderComponent(
    {
      [EVENT_FIELDS.IMAGES]: [image.atId],
    },
    [mockedImageResponse, mockedUserResponse]
  );

  const altTextInput = getElement('altTextInput');
  const nameInput = getElement('nameInput');

  await waitFor(() => expect(altTextInput).toBeEnabled());
  act(() => userEvent.click(altTextInput));
  act(() => userEvent.click(nameInput));

  await screen.findByText('Tämä kenttä voi olla korkeintaan 160 merkkiä pitkä');
});

test('should show validation error if image name is too long', async () => {
  const name = mockString(256);
  const image = fakeImage({ name, publisher });
  const imageVariables = { createPath: undefined, id: image.id };
  const imageResponse = { data: { image } };
  const mockedImageResponse: MockedResponse = {
    request: {
      query: ImageDocument,
      variables: imageVariables,
    },
    result: imageResponse,
  };
  renderComponent(
    {
      [EVENT_FIELDS.IMAGES]: [image.atId],
    },
    [mockedImageResponse, mockedUserResponse]
  );

  const altTextInput = getElement('altTextInput');
  const nameInput = getElement('nameInput');

  await waitFor(() => expect(nameInput).toBeEnabled());
  act(() => userEvent.click(nameInput));
  act(() => userEvent.click(altTextInput));

  await screen.findByText('Tämä kenttä voi olla korkeintaan 255 merkkiä pitkä');
});
