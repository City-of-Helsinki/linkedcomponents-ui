import {
  ImageFieldsFragment,
  ImageQueryVariables,
  ImagesQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import queryBuilder from '../../utils/queryBuilder';
import { DEFAULT_LICENSE_TYPE } from './constants';

export const imagePathBuilder = ({
  args,
}: PathBuilderProps<ImageQueryVariables>) => {
  const { id } = args;

  return `/image/${id}/`;
};

export const imagesPathBuilder = ({
  args,
}: PathBuilderProps<ImagesQueryVariables>) => {
  const { dataSource, page, pageSize, publisher } = args;
  const variableToKeyItems = [
    { key: 'data_source', value: dataSource },
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
    { key: 'publisher', value: publisher },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/image/${query}`;
};

export const getImageFields = (image: ImageFieldsFragment) => ({
  id: image.id,
  atId: image.atId,
  altText: image.altText || '',
  license: image.license || DEFAULT_LICENSE_TYPE,
  name: image.name || '',
  photographerName: image.photographerName || '',
});
