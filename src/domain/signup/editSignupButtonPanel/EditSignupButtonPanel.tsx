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
import useAuth from '../../auth/hooks/useAuth';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { SignupsLocationState } from '../../signups/types';
import useUser from '../../user/hooks/useUser';
import { SIGNUP_ACTIONS } from '../constants';
import { getSignupActionButtonProps } from '../permissions';
import styles from './editButtonPanel.module.scss';

export interface EditSignupButtonPanelProps {
  onDelete: () => void;
  onSendMessage: () => void;
  onUpdate: () => void;
  registration: RegistrationFieldsFragment;
  saving: SIGNUP_ACTIONS | false;
  signup: SignupFieldsFragment;
}

const EditSignupButtonPanel: React.FC<EditSignupButtonPanelProps> = ({
  onDelete,
  onSendMessage,
  onUpdate,
  registration,
  saving,
  signup,
}) => {
  const { t } = useTranslation();
  const { authenticated } = useAuth();
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
      registration,
      signup,
      t,
      user,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getActionItemProps({
      action: SIGNUP_ACTIONS.DELETE,
      onClick: onDelete,
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
          onClick={onUpdate}
          type="submit"
        >
          {t('signup.form.buttonSave')}
        </LoadingButton>,
      ]}
    />
  );
};

export default EditSignupButtonPanel;
