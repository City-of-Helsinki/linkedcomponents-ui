/* eslint-disable max-len */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

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
      <MainContent>
        <Container
          contentWrapperClassName={styles.pageContentContainer}
          withOffset={true}
        >
          <Breadcrumb
            items={[
              { label: t('common.home'), to: ROUTES.HOME },
              {
                label: t('registrationsPage.title'),
                to: ROUTES.REGISTRATIONS,
              },
              {
                label: t(`editRegistrationPage.title`),
                to: ROUTES.EDIT_REGISTRATION.replace(
                  ':id',
                  getValue(registration.id, '')
                ),
              },
              { active: true, label: t(`attendanceListPage.title`) },
            ]}
          />
          <SignupAuthenticationNotification
            action={SIGNUP_ACTIONS.UPDATE}
            registration={registration}
          />
          {<RegistrationInfo registration={registration} />}

          <AttendeeList registration={registration} />
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

const AttendanceListPageWrapper: React.FC = () => {
  const location = useLocation();

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
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default AttendanceListPageWrapper;
