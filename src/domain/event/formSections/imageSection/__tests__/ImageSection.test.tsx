import { MockedResponse } from '@apollo/react-testing';
import { Formik } from 'formik';
import React from 'react';

import { testIds as imagePreviewTestIds } from '../../../../../common/components/imagePreview/ImagePreview';
import { PAGE_SIZE } from '../../../../../common/components/imageSelector/constants';
import { testIds as imageUploaderTestIds } from '../../../../../common/components/imageUploader/ImageUploader';
import { MAX_PAGE_SIZE } from '../../../../../constants';
import {
  ImageDocument,
  ImagesDocument,
  OrganizationsDocument,
  UploadImageDocument,
  UserDocument,
} from '../../../../../generated/graphql';
import {
  fakeImages,
  fakeOrganizations,
  fakeUser,
} from '../../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../../utils/mockStoreUtils';
import {
  configure,
  fireEvent,
  getMockReduxStore,
  mockFile,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { DEFAULT_LICENSE_TYPE } from '../../../../image/constants';
import {
  EVENT_FIELDS,
  EVENT_TYPE,
  IMAGE_DETAILS_FIELDS,
} from '../../../constants';
import ImageSection from '../ImageSection';

configure({ defaultHidden: true });

const publisher = 'publisher:1';

const eventType = EVENT_TYPE.EVENT;

const images = fakeImages(PAGE_SIZE, [{ publisher }]);
const imagesVariables = {
  createPath: undefined,
  pageSize: PAGE_SIZE,
  publisher,
};
const imagesResponse = {
  data: {
    images: {
      ...images,
      meta: {
        ...images.meta,
        count: 15,
        next: 'https://api.hel.fi/linkedevents/v1/image/?page=2',
      },
    },
  },
};
const mockedImagesResponse = {
  request: {
    query: ImagesDocument,
    variables: imagesVariables,
  },
  result: imagesResponse,
  newData: () => imagesResponse,
};

const image = images.data[0];
const imageVariables = { createPath: undefined, id: image.id };
const imageResponse = {
  data: {
    image,
  },
};
const mockedImageResponse = {
  request: {
    query: ImageDocument,
    variables: imageVariables,
  },
  result: imageResponse,
};

const imageAtId = image.atId;
const imageUrl = image.url;
const file = mockFile({});

const uploadImage1Variables = {
  image: undefined,
  name: '',
  publisher,
  url: imageUrl,
};
const uploadImageResponse = {
  data: {
    uploadImage: image,
  },
};
const mockedUploadImage1Response = {
  request: {
    query: UploadImageDocument,
    variables: {
      input: uploadImage1Variables,
    },
  },
  result: uploadImageResponse,
};

const uploadImage2Variables = {
  image: file,
  name: '',
  publisher,
  url: undefined,
};
const mockedUploadImage2Response = {
  request: {
    query: UploadImageDocument,
    variables: {
      input: uploadImage2Variables,
    },
  },
  result: uploadImageResponse,
};

const organizationsVariables = {
  child: publisher,
  createPath: undefined,
  pageSize: MAX_PAGE_SIZE,
};
const organizationsResponse = {
  data: { organizations: fakeOrganizations(0) },
};
const mockedOrganizationsResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  result: organizationsResponse,
};

const user = fakeUser({
  organization: publisher,
  adminOrganizations: [publisher],
  organizationMemberships: [],
});
const userVariables = {
  createPath: undefined,
  id: 'user:1',
};
const userResponse = { data: { user } };
const mockedUserResponse: MockedResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userResponse,
};

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

test('should select existing image', async () => {
  renderComponent();

  // Both add button and preview image component have same label
  const addButton = screen.getAllByRole('button', {
    name: translations.event.form.buttonAddImage[eventType],
  })[0];
  userEvent.click(addButton);

  screen.getByRole('heading', {
    name: translations.event.form.modalTitleImage,
  });

  const imageCheckbox = await screen.findByRole('checkbox', {
    name: images.data[0].name,
  });
  userEvent.click(imageCheckbox);

  const submitButton = screen.getByRole('button', {
    name: translations.common.add,
  });
  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
  userEvent.click(submitButton);

  await screen.findByTestId(imagePreviewTestIds.image);
});

test('should remove image', async () => {
  renderComponent([imageAtId]);

  await screen.findByTestId(imagePreviewTestIds.image);
  // Both add button and preview image component have same label
  const removeButton = screen.getAllByRole('button', {
    name: translations.event.form.buttonRemoveImage[eventType],
  })[0];
  userEvent.click(removeButton);

  await waitFor(() => {
    expect(
      screen.queryByTestId(imagePreviewTestIds.image)
    ).not.toBeInTheDocument();
  });
});

test('should create and select new image by selecting image file', async () => {
  renderComponent();

  // Both add button and preview image component have same label
  const addButton = screen.getAllByRole('button', {
    name: translations.event.form.buttonAddImage[eventType],
  })[0];
  userEvent.click(addButton);

  screen.getByRole('heading', {
    name: translations.event.form.modalTitleImage,
  });

  const fileInput = screen.getByTestId(imageUploaderTestIds.input);
  Object.defineProperty(fileInput, 'files', {
    value: [file],
  });
  fireEvent.change(fileInput);

  await screen.findByTestId(imagePreviewTestIds.image);
});

test('should create and select new image by entering image url', async () => {
  renderComponent();

  // Both add button and preview image component have same label
  const addButton = screen.getAllByRole('button', {
    name: translations.event.form.buttonAddImage[eventType],
  })[0];
  userEvent.click(addButton);

  screen.getByRole('heading', {
    name: translations.event.form.modalTitleImage,
  });

  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
  });
  await waitFor(() => {
    expect(urlInput).toBeEnabled();
  });
  userEvent.type(urlInput, imageUrl);

  const submitButton = screen.queryByRole('button', {
    name: translations.common.add,
  });
  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.queryByTestId(imagePreviewTestIds.image)).toBeInTheDocument();
  });
});
