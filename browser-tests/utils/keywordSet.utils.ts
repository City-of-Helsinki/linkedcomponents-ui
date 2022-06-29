import { KeywordSetFieldsFragment } from '../../src/generated/graphql';
import { Language } from '../../src/types';
import { removeEmpty } from './utils';

export const getExpectedKeywordSetContext = (
  keywordSet: Partial<KeywordSetFieldsFragment>,
  ...fieldsToPick: Array<keyof KeywordSetFieldsFragment>
): Partial<KeywordSetFieldsFragment> =>
  removeEmpty(
    fieldsToPick.reduce(
      (fields, field) => ({ ...fields, [field]: keywordSet[field] }),
      {
        id: keywordSet.id,
        name: keywordSet.name?.fi,
      }
    )
  );

export const isLocalized = (
  event: KeywordSetFieldsFragment,
  locale: Language
): boolean => Boolean(event.name?.[locale]);
