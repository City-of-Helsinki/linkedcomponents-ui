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
import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
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
import { ENROLMENT_ACTIONS, ENROLMENT_MODALS } from '../enrolment/constants';
import EnrolmentAuthenticationNotification from '../enrolment/enrolmentAuthenticationNotification/EnrolmentAuthenticationNotification';
import { EnrolmentPageProvider } from '../enrolment/enrolmentPageContext/EnrolmentPageContext';
import { useEnrolmentPageContext } from '../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import useEnrolmentActions from '../enrolment/hooks/useEnrolmentActions';
import useRegistrationAndEventData from '../enrolment/hooks/useRegistrationAndEventData';
import SendMessageModal from '../enrolment/modals/sendMessageModal/SendMessageModal';
import {
  clearCreateSignupGroupFormData,
  getEditButtonProps as getEnrolmentEditButtonProps,
} from '../enrolment/utils';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import {
  getEditButtonProps as getRegistrationEditButtonProps,
  getRegistrationFields,
} from '../registration/utils';
import { REGISTRATION_ACTIONS } from '../registrations/constants';
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
  const publisher = getValue(registration.publisher, '');

  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { user } = useUser();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { event } = getRegistrationFields(registration, locale);

  const { createdBy, lastModifiedAt } = getRegistrationFields(
    registration,
    locale
  );

  const { closeModal, openModal, setOpenModal } = useEnrolmentPageContext();
  const { saving, sendMessage } = useEnrolmentActions({
    registration,
  });

  const handleCreate = () => {
    const registrationId = getValue(registration.id, '');
    clearCreateSignupGroupFormData(registrationId);
    clearSeatsReservationData(registrationId);

    navigate({
      pathname: ROUTES.CREATE_SIGNUP_GROUP.replace(
        ':registrationId',
        registrationId
      ),
      search: queryStringWithReturnPath,
    });
  };

  const goToAttendanceListPage = () => {
    navigate({
      pathname: `/${locale}${ROUTES.ATTENDANCE_LIST.replace(
        ':registrationId',
        getValue(registration.id, '')
      )}`,
      search: queryStringWithReturnPath,
    });
  };

  const actionItems: MenuItemOptionProps[] = [
    getEnrolmentEditButtonProps({
      action: ENROLMENT_ACTIONS.SEND_MESSAGE,
      authenticated,
      onClick: () => {
        setOpenModal(ENROLMENT_MODALS.SEND_MESSAGE);
      },
      organizationAncestors,
      publisher,
      t,
      user,
    }),
    getRegistrationEditButtonProps({
      action: REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST,
      authenticated,
      onClick: goToAttendanceListPage,
      organizationAncestors,
      registration,
      t,
      user,
    }),
  ];

  const buttonProps = getEnrolmentEditButtonProps({
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
      className={styles.attendanceListPage}
      noFooter
      titleText={getValue(
        t('enrolmentsPage.pageTitle', { name: event?.name }),
        ''
      )}
    >
      {openModal === ENROLMENT_MODALS.SEND_MESSAGE && (
        <SendMessageModal
          isOpen={openModal === ENROLMENT_MODALS.SEND_MESSAGE}
          isSaving={saving === ENROLMENT_ACTIONS.SEND_MESSAGE}
          onClose={closeModal}
          onSendMessage={sendMessage}
        />
      )}
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
            actionItems={actionItems}
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
            title={getValue(event?.name, '')}
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
