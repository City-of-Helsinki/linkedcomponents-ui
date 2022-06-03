import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/menuItem/MenuItem';
import { ROUTES } from '../../../constants';
import { KeywordSetFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { KEYWORD_SET_ACTIONS } from '../../keywordSet/constants';
import useKeywordSetUpdateActions, {
  KEYWORD_SET_MODALS,
} from '../../keywordSet/hooks/useKeywordSetUpdateActions';
import ConfirmDeleteModal from '../../keywordSet/modals/confirmDeleteModal/ConfirmDeleteModal';
import {
  getEditButtonProps,
  getKeywordSetFields,
} from '../../keywordSet/utils';
import useUser from '../../user/hooks/useUser';
import useUserOrganization from '../../user/hooks/useUserOrganization';
import { addParamsToKeywordSetQueryString } from '../utils';

export interface KeywordSetActionsDropdownProps {
  className?: string;
  keywordSet: KeywordSetFieldsFragment;
}

const KeywordSetActionsDropdown = React.forwardRef<
  HTMLDivElement,
  KeywordSetActionsDropdownProps
>(({ className, keywordSet }, ref) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const { dataSource, id } = getKeywordSetFields(keywordSet, locale);
  const { organization: userOrganization } = useUserOrganization(user);
  const { pathname, search } = useLocation();

  const { closeModal, deleteKeywordSet, openModal, saving, setOpenModal } =
    useKeywordSetUpdateActions({
      keywordSet,
    });

  const goToEditKeywordSetPage = () => {
    const queryString = addParamsToKeywordSetQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: `/${locale}${ROUTES.EDIT_KEYWORD_SET.replace(':id', id)}`,
      search: queryString,
    });
  };

  const onDelete = () => {
    deleteKeywordSet();
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: KEYWORD_SET_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getEditButtonProps({
      action,
      authenticated,
      dataSource,
      onClick,
      t,
      userOrganization,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: KEYWORD_SET_ACTIONS.EDIT,
      onClick: goToEditKeywordSetPage,
    }),
    getActionItemProps({
      action: KEYWORD_SET_ACTIONS.DELETE,
      onClick: () => setOpenModal(KEYWORD_SET_MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <div ref={ref}>
      {openModal === KEYWORD_SET_MODALS.DELETE && (
        <ConfirmDeleteModal
          isOpen={openModal === KEYWORD_SET_MODALS.DELETE}
          isSaving={saving === KEYWORD_SET_ACTIONS.DELETE}
          onClose={closeModal}
          onDelete={onDelete}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </div>
  );
});

export default KeywordSetActionsDropdown;
