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
import { ENROLMENT_ACTIONS } from '../../enrolment/constants';
import { getEditButtonProps } from '../../enrolment/utils';
import { EnrolmentsLocationState } from '../../signups/types';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import { SIGNUP_GROUP_ACTIONS } from '../constants';
import { getSignupGroupActionButtonProps } from '../permissions';
import { getResponsiblePerson } from '../utils';
import styles from './editButtonPanel.module.scss';

export interface EditSignupGroupButtonPanelProps {
  onSendMessage: () => void;
  onUpdate: () => void;
  registration: RegistrationFieldsFragment;
  saving: SIGNUP_GROUP_ACTIONS | null;
  signupGroup: SignupGroupFieldsFragment;
}

const EditSignupGroupButtonPanel: React.FC<EditSignupGroupButtonPanelProps> = ({
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

  const goBack = useGoBack<EnrolmentsLocationState>({
    defaultReturnPath: ROUTES.REGISTRATION_ENROLMENTS.replace(
      ':registrationId',
      getValue(registration.id, '')
    ),
    state: { enrolmentId: responsiblePerson?.id },
  });

  const getSignupActionItemProps = ({
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

  const getSignupGroupActionItemProps = ({
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
    getSignupActionItemProps({
      action: ENROLMENT_ACTIONS.SEND_MESSAGE,
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
          {...getSignupGroupActionItemProps({
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
