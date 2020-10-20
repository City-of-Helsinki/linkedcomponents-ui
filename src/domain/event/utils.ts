import * as Yup from 'yup';

import { OptionType } from '../../types';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';

export const createValidationSchema = () =>
  Yup.object().shape({
    type: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  });

const languageWeight = (lang: string): number => {
  switch (lang) {
    case 'fi':
      return 1;
    case 'sv':
      return 2;
    case 'en':
      return 3;
    default:
      return 4;
  }
};

export const sortLanguage = (a: OptionType, b: OptionType) =>
  languageWeight(a.value) - languageWeight(b.value);
