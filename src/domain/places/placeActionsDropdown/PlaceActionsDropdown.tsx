import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { PlaceFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { PLACE_ACTIONS } from '../../place/constants';
import usePlaceUpdateActions, {
  PLACE_MODALS,
} from '../../place/hooks/usePlaceActions';
import ConfirmDeletePlaceModal from '../../place/modals/confirmDeletePlaceModal/ConfirmDeletePlaceModal';
import { getEditButtonProps, getPlaceFields } from '../../place/utils';
import useUser from '../../user/hooks/useUser';
import { addParamsToPlaceQueryString } from '../utils';

export interface PlaceActionsDropdownProps {
  className?: string;
  place: PlaceFieldsFragment;
}

const PlaceActionsDropdown: React.FC<PlaceActionsDropdownProps> = ({
  className,
  place,
}) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const { id, publisher } = getPlaceFields(place, locale);
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { pathname, search } = useLocation();

  const { closeModal, deletePlace, openModal, saving, setOpenModal } =
    usePlaceUpdateActions({
      place,
    });

  const goToEditPlacePage = () => {
    const queryString = addParamsToPlaceQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: `/${locale}${ROUTES.EDIT_PLACE.replace(':id', id)}`,
      search: queryString,
    });
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: PLACE_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getEditButtonProps({
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
      action: PLACE_ACTIONS.EDIT,
      onClick: goToEditPlacePage,
    }),
    getActionItemProps({
      action: PLACE_ACTIONS.DELETE,
      onClick: () => setOpenModal(PLACE_MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <>
      {openModal === PLACE_MODALS.DELETE && (
        <ConfirmDeletePlaceModal
          isOpen={openModal === PLACE_MODALS.DELETE}
          isSaving={saving === PLACE_ACTIONS.DELETE}
          onClose={closeModal}
          onConfirm={() => {
            deletePlace({
              onSuccess: () => {
                addNotification({
                  label: t('place.form.notificationPlaceDeleted'),
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

export default PlaceActionsDropdown;
