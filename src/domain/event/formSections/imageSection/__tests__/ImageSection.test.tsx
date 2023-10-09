import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';
import { vi } from 'vitest';

import { EMPTY_MULTI_LANGUAGE_OBJECT, testIds } from '../../../../../constants';
import { ImageDocument } from '../../../../../generated/graphql';
import { setFeatureFlags } from '../../../../../test/featureFlags/featureFlags';
import getValue from '../../../../../utils/getValue';
import { fakeAuthenticatedAuthContextValue } from '../../../../../utils/mockAuthContextValue';
import { fakeImage } from '../../../../../utils/mockDataUtils';
import {
  actWait,
  configure,
  fireEvent,
  mockString,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import {
  DEFAULT_LICENSE_TYPE,
  IMAGE_FIELDS,
} from '../../../../image/constants';
import { mockedOrganizationAncestorsResponse } from '../../../../organization/__mocks__/organizationAncestors';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../../user/__mocks__/user';
import { EVENT_FIELDS } from '../../../constants';
import { ImageDetails } from '../../../types';
import { publicEventSchema } from '../../../validation';
import {
  eventType,
  file,
  imageAtId,
  images,
  imageUrl,
  mockedImageResponse,
  mockedImagesResponse,
  mockedImagesUserWithoutOrganizationsReponse,
  mockedImageUserWithoutOrganizationsReponse,
  mockedUploadImage1Response,
  mockedUploadImage1UserWithoutOrganizationsResponse,
  mockedUploadImage2Response,
  mockedUploadImage2UserWithoutOrganizationsResponse,
  publisher,
} from '../__mocks__/imageSection';
import ImageSection from '../ImageSection';

configure({ defaultHidden: true });

beforeEach(() => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: true,
    SHOW_REGISTRATION: true,
  });
});

const defaultMocks = [
  mockedImagesResponse,
  mockedImageResponse,
  mockedUploadImage1Response,
  mockedUploadImage2Response,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

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
    [IMAGE_FIELDS.ALT_TEXT]: EMPTY_MULTI_LANGUAGE_OBJECT,
    [IMAGE_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
    [IMAGE_FIELDS.NAME]: '',
    [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: '',
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
      onSubmit={vi.fn()}
      validationSchema={publicEventSchema}
    >
      <ImageSection isEditingAllowed={true} />
    </Formik>,
    { authContextValue, mocks }
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
        name: 'Lisää tapahtuman kuva',
      })[0];
    case 'altTextInput':
      return screen.getByRole('textbox', {
        name: 'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (suomeksi) *',
      });
    case 'modalHeading':
      return screen.getByRole('heading', { name: 'Lisää tapahtuman kuva' });
    case 'nameInput':
      return screen.getByLabelText(/kuvateksti/i);
    // Both remove button and preview image component have same label
    case 'removeButton':
      return screen.getAllByRole('button', {
        name: 'Poista tapahtuman kuva',
      })[0];
    case 'submitButton':
      return screen.getByRole('button', { name: 'Lisää' });
    case 'urlInput':
      return screen.getByLabelText('Kuvan URL-osoite');
  }
};

test('should select existing image', async () => {
  const user = userEvent.setup();
  renderComponent();

  const addButton = getElement('addButton');
  await user.click(addButton);

  getElement('modalHeading');

  const imageCheckbox = await screen.findByLabelText(
    getValue(images.data[0]?.name, '')
  );
  await user.click(imageCheckbox);

  const submitButton = getElement('submitButton');
  await waitFor(() => expect(submitButton).toBeEnabled());
  await user.click(submitButton);

  await screen.findByTestId(testIds.imagePreview.image);
  // Wait formik to update state to avoid act warnings
  await actWait();
});

test('should remove image', async () => {
  const user = userEvent.setup();
  renderComponent({ [EVENT_FIELDS.IMAGES]: [imageAtId] });

  await screen.findByTestId(testIds.imagePreview.image);
  // Both add button and preview image component have same label
  const removeButton = getElement('removeButton');
  await user.click(removeButton);

  await waitFor(() =>
    expect(
      screen.queryByTestId(testIds.imagePreview.image)
    ).not.toBeInTheDocument()
  );
});

test('should create and select new image by selecting image file', async () => {
  const user = userEvent.setup();
  renderComponent();

  const addButton = getElement('addButton');
  await user.click(addButton);

  getElement('modalHeading');

  const fileInput = screen.getByTestId(testIds.imageUploader.input);
  Object.defineProperty(fileInput, 'files', { value: [file] });
  await fireEvent.change(fileInput);

  const submitButton = getElement('submitButton');
  await waitFor(() => expect(submitButton).toBeEnabled());
  await user.click(submitButton);

  await screen.findByTestId(testIds.imagePreview.image);
  // Wait formik to update state to avoid act warnings
  await actWait();
});

test('should create and select new image by entering image url', async () => {
  const user = userEvent.setup();
  renderComponent();

  const addButton = getElement('addButton');
  await user.click(addButton);

  getElement('modalHeading');

  const urlInput = getElement('urlInput');
  await waitFor(() => expect(urlInput).toBeEnabled());
  await user.click(urlInput);
  await user.type(urlInput, imageUrl);
  await waitFor(() => expect(urlInput).toHaveValue(imageUrl));

  const submitButton = getElement('submitButton');
  await waitFor(() => expect(submitButton).toBeEnabled());
  await user.click(submitButton);

  await screen.findByTestId(testIds.imagePreview.image);
  // Wait formik to update state to avoid act warnings
  await actWait();
});

test('should show validation error if image alt text is too long', async () => {
  const altText = mockString(161);
  const image = fakeImage({
    altText: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: altText },
    publisher,
  });
  const imageVariables = { createPath: undefined, id: image.id };
  const imageResponse = { data: { image } };
  const mockedImageResponse: MockedResponse = {
    request: { query: ImageDocument, variables: imageVariables },
    result: imageResponse,
  };
  const user = userEvent.setup();
  renderComponent({ [EVENT_FIELDS.IMAGES]: [image.atId] }, [
    mockedImageResponse,
    mockedOrganizationAncestorsResponse,
    mockedUserResponse,
  ]);

  const altTextInput = getElement('altTextInput');
  const nameInput = getElement('nameInput');

  await waitFor(() => expect(altTextInput).toBeEnabled());
  await user.click(altTextInput);
  await user.click(nameInput);

  await screen.findByText('Tämä kenttä voi olla korkeintaan 160 merkkiä pitkä');
});

test('should show validation error if image name is too long', async () => {
  const name = mockString(256);
  const image = fakeImage({ name, publisher });
  const imageVariables = { createPath: undefined, id: image.id };
  const imageResponse = { data: { image } };
  const mockedImageResponse: MockedResponse = {
    request: { query: ImageDocument, variables: imageVariables },
    result: imageResponse,
  };
  const user = userEvent.setup();
  renderComponent({ [EVENT_FIELDS.IMAGES]: [image.atId] }, [
    mockedImageResponse,
    mockedOrganizationAncestorsResponse,
    mockedUserResponse,
  ]);

  const altTextInput = getElement('altTextInput');
  const nameInput = getElement('nameInput');

  await waitFor(() => expect(nameInput).toBeEnabled());
  await user.click(nameInput);
  await user.click(altTextInput);

  await screen.findByText('Tämä kenttä voi olla korkeintaan 255 merkkiä pitkä');
});

test('should create and select new image by selecting image file for external user', async () => {
  const user = userEvent.setup();
  renderComponent();

  const mockValues = { ...defaultInitialValues, [EVENT_FIELDS.PUBLISHER]: '' };
  const mocks = [
    mockedImagesUserWithoutOrganizationsReponse,
    mockedImageUserWithoutOrganizationsReponse,
    mockedUploadImage1UserWithoutOrganizationsResponse,
    mockedUploadImage2UserWithoutOrganizationsResponse,
    mockedOrganizationAncestorsResponse,
    mockedUserWithoutOrganizationsResponse,
  ];

  renderComponent(mockValues, mocks);

  const addButton = getElement('addButton');
  await user.click(addButton);

  getElement('modalHeading');

  const fileInput = screen.getByTestId(testIds.imageUploader.input);
  Object.defineProperty(fileInput, 'files', { value: [file] });
  await fireEvent.change(fileInput);

  const submitButton = getElement('submitButton');
  await waitFor(() => expect(submitButton).toBeEnabled());
  await user.click(submitButton);

  await screen.findByTestId(testIds.imagePreview.image);
  // Wait formik to update state to avoid act warnings
  await actWait();
});

test('should create and select new image by entering image url for external user', async () => {
  const user = userEvent.setup();

  const mockValues = { ...defaultInitialValues, [EVENT_FIELDS.PUBLISHER]: '' };
  const mocks = [
    mockedImagesUserWithoutOrganizationsReponse,
    mockedImageUserWithoutOrganizationsReponse,
    mockedUploadImage1UserWithoutOrganizationsResponse,
    mockedUploadImage2UserWithoutOrganizationsResponse,
    mockedOrganizationAncestorsResponse,
    mockedUserWithoutOrganizationsResponse,
  ];

  renderComponent(mockValues, mocks);

  const addButton = getElement('addButton');
  await user.click(addButton);

  getElement('modalHeading');

  const urlInput = getElement('urlInput');
  await waitFor(() => expect(urlInput).toBeEnabled());
  await user.click(urlInput);
  await user.type(urlInput, imageUrl);
  await waitFor(() => expect(urlInput).toHaveValue(imageUrl));

  const submitButton = getElement('submitButton');
  await waitFor(() => expect(submitButton).toBeEnabled());
  await user.click(submitButton);

  await screen.findByTestId(testIds.imagePreview.image);
  // Wait formik to update state to avoid act warnings
  await actWait();
});
