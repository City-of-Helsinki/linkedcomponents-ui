import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import getValue from '../../../utils/getValue';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { ENROLMENT_ACTIONS } from '../constants';
import { getEditButtonProps } from '../utils';
import styles from './createButtonPanel.module.scss';

export interface CreateButtonPanelProps {
  disabled: boolean;
  onSave: () => void;
  registration: RegistrationFieldsFragment;
  saving: ENROLMENT_ACTIONS | false;
}

const CreateButtonPanel: React.FC<CreateButtonPanelProps> = ({
  disabled,
  onSave,
  registration,
  saving,
}) => {
  const { t } = useTranslation();

  const { isAuthenticated: authenticated } = useAuth();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { user } = useUser();

  const goBack = useGoBack({
    defaultReturnPath: ROUTES.REGISTRATION_ENROLMENTS.replace(
      ':registrationId',
      getValue(registration.id, '')
    ),
  });

  const buttonProps = getEditButtonProps({
    action: ENROLMENT_ACTIONS.CREATE,
    authenticated,
    onClick: onSave,
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return (
    <ButtonPanel
      contentWrapperClassName={styles.container}
      onBack={goBack}
      submitButtons={[
        <LoadingButton
          key="save"
          {...buttonProps}
          className={buttonPanelStyles.fullWidthOnMobile}
          disabled={buttonProps.disabled || disabled}
          loading={saving === ENROLMENT_ACTIONS.CREATE}
          type="submit"
        >
          {buttonProps.label}
        </LoadingButton>,
      ]}
    />
  );
};

export default CreateButtonPanel;
