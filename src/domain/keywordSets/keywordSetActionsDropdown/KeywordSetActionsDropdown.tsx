/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { KeywordSetFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import { KEYWORD_SET_ACTIONS } from '../../keywordSet/constants';
import useKeywordSetUpdateActions, {
  KEYWORD_SET_MODALS,
} from '../../keywordSet/hooks/useKeywordSetActions';
import ConfirmDeleteKeywordSetModal from '../../keywordSet/modals/confirmDeleteKeywordSetModal/ConfirmDeleteKeywordSetModal';
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

const KeywordSetActionsDropdown: React.FC<KeywordSetActionsDropdownProps> = ({
  className,
  keywordSet,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAuthenticated: authenticated } = useAuth();
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
    <>
      {openModal === KEYWORD_SET_MODALS.DELETE && (
        <ConfirmDeleteKeywordSetModal
          isOpen={openModal === KEYWORD_SET_MODALS.DELETE}
          isSaving={saving === KEYWORD_SET_ACTIONS.DELETE}
          onClose={closeModal}
          onConfirm={deleteKeywordSet}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </>
  );
};

export default KeywordSetActionsDropdown;
