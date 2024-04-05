import { useMemo } from 'react';

import { OrganizationFieldsFragment } from '../../../generated/graphql';
import styles from '../../admin/layout/form.module.scss';

type UseOrganizationFormStylesProps = {
  isEditingAllowed: boolean;
  organization?: OrganizationFieldsFragment;
};

type UseOrganizationFormStylesState = {
  alignedInputStyle: string;
  alignedInputStyleIfOrganization: string;
  inputRowBorderStyle: string;
  inputRowBorderStyleIfOrganization: string;
};

const useOrganizationFormStyles = ({
  isEditingAllowed,
  organization,
}: UseOrganizationFormStylesProps): UseOrganizationFormStylesState => {
  const alignedInputStyle = useMemo(
    () =>
      /* istanbul ignore next */
      isEditingAllowed
        ? styles.alignedInput
        : styles.alignedInputWithFullBorder,
    [isEditingAllowed]
  );

  const alignedInputStyleIfOrganization = useMemo(
    () =>
      !isEditingAllowed || organization
        ? styles.alignedInputWithFullBorder
        : styles.alignedInput,
    [isEditingAllowed, organization]
  );

  const inputRowBorderStyle = useMemo(
    () =>
      /* istanbul ignore next */
      isEditingAllowed ? '' : styles.borderInMobile,
    [isEditingAllowed]
  );

  const inputRowBorderStyleIfOrganization = useMemo(
    () => (!isEditingAllowed || organization ? styles.borderInMobile : ''),
    [isEditingAllowed, organization]
  );

  return {
    alignedInputStyle,
    alignedInputStyleIfOrganization,
    inputRowBorderStyle,
    inputRowBorderStyleIfOrganization,
  };
};

export default useOrganizationFormStyles;
