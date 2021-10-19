import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { toast } from 'react-toastify';

import Button from '../../../common/components/button/Button';
import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/MenuItem';
import { ROUTES } from '../../../constants';
import { Enrolment, Registration } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import skipFalsyType from '../../../utils/skipFalsyType';
import { authenticatedSelector } from '../../auth/selectors';
import { ENROLMENT_EDIT_ACTIONS } from '../../enrolments/constants';
import { EnrolmentsLocationState } from '../../enrolments/types';
import { getEditButtonProps } from '../../enrolments/utils';
import styles from './editButtonPanel.module.scss';

export interface EditButtonPanelProps {
  enrolment: Enrolment;
  onSave: () => void;
  registration: Registration;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  enrolment,
  onSave,
  registration,
}) => {
  const { t } = useTranslation();
  const authenticated = useSelector(authenticatedSelector);
  const locale = useLocale();
  const history = useHistory<EnrolmentsLocationState>();
  const { search } = useLocation();

  const goBack = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      search,
      ROUTES.REGISTRATION_ENROLMENTS.replace(
        ':registrationId',
        registration.id as string
      )
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: remainingQueryString,
      state: { enrolmentId: enrolment.id },
    });
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
      action: ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE,
      onClick: () => toast.error('TODO: Send message to attendee'),
    }),
    getActionItemProps({
      action: ENROLMENT_EDIT_ACTIONS.CANCEL,
      onClick: () => toast.error('TODO: Cancel enrolment'),
    }),
  ].filter(skipFalsyType);

  return (
    <ButtonPanel
      actionItems={actionItems}
      contentWrapperClassName={styles.container}
      onBack={goBack}
      submitButtons={[
        <Button
          key="save"
          className={buttonPanelStyles.fullWidthOnMobile}
          fullWidth={true}
          onClick={onSave}
          type="button"
        >
          {t('enrolment.form.buttonSave')}
        </Button>,
      ]}
    />
  );
};

export default EditButtonPanel;
