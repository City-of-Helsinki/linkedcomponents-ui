import React from 'react';
import { useHistory, useLocation } from 'react-router';

import CommonButtonPanel from '../../../common/components/buttonPanel/ButtonPanel';
import { ROUTES } from '../../../constants';
import { Registration } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import { RegistrationsLocationState } from '../../registrations/types';
import { getRegistrationFields } from '../../registrations/utils';

export interface ButtonPanelProps {
  registration: Registration;
}

const ButtonPanel: React.FC<ButtonPanelProps> = ({ registration }) => {
  const { search } = useLocation();
  const locale = useLocale();
  const history = useHistory<RegistrationsLocationState>();

  const goBack = () => {
    const { id } = getRegistrationFields(registration, locale);
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      search,
      ROUTES.EDIT_REGISTRATION.replace(':id', id)
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: remainingQueryString,
      state: { registrationId: registration.id as string },
    });
  };

  return <CommonButtonPanel onBack={goBack} />;
};

export default ButtonPanel;
