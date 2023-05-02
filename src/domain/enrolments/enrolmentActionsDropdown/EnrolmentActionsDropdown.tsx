/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import ActionsDropdown from '../../../common/components/actionsDropdown/ActionsDropdown';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import {
  EnrolmentFieldsFragment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import { ENROLMENT_ACTIONS, ENROLMENT_MODALS } from '../../enrolment/constants';
import { useEnrolmentPageContext } from '../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import useEnrolmentActions from '../../enrolment/hooks/useEnrolmentActions';
import ConfirmCancelEnrolmentModal from '../../enrolment/modals/confirmCancelEnrolmentModal/ConfirmCancelEnrolmentModal';
import { getEditButtonProps } from '../../enrolment/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { getRegistrationFields } from '../../registration/utils';
import { addParamsToRegistrationQueryString } from '../../registrations/utils';
import useUser from '../../user/hooks/useUser';
import { getEnrolmentFields } from '../utils';

export interface EnrolmentActionsDropdownProps {
  className?: string;
  enrolment: EnrolmentFieldsFragment;
  registration: RegistrationFieldsFragment;
}

const EnrolmentActionsDropdown: React.FC<EnrolmentActionsDropdownProps> = ({
  className,
  enrolment,
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { pathname, search } = useLocation();
  const { id: registrationId } = getRegistrationFields(registration, locale);
  const { id } = getEnrolmentFields({
    enrolment,
    language: locale,
    registration,
  });

  const { closeModal, openModal, setOpenModal } = useEnrolmentPageContext();

  const { cancelEnrolment, saving } = useEnrolmentActions({
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
    <>
      {openModal === ENROLMENT_MODALS.CANCEL && (
        <ConfirmCancelEnrolmentModal
          enrolment={enrolment}
          isOpen={openModal === ENROLMENT_MODALS.CANCEL}
          isSaving={saving === ENROLMENT_ACTIONS.CANCEL}
          onConfirm={cancelEnrolment}
          onClose={closeModal}
          registration={registration}
        />
      )}
      <ActionsDropdown className={className} items={actionItems} />
    </>
  );
};

export default EnrolmentActionsDropdown;
