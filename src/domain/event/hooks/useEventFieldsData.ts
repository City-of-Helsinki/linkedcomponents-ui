import { INCLUDE, KEYWORD_SETS } from '../../../constants';
import {
  useKeywordSetQuery,
  useLanguagesQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { keywordSetPathBuilder } from '../../keywordSet/utils';

const useEventFieldsData = () => {
  const { loading: loadingLanguages } = useLanguagesQuery();

  const { loading: loadingKeywords } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id: KEYWORD_SETS.TOPICS,
      include: [INCLUDE.KEYWORDS],
    },
  });

  const { loading: loadingAudiences } = useKeywordSetQuery({
    variables: {
      createPath: getPathBuilder(keywordSetPathBuilder),
      id: KEYWORD_SETS.AUDIENCES,
      include: [INCLUDE.KEYWORDS],
    },
  });

  const loading = loadingLanguages || loadingKeywords || loadingAudiences;

  return { loading };
};

export default useEventFieldsData;
