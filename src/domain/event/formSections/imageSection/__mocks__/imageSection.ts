import { MockedResponse } from '@apollo/client/testing';

import { PAGE_SIZE } from '../../../../../common/components/imageSelector/constants';
import { MAX_PAGE_SIZE, TEST_USER_ID } from '../../../../../constants';
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
import { mockFile } from '../../../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../../../organization/constants';
import { EVENT_TYPE } from '../../../constants';

const publisher = TEST_PUBLISHER_ID;

const eventType = EVENT_TYPE.General;

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
const mockedImagesResponse: MockedResponse = {
  request: {
    query: ImagesDocument,
    variables: imagesVariables,
  },
  result: imagesResponse,
  newData: () => imagesResponse,
};

const image = images.data[0];
const imageVariables = { createPath: undefined, id: image.id };
const imageResponse = { data: { image } };
const mockedImageResponse: MockedResponse = {
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
const uploadImageResponse = { data: { uploadImage: image } };
const mockedUploadImage1Response: MockedResponse = {
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
const mockedUploadImage2Response: MockedResponse = {
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
const organizationsResponse = { data: { organizations: fakeOrganizations(0) } };
const mockedOrganizationsResponse: MockedResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  result: organizationsResponse,
};

const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};

const userWithoutOrganizations = fakeUser({
  organization: '',
  adminOrganizations: [],
  organizationMemberships: [],
});
const userWithoutOrganizationsResponse = {
  data: { user: userWithoutOrganizations },
};
const mockedUserWithoutOrganizationsResponse: MockedResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userWithoutOrganizationsResponse,
};

export {
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
  mockedUserWithoutOrganizationsResponse,
  publisher,
};
