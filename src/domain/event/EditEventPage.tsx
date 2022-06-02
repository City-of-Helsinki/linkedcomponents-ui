/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { ValidationError } from 'yup';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../common/components/serverErrorSummary/ServerErrorSummary';
import { LE_DATA_LANGUAGES, ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  EventQuery,
  EventQueryVariables,
  PublicationStatus,
  SuperEventType,
  useEventQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import extractLatestReturnPath from '../../utils/extractLatestReturnPath';
import getPathBuilder from '../../utils/getPathBuilder';
import isTestEnv from '../../utils/isTestEnv';
import { showFormErrors } from '../../utils/validationUtils';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import Section from '../app/layout/section/Section';
import { replaceParamsToEventQueryString } from '../events/utils';
import NotFound from '../notFound/NotFound';
import useOrganizationAncestors from '../organization/hooks/useOrganizationAncestors';
import useUser from '../user/hooks/useUser';
import { EVENT_EDIT_ACTIONS, EVENT_INCLUDES } from './constants';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import AuthenticationNotification from './eventAuthenticationNotification/EventAuthenticationNotification';
import EventInfo from './eventInfo/EventInfo';
import styles from './eventPage.module.scss';
import AdditionalInfoSection from './formSections/additionalInfoSection/AdditionalInfoSection';
import AudienceSection from './formSections/audienceSection/AudienceSection';
import ChannelsSection from './formSections/channelsSection/ChannelsSection';
import ClassificationSection from './formSections/classificationSection/ClassificationSection';
import DescriptionSection from './formSections/descriptionSection/DescriptionSection';
import ImageSection from './formSections/imageSection/ImageSection';
import LanguagesSection from './formSections/languagesSection/LanguagesSection';
import LinksToEventsSection from './formSections/linksToEventsSection/LinksToEventsSection';
import PlaceSection from './formSections/placeSection/PlaceSection';
import PriceSection from './formSections/priceSection/PriceSection';
import ResponsibilitiesSection from './formSections/responsibilitiesSection/ResponsibilitiesSection';
import TimeSection from './formSections/timeSection/TimeSection';
import TypeSection from './formSections/typeSection/TypeSection';
import VideoSection from './formSections/videoSection/VideoSection';
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';
import useEventServerErrors from './hooks/useEventServerErrors';
import useEventUpdateActions, { MODALS } from './hooks/useEventUpdateActions';
import useRelatedEvents from './hooks/useRelatedEvents';
import useSortedInfoLanguages from './hooks/useSortedInfoLanguages';
import ConfirmCancelModal from './modals/confirmCancelModal/ConfirmCancelModal';
import ConfirmDeleteModal from './modals/confirmDeleteModal/ConfirmDeleteModal';
import ConfirmPostponeModal from './modals/confirmPostponeModal/ConfirmPostponeModal';
import ConfirmUpdateModal from './modals/confirmUpdateModal/ConfirmUpdateModal';
import { EventFormFields } from './types';
import {
  checkCanUserDoAction,
  draftEventSchema,
  eventPathBuilder,
  getEventFields,
  getEventInitialValues,
  publicEventSchema,
  scrollToFirstError,
} from './utils';

interface EditEventPageProps {
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<EventQueryVariables>
  ) => Promise<ApolloQueryResult<EventQuery>>;
}

const EditEventPage: React.FC<EditEventPageProps> = ({ event, refetch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const { user } = useUser();
  const { organizationAncestors } = useOrganizationAncestors(
    event.publisher as string
  );
  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEventServerErrors();
  const { name, publicationStatus, superEventType } = getEventFields(
    event,
    locale
  );

  const [nextPublicationStatus, setNextPublicationStatus] =
    React.useState(publicationStatus);

  const {
    cancelEvent,
    closeModal,
    deleteEvent,
    saving,
    openModal,
    postponeEvent,
    setOpenModal,
    updateEvent,
  } = useEventUpdateActions({ event });

  const initialValues = React.useMemo(
    () => getEventInitialValues(event),
    [event]
  );

  const [descriptionLanguage, setDescriptionLanguage] = React.useState(
    initialValues.eventInfoLanguages[0] as LE_DATA_LANGUAGES
  );

  // Prefetch all related events which are used when postpone/delete/cancel events
  useRelatedEvents(event, isTestEnv);

  const goToEventsPage = () => {
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
      { state: { eventId: event.id } }
    );
  };

  const onCancel = (eventType: string) => {
    cancelEvent({
      onError: /* istanbul ignore next */ (error: any) =>
        showServerErrors({
          error,
          eventType,
          callbackFn: () => setOpenModal(null),
        }),
      onSuccess: async () => {
        await refetch();
        window.scrollTo(0, 0);
      },
    });
  };

  const onDelete = () => {
    deleteEvent({
      onSuccess: () => goToEventsPage(),
    });
  };

  const onPostpone = (eventType: string) => {
    postponeEvent({
      onError: /* istanbul ignore next */ (error: any) =>
        showServerErrors({
          error,
          eventType,
          callbackFn: () => setOpenModal(null),
        }),
      onSuccess: async () => {
        await refetch();
        window.scrollTo(0, 0);
      },
    });
  };

  const onUpdate = (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    updateEvent(values, publicationStatus, {
      onError: (error: any) =>
        showServerErrors({
          error,
          eventType: values.type,
          callbackFn: () => setOpenModal(null),
        }),
      onSuccess: async () => {
        await refetch();
        window.scrollTo(0, 0);
      },
    });
  };

  const sortedEventInfoLanguages = useSortedInfoLanguages(
    initialValues.eventInfoLanguages as LE_DATA_LANGUAGES[]
  );

  React.useEffect(() => {
    setDescriptionLanguage(sortedEventInfoLanguages[0]);
  }, [sortedEventInfoLanguages]);

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
        const isEventActionAllowed = (action: EVENT_EDIT_ACTIONS) => {
          return checkCanUserDoAction({
            action,
            event,
            organizationAncestors,
            user,
          });
        };

        /* istanbul ignore next */
        const isEditingAllowed =
          isEventActionAllowed(EVENT_EDIT_ACTIONS.UPDATE_DRAFT) ||
          isEventActionAllowed(EVENT_EDIT_ACTIONS.UPDATE_PUBLIC) ||
          isEventActionAllowed(EVENT_EDIT_ACTIONS.PUBLISH);

        const clearErrors = () => setErrors({});
        const handleUpdate = async (publicationStatus: PublicationStatus) => {
          try {
            setServerErrorItems([]);
            clearErrors();

            if (publicationStatus === PublicationStatus.Draft) {
              await draftEventSchema.validate(values, { abortEarly: false });
            } else {
              await publicEventSchema.validate(values, { abortEarly: false });
            }

            if (superEventType === SuperEventType.Recurring) {
              setNextPublicationStatus(publicationStatus);
              setOpenModal(MODALS.UPDATE);
            } else {
              onUpdate(values, publicationStatus);
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

        return (
          <>
            <ConfirmCancelModal
              event={event}
              isOpen={openModal === MODALS.CANCEL}
              isSaving={saving === EVENT_EDIT_ACTIONS.CANCEL}
              onCancel={() => onCancel(values.type)}
              onClose={closeModal}
            />
            <ConfirmDeleteModal
              event={event}
              isOpen={openModal === MODALS.DELETE}
              isSaving={saving === EVENT_EDIT_ACTIONS.DELETE}
              onClose={closeModal}
              onDelete={onDelete}
            />
            <ConfirmPostponeModal
              event={event}
              isOpen={openModal === MODALS.POSTPONE}
              isSaving={saving === EVENT_EDIT_ACTIONS.POSTPONE}
              onClose={closeModal}
              onPostpone={() => onPostpone(values.type)}
            />
            <ConfirmUpdateModal
              event={event}
              isOpen={openModal === MODALS.UPDATE}
              isSaving={
                saving === EVENT_EDIT_ACTIONS.PUBLISH ||
                saving === EVENT_EDIT_ACTIONS.UPDATE_DRAFT ||
                saving === EVENT_EDIT_ACTIONS.UPDATE_PUBLIC
              }
              onClose={closeModal}
              onSave={() => onUpdate(values, nextPublicationStatus)}
            />
            <Form noValidate={true}>
              <PageWrapper
                backgroundColor="coatOfArms"
                className={styles.eventPage}
                noFooter
                titleText={name}
              >
                <MainContent>
                  <Container
                    contentWrapperClassName={styles.editPageContentContainer}
                    withOffset={true}
                  >
                    <Breadcrumb className={styles.breadcrumb}>
                      <Breadcrumb.Item to={ROUTES.HOME}>
                        {t('common.home')}
                      </Breadcrumb.Item>
                      <Breadcrumb.Item to={ROUTES.EVENTS}>
                        {t('eventsPage.title')}
                      </Breadcrumb.Item>
                      <Breadcrumb.Item active={true}>
                        {t(`editEventPage.title.${values.type}`)}
                      </Breadcrumb.Item>
                    </Breadcrumb>

                    <AuthenticationNotification event={event} />

                    <EventInfo event={event} />
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
                    <Section title={t('event.form.sections.responsibilities')}>
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
                    <Section title={t('event.form.sections.linksToEvents')}>
                      <LinksToEventsSection event={event} />
                    </Section>
                  </Container>
                  <EditButtonPanel
                    event={event}
                    onCancel={() => setOpenModal(MODALS.CANCEL)}
                    onDelete={() => setOpenModal(MODALS.DELETE)}
                    onPostpone={() => setOpenModal(MODALS.POSTPONE)}
                    onUpdate={handleUpdate}
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

const EditEventPageWrapper: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { loading: loadingUser } = useUser();

  const {
    data: eventData,
    loading: loadingEvent,
    refetch,
  } = useEventQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: loadingUser,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id: id as string,
      include: EVENT_INCLUDES,
    },
  });

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading: loadingEventFieldOptions } = useEventFieldOptionsData();
  const loading = loadingEvent || loadingEventFieldOptions || loadingUser;

  return (
    <LoadingSpinner isLoading={loading}>
      {eventData?.event ? (
        <EditEventPage event={eventData.event} refetch={refetch} />
      ) : (
        <NotFound pathAfterSignIn={`${location.pathname}${location.search}`} />
      )}
    </LoadingSpinner>
  );
};

export default EditEventPageWrapper;
