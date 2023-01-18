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
import { FORM_NAMES, LE_DATA_LANGUAGES, ROUTES } from '../../../constants';
import {
  EventFieldsFragment,
  EventQuery,
  EventQueryVariables,
  PublicationStatus,
  SuperEventType,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import extractLatestReturnPath from '../../../utils/extractLatestReturnPath';
import { showFormErrors } from '../../../utils/validationUtils';
import Container from '../../app/layout/container/Container';
import MainContent from '../../app/layout/mainContent/MainContent';
import PageWrapper from '../../app/layout/pageWrapper/PageWrapper';
import Section from '../../app/layout/section/Section';
import { replaceParamsToEventQueryString } from '../../events/utils';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import useUser from '../../user/hooks/useUser';
import {
  EVENT_ACTIONS,
  EVENT_INITIAL_VALUES,
  EVENT_MODALS,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import EventAuthenticationNotification from '../eventAuthenticationNotification/EventAuthenticationNotification';
import EventInfo from '../eventInfo/EventInfo';
import styles from '../eventPage.module.scss';
import AdditionalInfoSection from '../formSections/additionalInfoSection/AdditionalInfoSection';
import AudienceSection from '../formSections/audienceSection/AudienceSection';
import ChannelsSection from '../formSections/channelsSection/ChannelsSection';
import ClassificationSection from '../formSections/classificationSection/ClassificationSection';
import DescriptionSection from '../formSections/descriptionSection/DescriptionSection';
import ImageSection from '../formSections/imageSection/ImageSection';
import LanguagesSection from '../formSections/languagesSection/LanguagesSection';
import LinksToEventsSection from '../formSections/linksToEventsSection/LinksToEventsSection';
import PlaceSection from '../formSections/placeSection/PlaceSection';
import PriceSection from '../formSections/priceSection/PriceSection';
import RegistrationSection from '../formSections/registrationSection/RegistrationSection';
import ResponsibilitiesSection from '../formSections/responsibilitiesSection/ResponsibilitiesSection';
import SummarySection from '../formSections/summarySection/SummarySection';
import TimeSection from '../formSections/timeSection/TimeSection';
import TypeSection from '../formSections/typeSection/TypeSection';
import VideoSection from '../formSections/videoSection/VideoSection';
import useEventActions from '../hooks/useEventActions';
import useEventServerErrors from '../hooks/useEventServerErrors';
import useSortedInfoLanguages from '../hooks/useSortedInfoLanguages';
import ConfirmCancelModal from '../modals/confirmCancelModal/ConfirmCancelModal';
import ConfirmDeleteModal from '../modals/confirmDeleteModal/ConfirmDeleteModal';
import ConfirmPostponeModal from '../modals/confirmPostponeModal/ConfirmPostponeModal';
import ConfirmUpdateModal from '../modals/confirmUpdateModal/ConfirmUpdateModal';
import { EventFormFields } from '../types';
import {
  checkCanUserDoAction,
  getEventFields,
  getEventInitialValues,
  scrollToFirstError,
} from '../utils';
import { draftEventSchema, publicEventSchema } from '../validation';

export type CreateEventFormProps = {
  event?: undefined;
  refetch?: undefined;
};

export type EditEventFormProps = {
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<EventQueryVariables>
  ) => Promise<ApolloQueryResult<EventQuery>>;
};

export type EventFormProps = CreateEventFormProps | EditEventFormProps;

const EventForm: React.FC<EventFormProps> = ({ event, refetch }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(
    event?.publisher ?? ''
  );

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEventServerErrors();

  const {
    closeModal,
    cancelEvent,
    createEvent,
    deleteEvent,
    openModal,
    postponeEvent,
    setOpenModal,
    saving,
    updateEvent,
  } = useEventActions(event);

  const goToEventSavedPage = (id: string) => {
    navigate(`/${locale}${ROUTES.EVENT_SAVED.replace(':id', id)}`);
  };

  const goToEventsPage = (): void => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search,
      ROUTES.SEARCH
    );

    navigate(
      {
        pathname: `/${locale}${returnPath}`,
        search: replaceParamsToEventQueryString(remainingQueryString, {
          page: null,
        }),
      },
      { state: { eventId: event?.id } }
    );
  };

  const onCancel = (eventType: string) => {
    cancelEvent({
      onError: /* istanbul ignore next */ (error) =>
        showServerErrors({
          error: error as ServerError,
          eventType,
          callbackFn: () => setOpenModal(null),
        }),
      onSuccess: async () => {
        refetch && (await refetch());
        window.scrollTo(0, 0);
      },
    });
  };

  const onCreate = (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    createEvent(values, publicationStatus, {
      onError: (error) => showServerErrors({ error, eventType: values.type }),
      onSuccess: (id?: string) => goToEventSavedPage(id as string),
    });
  };

  const onDelete = () => {
    deleteEvent({
      onSuccess: () => goToEventsPage(),
    });
  };

  const onPostpone = (eventType: string) => {
    postponeEvent({
      onError: /* istanbul ignore next */ (error) =>
        showServerErrors({
          error: error as ServerError,
          eventType,
          callbackFn: () => setOpenModal(null),
        }),
      onSuccess: async () => {
        refetch && (await refetch());
        window.scrollTo(0, 0);
      },
    });
  };

  const onUpdate = (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    updateEvent(values, publicationStatus, {
      onError: (error) =>
        showServerErrors({
          error: error as ServerError,
          eventType: values.type,
          callbackFn: () => setOpenModal(null),
        }),
      onSuccess: async () => {
        refetch && (await refetch());
        window.scrollTo(0, 0);
      },
    });
  };

  const initialValues = React.useMemo(
    () =>
      event
        ? getEventInitialValues(event)
        : {
            ...EVENT_INITIAL_VALUES,
            publisher: user?.organization ?? /* istanbul ignore next */ '',
          },
    [event, user]
  );

  const [nextPublicationStatus, setNextPublicationStatus] = React.useState(
    event?.publicationStatus as PublicationStatus
  );

  const sortedEventInfoLanguages = useSortedInfoLanguages(
    initialValues.eventInfoLanguages as LE_DATA_LANGUAGES[]
  );

  const [descriptionLanguage, setDescriptionLanguage] = React.useState(
    sortedEventInfoLanguages[0]
  );

  return (
    <Formik
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      enableReinitialize={true}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={publicEventSchema}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ values, setErrors, setTouched }) => {
        const isEventActionAllowed = (actions: EVENT_ACTIONS[]) => {
          return actions.some((action) =>
            checkCanUserDoAction({
              action,
              organizationAncestors,
              user,
              ...(event ? { event } : { publisher: values.publisher }),
            })
          );
        };

        /* istanbul ignore next */
        const isEditingAllowed = event
          ? isEventActionAllowed([
              EVENT_ACTIONS.UPDATE_DRAFT,
              EVENT_ACTIONS.UPDATE_PUBLIC,
              EVENT_ACTIONS.ACCEPT_AND_PUBLISH,
            ])
          : isEventActionAllowed([
              EVENT_ACTIONS.CREATE_DRAFT,
              EVENT_ACTIONS.PUBLISH,
            ]);

        const clearErrors = () => setErrors({});

        const handleSubmit = async (publicationStatus: PublicationStatus) => {
          try {
            setServerErrorItems([]);
            clearErrors();

            if (publicationStatus === PublicationStatus.Draft) {
              await draftEventSchema.validate(values, { abortEarly: false });
            } else {
              await publicEventSchema.validate(values, { abortEarly: false });
            }

            if (event) {
              const { publicationStatus, superEventType } = getEventFields(
                event,
                locale
              );

              if (superEventType === SuperEventType.Recurring) {
                setNextPublicationStatus(publicationStatus);
                setOpenModal(EVENT_MODALS.UPDATE);
              } else {
                onUpdate(values, publicationStatus);
              }
            } else {
              onCreate(values, publicationStatus);
            }
          } catch (error) {
            showFormErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            await scrollToFirstError({
              descriptionLanguage,
              error: error as ValidationError,
              setDescriptionLanguage,
            });
          }
        };

        const { name } = event ? getEventFields(event, locale) : { name: '' };

        return (
          <>
            {event && (
              <>
                <ConfirmCancelModal
                  event={event}
                  isOpen={openModal === EVENT_MODALS.CANCEL}
                  isSaving={saving === EVENT_ACTIONS.CANCEL}
                  onCancel={() => onCancel(values.type)}
                  onClose={closeModal}
                />
                <ConfirmDeleteModal
                  event={event}
                  isOpen={openModal === EVENT_MODALS.DELETE}
                  isSaving={saving === EVENT_ACTIONS.DELETE}
                  onClose={closeModal}
                  onDelete={onDelete}
                />
                <ConfirmPostponeModal
                  event={event}
                  isOpen={openModal === EVENT_MODALS.POSTPONE}
                  isSaving={saving === EVENT_ACTIONS.POSTPONE}
                  onClose={closeModal}
                  onPostpone={() => onPostpone(values.type)}
                />
                <ConfirmUpdateModal
                  event={event}
                  isOpen={openModal === EVENT_MODALS.UPDATE}
                  isSaving={
                    saving === EVENT_ACTIONS.ACCEPT_AND_PUBLISH ||
                    saving === EVENT_ACTIONS.UPDATE_DRAFT ||
                    saving === EVENT_ACTIONS.UPDATE_PUBLIC
                  }
                  onClose={closeModal}
                  onSave={() => onUpdate(values, nextPublicationStatus)}
                />
              </>
            )}

            <Form noValidate={true}>
              <FormikPersist
                name={FORM_NAMES.EVENT_FORM}
                isSessionStorage={true}
                restoringDisabled={!!event}
                savingDisabled={!!event}
              >
                <PageWrapper
                  {...(event
                    ? {
                        backgroundColor: 'coatOfArms',
                        className: styles.eventPage,
                        noFooter: true,
                        titleText: name,
                      }
                    : {
                        className: styles.eventPage,
                        title: `createEventPage.pageTitle.${values.type}`,
                      })}
                >
                  <MainContent>
                    <Container
                      className={event ? '' : styles.createContainer}
                      contentWrapperClassName={
                        event ? styles.editPageContentContainer : ''
                      }
                      withOffset={true}
                    >
                      <Breadcrumb
                        className={styles.breadcrumb}
                        items={[
                          { label: t('common.home'), to: ROUTES.HOME },
                          { label: t('eventsPage.title'), to: ROUTES.EVENTS },
                          {
                            active: true,
                            label: event
                              ? t(`editEventPage.title.${values.type}`)
                              : t(`createEventPage.title.${values.type}`),
                          },
                        ]}
                      />

                      <EventAuthenticationNotification event={event} />
                      {event && <EventInfo event={event} />}
                      <ServerErrorSummary errors={serverErrorItems} />

                      <Section title={t('event.form.sections.type')}>
                        <TypeSection
                          isEditingAllowed={isEditingAllowed}
                          savedEvent={event}
                        />
                      </Section>
                      <Section title={t('event.form.sections.languages')}>
                        <LanguagesSection isEditingAllowed={isEditingAllowed} />
                      </Section>
                      <Section
                        title={t('event.form.sections.responsibilities')}
                      >
                        <ResponsibilitiesSection
                          isEditingAllowed={isEditingAllowed}
                          savedEvent={event}
                        />
                      </Section>
                      <Section title={t('event.form.sections.description')}>
                        <DescriptionSection
                          isEditingAllowed={isEditingAllowed}
                          selectedLanguage={descriptionLanguage}
                          setSelectedLanguage={setDescriptionLanguage}
                        />
                      </Section>
                      <Section title={t('event.form.sections.time')}>
                        <TimeSection
                          isEditingAllowed={isEditingAllowed}
                          savedEvent={event}
                        />
                      </Section>
                      <Section title={t('event.form.sections.place')}>
                        <PlaceSection isEditingAllowed={isEditingAllowed} />
                      </Section>
                      <Section title={t('event.form.sections.price')}>
                        <PriceSection isEditingAllowed={isEditingAllowed} />
                      </Section>
                      <Section
                        title={t(`event.form.sections.channels.${values.type}`)}
                      >
                        <ChannelsSection isEditingAllowed={isEditingAllowed} />
                      </Section>
                      <Section title={t('event.form.sections.image')}>
                        <ImageSection isEditingAllowed={isEditingAllowed} />
                      </Section>
                      <Section title={t('event.form.sections.video')}>
                        <VideoSection isEditingAllowed={isEditingAllowed} />
                      </Section>
                      <Section title={t('event.form.sections.classification')}>
                        <ClassificationSection
                          isEditingAllowed={isEditingAllowed}
                        />
                      </Section>
                      <Section title={t('event.form.sections.audience')}>
                        <AudienceSection isEditingAllowed={isEditingAllowed} />
                      </Section>
                      <Section title={t('event.form.sections.additionalInfo')}>
                        <AdditionalInfoSection
                          isEditingAllowed={isEditingAllowed}
                        />
                      </Section>

                      {event ? (
                        <>
                          <RegistrationSection event={event} />
                          <Section
                            title={t('event.form.sections.linksToEvents')}
                          >
                            <LinksToEventsSection event={event} />
                          </Section>
                        </>
                      ) : (
                        <SummarySection isEditingAllowed={isEditingAllowed} />
                      )}
                    </Container>
                    {event ? (
                      <EditButtonPanel
                        event={event}
                        onCancel={() => setOpenModal(EVENT_MODALS.CANCEL)}
                        onDelete={() => setOpenModal(EVENT_MODALS.DELETE)}
                        onPostpone={() => setOpenModal(EVENT_MODALS.POSTPONE)}
                        onUpdate={handleSubmit}
                        saving={saving}
                      />
                    ) : (
                      <CreateButtonPanel
                        onSubmit={handleSubmit}
                        publisher={values.publisher}
                        saving={saving}
                      />
                    )}
                  </MainContent>
                </PageWrapper>
              </FormikPersist>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default EventForm;
