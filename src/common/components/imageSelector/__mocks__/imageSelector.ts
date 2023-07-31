import { TEST_PUBLISHER_ID } from '../../../../domain/organization/constants';
import { ImagesDocument } from '../../../../generated/graphql';
import { fakeImages } from '../../../../utils/mockDataUtils';
import { PAGE_SIZE } from '../constants';

const publisher = TEST_PUBLISHER_ID;

const images = fakeImages(PAGE_SIZE);
const imagesVariables = {
  createdBy: undefined,
  createPath: undefined,
  mergePages: true,
  pageSize: PAGE_SIZE,
  publisher,
  text: '',
};

const meta = {
  ...images.meta,
  count: 15,
  next: 'https://api.hel.fi/linkedevents/v1/image/?page=2',
};

const imagesResponse = {
  data: {
    images: {
      ...images,
      meta,
    },
  },
};
const mockedImagesReponse = {
  request: { query: ImagesDocument, variables: imagesVariables },
  result: imagesResponse,
};

const mockedImagesUserWithoutOrganizationsReponse = {
  ...mockedImagesReponse,
  request: {
    ...mockedImagesReponse.request,
    variables: { ...imagesVariables, createdBy: 'me', publisher: '' },
  },
};

const loadMoreImages = fakeImages(PAGE_SIZE);
const loadMoreImagesVariables = { ...imagesVariables, page: 2 };

const loadMoreImagesResponse = {
  data: {
    images: {
      ...loadMoreImages,
      meta: {
        ...meta,
        next: 'https://api.hel.fi/linkedevents/v1/image/?page=3',
      },
    },
  },
};
const mockedLoadMoreImagesResponse = {
  request: { query: ImagesDocument, variables: loadMoreImagesVariables },
  result: loadMoreImagesResponse,
};

export {
  images,
  loadMoreImages,
  mockedImagesReponse,
  mockedImagesUserWithoutOrganizationsReponse,
  mockedLoadMoreImagesResponse,
  publisher,
};
