import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import useRegistrationUpdateActions, {
  MODALS,
} from '../../registration/hooks/useRegistrationUpdateActions';
import ConfirmDeleteModal from '../../registration/modals/ConfirmDeleteModal';
import {
  copyEnrolmentLinkToClipboard,
  copyRegistrationToSessionStorage,
} from '../../registration/utils';
import { REGISTRATION_EDIT_ACTIONS } from '../constants';
import useQueryStringWithReturnPath from '../hooks/useRegistrationsQueryStringWithReturnPath';
import { getEditButtonProps, getRegistrationFields } from '../utils';
import styles from './actionsDropdown.module.scss';

export interface ActionsDropdownProps {
  className?: string;
  registration: RegistrationFieldsFragment;
}

const ActionsDropdown = React.forwardRef<HTMLDivElement, ActionsDropdownProps>(
  ({ className, registration }, ref) => {
    const { t } = useTranslation();
    const locale = useLocale();
    const history = useHistory();
    const { id, registrationUrl } = getRegistrationFields(registration, locale);
    const queryStringWithReturnPath = useQueryStringWithReturnPath();
    const { closeModal, deleteRegistration, openModal, saving, setOpenModal } =
      useRegistrationUpdateActions({
        registration,
      });

    const goToEditRegistrationPage = () => {
      const registrationUrlWithReturnPath = `${registrationUrl}${queryStringWithReturnPath}`;
      history.push(registrationUrlWithReturnPath);
    };

    const goToRegistrationEnrolmentsPage = () => {
      history.push({
        pathname: `/${locale}${ROUTES.REGISTRATION_ENROLMENTS.replace(
          ':registrationId',
          id
        )}`,
        search: queryStringWithReturnPath,
      });
    };

    const copyRegistration = async () => {
      await copyRegistrationToSessionStorage(registration);
      history.push(`/${locale}${ROUTES.CREATE_REGISTRATION}`);
    };

    const onDelete = () => {
      deleteRegistration();
    };

    const getActionItemProps = ({
      action,
      onClick,
    }: {
      action: REGISTRATION_EDIT_ACTIONS;
      onClick: () => void;
    }): MenuItemOptionProps | null => {
      return getEditButtonProps({
        action,
        onClick,
        t,
      });
    };

    const actionItems: MenuItemOptionProps[] = [
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.EDIT,
        onClick: goToEditRegistrationPage,
      }),
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.SHOW_ENROLMENTS,
        onClick: goToRegistrationEnrolmentsPage,
      }),
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.COPY,
        onClick: copyRegistration,
      }),
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.COPY_LINK,
        onClick: () => {
          copyEnrolmentLinkToClipboard({ locale, registration, t });
        },
      }),
      getActionItemProps({
        action: REGISTRATION_EDIT_ACTIONS.DELETE,
        onClick: () => setOpenModal(MODALS.DELETE),
      }),
    ].filter(skipFalsyType);

    return (
      <div ref={ref}>
        {openModal === MODALS.DELETE && (
          <ConfirmDeleteModal
            isOpen={openModal === MODALS.DELETE}
            isSaving={saving === REGISTRATION_EDIT_ACTIONS.DELETE}
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
