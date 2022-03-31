import { KeywordFieldsFragment } from '../../src/generated/graphql';
import { Language } from '../../src/types';
import { removeEmpty } from './utils';

export const getExpectedKeywordContext = (
  keyword: Partial<KeywordFieldsFragment>,
  ...fieldsToPick: Array<keyof KeywordFieldsFragment>
): Partial<KeywordFieldsFragment> =>
  removeEmpty(
    fieldsToPick.reduce(
      (fields, field) => ({ ...fields, [field]: keyword[field] }),
      {
        id: keyword.id,
        name: keyword.name.fi,
      }
    )
  );

export const isLocalized = (
  keyword: KeywordFieldsFragment,
  locale: Language
): boolean => Boolean(keyword.name?.[locale]);
