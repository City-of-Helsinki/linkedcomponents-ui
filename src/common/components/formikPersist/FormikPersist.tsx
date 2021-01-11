import { FormikProps, useFormikContext } from 'formik';
import debounce from 'lodash/debounce';
import * as React from 'react';

export interface PersistProps {
  name: string;
  debounceTime?: number;
  isSessionStorage?: boolean;
}

const FormikPersist = ({
  debounceTime = 300,
  isSessionStorage = false,
  name,
}: PersistProps) => {
  const isMounted = React.useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formik = useFormikContext<any>();

  const saveForm = React.useCallback(
    debounce((data: FormikProps<{}>) => {
      /* istanbul ignore next  */
      if (!isMounted.current) return;

      if (isSessionStorage) {
        window.sessionStorage.setItem(name, JSON.stringify(data));
      } else {
        window.localStorage.setItem(name, JSON.stringify(data));
      }
    }, debounceTime),
    [debounceTime, isSessionStorage, name]
  );

  React.useEffect(() => {
    saveForm(formik);
  }, [formik, saveForm]);

  React.useEffect(() => {
    isMounted.current = true;
    let timeout: number;

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
    return () => {
      clearTimeout(timeout);
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default FormikPersist;
