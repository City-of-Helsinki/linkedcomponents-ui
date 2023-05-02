import range from 'lodash/range';

import {
  ImageFieldsFragment,
  ImagesDocument,
  Meta,
} from '../../../generated/graphql';
import { fakeImages } from '../../../utils/mockDataUtils';
import {
  DEFAULT_IMAGE_SORT,
  IMAGE_SORT_OPTIONS,
  IMAGES_PAGE_SIZE,
} from '../constants';

const TEST_PAGE_SIZE = 2;

const variables = {
  createPath: undefined,
  page: 1,
  pageSize: IMAGES_PAGE_SIZE,
  sort: DEFAULT_IMAGE_SORT,
  text: '',
};

const imageNames = range(1, TEST_PAGE_SIZE + 1).map((n) => `Image name ${n}`);
const images = fakeImages(
  TEST_PAGE_SIZE,
  imageNames.map((name) => ({ name }))
);

const count = 30;
const meta: Meta = { ...images.meta, count };
const imagesResponse = { data: { images: { ...images, meta } } };
const mockedImagesResponse = {
  request: { query: ImagesDocument, variables },
  result: imagesResponse,
};

const page2ImageNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Page 2 image ${n}`
);
const page2Images = fakeImages(
  TEST_PAGE_SIZE,
  page2ImageNames.map((name) => ({ name }))
);
const page2ImagesResponse = {
  data: { images: { ...page2Images, meta } },
};
const page2ImagesVariables = { ...variables, page: 2 };
const mockedPage2ImagesResponse = {
  request: { query: ImagesDocument, variables: page2ImagesVariables },
  result: page2ImagesResponse,
};

const sortedImageNames = range(1, TEST_PAGE_SIZE + 1).map(
  (n) => `Sorted images ${n}`
);
const sortedImages = fakeImages(
  TEST_PAGE_SIZE,
  sortedImageNames.map((name) => ({ name }))
);
const sortedImagesResponse = {
  data: { images: { ...sortedImages, meta } },
};
const sortedImagesVariables = {
  ...variables,
  sort: IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME,
};
const mockedSortedImagesResponse = {
  request: { query: ImagesDocument, variables: sortedImagesVariables },
  result: sortedImagesResponse,
};

const filteredImages = fakeImages(1, [images.data[0] as ImageFieldsFragment]);
const filteredImagesResponse = {
  data: { images: filteredImages },
};
const filteredImagesVariables = {
  ...variables,
  text: images.data[0]?.name,
};
const mockedFilteredImagesResponse = {
  request: { query: ImagesDocument, variables: filteredImagesVariables },
  result: filteredImagesResponse,
};

export {
  imageNames,
  images,
  mockedFilteredImagesResponse,
  mockedImagesResponse,
  mockedPage2ImagesResponse,
  mockedSortedImagesResponse,
  page2ImageNames,
  sortedImageNames,
};
