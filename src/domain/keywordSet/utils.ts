import { KeywordSetQueryVariables } from '../../generated/graphql';
import queryBuilder from '../../utils/queryBuilder';

interface KeywordSetPathBuilderProps {
  args: KeywordSetQueryVariables;
}

export const keywordSetPathBuilder = ({ args }: KeywordSetPathBuilderProps) => {
  const { id, include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${id}/${query}`;
};
