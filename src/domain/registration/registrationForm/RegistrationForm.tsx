/* eslint-disable max-len */
import { ApolloQueryResult, ServerError } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import Breadcrumb from '../../../common/components/breadcrumb/Breadcrumb';
import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES, ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  RegistrationFieldsFragment,
  RegistrationQuery,
  RegistrationQueryVariables,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import {
  scrollToFirstError,
  showFormErrors,
} from '../../../utils/validationUtils';
import Container from '../../app/layout/container/Container';
import MainContent from '../../app/layout/mainContent/MainContent';
import Section from '../../app/layout/section/Section';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import { replaceParamsToRegistrationQueryString } from '../../registrations/utils';
import useUser from '../../user/hooks/useUser';
import { REGISTRATION_INITIAL_VALUES, REGISTRATION_MODALS } from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import EventLink from '../eventLink/EventLink';
import AttendeeCapacitySection from '../formSections/attendeeCapacitySection/AttendeeCapacitySection';
import AudienceAgeSection from '../formSections/audienceAgeSection/AudienceAgeSection';
import ConfirmationMessageSection from '../formSections/confirmationMessageSection/ConfirmationMessageSection';
import EnrolmentTimeSection from '../formSections/enrolmentTimeSection/EnrolmentTimeSection';
import EventSection from '../formSections/eventSection/EventSection';
import InstructionsSection from '../formSections/instructionsSection/InstructionsSection';
import RequiredFieldsSection from '../formSections/requiredFieldsSection/RequiredFieldsSection';
import WaitingListSection from '../formSections/waitingListSection/WaitingListSection';
import useRegistrationActions from '../hooks/useRegistrationActions';
import useRegistrationServerErrors from '../hooks/useRegistrationServerErrors';
import ConfirmDeleteModal from '../modals/confirmDeleteModal/ConfirmDeleteModal';
import RegistrationAuthenticationNotification from '../registrationAuthenticationNotification/RegistrationAuthenticationNotification';
import RegistrationInfo from '../registrationInfo/RegistrationInfo';
import styles from '../registrationPage.module.scss';
import { RegistrationFormFields } from '../types';
import { checkCanUserDoAction, getRegistrationInitialValues } from '../utils';
import { getFocusableFieldId, registrationSchema } from '../validation';

export type CreateRegistrationFormProps = {
  event?: undefined;
  refetch?: undefined;
  registration?: undefined;
};

export type EditRegistrationFormProps = {
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<RegistrationQueryVariables>
  ) => Promise<ApolloQueryResult<RegistrationQuery>>;
  registration: RegistrationFieldsFragment;
};

export type RegistrationFormProps =
  | CreateRegistrationFormProps
  | EditRegistrationFormProps;

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  event,
  refetch,
  registration,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(
    event?.publisher ?? ''
  );

  const isEditingAllowed = checkCanUserDoAction({
    action: registration
      ? REGISTRATION_ACTIONS.EDIT
      : REGISTRATION_ACTIONS.CREATE,
    organizationAncestors,
    publisher: event?.publisher as string,
    user,
  });

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useRegistrationServerErrors();

  const goToRegistrationsPage = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search,
      ROUTES.REGISTRATIONS
    );

    navigate(
      {
        pathname: `/${locale}${returnPath}`,
        search: replaceParamsToRegistrationQueryString(remainingQueryString, {
          page: null,
        }),
      },
      { state: { registrationId: registration?.id } }
    );
  };

  const {
    closeModal,
    createRegistration,
    deleteRegistration,
    openModal,
    setOpenModal,
    saving,
    updateRegistration,
  } = useRegistrationActions({
    registration,
  });

  const goToRegistrationSavedPage = (id: string) => {
    navigate(`/${locale}${ROUTES.REGISTRATION_SAVED.replace(':id', id)}`);
  };

  const onCreate = async (values: RegistrationFormFields) => {
    await createRegistration(values, {
      onError: (error: ServerError) => showServerErrors({ error }),
      onSuccess: (id) => goToRegistrationSavedPage(id as string),
    });
  };

  const onDelete = () => {
    deleteRegistration({
      onSuccess: goToRegistrationsPage,
    });
  };

  const onUpdate = (values: RegistrationFormFields) => {
    updateRegistration(values, {
      onError: (error) => showServerErrors({ error }),
      onSuccess: async () => {
        refetch && (await refetch());
        window.scrollTo(0, 0);
      },
    });
  };

  const initialValues = React.useMemo(
    () =>
      registration
        ? getRegistrationInitialValues(registration)
        : REGISTRATION_INITIAL_VALUES,
    [registration]
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs

      onSubmit={/* istanbul ignore next */ () => undefined}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={isEditingAllowed && registrationSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async (
          event?: React.FormEvent<HTMLFormElement>
        ) => {
          event?.preventDefault();

          try {
            setServerErrorItems([]);
            clearErrors();

            await registrationSchema.validate(values, { abortEarly: false });

            if (registration) {
              await onUpdate(values);
            } else {
              await onCreate(values);
            }
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({
              error: error as ValidationError,
              getFocusableFieldId,
            });
          }
        };

        return (
          <>
            <ConfirmDeleteModal
              isOpen={openModal === REGISTRATION_MODALS.DELETE}
              isSaving={saving === REGISTRATION_ACTIONS.DELETE}
              onClose={closeModal}
              onDelete={onDelete}
            />
            <Form noValidate={true}>
              <FormikPersist
                name={FORM_NAMES.REGISTRATION_FORM}
                isSessionStorage={true}
                restoringDisabled={!!registration}
                savingDisabled={!!registration}
              >
                <MainContent>
                  <Container
                    contentWrapperClassName={
                      registration
                        ? styles.editPageContentContainer
                        : styles.createContainer
                    }
                    withOffset={true}
                  >
                    <Breadcrumb
                      className={styles.breadcrumb}
                      items={[
                        { label: t('common.home'), to: ROUTES.HOME },
                        {
                          label: t('registrationsPage.title'),
                          to: ROUTES.REGISTRATIONS,
                        },
                        {
                          active: true,
                          label: registration
                            ? t('editRegistrationPage.title')
                            : t('createRegistrationPage.title'),
                        },
                      ]}
                    />
                    <RegistrationAuthenticationNotification
                      action={
                        registration
                          ? REGISTRATION_ACTIONS.UPDATE
                          : REGISTRATION_ACTIONS.CREATE
                      }
                      registration={registration}
                    />
                    <ServerErrorSummary errors={serverErrorItems} />

                    {registration && (
                      <RegistrationInfo registration={registration} />
                    )}
                    <Section title={t('registration.form.sections.event')}>
                      {registration ? (
                        <EventLink registration={registration} />
                      ) : (
                        <EventSection isEditingAllowed={isEditingAllowed} />
                      )}
                    </Section>
                    <Section
                      title={t('registration.form.sections.enrolmentTime')}
                    >
                      <EnrolmentTimeSection
                        isEditingAllowed={isEditingAllowed}
                      />
                    </Section>
                    <Section
                      title={t('registration.form.sections.attendeeCount')}
                    >
                      <AttendeeCapacitySection
                        isEditingAllowed={isEditingAllowed}
                      />
                    </Section>
                    <Section
                      title={t('registration.form.sections.waitingList')}
                    >
                      <WaitingListSection isEditingAllowed={isEditingAllowed} />
                    </Section>
                    <Section
                      title={t('registration.form.sections.instructions')}
                    >
                      <InstructionsSection
                        isEditingAllowed={isEditingAllowed}
                      />
                    </Section>
                    <Section
                      title={t(
                        'registration.form.sections.confirmationMessage'
                      )}
                    >
                      <ConfirmationMessageSection
                        isEditingAllowed={isEditingAllowed}
                      />
                    </Section>
                    <Section
                      title={t('registration.form.sections.audienceAge')}
                    >
                      <AudienceAgeSection isEditingAllowed={isEditingAllowed} />
                    </Section>
                    <Section
                      title={t('registration.form.sections.requiredFields')}
                    >
                      <RequiredFieldsSection
                        isEditingAllowed={isEditingAllowed}
                      />
                    </Section>
                  </Container>
                </MainContent>
                {registration ? (
                  <EditButtonPanel
                    onDelete={() => setOpenModal(REGISTRATION_MODALS.DELETE)}
                    onUpdate={handleSubmit}
                    publisher={event?.publisher as string}
                    registration={registration}
                    saving={saving}
                  />
                ) : (
                  <CreateButtonPanel onSave={handleSubmit} saving={saving} />
                )}
              </FormikPersist>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default RegistrationForm;
