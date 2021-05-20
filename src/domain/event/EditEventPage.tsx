import { ApolloQueryResult } from '@apollo/client';
import { Form, Formik } from 'formik';
import debounce from 'lodash/debounce';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  EventQuery,
  EventQueryVariables,
  PublicationStatus,
  SuperEventType,
  useEventQuery,
} from '../../generated/graphql';
import useIsMounted from '../../hooks/useIsMounted';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { EventsLocationState } from '../eventSearch/types';
import {
  extractLatestReturnPath,
  replaceParamsToEventQueryString,
} from '../eventSearch/utils';
import NotFound from '../notFound/NotFound';
import useUser from '../user/hooks/useUser';
import {
  EVENT_EDIT_ACTIONS,
  EVENT_INCLUDES,
  EVENT_INFO_LANGUAGES,
} from './constants';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import EventHierarchy from './eventHierarchy/EventHierarchy';
import EventInfo from './EventInfo';
import styles from './eventPage.module.scss';
import AdditionalInfoSection from './formSections/additionalInfoSection/AdditionalInfoSection';
import AudienceSection from './formSections/audienceSection/AudienceSection';
import ChannelsSection from './formSections/channelsSection/ChannelsSection';
import ClassificationSection from './formSections/classificationSection/ClassificationSection';
import DescriptionSection from './formSections/descriptionSection/DescriptionSection';
import ImageSection from './formSections/imageSection/ImageSection';
import LanguagesSection from './formSections/languagesSection/LanguagesSection';
import PlaceSection from './formSections/placeSection/PlaceSection';
import PriceSection from './formSections/priceSection/PriceSection';
import ResponsibilitiesSection from './formSections/responsibilitiesSection/ResponsibilitiesSection';
import TimeSection from './formSections/timeSection/TimeSection';
import TypeSection from './formSections/typeSection/TypeSection';
import VideoSection from './formSections/videoSection/VideoSection';
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';
import useEventUpdateActions, { MODALS } from './hooks/useEventUpdateActions';
import useRelatedEvents from './hooks/useRelatedEvents';
import useSortedInfoLanguages from './hooks/useSortedInfoLanguages';
import Section from './layout/Section';
import ConfirmCancelModal from './modals/ConfirmCancelModal';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import ConfirmPostponeModal from './modals/ConfirmPostponeModal';
import ConfirmUpdateModal from './modals/ConfirmUpdateModal';
import { EventFormFields } from './types';
import {
  draftEventSchema,
  eventPathBuilder,
  getEventFields,
  getEventInitialValues,
  publicEventSchema,
  showErrors,
} from './utils';

interface EditEventPageProps {
  event: EventFieldsFragment;
  refetch: (
    variables?: Partial<EventQueryVariables>
  ) => Promise<ApolloQueryResult<EventQuery>>;
}

const EditEventPage: React.FC<EditEventPageProps> = ({ event, refetch }) => {
  const { t } = useTranslation();
  const history = useHistory<EventsLocationState>();
  const location = useLocation();
  const locale = useLocale();
  const { id, name, publicationStatus, superEventType } = getEventFields(
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

  const initialValues = React.useMemo(() => {
    return getEventInitialValues(event);
  }, [event]);

  const [descriptionLanguage, setDescriptionLanguage] = React.useState(
    initialValues.eventInfoLanguages[0] as EVENT_INFO_LANGUAGES
  );

  // Prefetch all related events which are used when postpone/delete/cancel events
  useRelatedEvents(event);

  const goToEventsPage = () => {
    const { returnPath, remainingQueryString } = extractLatestReturnPath(
      location.search
    );
    history.push({
      pathname: `/${locale}${returnPath}`,
      search: replaceParamsToEventQueryString(remainingQueryString, {
        page: null,
      }),
      state: { eventId: event.id },
    });
    history.push(`/${locale}${ROUTES.EVENTS}`);
  };

  const onCancel = () => {
    cancelEvent({
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

  const onPostpone = () => {
    postponeEvent({
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
      onSuccess: async () => {
        await refetch();
        window.scrollTo(0, 0);
      },
    });
  };

  const sortedEventInfoLanguages = useSortedInfoLanguages(
    initialValues.eventInfoLanguages as EVENT_INFO_LANGUAGES[]
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
      {({ values: { type, ...restValues }, setErrors, setTouched }) => {
        const clearErrors = () => {
          setErrors({});
        };

        const handleUpdate = async (publicationStatus: PublicationStatus) => {
          const values = { type, ...restValues };
          try {
            clearErrors();
            if (publicationStatus === PublicationStatus.Draft) {
              await draftEventSchema.validate(values, {
                abortEarly: false,
              });
            } else {
              await publicEventSchema.validate(values, {
                abortEarly: false,
              });
            }

            clearErrors();

            if (superEventType === SuperEventType.Recurring) {
              setNextPublicationStatus(publicationStatus);
              setOpenModal(MODALS.UPDATE);
            } else {
              onUpdate(values, publicationStatus);
            }
          } catch (error) {
            showErrors({
              descriptionLanguage,
              error,
              setErrors,
              setDescriptionLanguage,
              setTouched,
            });
          }
        };

        return (
          <>
            <ConfirmCancelModal
              event={event}
              isOpen={openModal === MODALS.CANCEL}
              isSaving={saving === EVENT_EDIT_ACTIONS.CANCEL}
              onCancel={onCancel}
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
              onPostpone={onPostpone}
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
              onSave={() => {
                const values = { type, ...restValues };

                onUpdate(values, nextPublicationStatus);
              }}
            />
            <Form noValidate={true}>
              <PageWrapper
                backgroundColor="coatOfArms"
                className={styles.eventPage}
                noFooter
                title={name}
              >
                <MainContent>
                  <Container
                    contentWrapperClassName={styles.editPageContentContainer}
                    withOffset={true}
                  >
                    <EventInfo event={event} />

                    <Section title={t('event.form.sections.type')}>
                      <TypeSection savedEvent={event} />
                    </Section>
                    <Section title={t('event.form.sections.languages')}>
                      <LanguagesSection />
                    </Section>
                    <Section title={t('event.form.sections.responsibilities')}>
                      <ResponsibilitiesSection savedEvent={event} />
                    </Section>
                    <Section title={t('event.form.sections.description')}>
                      <DescriptionSection
                        selectedLanguage={descriptionLanguage}
                        setSelectedLanguage={setDescriptionLanguage}
                      />
                    </Section>
                    <Section title={t('event.form.sections.time')}>
                      <TimeSection savedEvent={event} />
                    </Section>
                    <Section title={t('event.form.sections.place')}>
                      <PlaceSection />
                    </Section>
                    <Section title={t('event.form.sections.price')}>
                      <PriceSection />
                    </Section>
                    <Section title={t(`event.form.sections.channels.${type}`)}>
                      <ChannelsSection />
                    </Section>
                    <Section title={t('event.form.sections.image')}>
                      <ImageSection />
                    </Section>
                    <Section title={t('event.form.sections.video')}>
                      <VideoSection />
                    </Section>
                    <Section title={t('event.form.sections.classification')}>
                      <ClassificationSection />
                    </Section>
                    <Section title={t('event.form.sections.audience')}>
                      <AudienceSection />
                    </Section>
                    <Section title={t('event.form.sections.additionalInfo')}>
                      <AdditionalInfoSection />
                    </Section>
                    <Section title={t('event.form.sections.linksToEvents')}>
                      <EventHierarchy
                        event={event}
                        eventNameRenderer={(item) => {
                          const {
                            eventUrl,
                            id: itemId,
                            name,
                          } = getEventFields(item, locale);
                          if (id === itemId) {
                            return <>{name}</>;
                          }
                          return (
                            <Link
                              className={styles.hierarchyLink}
                              to={{
                                pathname: eventUrl,
                                search: location.search,
                              }}
                            >
                              {name}
                            </Link>
                          );
                        }}
                        showSuperEvent={true}
                      />
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

const LOADING_USER_DEBOUNCE_TIME = 50;

const EditEventPageWrapper: React.FC = () => {
  const isMounted = useIsMounted();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { loading: loadingUser } = useUser();

  const [debouncedLoadingUser, setDebouncedLoadingUser] =
    React.useState(loadingUser);

  const debouncedSetLoading = React.useMemo(
    () =>
      debounce((loading: boolean) => {
        /* istanbul ignore next */
        if (!isMounted.current) return;

        setDebouncedLoadingUser(loading);
      }, LOADING_USER_DEBOUNCE_TIME),
    [isMounted]
  );

  const handleLoadingUserChange = React.useCallback(
    (loading: boolean) => {
      /* istanbul ignore next */
      debouncedSetLoading(loading);
    },
    [debouncedSetLoading]
  );

  React.useEffect(() => {
    handleLoadingUserChange(loadingUser);
  }, [handleLoadingUserChange, loadingUser]);

  const {
    data: eventData,
    loading: loadingEvent,
    refetch,
  } = useEventQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: debouncedLoadingUser,
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id,
      include: EVENT_INCLUDES,
    },
  });

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading: loadingEventFieldOptions } = useEventFieldOptionsData();

  const loading =
    loadingEvent || loadingEventFieldOptions || debouncedLoadingUser;

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
