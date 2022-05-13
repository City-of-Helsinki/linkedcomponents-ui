/* eslint-disable no-undef */
import { FormikProps, useFormikContext } from 'formik';
import debounce from 'lodash/debounce';
import * as React from 'react';

import useIsMounted from '../../../hooks/useIsMounted';

export interface PersistProps {
  name: string;
  debounceTime?: number;
  isSessionStorage?: boolean;
}

const FormikPersist = ({
  debounceTime = 300,
  isSessionStorage = false,
  name,
}: PersistProps): null => {
  const isMounted = useIsMounted();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formik = useFormikContext<any>();

  const debouncedSaveForm = React.useMemo(
    () =>
      debounce((data: FormikProps<Record<string, unknown>>) => {
        /* istanbul ignore next */
        if (!isMounted.current) return;

        if (isSessionStorage) {
          window.sessionStorage.setItem(name, JSON.stringify(data));
        } else {
          window.localStorage.setItem(name, JSON.stringify(data));
        }
      }, debounceTime),
    [debounceTime, isMounted, isSessionStorage, name]
  );

  const saveForm = React.useCallback(
    (data: FormikProps<Record<string, unknown>>) => {
      debouncedSaveForm(data);
    },
    [debouncedSaveForm]
  );

  React.useEffect(() => {
    saveForm(formik);
  }, [formik, saveForm]);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;

    const maybeState = isSessionStorage
      ? window.sessionStorage.getItem(name)
      : window.localStorage.getItem(name);

    if (maybeState) {
      formik.setFormikState(JSON.parse(maybeState));

      // Validate form after setting state
      timeout = setTimeout(() => {
        formik.validateForm();
      });
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default FormikPersist;
