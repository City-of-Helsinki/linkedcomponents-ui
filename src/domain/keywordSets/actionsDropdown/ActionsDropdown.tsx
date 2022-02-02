import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import styles from '../../../common/components/actionsDropdown/actionsDropdown.module.scss';
import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { KeywordSetFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { KEYWORD_SET_ACTIONS } from '../../keywordSet/constants';
import useKeywordSetUpdateActions, {
  KEYWORD_SET_MODALS,
} from '../../keywordSet/hooks/useKeywordSetUpdateActions';
import ConfirmDeleteModal from '../../keywordSet/modals/ConfirmDeleteModal';
import {
  getEditButtonProps,
  getKeywordSetFields,
} from '../../keywordSet/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { addParamsToKeywordSetQueryString } from '../utils';

export interface ActionsDropdownProps {
  className?: string;
  keywordSet: KeywordSetFieldsFragment;
}

const ActionsDropdown = React.forwardRef<HTMLDivElement, ActionsDropdownProps>(
  ({ className, keywordSet }, ref) => {
    const { t } = useTranslation();
    const locale = useLocale();
    const history = useHistory();
    const authenticated = useSelector(authenticatedSelector);
    const { user } = useUser();
    const { id, organization: publisher } = getKeywordSetFields(
      keywordSet,
      locale
    );
    const { organizationAncestors } = useOrganizationAncestors(publisher);
    const { pathname, search } = useLocation();

    const { closeModal, deleteKeywordSet, openModal, saving, setOpenModal } =
      useKeywordSetUpdateActions({
        keywordSet,
      });

    const goToEditKeywordSetPage = () => {
      const queryString = addParamsToKeywordSetQueryString(search, {
        returnPath: pathname,
      });

      history.push({
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
        onClick,
        organizationAncestors,
        publisher,
        t,
        user,
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
