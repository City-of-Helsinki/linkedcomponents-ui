/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import { ValidationError } from 'yup';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../common/components/serverErrorSummary/ServerErrorSummary';
import { ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
  RegistrationQuery,
  RegistrationQueryVariables,
  useEventQuery,
  useRegistrationQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import extractLatestReturnPath from '../../utils/extractLatestReturnPath';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import Section from '../app/layout/Section';
import { EVENT_INCLUDES } from '../event/constants';
import { eventPathBuilder } from '../event/utils';
import NotFound from '../notFound/NotFound';
import { REGISTRATION_EDIT_ACTIONS } from '../registrations/constants';
import { replaceParamsToRegistrationQueryString } from '../registrations/utils';
import useDebouncedLoadingUser from '../user/hooks/useDebouncedLoadingUser';
import useUser from '../user/hooks/useUser';
import AuthRequiredNotification from './authRequiredNotification/AuthRequiredNotification';
import { REGISTRATION_INCLUDES } from './constants';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import AttendeeCapacitySection from './formSections/attendeeCapacitySection/AttendeeCapacitySection';
import AudienceAgeSection from './formSections/audienceAgeSection/AudienceAgeSection';
import ConfirmationMessageSection from './formSections/confirmationMessageSection/ConfirmationMessageSection';
import EnrolmentTimeSection from './formSections/enrolmentTimeSection/EnrolmentTimeSection';
import InstructionsSection from './formSections/instructionsSection/InstructionsSection';
import WaitingListSection from './formSections/waitingListSection/WaitingListSection';
import useRegistrationName from './hooks/useRegistrationName';
import useRegistrationServerErrors from './hooks/useRegistrationServerErrors';
import useRegistrationUpdateActions, {
  MODALS,
} from './hooks/useRegistrationUpdateActions';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import RegistrationInfo from './registrationInfo/RegistrationInfo';
import styles from './registrationPage.module.scss';
import { RegistrationFormFields } from './types';
import { getRegistrationInitialValues, registrationPathBuilder } from './utils';
import { registrationSchema, showErrors } from './validation';

interface EditRegistrationPageProps {
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<RegistrationQueryVariables>
  ) => Promise<ApolloQueryResult<RegistrationQuery>>;
  registration: RegistrationFieldsFragment;
}

const EditRegistrationPage: React.FC<EditRegistrationPageProps> = ({
  event,
  refetch,
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const location = useLocation();
  const history = useHistory();
  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useRegistrationServerErrors();

  const {
    closeModal,
    deleteRegistration,
    openModal,
    saving,
    setOpenModal,
    updateRegistration,
  } = useRegistrationUpdateActions({
    registration,
  });

  const initialValues = React.useMemo(
    () => getRegistrationInitialValues(registration),
    [registration]
  );

  const name = useRegistrationName({ registration });

  const goToRegistrationsPage = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search,
      ROUTES.REGISTRATIONS
    );

    history.push({
      pathname: `/${locale}${returnPath}`,
      search: replaceParamsToRegistrationQueryString(remainingQueryString, {
        page: null,
      }),
      state: { registrationId: registration.id },
    });
  };

  const onDelete = () => {
    deleteRegistration({
      onSuccess: () => goToRegistrationsPage(),
    });
  };

  const onUpdate = (values: RegistrationFormFields) => {
    updateRegistration(values, {
      onError: (error: any) => showServerErrors({ error }),
      onSuccess: async () => {
        await refetch();
        window.scrollTo(0, 0);
      },
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={registrationSchema}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ values, setErrors, setTouched }) => {
        const clearErrors = () => setErrors({});

        const handleUpdate = async () => {
          try {
            setServerErrorItems([]);
            clearErrors();

            await registrationSchema.validate(values, { abortEarly: false });

            onUpdate(values);
          } catch (error) {
            showErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });
          }
        };

        return (
          <>
            <ConfirmDeleteModal
              isOpen={openModal === MODALS.DELETE}
              isSaving={saving === REGISTRATION_EDIT_ACTIONS.DELETE}
              onClose={closeModal}
              onDelete={onDelete}
            />
            <Form noValidate={true}>
              <PageWrapper
                backgroundColor="coatOfArms"
                className={styles.registrationPage}
                noFooter
                titleText={name}
              >
                <MainContent>
                  <Container
                    contentWrapperClassName={styles.editPageContentContainer}
                    withOffset={true}
                  >
                    <AuthRequiredNotification />
                    <ServerErrorSummary errors={serverErrorItems} />
                    <RegistrationInfo registration={registration} />
                    <Section
                      title={t('registration.form.sections.enrolmentTime')}
                    >
                      <EnrolmentTimeSection />
                    </Section>
                    <Section
                      title={t('registration.form.sections.attendeeCount')}
                    >
                      <AttendeeCapacitySection />
                    </Section>
                    <Section
                      title={t('registration.form.sections.waitingList')}
                    >
                      <WaitingListSection />
                    </Section>
                    <Section
                      title={t('registration.form.sections.instructions')}
                    >
                      <InstructionsSection />
                    </Section>
                    <Section
                      title={t(
                        'registration.form.sections.confirmationMessage'
                      )}
                    >
                      <ConfirmationMessageSection />
                    </Section>
                    <Section
                      title={t('registration.form.sections.audienceAge')}
                    >
                      <AudienceAgeSection />
                    </Section>
                  </Container>
                  <EditButtonPanel
                    onDelete={() => setOpenModal(MODALS.DELETE)}
                    onUpdate={handleUpdate}
                    publisher={event.publisher as string}
                    registration={registration}
                    saving={saving}
                  />
                </MainContent>
              </PageWrapper>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

const EditRegistrationPageWrapper: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const loadingUser = useDebouncedLoadingUser();

  const {
    data: registrationData,
    loading: loadingRegistration,
    refetch,
  } = useRegistrationQuery({
    skip: !id || !user,
    variables: {
      id,
      include: REGISTRATION_INCLUDES,
      createPath: getPathBuilder(registrationPathBuilder),
    },
  });
  const registration = registrationData?.registration;

  const { data: eventData, loading: loadingEvent } = useEventQuery({
    skip: !registration?.event,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: registration?.event as string,
      include: EVENT_INCLUDES,
    },
  });

  const event = eventData?.event;
  const loading = loadingEvent || loadingRegistration || loadingUser;

  return (
    <LoadingSpinner isLoading={loading}>
      {event && registration ? (
        <EditRegistrationPage
          event={event}
          refetch={refetch}
          registration={registration}
        />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditRegistrationPageWrapper;
