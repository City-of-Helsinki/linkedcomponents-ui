import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
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
import styles from './actionsDropdown.module.scss';

export interface ActionsDropdownProps {
  className?: string;
  keyword: KeywordFieldsFragment;
}

const ActionsDropdown = React.forwardRef<HTMLDivElement, ActionsDropdownProps>(
  ({ className, keyword }, ref) => {
    const { t } = useTranslation();
    const locale = useLocale();
    const history = useHistory();
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

      history.push({
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
        <MenuDropdown
          button={
            <button className={styles.toggleButton}>
              <IconMenuDots aria-hidden={true} />
            </button>
          }
          buttonLabel={t('common.buttonActions')}
          className={className}
          closeOnItemClick={true}
          fixedPosition={true}
          items={actionItems}
        />
      </div>
    );
  }
);

export default ActionsDropdown;
