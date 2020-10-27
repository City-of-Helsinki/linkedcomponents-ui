import reduce from 'lodash/reduce';
import * as Yup from 'yup';

import { CHARACTER_LIMITS } from '../../constants';
import { EventQueryVariables } from '../../generated/graphql';
import { OptionType } from '../../types';
import queryBuilder from '../../utils/queryBuilder';
import { createStringError } from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { EVENT_FIELDS } from './constants';

const createMultiLanguageFieldValidation = (
  rule: Yup.Schema<string | null | undefined>
) => {
  return Yup.object().when(
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES],
    (value: string[]) => {
      return Yup.object().shape({
        ...reduce(value, (acc, lang) => ({ ...acc, [lang]: rule }), {}),
      });
    }
  );
};

export const createValidationSchema = () => {
  return Yup.object().shape({
    [EVENT_FIELDS.TYPE]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [EVENT_FIELDS.UMBRELLA_EVENT]: Yup.string()
      .nullable()
      .when([EVENT_FIELDS.HAS_UMBRELLA], {
        is: (value) => value,
        then: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
      }),
    [EVENT_FIELDS.NAME]: createMultiLanguageFieldValidation(
      Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    ),
    [EVENT_FIELDS.INFO_URL]: createMultiLanguageFieldValidation(
      Yup.string().url(VALIDATION_MESSAGE_KEYS.URL)
    ),
    [EVENT_FIELDS.DESCRIPTION]: createMultiLanguageFieldValidation(
      Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(CHARACTER_LIMITS.LONG_STRING, (param) =>
          createStringError(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
        )
    ),
    [EVENT_FIELDS.SHORT_DESCRIPTION]: createMultiLanguageFieldValidation(
      Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(CHARACTER_LIMITS.SHORT_STRING, (param) =>
          createStringError(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
        )
    ),
  });
};

interface EventPathBuilderProps {
  args: EventQueryVariables;
}

export const eventPathBuilder = ({ args }: EventPathBuilderProps) => {
  const { id, include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/event/${id}/${query}`;
};

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
