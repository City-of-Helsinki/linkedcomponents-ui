import {
  KeywordSetQueryVariables,
  KeywordSetsQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import queryBuilder from '../../utils/queryBuilder';

export const keywordSetPathBuilder = ({
  args,
}: PathBuilderProps<KeywordSetQueryVariables>) => {
  const { id, include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${id}/${query}`;
};

export const keywordSetsPathBuilder = ({
  args,
}: PathBuilderProps<KeywordSetsQueryVariables>) => {
  const { include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${query}`;
};
