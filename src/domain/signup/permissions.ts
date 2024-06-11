import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import {
  OrganizationFieldsFragment,
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability } from '../../types';
import getValue from '../../utils/getValue';
import {
  isAdminUserInOrganization,
  isRegistrationAdminUserInOrganization,
} from '../organization/utils';
import { SIGNUP_ACTIONS, SIGNUP_ICONS, SIGNUP_LABEL_KEYS } from './constants';

export const checkCanUserDoSignupAction = ({
  action,
  organizationAncestors,
  registration,
  user,
}: {
  action: SIGNUP_ACTIONS;
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
    case SIGNUP_ACTIONS.EDIT:
    case SIGNUP_ACTIONS.CREATE:
    case SIGNUP_ACTIONS.DELETE:
    case SIGNUP_ACTIONS.SEND_MESSAGE:
    case SIGNUP_ACTIONS.UPDATE:
    case SIGNUP_ACTIONS.VIEW:
      return Boolean(
        isRegistrationAdminUser ||
          (isAdminUser && registration.isCreatedByCurrentUser) ||
          registration.hasSubstituteUserAccess
      );
  }
};

export const getSignupActionWarning = ({
  action,
  authenticated,
  signup,
  t,
  userCanDoAction,
}: {
  action: SIGNUP_ACTIONS;
  authenticated: boolean;
  signup?: SignupFieldsFragment;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (!authenticated) {
    return t('authentication.noRightsUpdateSignup');
  }

  if (!userCanDoAction) {
    switch (action) {
      case SIGNUP_ACTIONS.CREATE:
        return t('signupsPage.warningNoRightsToCreate');
      case SIGNUP_ACTIONS.VIEW:
        return t('signupsPage.warningNoRightsToView');
      default:
        return t('signupsPage.warningNoRightsToEdit');
    }
  } else if (action === SIGNUP_ACTIONS.DELETE) {
    if (signup?.paymentCancellation) {
      return t('signupsPage.warningHasPaymentCancellation');
    }
    if (signup?.paymentRefund) {
      return t('signupsPage.warningHasPaymentRefund');
    }
  }

  return '';
};

export const checkIsSignupActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  registration,
  signup,
  t,
  user,
}: {
  action: SIGNUP_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  signup?: SignupFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoSignupAction({
    action,
    organizationAncestors,
    registration,
    user,
  });

  const warning = getSignupActionWarning({
    action,
    authenticated,
    signup,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getSignupActionButtonProps = ({
  action,
  authenticated,
  onClick,
  organizationAncestors,
  registration,
  signup,
  t,
  user,
}: {
  action: SIGNUP_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  signup?: SignupFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsSignupActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    registration,
    signup,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: SIGNUP_ICONS[action],
    label: t(SIGNUP_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};
