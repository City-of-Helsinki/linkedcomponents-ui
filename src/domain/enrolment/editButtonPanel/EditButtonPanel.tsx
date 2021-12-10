import { IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import {
  Enrolment,
  RegistrationFieldsFragment,
} from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { ENROLMENT_EDIT_ACTIONS } from '../../enrolments/constants';
import { EnrolmentsLocationState } from '../../enrolments/types';
import { getEditButtonProps } from '../../enrolments/utils';
import styles from './editButtonPanel.module.scss';

export interface EditButtonPanelProps {
  enrolment: Enrolment;
  onCancel: () => void;
  onSave: () => void;
  registration: RegistrationFieldsFragment;
  saving: ENROLMENT_EDIT_ACTIONS | false;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  enrolment,
  onCancel,
  onSave,
  registration,
  saving,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const goBack = useGoBack<EnrolmentsLocationState>({
    defaultReturnPath: ROUTES.REGISTRATION_ENROLMENTS.replace(
      ':registrationId',
      registration.id as string
    ),
    state: { enrolmentId: enrolment.id },
  });

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
      action: ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE,
      onClick: () => toast.error('TODO: Send message to attendee'),
    }),
    getActionItemProps({
      action: ENROLMENT_EDIT_ACTIONS.CANCEL,
      onClick: onCancel,
    }),
  ].filter(skipFalsyType);

  return (
    <ButtonPanel
      actionItems={actionItems}
      contentWrapperClassName={styles.container}
      onBack={goBack}
      submitButtons={[
        <LoadingButton
          key="save"
          className={buttonPanelStyles.fullWidthOnMobile}
          fullWidth={true}
          icon={<IconPen aria-hidden={true} />}
          loading={saving === ENROLMENT_EDIT_ACTIONS.UPDATE}
          onClick={onSave}
          type="submit"
        >
          {t('enrolment.form.buttonSave')}
        </LoadingButton>,
      ]}
    />
  );
};

export default EditButtonPanel;
