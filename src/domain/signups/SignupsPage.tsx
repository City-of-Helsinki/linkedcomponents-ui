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
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import {
  getEditButtonProps as getRegistrationEditButtonProps,
  getRegistrationFields,
} from '../registration/utils';
import { REGISTRATION_ACTIONS } from '../registrations/constants';
import { clearSeatsReservationData } from '../seatsReservation/utils';
import { SIGNUP_ACTIONS, SIGNUP_MODALS } from '../signup/constants';
import useRegistrationAndEventData from '../signup/hooks/useRegistrationAndEventData';
import useSignupActions from '../signup/hooks/useSignupActions';
import SendMessageModal from '../signup/modals/sendMessageModal/SendMessageModal';
import { getSignupActionButtonProps } from '../signup/permissions';
import SignupAuthenticationNotification from '../signup/signupAuthenticationNotification/SignupAuthenticationNotification';
import { useSignupGroupFormContext } from '../signupGroup/signupGroupFormContext/hooks/useSignupGroupFormContext';
import { SignupGroupFormProvider } from '../signupGroup/signupGroupFormContext/SignupGroupFormContext';
import { clearCreateSignupGroupFormData } from '../signupGroup/utils';
import useUser from '../user/hooks/useUser';
import AttendeeList from './attendeeList/AttendeeList';
import ButtonPanel from './buttonPanel/ButtonPanel';
import FilterSummary from './filterSummary/FilterSummary';
import SearchPanel from './searchPanel/SearchPanel';
import styles from './signupsPage.module.scss';
import WaitingList from './waitingList/WaitingList';

interface SignupsPageProps {
  registration: RegistrationFieldsFragment;
}

const SignupsPage: React.FC<SignupsPageProps> = ({ registration }) => {
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

  const { closeModal, openModal, setOpenModal } = useSignupGroupFormContext();
  const { saving, sendMessage } = useSignupActions({
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
    getSignupActionButtonProps({
      action: SIGNUP_ACTIONS.SEND_MESSAGE,
      authenticated,
      onClick: () => {
        setOpenModal(SIGNUP_MODALS.SEND_MESSAGE);
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

  const buttonProps = getSignupActionButtonProps({
    action: SIGNUP_ACTIONS.CREATE,
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
        t('signupsPage.pageTitle', { name: event?.name }),
        ''
      )}
    >
      {openModal === SIGNUP_MODALS.SEND_MESSAGE && (
        <SendMessageModal
          isOpen={openModal === SIGNUP_MODALS.SEND_MESSAGE}
          isSaving={saving === SIGNUP_ACTIONS.SEND_MESSAGE}
          onClose={closeModal}
          onSendMessage={sendMessage}
        />
      )}
      <MainContent>
        <Container
          contentWrapperClassName={styles.pageContentContainer}
          withOffset={true}
        >
          <SignupAuthenticationNotification
            action={SIGNUP_ACTIONS.VIEW}
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
                  { active: true, label: t(`signupsPage.title`) },
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
                {t('signupsPage.searchPanel.buttonCreate')}
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

const SignupsPageWrapper: React.FC = () => {
  const location = useLocation();

  const { loading, registration } = useRegistrationAndEventData({
    shouldFetchEvent: false,
  });

  return (
    <LoadingSpinner isLoading={loading}>
      {registration ? (
        <SignupGroupFormProvider>
          <SignupsPage registration={registration} />
        </SignupGroupFormProvider>
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default SignupsPageWrapper;
