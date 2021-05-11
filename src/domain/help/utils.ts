import { FormikErrors, FormikTouched } from 'formik';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { ContactFormFields } from './types';

export const showErrors = ({
  error,
  setErrors,
  setTouched,
}: {
  error: Yup.ValidationError;
  setErrors: (errors: FormikErrors<ContactFormFields>) => void;
  setTouched: (
    touched: FormikTouched<ContactFormFields>,
    shouldValidate?: boolean
  ) => void;
}): void => {
  /* istanbul ignore else */
  if (error.name === 'ValidationError') {
    const newErrors = error.inner.reduce(
      (acc, e: Yup.ValidationError) => set(acc, e.path, e.errors[0]),
      {}
    );
    const touchedFields = error.inner.reduce(
      (acc, e: Yup.ValidationError) => set(acc, e.path, true),
      {}
    );

    setErrors(newErrors);
    setTouched(touchedFields);
  }
};

export const scrollToFirstError = ({
  error,
}: {
  error: Yup.ValidationError;
}): void => {
  forEach(error.inner, (e) => {
    const fieldId = e.path;
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, {
        delay: 0,
        duration: 500,
        offset: -200,
        smooth: true,
      });

      field.focus();
      return false;
    }
  });
};
