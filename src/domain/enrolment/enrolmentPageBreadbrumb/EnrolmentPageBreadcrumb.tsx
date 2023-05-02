import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../constants';
import { RegistrationFieldsFragment } from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import styles from './enrolmentPageBreadcrumb.module.scss';

type Props = {
  activeLabel: string;
  registration: RegistrationFieldsFragment;
};

const EnrolmentPageBreadcrumb: FC<Props> = ({ activeLabel, registration }) => {
  const { t } = useTranslation();
  const registrationId = getValue(registration.id, '');

  return (
    <Breadcrumb
      className={styles.breadcrumb}
      items={[
        { label: t('common.home'), to: ROUTES.HOME },
        { label: t('registrationsPage.title'), to: ROUTES.REGISTRATIONS },
        {
          label: t(`editRegistrationPage.title`),
          to: ROUTES.EDIT_REGISTRATION.replace(':id', registrationId),
        },
        {
          label: t(`enrolmentsPage.title`),
          to: ROUTES.REGISTRATION_ENROLMENTS.replace(
            ':registrationId',
            registrationId
          ),
        },
        { active: true, label: activeLabel },
      ]}
    />
  );
};

export default EnrolmentPageBreadcrumb;
