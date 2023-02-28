/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import Button from '../../common/components/button/Button';
import EditingInfo from '../../common/components/editingInfo/EditingInfo';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import { RegistrationFieldsFragment } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import useQueryStringWithReturnPath from '../../hooks/useQueryStringWithReturnPath';
import getValue from '../../utils/getValue';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../app/layout/titleRow/TitleRow';
import { useAuth } from '../auth/hooks/useAuth';
import { ENROLMENT_ACTIONS } from '../enrolment/constants';
import EnrolmentAuthenticationNotification from '../enrolment/enrolmentAuthenticationNotification/EnrolmentAuthenticationNotification';
import { EnrolmentPageProvider } from '../enrolment/enrolmentPageContext/EnrolmentPageContext';
import useRegistrationAndEventData from '../enrolment/hooks/useRegistrationAndEventData';
import {
  clearCreateEnrolmentFormData,
  getEditButtonProps,
} from '../enrolment/utils';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useRegistrationName from '../registration/hooks/useRegistrationName';
import useRegistrationPublisher from '../registration/hooks/useRegistrationPublisher';
import { getRegistrationFields } from '../registration/utils';
import { clearSeatsReservationData } from '../reserveSeats/utils';
import useUser from '../user/hooks/useUser';
import AttendeeList from './attendeeList/AttendeeList';
import ButtonPanel from './buttonPanel/ButtonPanel';
import styles from './enrolmentsPage.module.scss';
import FilterSummary from './filterSummary/FilterSummary';
import SearchPanel from './searchPanel/SearchPanel';
import WaitingList from './waitingList/WaitingList';

interface EnrolmentsPageProps {
  registration: RegistrationFieldsFragment;
}

const EnrolmentsPage: React.FC<EnrolmentsPageProps> = ({ registration }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useLocale();

  const { isAuthenticated: authenticated } = useAuth();
  const publisher = getValue(useRegistrationPublisher({ registration }), '');

  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { user } = useUser();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const name = useRegistrationName({ registration });

  const { createdBy, lastModifiedAt } = getRegistrationFields(
    registration,
    locale
  );

  const handleCreate = () => {
    const registrationId = getValue(registration.id, '');
    clearCreateEnrolmentFormData(registrationId);
    clearSeatsReservationData(registrationId);

    navigate({
      pathname: ROUTES.CREATE_ENROLMENT.replace(
        ':registrationId',
        registrationId
      ),
      search: queryStringWithReturnPath,
    });
  };

  const buttonProps = getEditButtonProps({
    action: ENROLMENT_ACTIONS.CREATE,
    authenticated,
    onClick: handleCreate,
    organizationAncestors,
    publisher,
    t,
    user,
  });
  return (
    <PageWrapper
      backgroundColor="coatOfArms"
      className={styles.enrolmentsPage}
      noFooter
      titleText={getValue(t('enrolmentsPage.pageTitle', { name }), '')}
    >
      <MainContent>
        <Container
          contentWrapperClassName={styles.pageContentContainer}
          withOffset={true}
        >
          <EnrolmentAuthenticationNotification
            action={ENROLMENT_ACTIONS.VIEW}
            registration={registration}
          />
          <TitleRow
            breadcrumb={
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
                  { active: true, label: t(`enrolmentsPage.title`) },
                ]}
              />
            }
            buttonWrapperClassName={styles.titleButtonWrapper}
            button={
              <Button
                {...buttonProps}
                className={styles.createButton}
                fullWidth={true}
                iconLeft={<IconPlus aria-hidden={true} />}
                variant="primary"
              >
                {t('enrolmentsPage.searchPanel.buttonCreate')}
              </Button>
            }
            editingInfo={
              <EditingInfo
                createdBy={createdBy}
                lastModifiedAt={lastModifiedAt}
              />
            }
            title={name}
          />

          <SearchPanel />
          <FilterSummary />

          <AttendeeList registration={registration} />
          <WaitingList registration={registration} />
        </Container>
        <ButtonPanel registration={registration} />
      </MainContent>
    </PageWrapper>
  );
};

const EnrolmentsPageWrapper: React.FC = () => {
  const location = useLocation();

  const { loading, registration } = useRegistrationAndEventData({
    shouldFetchEvent: false,
  });

  return (
    <LoadingSpinner isLoading={loading}>
      {registration ? (
        <EnrolmentPageProvider>
          <EnrolmentsPage registration={registration} />
        </EnrolmentPageProvider>
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EnrolmentsPageWrapper;
