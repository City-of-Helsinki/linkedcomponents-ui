import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import {
  OrganizationFieldsFragment,
  RegistrationFieldsFragment,
  SignupGroupFieldsFragment,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability } from '../../types';
import getValue from '../../utils/getValue';
import {
  isAdminUserInOrganization,
  isRegistrationAdminUserInOrganization,
} from '../organization/utils';
import {
  SIGNUP_GROUP_ACTIONS,
  SIGNUP_GROUP_ICONS,
  SIGNUP_GROUP_LABEL_KEYS,
} from './constants';

export const checkCanUserDoSignupGroupAction = ({
  action,
  organizationAncestors,
  registration,
  user,
}: {
  action: SIGNUP_GROUP_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  user?: UserFieldsFragment;
}): boolean => {
  if (user?.isSuperuser) {
    return true;
  }

  const publisher = getValue(registration.publisher, '');
  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });
  const isRegistrationAdminUser = isRegistrationAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  switch (action) {
    case SIGNUP_GROUP_ACTIONS.EDIT:
    case SIGNUP_GROUP_ACTIONS.CREATE:
    case SIGNUP_GROUP_ACTIONS.DELETE:
    case SIGNUP_GROUP_ACTIONS.UPDATE:
    case SIGNUP_GROUP_ACTIONS.VIEW:
      return Boolean(
        isRegistrationAdminUser ||
          (isAdminUser && registration.isCreatedByCurrentUser) ||
          registration.hasSubstituteUserAccess
      );
  }
};

export const checkCanUserSignupAfterSignupIsEnded = ({
  organizationAncestors,
  registration,
  user,
}: {
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  user?: UserFieldsFragment;
}): boolean => {
  const publisher = getValue(registration.publisher, '');
  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });
  const isRegistrationAdminUser = isRegistrationAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  return Boolean(
    isRegistrationAdminUser ||
      (isAdminUser && registration.isCreatedByCurrentUser) ||
      registration.hasSubstituteUserAccess ||
      user?.isSuperuser
  );
};

export const getSignupGroupActionWarning = ({
  action,
  authenticated,
  signupGroup,
  t,
  userCanDoAction,
}: {
  action: SIGNUP_GROUP_ACTIONS;
  authenticated: boolean;
  signupGroup?: SignupGroupFieldsFragment;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (!authenticated) {
    return t('authentication.noRightsUpdateSignupGroup');
  }

  if (!userCanDoAction) {
    switch (action) {
      case SIGNUP_GROUP_ACTIONS.CREATE:
        return t('signupGroup.warnings.noRightsToCreate');
      case SIGNUP_GROUP_ACTIONS.VIEW:
        return t('signupGroup.warnings.noRightsToView');
      default:
        return t('signupGroup.warnings.noRightsToEdit');
    }
  } else if (action === SIGNUP_GROUP_ACTIONS.DELETE) {
    if (
      signupGroup?.paymentCancellation ||
      signupGroup?.signups?.some((signup) => signup?.paymentCancellation)
    ) {
      return t('signupGroup.warnings.hasPaymentCancellation');
    }
    if (
      signupGroup?.paymentRefund ||
      signupGroup?.signups?.some((signup) => signup?.paymentRefund)
    ) {
      return t('signupGroup.warnings.hasPaymentRefund');
    }
  }

  return '';
};

export const checkIsSignupGroupActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  registration,
  signupGroup,
  t,
  user,
}: {
  action: SIGNUP_GROUP_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoSignupGroupAction({
    action,
    organizationAncestors,
    registration,
    user,
  });

  const warning = getSignupGroupActionWarning({
    action,
    authenticated,
    signupGroup,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getSignupGroupActionButtonProps = ({
  action,
  authenticated,
  onClick,
  organizationAncestors,
  registration,
  signupGroup,
  t,
  user,
}: {
  action: SIGNUP_GROUP_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsSignupGroupActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    registration,
    signupGroup,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: SIGNUP_GROUP_ICONS[action],
    label: t(SIGNUP_GROUP_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};
