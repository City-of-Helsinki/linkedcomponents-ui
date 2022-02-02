import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useRegistrationPublisher from '../../registration/hooks/useRegistrationPublisher';
import useRegistrationUpdateActions, {
  MODALS,
} from '../../registration/hooks/useRegistrationUpdateActions';
import ConfirmDeleteModal from '../../registration/modals/ConfirmDeleteModal';
import {
  copyEnrolmentLinkToClipboard,
  copyRegistrationToSessionStorage,
  getEditButtonProps,
  getRegistrationFields,
} from '../../registration/utils';
import useUser from '../../user/hooks/useUser';
import { REGISTRATION_ACTIONS } from '../constants';
import useQueryStringWithReturnPath from '../hooks/useRegistrationsQueryStringWithReturnPath';
import styles from './actionsDropdown.module.scss';

export interface ActionsDropdownProps {
  className?: string;
  registration: RegistrationFieldsFragment;
}

const ActionsDropdown = React.forwardRef<HTMLDivElement, ActionsDropdownProps>(
  ({ className, registration }, ref) => {
    const { t } = useTranslation();
    const authenticated = useSelector(authenticatedSelector);
    const locale = useLocale();
    const history = useHistory();
    const { id, registrationUrl } = getRegistrationFields(registration, locale);
    const queryStringWithReturnPath = useQueryStringWithReturnPath();
    const { user } = useUser();

    const publisher = useRegistrationPublisher({ registration }) as string;
    const { organizationAncestors } = useOrganizationAncestors(publisher);

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
      action: REGISTRATION_ACTIONS;
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
        action: REGISTRATION_ACTIONS.EDIT,
        onClick: goToEditRegistrationPage,
      }),
      getActionItemProps({
        action: REGISTRATION_ACTIONS.SHOW_ENROLMENTS,
        onClick: goToRegistrationEnrolmentsPage,
      }),
      getActionItemProps({
        action: REGISTRATION_ACTIONS.COPY,
        onClick: copyRegistration,
      }),
      getActionItemProps({
        action: REGISTRATION_ACTIONS.COPY_LINK,
        onClick: () => {
          copyEnrolmentLinkToClipboard({ locale, registration, t });
        },
      }),
      getActionItemProps({
        action: REGISTRATION_ACTIONS.DELETE,
        onClick: () => setOpenModal(MODALS.DELETE),
      }),
    ].filter(skipFalsyType);

    return (
      <div ref={ref}>
        {openModal === MODALS.DELETE && (
          <ConfirmDeleteModal
            isOpen={openModal === MODALS.DELETE}
            isSaving={saving === REGISTRATION_ACTIONS.DELETE}
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
