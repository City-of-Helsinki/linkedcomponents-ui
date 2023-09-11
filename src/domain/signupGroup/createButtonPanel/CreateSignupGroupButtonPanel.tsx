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
import { SIGNUP_GROUP_ACTIONS } from '../constants';
import { getSignupGroupActionButtonProps } from '../permissions';
import styles from './createButtonPanel.module.scss';

export interface CreateSignupGroupButtonPanelProps {
  disabled: boolean;
  onCreate: () => void;
  registration: RegistrationFieldsFragment;
  saving: SIGNUP_GROUP_ACTIONS | null;
}

const CreateSignupGroupButtonPanel: React.FC<
  CreateSignupGroupButtonPanelProps
> = ({ disabled, onCreate, registration, saving }) => {
  const { t } = useTranslation();

  const { isAuthenticated: authenticated } = useAuth();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { user } = useUser();

  const goBack = useGoBack({
    defaultReturnPath: ROUTES.REGISTRATION_SIGNUPS.replace(
      ':registrationId',
      getValue(registration.id, '')
    ),
  });

  const buttonProps = getSignupGroupActionButtonProps({
    action: SIGNUP_GROUP_ACTIONS.CREATE,
    authenticated,
    onClick: onCreate,
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
          loading={saving === SIGNUP_GROUP_ACTIONS.CREATE}
          type="submit"
        >
          {buttonProps.label}
        </LoadingButton>,
      ]}
    />
  );
};

export default CreateSignupGroupButtonPanel;
