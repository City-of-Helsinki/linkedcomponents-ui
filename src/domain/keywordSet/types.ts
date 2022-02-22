import { MultiLanguageObject } from '../../types';
import { KEYWORD_SET_FIELDS } from './constants';

export type KeywordSetFields = {
  dataSource: string;
  id: string;
  keywordSetUrl: string;
  name: string;
  organization: string;
  usage: string;
};

export type KeywordSetFormFields = {
  [KEYWORD_SET_FIELDS.DATA_SOURCE]: string;
  [KEYWORD_SET_FIELDS.ID]: string;
  [KEYWORD_SET_FIELDS.KEYWORDS]: string[];
  [KEYWORD_SET_FIELDS.NAME]: MultiLanguageObject;
  [KEYWORD_SET_FIELDS.ORIGIN_ID]: string;
  [KEYWORD_SET_FIELDS.ORGANIZATION]: string;
  [KEYWORD_SET_FIELDS.USAGE]: string;
};
