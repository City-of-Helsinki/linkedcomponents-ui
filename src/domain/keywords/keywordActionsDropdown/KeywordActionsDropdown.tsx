import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import { KeywordFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import useResetPageParamAndGoToPage from '../../../hooks/useResetPageParam';
import { addParamsToAdminListQueryString } from '../../../utils/adminListQueryStringUtils';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import useAuth from '../../auth/hooks/useAuth';
import { KEYWORD_ACTIONS } from '../../keyword/constants';
import useKeywordUpdateActions, {
  KEYWORD_MODALS,
} from '../../keyword/hooks/useKeywordActions';
import ConfirmDeleteKeywordModal from '../../keyword/modals/confirmDeleteKeywordModal/ConfirmDeleteKeywordModal';
import { getEditButtonProps, getKeywordFields } from '../../keyword/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';

export interface KeywordActionsDropdownProps {
  className?: string;
  keyword: KeywordFieldsFragment;
}

const KeywordActionsDropdown: React.FC<KeywordActionsDropdownProps> = ({
  className,
  keyword,
}) => {
  const { t } = useTranslation();
  const { resetPageParamAndGoToPage } = useResetPageParamAndGoToPage();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const { user } = useUser();
  const { id, publisher } = getKeywordFields(keyword, locale);
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { pathname, search } = useLocation();

  const { closeModal, deleteKeyword, openModal, saving, setOpenModal } =
    useKeywordUpdateActions({
      keyword,
    });

  const goToEditKeywordPage = () => {
    const queryString = addParamsToAdminListQueryString(search, {
      returnPath: pathname,
    });

    navigate({
      pathname: `/${locale}${ROUTES.EDIT_KEYWORD.replace(':id', id)}`,
      search: queryString,
    });
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
    <>
      {openModal === KEYWORD_MODALS.DELETE && (
        <ConfirmDeleteKeywordModal
          isOpen={openModal === KEYWORD_MODALS.DELETE}
          isSaving={saving === KEYWORD_ACTIONS.DELETE}
          onClose={closeModal}
          onConfirm={() =>
            deleteKeyword({
              onSuccess: () => {
                addNotification({
                  label: t('keyword.form.notificationKeywordDeleted'),
                  type: 'success',
                });
                resetPageParamAndGoToPage(ROUTES.KEYWORDS);
              },
            })
          }
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </>
  );
};

export default KeywordActionsDropdown;
