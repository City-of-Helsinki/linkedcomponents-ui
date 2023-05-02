import range from 'lodash/range';

import { Keyword, KeywordFieldsFragment } from '../../../generated/graphql';
import {
  fakeKeywords,
  fakeLocalisedObject,
} from '../../../utils/mockDataUtils';

export const keywordsOverrides: Partial<Keyword>[] = range(1, 5).map(
  (index) => ({
    id: `keyword:${index}`,
    name: fakeLocalisedObject(`Keyword name ${index}`),
  })
);
export const keywordName = keywordsOverrides[0].name?.fi as string;
export const keywordId = keywordsOverrides[0].id;
export const keywordsResponse = fakeKeywords(
  keywordsOverrides.length,
  keywordsOverrides
);
export const keyword = keywordsResponse.data[0] as KeywordFieldsFragment;
