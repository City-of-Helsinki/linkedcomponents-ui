import React from 'react';

import CommonButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import useGoBack from '../../../hooks/useGoBack';
import useLocale from '../../../hooks/useLocale';
import { getRegistrationFields } from '../../registration/utils';
import { RegistrationsLocationState } from '../../registrations/types';

export interface ButtonPanelProps {
  registration: RegistrationFieldsFragment;
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({ registration }) => {
  const locale = useLocale();
  const { id } = getRegistrationFields(registration, locale);

  const goBack = useGoBack<RegistrationsLocationState>({
    defaultReturnPath: ROUTES.EDIT_REGISTRATION.replace(':id', id),
    state: { registrationId: registration.id as string },
  });

  return <CommonButtonPanel onBack={goBack} />;
};

export default ButtonPanel;
