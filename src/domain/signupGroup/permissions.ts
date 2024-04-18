import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import {
  OrganizationFieldsFragment,
  RegistrationFieldsFragment,
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
  t,
  userCanDoAction,
}: {
  action: SIGNUP_GROUP_ACTIONS;
  authenticated: boolean;
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
  }

  return '';
};

export const checkIsSignupGroupActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  registration,
  t,
  user,
}: {
  action: SIGNUP_GROUP_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
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
  t,
  user,
}: {
  action: SIGNUP_GROUP_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsSignupGroupActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    registration,
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
