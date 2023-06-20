import { MockedResponse } from '@apollo/client/testing';

import { PAGE_SIZE } from '../../../../../common/components/imageSelector/constants';
import {
  ImageDocument,
  ImagesDocument,
  UploadImageDocument,
} from '../../../../../generated/graphql';
import getValue from '../../../../../utils/getValue';
import { fakeImages } from '../../../../../utils/mockDataUtils';
import { mockFile } from '../../../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../../../organization/constants';
import { EVENT_TYPE } from '../../../constants';

const publisher = TEST_PUBLISHER_ID;

const eventType = EVENT_TYPE.General;

const images = fakeImages(PAGE_SIZE, [{ publisher }]);
const imagesVariables = {
  createdBy: undefined,
  createPath: undefined,
  mergePages: true,
  pageSize: PAGE_SIZE,
  publisher,
  text: '',
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
const mockedImagesResponse: MockedResponse = {
  request: { query: ImagesDocument, variables: imagesVariables },
  result: imagesResponse,
  newData: () => imagesResponse,
};

const image = images.data[0];
const imageVariables = { createPath: undefined, id: image?.id };
const imageResponse = { data: { image } };
const mockedImageResponse: MockedResponse = {
  request: { query: ImageDocument, variables: imageVariables },
  result: imageResponse,
};

const imageAtId = getValue(image?.atId, '');
const imageUrl = getValue(image?.url, '');
const file = mockFile({});

const uploadImage1Variables = {
  image: undefined,
  name: '',
  publisher,
  url: imageUrl,
};
const uploadImageResponse = { data: { uploadImage: image } };
const mockedUploadImage1Response: MockedResponse = {
  request: {
    query: UploadImageDocument,
    variables: { input: uploadImage1Variables },
  },
  result: uploadImageResponse,
};

const uploadImage2Variables = {
  image: file,
  name: '',
  publisher,
  url: undefined,
};
const mockedUploadImage2Response: MockedResponse = {
  request: {
    query: UploadImageDocument,
    variables: { input: uploadImage2Variables },
  },
  result: uploadImageResponse,
};

export {
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
};
