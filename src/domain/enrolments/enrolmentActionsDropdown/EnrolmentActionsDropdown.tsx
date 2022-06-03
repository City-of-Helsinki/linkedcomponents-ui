import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/menuItem/MenuItem';
import { ROUTES } from '../../../constants';
import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { ENROLMENT_ACTIONS } from '../../enrolment/constants';
import useEnrolmentUpdateActions, {
  ENROLMENT_MODALS,
} from '../../enrolment/hooks/useEnrolmentUpdateActions';
import ConfirmCancelModal from '../../enrolment/modals/confirmCancelModal/ConfirmCancelModal';
import { getEditButtonProps } from '../../enrolment/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useRegistrationPublisher from '../../registration/hooks/useRegistrationPublisher';
import { getRegistrationFields } from '../../registration/utils';
import { addParamsToRegistrationQueryString } from '../../registrations/utils';
import useUser from '../../user/hooks/useUser';
import { getEnrolmentFields } from '../utils';

export interface EnrolmentActionsDropdownProps {
  className?: string;
  enrolment: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
}

const EnrolmentActionsDropdown = React.forwardRef<
  HTMLDivElement,
  EnrolmentActionsDropdownProps
>(({ className, enrolment, registration }, ref) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const authenticated = useSelector(authenticatedSelector);
  const { user } = useUser();
  const publisher = useRegistrationPublisher({ registration }) as string;
  const { organizationAncestors } = useOrganizationAncestors(publisher);
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

    navigate({
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
    action: ENROLMENT_ACTIONS;
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
      action: ENROLMENT_ACTIONS.EDIT,
      onClick: goToEditEnrolmentPage,
    }),
    getActionItemProps({
      action: ENROLMENT_ACTIONS.CANCEL,
      onClick: () => setOpenModal(ENROLMENT_MODALS.CANCEL),
    }),
  ].filter(skipFalsyType);

  return (
    <div ref={ref}>
      {openModal === ENROLMENT_MODALS.CANCEL && (
        <ConfirmCancelModal
          enrolment={enrolment}
          isOpen={openModal === ENROLMENT_MODALS.CANCEL}
          isSaving={saving === ENROLMENT_ACTIONS.CANCEL}
          onCancel={onCancel}
          onClose={closeModal}
          registration={registration}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </div>
  );
});

export default EnrolmentActionsDropdown;
