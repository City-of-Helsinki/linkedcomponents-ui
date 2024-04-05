/* eslint-disable max-len */
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { OrganizationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import useAuth from '../../auth/hooks/useAuth';
import { ORGANIZATION_ACTIONS } from '../../organization/constants';
import useOrganizationUpdateActions, {
  ORGANIZATION_MODALS,
} from '../../organization/hooks/useOrganizationActions';
import ConfirmDeleteOrganizationModal from '../../organization/modals/confirmDeleteOrganizationModal/ConfirmDeleteOrganizationModal';
import {
  getEditOrganizationButtonProps,
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
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { id } = getOrganizationFields(organization, locale, t);
  const { pathname, search } = useLocation();

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

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: ORGANIZATION_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getEditOrganizationButtonProps({
      action,
      authenticated,
      id,
      onClick,
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
        <ConfirmDeleteOrganizationModal
          isOpen={openModal === ORGANIZATION_MODALS.DELETE}
          isSaving={saving === ORGANIZATION_ACTIONS.DELETE}
          onClose={closeModal}
          onConfirm={() => {
            deleteOrganization({
              onSuccess: () => {
                addNotification({
                  label: t('organization.form.notificationOrganizationDeleted'),
                  type: 'success',
                });
              },
            });
          }}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </>
  );
};

export default OrganizationActionsDropdown;
