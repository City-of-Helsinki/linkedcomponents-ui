import { MockedResponse } from '@apollo/client/testing';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import {
  DeleteImageDocument,
  ImageDocument,
  ImageFieldsFragment,
  UpdateImageDocument,
} from '../../../generated/graphql';
import { fakeImage } from '../../../utils/mockDataUtils';
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

const imageVariables = { id: image.id, createPath: undefined };
const imageResponse = { data: { image } };
const mockedImageResponse = {
  request: { query: ImageDocument, variables: imageVariables },
  result: imageResponse,
};

const updateImageVariables = { input: imageValues };

const updateImageResponse = { data: { updateImage: image } };

const mockedUpdateImageResponse: MockedResponse = {
  request: { query: UpdateImageDocument, variables: updateImageVariables },
  result: updateImageResponse,
};

const mockedInvalidUpdateImageResponse: MockedResponse = {
  request: { query: UpdateImageDocument, variables: updateImageVariables },
  error: {
    ...new Error(),
    result: { name: ['The name must be specified.'] },
  } as Error,
};

const deleteImageVariables = { id: image.id };
const deleteImageResponse = { data: { deleteImage: null } };
const mockedDeleteImageResponse: MockedResponse = {
  request: { query: DeleteImageDocument, variables: deleteImageVariables },
  result: deleteImageResponse,
};

export {
  image,
  mockedDeleteImageResponse,
  mockedImageResponse,
  mockedInvalidUpdateImageResponse,
  mockedUpdateImageResponse,
};
