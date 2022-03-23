import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { KeywordFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { KEYWORD_ACTIONS } from '../../keyword/constants';
import useKeywordUpdateActions, {
  KEYWORD_MODALS,
} from '../../keyword/hooks/useKeywordUpdateActions';
import ConfirmDeleteModal from '../../keyword/modals/ConfirmDeleteModal';
import { getEditButtonProps, getKeywordFields } from '../../keyword/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { addParamsToKeywordQueryString } from '../utils';

export interface KeywordActionsDropdownProps {
  className?: string;
  keyword: KeywordFieldsFragment;
}

const KeywordActionsDropdown = React.forwardRef<
  HTMLDivElement,
  KeywordActionsDropdownProps
>(({ className, keyword }, ref) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const { id, publisher } = getKeywordFields(keyword, locale);
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { pathname, search } = useLocation();

  const { closeModal, deleteKeyword, openModal, saving, setOpenModal } =
    useKeywordUpdateActions({
      keyword,
    });

  const goToEditKeywordPage = () => {
    const queryString = addParamsToKeywordQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: `/${locale}${ROUTES.EDIT_KEYWORD.replace(':id', id)}`,
      search: queryString,
    });
  };

  const onDelete = () => {
    deleteKeyword();
  };

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: KEYWORD_ACTIONS;
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
      action: KEYWORD_ACTIONS.EDIT,
      onClick: goToEditKeywordPage,
    }),
    getActionItemProps({
      action: KEYWORD_ACTIONS.DELETE,
      onClick: () => setOpenModal(KEYWORD_MODALS.DELETE),
    }),
  ].filter(skipFalsyType);

  return (
    <div ref={ref}>
      {openModal === KEYWORD_MODALS.DELETE && (
        <ConfirmDeleteModal
          isOpen={openModal === KEYWORD_MODALS.DELETE}
          isSaving={saving === KEYWORD_ACTIONS.DELETE}
          onClose={closeModal}
          onDelete={onDelete}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </div>
  );
});

export default KeywordActionsDropdown;
