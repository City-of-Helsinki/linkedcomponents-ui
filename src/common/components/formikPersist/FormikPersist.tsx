/* eslint-disable no-undef */
import { FormikProps, useFormikContext } from 'formik';
import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import useIsMounted from '../../../hooks/useIsMounted';

export interface PersistProps {
  name: string;
  debounceTime?: number;
  isSessionStorage?: boolean;
  restoringDisabled?: boolean;
  savingDisabled?: boolean;
}

const FormikPersist: React.FC<React.PropsWithChildren<PersistProps>> = ({
  children,
  debounceTime = 300,
  isSessionStorage = false,
  name,
  restoringDisabled,
  savingDisabled,
}) => {
  const isMounted = useIsMounted();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formik = useFormikContext<any>();

  const debouncedSaveForm = useDebouncedCallback(
    (data: FormikProps<Record<string, unknown>>) => {
      /* istanbul ignore next */
      if (savingDisabled || !isMounted.current) return;

      if (isSessionStorage) {
        window.sessionStorage.setItem(name, JSON.stringify(data));
      } else {
        window.localStorage.setItem(name, JSON.stringify(data));
      }
    },
    debounceTime
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

    if (!restoringDisabled && maybeState) {
      formik.setFormikState(JSON.parse(maybeState), formik.validateForm);

      // Validate form after setting state
      timeout = setTimeout(async () => {
        await formik.validateForm();
      }, 10);
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default FormikPersist;
