import { IconMenuDots } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { toast } from 'react-toastify';

import MenuDropdown from '../../../common/components/menuDropdown/MenuDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import {
  Enrolment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import useEnrolmentUpdateActions, {
  ENROLMENT_MODALS,
} from '../../enrolment/hooks/useEnrolmentUpdateActions';
import ConfirmCancelModal from '../../enrolment/modals/ConfirmCancelModal';
import {
  addParamsToRegistrationQueryString,
  getRegistrationFields,
} from '../../registrations/utils';
import { ENROLMENT_EDIT_ACTIONS } from '../constants';
import { getEditButtonProps, getEnrolmentFields } from '../utils';
import styles from './actionsDropdown.module.scss';

export interface ActionsDropdownProps {
  className?: string;
  enrolment: Enrolment;
  registration: RegistrationFieldsFragment;
}

const ActionsDropdown = React.forwardRef<HTMLDivElement, ActionsDropdownProps>(
  ({ className, enrolment, registration }, ref) => {
    const { t } = useTranslation();
    const locale = useLocale();
    const history = useHistory();
    const authenticated = useSelector(authenticatedSelector);
    const { pathname, search } = useLocation();
    const { id: registrationId } = getRegistrationFields(registration, locale);
    const { id } = getEnrolmentFields({
      enrolment,
      language: locale,
      registration,
    });

    const { cancelEnrolment, closeModal, openModal, saving, setOpenModal } =
      useEnrolmentUpdateActions({
        enrolment,
        registration,
      });

    const goToEditEnrolmentPage = () => {
      const queryString = addParamsToRegistrationQueryString(search, {
        returnPath: pathname,
      });

      history.push({
        pathname: `/${locale}${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
          ':registrationId',
          registrationId
        ).replace(':enrolmentId', id)}`,
        search: queryString,
      });
    };

    const onCancel = () => {
      cancelEnrolment();
    };

    const getActionItemProps = ({
      action,
      onClick,
    }: {
      action: ENROLMENT_EDIT_ACTIONS;
      onClick: () => void;
    }): MenuItemOptionProps | null => {
      return getEditButtonProps({
        action,
        authenticated,
        enrolment,
        onClick,
        t,
      });
    };

    const actionItems: MenuItemOptionProps[] = [
      getActionItemProps({
        action: ENROLMENT_EDIT_ACTIONS.EDIT,
        onClick: goToEditEnrolmentPage,
      }),
      getActionItemProps({
        action: ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE,
        onClick: () => toast.error('TODO: Send message to attendee'),
      }),
      getActionItemProps({
        action: ENROLMENT_EDIT_ACTIONS.CANCEL,
        onClick: () => setOpenModal(ENROLMENT_MODALS.CANCEL),
      }),
    ].filter(skipFalsyType);

    return (
      <div ref={ref}>
        {openModal === ENROLMENT_MODALS.CANCEL && (
          <ConfirmCancelModal
            enrolment={enrolment}
            isOpen={openModal === ENROLMENT_MODALS.CANCEL}
            isSaving={saving === ENROLMENT_EDIT_ACTIONS.CANCEL}
            onCancel={onCancel}
            onClose={closeModal}
            registration={registration}
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