/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { PriceGroupFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useResetPageParamAndGoToPage from '../../../hooks/useResetPageParam';
import { addParamsToAdminListQueryString } from '../../../utils/adminListQueryStringUtils';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import useAuth from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { PRICE_GROUP_ACTIONS } from '../../priceGroup/constants';
import usePriceGroupActions, {
  PRICE_GROUP_MODALS,
} from '../../priceGroup/hooks/usePriceGroupActions';
import ConfirmDeletePriceGroupModal from '../../priceGroup/modals/confirmDeletePriceGroupModal/ConfirmDeletePriceGroupModal';
import {
  getEditPriceGroupButtonProps,
  getPriceGroupFields,
} from '../../priceGroup/utils';
import useUser from '../../user/hooks/useUser';

export interface PriceGroupActionsDropdownProps {
  className?: string;
  priceGroup: PriceGroupFieldsFragment;
}

const PriceGroupActionsDropdown: React.FC<PriceGroupActionsDropdownProps> = ({
  className,
  priceGroup,
}) => {
  const { resetPageParamAndGoToPage } = useResetPageParamAndGoToPage();
  const { addNotification } = useNotificationsContext();
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { id, publisher } = getPriceGroupFields(priceGroup, locale);
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { pathname, search } = useLocation();

  const { closeModal, deletePriceGroup, openModal, saving, setOpenModal } =
    usePriceGroupActions({
      priceGroup,
    });

  const goToEditPriceGroupPage = () => {
    const queryString = addParamsToAdminListQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: `/${locale}${ROUTES.EDIT_PRICE_GROUP.replace(':id', id)}`,
      search: queryString,
    });
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: PRICE_GROUP_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getEditPriceGroupButtonProps({
      action,
      authenticated,
      onClick,
      organizationAncestors,
      publisher,
      t,
      user,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: PRICE_GROUP_ACTIONS.EDIT,
      onClick: goToEditPriceGroupPage,
    }),
    getActionItemProps({
      action: PRICE_GROUP_ACTIONS.DELETE,
      onClick: () => setOpenModal(PRICE_GROUP_MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <>
      {openModal === PRICE_GROUP_MODALS.DELETE && (
        <ConfirmDeletePriceGroupModal
          isOpen={openModal === PRICE_GROUP_MODALS.DELETE}
          isSaving={saving === PRICE_GROUP_ACTIONS.DELETE}
          onClose={closeModal}
          onConfirm={() => {
            deletePriceGroup({
              onSuccess: () => {
                addNotification({
                  label: t('priceGroup.form.notificationPriceGroupDeleted'),
                  type: 'success',
                });
                resetPageParamAndGoToPage(ROUTES.PRICE_GROUPS);
              },
            });
          }}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </>
  );
};

export default PriceGroupActionsDropdown;
