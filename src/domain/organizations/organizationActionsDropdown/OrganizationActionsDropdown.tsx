import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { OrganizationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import { ORGANIZATION_ACTIONS } from '../../organization/constants';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useOrganizationUpdateActions, {
  ORGANIZATION_MODALS,
} from '../../organization/hooks/useOrganizationUpdateActions';
import ConfirmDeleteModal from '../../organization/modals/confirmDeleteModal/ConfirmDeleteModal';
import {
  getEditButtonProps,
  getOrganizationFields,
} from '../../organization/utils';
import useUser from '../../user/hooks/useUser';
import { addParamsToOrganizationQueryString } from '../utils';

export interface OrganizationActionsDropdownProps {
  className?: string;
  organization: OrganizationFieldsFragment;
}

const OrganizationActionsDropdown: FC<OrganizationActionsDropdownProps> = ({
  className,
  organization,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const { id } = getOrganizationFields(organization, locale, t);
  const { pathname, search } = useLocation();
  const { organizationAncestors } = useOrganizationAncestors(id);

  const { closeModal, deleteOrganization, openModal, saving, setOpenModal } =
    useOrganizationUpdateActions({
      organization,
    });

  const goToEditOrganizationPage = () => {
    const queryString = addParamsToOrganizationQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: `/${locale}${ROUTES.EDIT_ORGANIZATION.replace(':id', id)}`,
      search: queryString,
    });
  };

  const onDelete = () => {
    deleteOrganization();
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: ORGANIZATION_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getEditButtonProps({
      action,
      authenticated,
      id,
      onClick,
      organizationAncestors,
      t,
      user,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: ORGANIZATION_ACTIONS.EDIT,
      onClick: goToEditOrganizationPage,
    }),
    getActionItemProps({
      action: ORGANIZATION_ACTIONS.DELETE,
      onClick: () => setOpenModal(ORGANIZATION_MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <>
      {openModal === ORGANIZATION_MODALS.DELETE && (
        <ConfirmDeleteModal
          isOpen={openModal === ORGANIZATION_MODALS.DELETE}
          isSaving={saving === ORGANIZATION_ACTIONS.DELETE}
          onClose={closeModal}
          onDelete={onDelete}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </>
  );
};

export default OrganizationActionsDropdown;
