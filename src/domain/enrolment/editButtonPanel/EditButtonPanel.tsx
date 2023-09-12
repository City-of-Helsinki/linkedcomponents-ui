import { IconPen } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import {
  RegistrationFieldsFragment,
  SignupFieldsFragment,
} from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useAuth } from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { SIGNUP_ACTIONS } from '../../signup/constants';
import { getSignupActionButtonProps } from '../../signup/permissions';
import { SignupsLocationState } from '../../signups/types';
import useUser from '../../user/hooks/useUser';
import styles from './editButtonPanel.module.scss';

export interface EditButtonPanelProps {
  onCancel: () => void;
  onSave: () => void;
  onSendMessage: () => void;
  registration: RegistrationFieldsFragment;
  saving: SIGNUP_ACTIONS | false;
  signup: SignupFieldsFragment;
}

const EditButtonPanel: React.FC<EditButtonPanelProps> = ({
  onCancel,
  onSave,
  onSendMessage,
  registration,
  saving,
  signup,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const goBack = useGoBack<SignupsLocationState>({
    defaultReturnPath: ROUTES.REGISTRATION_SIGNUPS.replace(
      ':registrationId',
      getValue(registration.id, '')
    ),
    state: { signupId: signup.id },
  });

  const getActionItemProps = ({
    action,
    onClick,
  }: {
    action: SIGNUP_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getSignupActionButtonProps({
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
      action: SIGNUP_ACTIONS.DELETE,
      onClick: onCancel,
    }),
    getActionItemProps({
      action: SIGNUP_ACTIONS.SEND_MESSAGE,
      onClick: onSendMessage,
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
          icon={<IconPen aria-hidden={true} />}
          loading={saving === SIGNUP_ACTIONS.UPDATE}
          onClick={onSave}
          type="submit"
        >
          {t('signup.form.buttonSave')}
        </LoadingButton>,
      ]}
    />
  );
};

export default EditButtonPanel;
