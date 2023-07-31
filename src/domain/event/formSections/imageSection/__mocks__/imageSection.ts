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

const mockedImagesUserWithoutOrganizationsReponse = {
  ...mockedImagesResponse,
  request: {
    ...mockedImagesResponse.request,
    variables: { ...imagesVariables, createdBy: 'me', publisher: '' },
  },
};

const image = images.data[0];
const imageVariables = { createPath: undefined, id: image?.id };
const imageResponse = { data: { image } };
const mockedImageResponse: MockedResponse = {
  request: { query: ImageDocument, variables: imageVariables },
  result: imageResponse,
};

const mockedImageUserWithoutOrganizationsReponse = {
  ...mockedImageResponse,
  request: {
    ...mockedImageResponse.request,
    variables: { ...imagesVariables, createdBy: 'me', publisher: '' },
  },
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
const mockedUploadImage1UserWithoutOrganizationsResponse: MockedResponse = {
  ...mockedUploadImage1Response,
  request: {
    ...mockedUploadImage1Response.request,
    variables: { input: { ...uploadImage1Variables, publisher: '' } },
  },
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
const mockedUploadImage2UserWithoutOrganizationsResponse: MockedResponse = {
  ...mockedUploadImage2Response,
  request: {
    ...mockedUploadImage2Response.request,
    variables: { input: { ...uploadImage2Variables, publisher: '' } },
  },
};

export {
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
};
