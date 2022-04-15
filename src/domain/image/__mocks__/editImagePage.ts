import { MockedResponse } from '@apollo/client/testing';

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
  id: TEST_IMAGE_ID,
  name: 'Image name',
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

const updateImageResponse = { data: { updateKeyword: image } };

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
