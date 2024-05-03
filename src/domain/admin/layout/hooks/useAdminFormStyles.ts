import { useMemo } from 'react';

import {
  KeywordFieldsFragment,
  KeywordSetFieldsFragment,
  OrganizationFieldsFragment,
} from '../../../../generated/graphql';
import styles from '../form.module.scss';

type UseAdminFormStylesProps = {
  isEditingAllowed: boolean;
  instance?:
    | KeywordFieldsFragment
    | KeywordSetFieldsFragment
    | OrganizationFieldsFragment;
};

type UseAdminFormStylesState = {
  alignedInputStyle: string;
  alignedInputStyleIfHasInstance: string;
  inputRowBorderStyle: string;
  inputRowBorderStyleIfHasInstance: string;
};

const useAdminFormStyles = ({
  instance,
  isEditingAllowed,
}: UseAdminFormStylesProps): UseAdminFormStylesState => {
  const alignedInputStyle = useMemo(
    () =>
      /* istanbul ignore next */
      isEditingAllowed
        ? styles.alignedInput
        : styles.alignedInputWithFullBorder,
    [isEditingAllowed]
  );

  const alignedInputStyleIfHasInstance = useMemo(
    () =>
      !isEditingAllowed || instance
        ? styles.alignedInputWithFullBorder
        : styles.alignedInput,
    [isEditingAllowed, instance]
  );

  const inputRowBorderStyle = useMemo(
    () =>
      /* istanbul ignore next */
      isEditingAllowed ? '' : styles.borderInMobile,
    [isEditingAllowed]
  );

  const inputRowBorderStyleIfHasInstance = useMemo(
    () => (!isEditingAllowed || instance ? styles.borderInMobile : ''),
    [isEditingAllowed, instance]
  );

  return {
    alignedInputStyle,
    alignedInputStyleIfHasInstance,
    inputRowBorderStyle,
    inputRowBorderStyleIfHasInstance,
  };
};

export default useAdminFormStyles;
