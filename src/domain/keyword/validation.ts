import forEach from 'lodash/forEach';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import {
  LE_DATA_LANGUAGES,
  VALIDATION_ERROR_SCROLLER_OPTIONS,
} from '../../constants';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { KEYWORD_FIELDS } from './constants';

export const keywordSchema = Yup.object().shape({
  [KEYWORD_FIELDS.NAME]: Yup.object().shape({
    [LE_DATA_LANGUAGES.FI]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .nullable(),
  }),
});

export const scrollToFirstError = ({
  error,
}: {
  error: Yup.ValidationError;
}): void => {
  forEach(error.inner, (e) => {
    const path = e.path ?? /* istanbul ignore next */ '';
    const field = document.getElementById(path);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(path, VALIDATION_ERROR_SCROLLER_OPTIONS);

      field.focus();

      return false;
    }
  });
};
