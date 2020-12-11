import { Formik } from 'formik';
import React from 'react';

import { testIds as imagePreviewTestIds } from '../../../../../common/components/imagePreview/ImagePreview';
import { testIds as imageUploaderTestIds } from '../../../../../common/components/imageUploader/ImageUploader';
import {
  ImageDocument,
  ImagesDocument,
  UploadImageDocument,
} from '../../../../../generated/graphql';
import { fakeImages } from '../../../../../utils/mockDataUtils';
import {
  fireEvent,
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

const eventType = EVENT_TYPE.EVENT;

const images = fakeImages(5);
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

const image = images.data[0];
const imageResponse = {
  data: {
    image,
  },
};

const imageAtId = image.atId;
const imageUrl = image.url;
const file = mockFile({});

const uploadImageResponse = {
  data: {
    uploadImage: image,
  },
};
const mocks = [
  {
    request: {
      query: ImagesDocument,
      variables: { createPath: undefined, pageSize: 5 },
    },
    result: imagesResponse,
    newData: () => imagesResponse,
  },
  {
    request: {
      query: ImageDocument,
      variables: { createPath: undefined, id: image.id },
    },
    result: imageResponse,
  },
  {
    request: {
      query: UploadImageDocument,
      variables: {
        input: { image: undefined, name: '', url: imageUrl },
      },
    },
    result: uploadImageResponse,
  },
  {
    request: {
      query: UploadImageDocument,
      variables: {
        input: { image: file, name: '', url: undefined },
      },
    },
    result: uploadImageResponse,
  },
];

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
      }}
      onSubmit={jest.fn()}
    >
      <ImageSection />
    </Formik>,
    { mocks }
  );

test('should select existing image', async () => {
  renderComponent();

  // Both add button and preview image component have same label
  const addButton = screen.getAllByRole('button', {
    name: translations.event.form.buttonAddImage[eventType],
  })[0];

  userEvent.click(addButton);

  expect(
    screen.getByRole('heading', {
      name: translations.event.form.modalTitleImage,
    })
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(
      screen.queryByRole('checkbox', { name: images.data[0].name })
    ).toBeInTheDocument();
  });

  userEvent.click(screen.getByRole('checkbox', { name: images.data[0].name }));

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

test('should remove image', async () => {
  renderComponent([imageAtId]);

  await waitFor(() => {
    expect(screen.queryByTestId(imagePreviewTestIds.image)).toBeInTheDocument();
  });
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

  expect(
    screen.getByRole('heading', {
      name: translations.event.form.modalTitleImage,
    })
  ).toBeInTheDocument();

  const fileInput = screen.getByTestId(imageUploaderTestIds.input);

  Object.defineProperty(fileInput, 'files', {
    value: [file],
  });

  fireEvent.change(fileInput);

  await waitFor(() => {
    expect(screen.queryByTestId(imagePreviewTestIds.image)).toBeInTheDocument();
  });
});

test('should create and select new image by entering image url', async () => {
  renderComponent();

  // Both add button and preview image component have same label
  const addButton = screen.getAllByRole('button', {
    name: translations.event.form.buttonAddImage[eventType],
  })[0];

  userEvent.click(addButton);

  expect(
    screen.getByRole('heading', {
      name: translations.event.form.modalTitleImage,
    })
  ).toBeInTheDocument();

  const urlInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelUrl,
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
