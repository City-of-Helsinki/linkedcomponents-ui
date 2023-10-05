import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import styles from './signupPageBreadcrumb.module.scss';

type Props = {
  activeLabel: string;
  registration: RegistrationFieldsFragment;
};

const SignupPageBreadcrumb: FC<Props> = ({ activeLabel, registration }) => {
  const { t } = useTranslation();
  const registrationId = getValue(registration.id, '');

  return (
    <div className={styles.breadcrumb}>
      <Breadcrumb
        list={[
          { title: t('common.home'), path: ROUTES.HOME },
          { title: t('registrationsPage.title'), path: ROUTES.REGISTRATIONS },
          {
            title: t(`editRegistrationPage.title`),
            path: ROUTES.EDIT_REGISTRATION.replace(':id', registrationId),
          },
          {
            title: t(`signupsPage.title`),
            path: ROUTES.REGISTRATION_SIGNUPS.replace(
              ':registrationId',
              registrationId
            ),
          },
          { title: activeLabel, path: null },
        ]}
      />
    </div>
  );
};

export default SignupPageBreadcrumb;
