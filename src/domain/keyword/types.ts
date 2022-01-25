import { MultiLanguageObject } from '../../types';
import { KEYWORD_FIELDS } from './constants';

export type KeywordFields = {
  id: string;
  atId: string;
  keywordUrl: string;
  name: string;
  nEvents: number;
};

export type KeywordFormFields = {
  [KEYWORD_FIELDS.DATA_SOURCE]: string;
  [KEYWORD_FIELDS.DEPRECATED]: boolean;
  [KEYWORD_FIELDS.ID]: string;
  [KEYWORD_FIELDS.NAME]: MultiLanguageObject;
  [KEYWORD_FIELDS.ORIGIN_ID]: string;
  [KEYWORD_FIELDS.PUBLISHER]: string;
  [KEYWORD_FIELDS.REPLACED_BY]: string;
};
