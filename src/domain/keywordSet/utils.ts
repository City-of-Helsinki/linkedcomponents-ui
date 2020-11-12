import {
  KeywordSetQueryVariables,
  KeywordSetsQueryVariables,
} from '../../generated/graphql';
import queryBuilder from '../../utils/queryBuilder';

interface KeywordSetPathBuilderProps {
  args: KeywordSetQueryVariables;
}

interface KeywordSetsPathBuilderProps {
  args: KeywordSetsQueryVariables;
}

export const keywordSetPathBuilder = ({ args }: KeywordSetPathBuilderProps) => {
  const { id, include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${id}/${query}`;
};

export const keywordSetsPathBuilder = ({
  args,
}: KeywordSetsPathBuilderProps) => {
  const { include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/keyword_set/${query}`;
};
