import { IconPen } from 'hds-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import buttonPanelStyles from '../../../common/components/buttonPanel/buttonPanel.module.scss';
import LoadingButton from '../../../common/components/loadingButton/LoadingButton';
import { MenuItemOptionProps } from '../../../common/components/menuDropdown/types';
import { ROUTES } from '../../../constants';
import {
  RegistrationFieldsFragment,
  SignupGroupFieldsFragment,
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
import { SIGNUP_GROUP_ACTIONS } from '../constants';
import { getSignupGroupActionButtonProps } from '../permissions';
import { getResponsiblePerson } from '../utils';
import styles from './editButtonPanel.module.scss';

export interface EditSignupGroupButtonPanelProps {
  onDelete: () => void;
  onSendMessage: () => void;
  onUpdate: () => void;
  registration: RegistrationFieldsFragment;
  saving: SIGNUP_GROUP_ACTIONS | null;
  signupGroup: SignupGroupFieldsFragment;
}

const EditSignupGroupButtonPanel: React.FC<EditSignupGroupButtonPanelProps> = ({
  onDelete,
  onSendMessage,
  onUpdate,
  registration,
  saving,
  signupGroup,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated: authenticated } = useAuth();
  const { user } = useUser();
  const publisher = getValue(registration.publisher, '');
  const { organizationAncestors } = useOrganizationAncestors(publisher);

  const responsiblePerson = useMemo(
    () => getResponsiblePerson(signupGroup),
    [signupGroup]
  );

  const goBack = useGoBack<SignupsLocationState>({
    defaultReturnPath: ROUTES.REGISTRATION_SIGNUPS.replace(
      ':registrationId',
      getValue(registration.id, '')
    ),
    state: { signupId: responsiblePerson?.id },
  });

  const getSingupActionItemProps = ({
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

  const getSingupGroupActionItemProps = ({
    action,
    onClick,
  }: {
    action: SIGNUP_GROUP_ACTIONS;
    onClick: () => void;
  }): MenuItemOptionProps | null => {
    return getSignupGroupActionButtonProps({
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
    getSingupGroupActionItemProps({
      action: SIGNUP_GROUP_ACTIONS.DELETE,
      onClick: onDelete,
    }),
    getSingupActionItemProps({
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
          key="update"
          className={buttonPanelStyles.fullWidthOnMobile}
          icon={<IconPen aria-hidden={true} />}
          {...getSingupGroupActionItemProps({
            action: SIGNUP_GROUP_ACTIONS.UPDATE,
            onClick: onUpdate,
          })}
          loading={saving === SIGNUP_GROUP_ACTIONS.UPDATE}
          type="submit"
        >
          {t('signupGroup.form.buttonUpdate')}
        </LoadingButton>,
      ]}
    />
  );
};

export default EditSignupGroupButtonPanel;
