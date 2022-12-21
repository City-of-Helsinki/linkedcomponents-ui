import isFunction from 'lodash/isFunction';
import React, { RefObject } from 'react';

const mergeRefWithInternalRef = (
  ref: React.Ref<HTMLInputElement>,
  internalRef: RefObject<HTMLInputElement>
): void => {
  if (isFunction(ref)) {
    (ref as (instance: HTMLInputElement) => void)(
      internalRef.current as HTMLInputElement
    );
  } else {
    // eslint-disable-next-line no-param-reassign
    (ref as React.MutableRefObject<HTMLInputElement>).current =
      internalRef.current as HTMLInputElement;
  }
};

export default mergeRefWithInternalRef;
