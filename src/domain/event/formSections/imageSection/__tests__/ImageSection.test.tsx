import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';

import { EMPTY_MULTI_LANGUAGE_OBJECT, testIds } from '../../../../../constants';
import { ImageDocument } from '../../../../../generated/graphql';
import { setFeatureFlags } from '../../../../../test/featureFlags/featureFlags';
import { fakeAuthenticatedAuthContextValue } from '../../../../../utils/mockAuthContextValue';
import { fakeImage } from '../../../../../utils/mockDataUtils';
import {
  act,
  configure,
  fireEvent,
  mockString,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  DEFAULT_LICENSE_TYPE,
  IMAGE_FIELDS,
} from '../../../../image/constants';
import { mockedOrganizationAncestorsResponse } from '../../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
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
  mockedUploadImage1Response,
  mockedUploadImage2Response,
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
      onSubmit={jest.fn()}
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
        name: translations.event.form.buttonAddImage[eventType],
      })[0];
    case 'altTextInput':
      return screen.getByRole('textbox', {
        name: 'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (suomeksi) *',
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
        name: translations.image.form.labelUrl,
      });
  }
};

test('should select existing image', async () => {
  const user = userEvent.setup();
  renderComponent();

  const addButton = getElement('addButton');
  await act(async () => await user.click(addButton));

  getElement('modalHeading');

  const imageCheckbox = await screen.findByRole('checkbox', {
    name: images.data[0]?.name as string,
  });
  await act(async () => await user.click(imageCheckbox));

  const submitButton = screen.getByRole('button', {
    name: translations.common.add,
  });
  await waitFor(() => expect(submitButton).toBeEnabled());
  await act(async () => await user.click(submitButton));

  await screen.findByTestId(testIds.imagePreview.image);
});

test('should remove image', async () => {
  const user = userEvent.setup();
  renderComponent({ [EVENT_FIELDS.IMAGES]: [imageAtId] });

  await screen.findByTestId(testIds.imagePreview.image);
  // Both add button and preview image component have same label
  const removeButton = getElement('removeButton');
  await act(async () => await user.click(removeButton));

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
  await act(async () => await user.click(addButton));

  getElement('modalHeading');

  const fileInput = screen.getByTestId(testIds.imageUploader.input);
  Object.defineProperty(fileInput, 'files', { value: [file] });
  await act(async () => {
    await fireEvent.change(fileInput);
  });

  const submitButton = screen.getByRole('button', {
    name: translations.common.add,
  });
  await waitFor(() => expect(submitButton).toBeEnabled());
  await act(async () => await user.click(submitButton));

  await screen.findByTestId(testIds.imagePreview.image);
});

test('should create and select new image by entering image url', async () => {
  const user = userEvent.setup();
  renderComponent();

  const addButton = getElement('addButton');
  await act(async () => await user.click(addButton));

  getElement('modalHeading');

  const urlInput = getElement('urlInput');
  await waitFor(() => expect(urlInput).toBeEnabled());
  await act(async () => await user.click(urlInput));
  await act(async () => await user.type(urlInput, imageUrl));
  await waitFor(() => expect(urlInput).toHaveValue(imageUrl));

  const submitButton = getElement('submitButton');
  await waitFor(() => expect(submitButton).toBeEnabled());
  await act(async () => await user.click(submitButton));

  await screen.findByTestId(testIds.imagePreview.image);
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
    mockedUserResponse,
  ]);

  const altTextInput = getElement('altTextInput');
  const nameInput = getElement('nameInput');

  await waitFor(() => expect(altTextInput).toBeEnabled());
  await act(async () => await user.click(altTextInput));
  await act(async () => await user.click(nameInput));

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
    mockedUserResponse,
  ]);

  const altTextInput = getElement('altTextInput');
  const nameInput = getElement('nameInput');

  await waitFor(() => expect(nameInput).toBeEnabled());
  await act(async () => await user.click(nameInput));
  await act(async () => await user.click(altTextInput));

  await screen.findByText('Tämä kenttä voi olla korkeintaan 255 merkkiä pitkä');
});
