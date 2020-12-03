import {
  ImageQueryVariables,
  ImagesQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import queryBuilder from '../../utils/queryBuilder';

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
