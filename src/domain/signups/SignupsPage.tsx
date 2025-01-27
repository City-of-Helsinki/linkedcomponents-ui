/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

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
import { useNotificationsContext } from '../app/notificationsContext/hooks/useNotificationsContext';
import useAuth from '../auth/hooks/useAuth';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import { getRegistrationActionButtonProps } from '../registration/permissions';
import {
  exportSignupsAsExcel,
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

  const { authenticated, apiToken } = useAuth();
  const publisher = getValue(registration.publisher, '');
  const { addNotification } = useNotificationsContext();

  const { organizationAncestors } = useOrganizationAncestors(publisher);
  const { user } = useUser();
  const queryStringWithReturnPath = useQueryStringWithReturnPath();
  const { event } = getRegistrationFields(registration, locale);

  const { createdBy, lastModifiedTime } = getRegistrationFields(
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
      registration,
      t,
      user,
    }),
    getRegistrationActionButtonProps({
      action: REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST,
      authenticated,
      onClick: goToAttendanceListPage,
      organizationAncestors,
      registration,
      t,
      user,
    }),
    getRegistrationActionButtonProps({
      action: REGISTRATION_ACTIONS.EXPORT_SIGNUPS_AS_EXCEL,
      authenticated,
      onClick: () =>
        exportSignupsAsExcel({
          addNotification,
          apiToken,
          registration,
          uiLanguage: locale,
        }),
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
    registration,
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
      <MainContent className={styles.mainContent}>
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
                  { title: t(`signupsPage.title`), path: null },
                ]}
              />
            }
            breadcrumbClassName={styles.breadcrumbWrapper}
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
                lastModifiedTime={lastModifiedTime}
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
  const { loading, registration } = useRegistrationAndEventData({
    shouldFetchEvent: false,
  });

  return (
    <LoadingSpinner isLoading={loading}>
      {registration ? (
        <SignupGroupFormProvider registration={registration}>
          <SignupsPage registration={registration} />
        </SignupGroupFormProvider>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default SignupsPageWrapper;
