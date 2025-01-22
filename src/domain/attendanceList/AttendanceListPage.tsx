/* eslint-disable max-len */

import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import { RegistrationFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getValue from '../../utils/getValue';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import NotFound from '../notFound/NotFound';
import { REGISTRATION_INCLUDES } from '../registration/constants';
import RegistrationInfo from '../registration/registrationInfo/RegistrationInfo';
import { getRegistrationFields } from '../registration/utils';
import { SIGNUP_ACTIONS } from '../signup/constants';
import useRegistrationAndEventData from '../signup/hooks/useRegistrationAndEventData';
import SignupAuthenticationNotification from '../signup/signupAuthenticationNotification/SignupAuthenticationNotification';
import ButtonPanel from '../signups/buttonPanel/ButtonPanel';
import styles from './attendanceListPage.module.scss';
import AttendeeList from './attendeeList/AttendeeList';

interface AttendanceListPageProps {
  registration: RegistrationFieldsFragment;
}

const AttendanceListPage: React.FC<AttendanceListPageProps> = ({
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const { event } = getRegistrationFields(registration, locale);

  return (
    <PageWrapper
      backgroundColor="coatOfArms"
      className={styles.attendanceListPage}
      noFooter
      titleText={getValue(
        t('attendanceListPage.pageTitle', { name: event?.name }),
        ''
      )}
    >
      <MainContent className={styles.mainContent}>
        <Container
          contentWrapperClassName={styles.pageContentContainer}
          withOffset={true}
        >
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              {
                title: t('registrationsPage.title'),
                path: ROUTES.REGISTRATIONS,
              },
              {
                title: t(`editRegistrationPage.title`),
                path: ROUTES.EDIT_REGISTRATION.replace(
                  ':id',
                  getValue(registration.id, '')
                ),
              },
              { title: t(`attendanceListPage.title`), path: null },
            ]}
          />
          <SignupAuthenticationNotification
            action={SIGNUP_ACTIONS.UPDATE}
            registration={registration}
          />
          {<RegistrationInfo registration={registration} />}

          <AttendeeList registration={registration} />
        </Container>
        <ButtonPanel registration={registration} />
      </MainContent>
    </PageWrapper>
  );
};

const AttendanceListPageWrapper: React.FC = () => {
  const { loading, registration } = useRegistrationAndEventData({
    overrideRegistrationsVariables: {
      include: [...REGISTRATION_INCLUDES, 'signups'],
    },
    shouldFetchEvent: false,
  });

  return (
    <LoadingSpinner isLoading={loading}>
      {registration ? (
        <AttendanceListPage registration={registration} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default AttendanceListPageWrapper;
