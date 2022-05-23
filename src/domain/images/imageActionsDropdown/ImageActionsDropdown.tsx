import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { ImageFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { IMAGE_ACTIONS } from '../../image/constants';
import useImageUpdateActions, {
  IMAGE_MODALS,
} from '../../image/hooks/useImageUpdateActions';
import ConfirmDeleteModal from '../../image/modals/ConfirmDeleteModal';
import { getEditButtonProps, getImageFields } from '../../image/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { addParamsToImageQueryString } from '../utils';

export interface ImageActionsDropdownProps {
  className?: string;
  image: ImageFieldsFragment;
}

const ImageActionsDropdown = React.forwardRef<
  HTMLDivElement,
  ImageActionsDropdownProps
>(({ className, image }, ref) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const { id, publisher } = getImageFields(image, locale);
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { pathname, search } = useLocation();

  const { closeModal, deleteImage, openModal, saving, setOpenModal } =
    useImageUpdateActions({
      image,
    });

  const goToEditImagePage = () => {
    const queryString = addParamsToImageQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: `/${locale}${ROUTES.EDIT_IMAGE.replace(':id', id)}`,
      search: queryString,
    });
  };

  const onDelete = () => {
    deleteImage();
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: IMAGE_ACTIONS;
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
      action: IMAGE_ACTIONS.EDIT,
      onClick: goToEditImagePage,
    }),
    getActionItemProps({
      action: IMAGE_ACTIONS.DELETE,
      onClick: () => setOpenModal(IMAGE_MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <div ref={ref}>
      {openModal === IMAGE_MODALS.DELETE && (
        <ConfirmDeleteModal
          isOpen={openModal === IMAGE_MODALS.DELETE}
          isSaving={saving === IMAGE_ACTIONS.DELETE}
          onClose={closeModal}
          onDelete={onDelete}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </div>
  );
});

export default ImageActionsDropdown;