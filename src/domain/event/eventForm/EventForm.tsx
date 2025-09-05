/* eslint-disable max-len */
import { ApolloQueryResult, ServerError } from '@apollo/client';
import { Form, Formik, FormikErrors, FormikTouched, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ValidationError } from 'yup';

import Breadcrumb from '../../../common/components/breadcrumb/Breadcrumb';
import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import Notification from '../../../common/components/notification/Notification';
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
import getValue from '../../../utils/getValue';
import { showFormErrors } from '../../../utils/validationUtils';
import Container from '../../app/layout/container/Container';
import MainContent from '../../app/layout/mainContent/MainContent';
import PageWrapper from '../../app/layout/pageWrapper/PageWrapper';
import Section from '../../app/layout/section/Section';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { replaceParamsToEventQueryString } from '../../events/utils';
import { EXTERNAL_PUBLISHER_ID } from '../../organization/constants';
import useOrganizationAncestors from '../../organization/hooks/useOrganizationAncestors';
import { isAdminUserInOrganization } from '../../organization/utils';
import useUser from '../../user/hooks/useUser';
import { areRegistrationRoutesAllowed } from '../../user/permissions';
import {
  EVENT_ACTIONS,
  EVENT_EXTERNAL_USER_INITIAL_VALUES,
  EVENT_FIELDS,
  EVENT_INITIAL_VALUES,
  EVENT_MODALS,
  EVENT_TYPE,
  PUBLICATION_LIST_LINKS,
} from '../constants';
import CreateButtonPanel from '../createButtonPanel/CreateButtonPanel';
import EditButtonPanel from '../editButtonPanel/EditButtonPanel';
import EventAuthenticationNotification from '../eventAuthenticationNotification/EventAuthenticationNotification';
import EventInfo from '../eventInfo/EventInfo';
import styles from '../eventPage.module.scss';
import AdditionalInfoSection from '../formSections/additionalInfoSection/AdditionalInfoSection';
import AudienceInstructions from '../formSections/audienceSection/audienceInstructions/AudienceInstructions';
import AudienceSection from '../formSections/audienceSection/AudienceSection';
import ChannelsSection from '../formSections/channelsSection/ChannelsSection';
import ClassificationSection from '../formSections/classificationSection/ClassificationSection';
import DescriptionInstructions from '../formSections/descriptionSection/descriptionInstructions/DescriptionInstructions';
import DescriptionSection from '../formSections/descriptionSection/DescriptionSection';
import EventStateInfoSection from '../formSections/eventStateInfoSection/EventStateInfoSection';
import ExternalUserContact from '../formSections/externalUserContact/ExternalUserContact';
import ImageSection from '../formSections/imageSection/ImageSection';
import LanguagesSection from '../formSections/languagesSection/LanguagesSection';
import LinksToEventsSection from '../formSections/linksToEventsSection/LinksToEventsSection';
import LocationInstructions from '../formSections/placeSection/locationInstructions/LocationInstructions';
import PlaceSection from '../formSections/placeSection/PlaceSection';
import PriceSection from '../formSections/priceSection/PriceSection';
import RegistrationSection from '../formSections/registrationSection/RegistrationSection';
import ResponsibilitiesSection from '../formSections/responsibilitiesSection/ResponsibilitiesSection';
import SummarySection from '../formSections/summarySection/SummarySection';
import TimeInstructions from '../formSections/timeSection/timeInstructions/TimeInstructions';
import TimeSection from '../formSections/timeSection/TimeSection';
import PublicationListLinks from '../formSections/typeSection/publicationListLinks/PublicationListLinks';
import TypeSection from '../formSections/typeSection/TypeSection';
import VideoSection from '../formSections/videoSection/VideoSection';
import useEventActions from '../hooks/useEventActions';
import useEventServerErrors from '../hooks/useEventServerErrors';
import useMainCategories from '../hooks/useMainCategories';
import useSortedInfoLanguages from '../hooks/useSortedInfoLanguages';
import ConfirmCancelEventModal from '../modals/confirmCancelEventModal/ConfirmCancelEventModal';
import ConfirmDeleteEventModal from '../modals/confirmDeleteEventModal/ConfirmDeleteEventModal';
import ConfirmPostponeEventModal from '../modals/confirmPostponeEventModal/ConfirmPostponeEventModal';
import ConfirmUpdateEventModal from '../modals/confirmUpdateEventModal/ConfirmUpdateEventModal';
import { EventFormFields } from '../types';
import {
  checkCanUserDoAction,
  getEventFields,
  getEventInitialValues,
  scrollToFirstEventError,
  shouldShowTypeSection,
  showTooltipInstructions,
} from '../utils';
import {
  draftEventSchema,
  externalUserEventSchema,
  publicEventSchema,
} from '../validation';

export type CreateEventFormProps = {
  event?: null;
  refetch?: null;
};

export type EditEventFormProps = {
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<EventQueryVariables>
  ) => Promise<ApolloQueryResult<EventQuery>>;
};

export type EventFormWrapperProps = CreateEventFormProps | EditEventFormProps;

type EventFormProps = EventFormWrapperProps & {
  initialValues: EventFormFields;
  setErrors: (errors: FormikErrors<EventFormFields>) => void;
  setTouched: (
    touched: FormikTouched<EventFormFields>,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<EventFormFields>>;
  values: EventFormFields;
  isExternalUser: boolean;
};

const EventForm: React.FC<EventFormProps> = ({
  event,
  initialValues,
  refetch,
  setErrors,
  setTouched,
  values,
  isExternalUser,
}) => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const locale = useLocale();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useUser();

  const { organizationAncestors } = useOrganizationAncestors(
    getValue(event?.publisher, '')
  );

  const isAdminUser = isAdminUserInOrganization({
    id: getValue(event?.publisher, ''),
    organizationAncestors,
    user,
  });

  const mainCategories = useMainCategories(values.type as EVENT_TYPE);

  const [, , { setValue: setMainCategories }] = useField<string[]>({
    name: EVENT_FIELDS.MAIN_CATEGORIES,
  });
  const [{ value: eventType }] = useField<EVENT_TYPE>({
    name: EVENT_FIELDS.TYPE,
  });

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

  const handleCancel = (eventType: string) => {
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
        addNotification({
          label: t('event.form.notificationEventCancelled'),
          type: 'success',
        });
      },
    });
  };

  const handleCreate = (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    createEvent(values, publicationStatus, {
      onError: (error) => showServerErrors({ error, eventType: values.type }),
      onSuccess: (id) => goToEventSavedPage(getValue(id, '')),
    });
  };

  const handleDelete = () => {
    deleteEvent({
      onSuccess: () => {
        goToEventsPage();
        addNotification({
          label: t('event.form.notificationEventDeleted'),
          type: 'success',
        });
      },
    });
  };

  const handlePostpone = (eventType: string) => {
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
        addNotification({
          label: t('event.form.notificationEventPostponed'),
          type: 'success',
        });
      },
    });
  };

  const handleUpdate = (
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
        addNotification({
          label: t('event.form.notificationEventUpdated'),
          type: 'success',
        });
      },
    });
  };

  const [nextPublicationStatus, setNextPublicationStatus] = React.useState(
    event?.publicationStatus as PublicationStatus
  );

  const sortedEventInfoLanguages = useSortedInfoLanguages(
    initialValues.eventInfoLanguages as LE_DATA_LANGUAGES[]
  );

  const [descriptionLanguage, setDescriptionLanguage] = React.useState(
    sortedEventInfoLanguages[0]
  );

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
    : isEventActionAllowed([EVENT_ACTIONS.CREATE_DRAFT, EVENT_ACTIONS.PUBLISH]);

  const clearErrors = () => setErrors({});

  const handleSubmit = async (publicationStatus: PublicationStatus) => {
    try {
      const valuesWithMainCategories = { ...values, mainCategories };
      setServerErrorItems([]);
      clearErrors();

      if (isExternalUser) {
        await externalUserEventSchema.validate(valuesWithMainCategories, {
          abortEarly: false,
        });
      } else if (publicationStatus === PublicationStatus.Draft) {
        await draftEventSchema.validate(valuesWithMainCategories, {
          abortEarly: false,
        });
      } else {
        await publicEventSchema.validate(valuesWithMainCategories, {
          abortEarly: false,
        });
      }

      if (event) {
        const { superEventType } = getEventFields(event, locale);

        if (superEventType === SuperEventType.Recurring) {
          setNextPublicationStatus(publicationStatus);
          setOpenModal(EVENT_MODALS.UPDATE);
        } else {
          handleUpdate(values, publicationStatus);
        }
      } else {
        handleCreate(values, publicationStatus);
      }
    } catch (error) {
      showFormErrors({
        error: error as ValidationError,
        setErrors,
        setTouched,
      });

      await scrollToFirstEventError({
        descriptionLanguage,
        error: error as ValidationError,
        setDescriptionLanguage,
      });
    }
  };

  React.useEffect(() => {
    setMainCategories(mainCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategories]);

  const { name } = event ? getEventFields(event, locale) : { name: '' };

  return (
    <>
      {event && (
        <>
          <ConfirmCancelEventModal
            event={event}
            isOpen={openModal === EVENT_MODALS.CANCEL}
            isSaving={saving === EVENT_ACTIONS.CANCEL}
            onClose={closeModal}
            onConfirm={() => handleCancel(values.type)}
          />
          <ConfirmDeleteEventModal
            event={event}
            isOpen={openModal === EVENT_MODALS.DELETE}
            isSaving={saving === EVENT_ACTIONS.DELETE}
            onClose={closeModal}
            onConfirm={handleDelete}
          />
          <ConfirmPostponeEventModal
            event={event}
            isOpen={openModal === EVENT_MODALS.POSTPONE}
            isSaving={saving === EVENT_ACTIONS.POSTPONE}
            onClose={closeModal}
            onConfirm={() => handlePostpone(values.type)}
          />
          <ConfirmUpdateEventModal
            event={event}
            isOpen={openModal === EVENT_MODALS.UPDATE}
            isSaving={
              saving === EVENT_ACTIONS.ACCEPT_AND_PUBLISH ||
              saving === EVENT_ACTIONS.UPDATE_DRAFT ||
              saving === EVENT_ACTIONS.UPDATE_PUBLIC
            }
            onClose={closeModal}
            onConfirm={() => handleUpdate(values, nextPublicationStatus)}
          />
        </>
      )}

      <Form noValidate={true}>
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
              <div className={styles.breadcrumb}>
                <Breadcrumb
                  list={[
                    { title: t('common.home'), path: ROUTES.HOME },
                    { title: t('eventsPage.title'), path: ROUTES.EVENTS },
                    {
                      title: event
                        ? t(`editEventPage.title.${values.type}`)
                        : t(`createEventPage.title.${values.type}`),
                      path: null,
                    },
                  ]}
                />
              </div>

              <EventAuthenticationNotification event={event} />
              {event && <EventInfo event={event} />}
              <ServerErrorSummary errors={serverErrorItems} />

              <Notification
                className={styles.publicationNotification}
                label={t('event.form.notificationTitlePublication')}
                type="info"
              >
                <p>
                  {t(`event.form.infoTextPublication.paragraph1.${eventType}`)}
                </p>
                <p>
                  {t('event.form.infoTextPublication.paragraph2.sentence1')}{' '}
                  <PublicationListLinks
                    links={PUBLICATION_LIST_LINKS[eventType]}
                  />{' '}
                  {t('event.form.infoTextPublication.paragraph2.sentence2')}
                </p>
                <p>
                  {t(
                    `event.form.infoTextPublication.paragraph3.sentence1.${eventType}`
                  )}{' '}
                  {t('event.form.infoTextPublication.paragraph3.sentence2')}
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: t(`event.form.infoTextPublication.paragraph4`, {
                      openInNewTab: t('common.openInNewTab'),
                    }),
                  }}
                ></p>
                {isExternalUser && (
                  <p>
                    <strong>{t('event.form.eventDraftStateInfo')}</strong>
                  </p>
                )}
              </Notification>

              {shouldShowTypeSection({
                event,
                organizationAncestors,
                user,
              }) && (
                <Section title={t('event.form.sections.type')}>
                  <TypeSection
                    isEditingAllowed={isEditingAllowed}
                    isExternalUser={isExternalUser}
                    savedEvent={event}
                  />
                </Section>
              )}

              <Section title={t('event.form.sections.languages')}>
                <LanguagesSection isEditingAllowed={isEditingAllowed} />
              </Section>
              <Section title={t('event.form.sections.responsibilities')}>
                <ResponsibilitiesSection
                  isEditingAllowed={isEditingAllowed}
                  isExternalUser={isExternalUser}
                  savedEvent={event}
                />
              </Section>
              <Section
                showTooltip={showTooltipInstructions(user)}
                title={t('event.form.sections.description')}
                tooltipContent={
                  <DescriptionInstructions eventType={eventType} />
                }
              >
                <DescriptionSection
                  isEditingAllowed={isEditingAllowed}
                  isExternalUser={isExternalUser}
                  selectedLanguage={descriptionLanguage}
                  setSelectedLanguage={setDescriptionLanguage}
                />
              </Section>
              <Section
                showTooltip={showTooltipInstructions(user)}
                title={t('event.form.sections.time')}
                tooltipContent={<TimeInstructions eventType={eventType} />}
                tooltipLabel={t(
                  `event.form.notificationTitleEventTimes.${eventType}`
                )}
              >
                <TimeSection
                  isEditingAllowed={isEditingAllowed}
                  savedEvent={event}
                />
              </Section>
              <Section
                showTooltip={showTooltipInstructions(user)}
                title={t('event.form.sections.place')}
                tooltipContent={<LocationInstructions eventType={eventType} />}
                tooltipLabel={t('event.form.notificationTitleLocation')}
              >
                <PlaceSection
                  isEditingAllowed={isEditingAllowed}
                  isExternalUser={isExternalUser}
                />
              </Section>
              <Section title={t('event.form.sections.price')}>
                <PriceSection
                  event={event}
                  isEditingAllowed={isEditingAllowed}
                  isAdminUser={isAdminUser}
                />
              </Section>
              <Section title={t(`event.form.sections.channels.${values.type}`)}>
                <ChannelsSection isEditingAllowed={isEditingAllowed} />
              </Section>
              <Section title={t('event.form.sections.image')}>
                <ImageSection isEditingAllowed={isEditingAllowed} />
              </Section>
              <Section title={t('event.form.sections.video')}>
                <VideoSection isEditingAllowed={isEditingAllowed} />
              </Section>
              <Section title={t('event.form.sections.classification')}>
                <ClassificationSection isEditingAllowed={isEditingAllowed} />
              </Section>
              <Section
                showTooltip={showTooltipInstructions(user)}
                title={t('event.form.sections.audience')}
                tooltipContent={<AudienceInstructions eventType={eventType} />}
                tooltipLabel={t(`event.form.titleAudience`)}
              >
                <AudienceSection isEditingAllowed={isEditingAllowed} />
              </Section>
              <Section title={t('event.form.sections.additionalInfo')}>
                <AdditionalInfoSection
                  isEditingAllowed={isEditingAllowed}
                  isExternalUser={isExternalUser}
                />
              </Section>
              {(isExternalUser ||
                (isAdminUser &&
                  event?.publisher === EXTERNAL_PUBLISHER_ID)) && (
                <Section title={t('event.form.sections.contact')}>
                  <ExternalUserContact
                    isEditingAllowed={isEditingAllowed && !isAdminUser}
                  />
                </Section>
              )}
              {event ? (
                <>
                  {areRegistrationRoutesAllowed(user) && (
                    <RegistrationSection event={event} />
                  )}
                  <Section title={t('event.form.sections.linksToEvents')}>
                    <LinksToEventsSection event={event} />
                  </Section>
                </>
              ) : (
                <>
                  <SummarySection isEditingAllowed={isEditingAllowed} />
                  {isExternalUser && (
                    <EventStateInfoSection
                      text={t('event.form.eventDraftStateInfo')}
                    />
                  )}
                </>
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
      </Form>
    </>
  );
};

const EventFormWrapper: React.FC<EventFormWrapperProps> = (props) => {
  const { event } = props;
  const { user, externalUser } = useUser();

  const eventInitialValues = externalUser
    ? EVENT_EXTERNAL_USER_INITIAL_VALUES
    : EVENT_INITIAL_VALUES;

  const initialValues = React.useMemo(
    () =>
      event
        ? getEventInitialValues(event)
        : {
            ...eventInitialValues,
            publisher: getValue(user?.organization, ''),
          },
    [event, eventInitialValues, user]
  );

  const validationSchema = externalUser
    ? externalUserEventSchema
    : publicEventSchema;

  return (
    <Formik
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      enableReinitialize={true}
      onSubmit={
        /* istanbul ignore next */
        () => undefined
      }
      validationSchema={validationSchema}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={false}
    >
      {({ setErrors, setTouched, values }) => {
        return (
          <FormikPersist
            name={FORM_NAMES.EVENT_FORM}
            isSessionStorage={true}
            restoringDisabled={!!event}
            savingDisabled={!!event}
          >
            <EventForm
              {...props}
              initialValues={initialValues}
              setErrors={setErrors}
              setTouched={setTouched}
              values={values}
              isExternalUser={externalUser}
            />
          </FormikPersist>
        );
      }}
    </Formik>
  );
};

export default EventFormWrapper;
