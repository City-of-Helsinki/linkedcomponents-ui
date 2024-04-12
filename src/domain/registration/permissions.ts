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
  hasAdminOrganization,
  hasRegistrationAdminOrganization,
  isAdminUserInOrganization,
  isRegistrationAdminUserInOrganization,
} from '../organization/utils';
import {
  REGISTRATION_ACTIONS,
  REGISTRATION_ICONS,
  REGISTRATION_LABEL_KEYS,
} from '../registrations/constants';
import { hasSignups } from './utils';

export const checkCanUserDoRegistrationAction = ({
  action,
  organizationAncestors,
  registration,
  user,
}: {
  action: REGISTRATION_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  registration?: RegistrationFieldsFragment;
  user?: UserFieldsFragment;
}): boolean => {
  if (user?.isSuperuser) {
    return true;
  }

  const publisher = getValue(registration?.publisher, '');
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
  const hasAdminOrg =
    hasAdminOrganization(user) || hasRegistrationAdminOrganization(user);

  switch (action) {
    case REGISTRATION_ACTIONS.CREATE:
      return publisher ? isAdminUser || isRegistrationAdminUser : hasAdminOrg;
    case REGISTRATION_ACTIONS.COPY:
    case REGISTRATION_ACTIONS.COPY_LINK:
    case REGISTRATION_ACTIONS.EDIT:
    case REGISTRATION_ACTIONS.DELETE:
    case REGISTRATION_ACTIONS.UPDATE:
      return Boolean(
        isAdminUser ||
          isRegistrationAdminUser ||
          registration?.hasSubstituteUserAccess
      );
    case REGISTRATION_ACTIONS.SHOW_SIGNUPS:
    case REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST:
    case REGISTRATION_ACTIONS.EXPORT_SIGNUPS_AS_EXCEL:
      return Boolean(
        isRegistrationAdminUser ||
          (isAdminUser && registration?.isCreatedByCurrentUser) ||
          registration?.hasSubstituteUserAccess
      );
  }
};

export const getRegistrationActionWarning = ({
  action,
  authenticated,
  registration,
  t,
  userCanDoAction,
}: {
  action: REGISTRATION_ACTIONS;
  authenticated: boolean;
  registration?: RegistrationFieldsFragment;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (!authenticated) {
    return t('authentication.noRightsUpdateRegistration');
  }

  if (!userCanDoAction) {
    if (action === REGISTRATION_ACTIONS.CREATE) {
      return t('registration.form.editButtonPanel.warningNoRightsToCreate');
    }
    return t('registration.form.editButtonPanel.warningNoRightsToEdit');
  }

  if (
    registration &&
    hasSignups(registration) &&
    action === REGISTRATION_ACTIONS.DELETE
  )
    return t('registration.form.editButtonPanel.warningHasSignups');

  return '';
};

export const checkIsRegistrationActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  registration,
  t,
  user,
}: {
  action: REGISTRATION_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  registration?: RegistrationFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoRegistrationAction({
    action,
    organizationAncestors,
    registration,
    user,
  });

  const warning = getRegistrationActionWarning({
    action,
    authenticated,
    registration,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getRegistrationActionButtonProps = ({
  action,
  authenticated,
  onClick,
  organizationAncestors,
  registration,
  t,
  user,
}: {
  action: REGISTRATION_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  registration?: RegistrationFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsRegistrationActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    registration,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: REGISTRATION_ICONS[action],
    label: t(REGISTRATION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};
