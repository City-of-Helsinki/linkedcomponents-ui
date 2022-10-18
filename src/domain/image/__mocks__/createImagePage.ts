import { MockedResponse } from '@apollo/client/testing';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import {
  ImageFieldsFragment,
  UploadImageDocument,
} from '../../../generated/graphql';
import { fakeImage } from '../../../utils/mockDataUtils';
import { mockFile } from '../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_IMAGE_ID } from '../constants';

const imageValues: Partial<ImageFieldsFragment> = {
  altText: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Image alt text' },
  id: TEST_IMAGE_ID,
  license: 'cc_by',
  name: 'Image name',
  photographerName: 'Photographer name',
  publisher: TEST_PUBLISHER_ID,
};

const image = fakeImage(imageValues);
const imageUrl = image.url as string;
const file = mockFile({});

const uploadImageByUrlVariables = {
  image: undefined,
  name: '',
  publisher: imageValues.publisher,
  url: imageUrl,
};
const uploadImageResponse = { data: { uploadImage: image } };
const mockedUploadImageByUrlResponse: MockedResponse = {
  request: {
    query: UploadImageDocument,
    variables: { input: uploadImageByUrlVariables },
  },
  result: uploadImageResponse,
};

const uploadImageByFileVariables = {
  image: file,
  name: '',
  publisher: imageValues.publisher,
  url: undefined,
};
const mockedUploadImageByFileResponse: MockedResponse = {
  request: {
    query: UploadImageDocument,
    variables: { input: uploadImageByFileVariables },
  },
  result: uploadImageResponse,
};

export {
  file,
  imageUrl,
  mockedUploadImageByFileResponse,
  mockedUploadImageByUrlResponse,
};
