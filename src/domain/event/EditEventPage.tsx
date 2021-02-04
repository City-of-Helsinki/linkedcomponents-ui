import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ROUTES } from '../../constants';
import {
  EventFieldsFragment,
  PublicationStatus,
  SuperEventType,
  useEventQuery,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import { resetEventListPage } from '../events/utils';
import NotFound from '../notFound/NotFound';
import { EVENT_INCLUDES } from './constants';
import EditButtonPanel from './editButtonPanel/EditButtonPanel';
import EventHierarchy from './eventHierarchy/EventHierarchy';
import EventInfo from './EventInfo';
import styles from './eventPage.module.scss';
import AdditionalInfoSection from './formSections/additionalInfoSection/AdditionalInfoSection';
import AudienceSection from './formSections/audienceSection/AudienceSection';
import ClassificationSection from './formSections/classificationSection/ClassificationSection';
import DescriptionSection from './formSections/descriptionSection/DescriptionSection';
import ImageSection from './formSections/imageSection/ImageSection';
import LanguagesSection from './formSections/languagesSection/LanguagesSection';
import PlaceSection from './formSections/placeSection/PlaceSection';
import PriceSection from './formSections/priceSection/PriceSection';
import ResponsibilitiesSection from './formSections/responsibilitiesSection/ResponsibilitiesSection';
import SocialMediaSection from './formSections/socialMediaSection/SocialMediaSection';
import TimeSection from './formSections/timeSection/TimeSection';
import TypeSection from './formSections/typeSection/TypeSection';
import useEventFieldOptionsData from './hooks/useEventFieldOptionsData';
import useEventUpdateActions from './hooks/useEventUpdateActions';
import useRelatedEvents from './hooks/useRelatedEvents';
import Section from './layout/Section';
import ConfirmCancelModal from './modals/ConfirmCancelModal';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import ConfirmPostponeModal from './modals/ConfirmPostponeModal';
import ConfirmUpdateModal from './modals/ConfirmUpdateModal';
import { EventFormFields } from './types';
import {
  draftEventValidationSchema,
  eventPathBuilder,
  eventValidationSchema,
  getEventFields,
  getEventInitialValues,
  showErrors,
} from './utils';

interface EditEventPageProps {
  event: EventFieldsFragment;
  refetch: () => void;
}

enum MODALS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  POSTPONE = 'postpone',
  UPDATE = 'update',
}

const EditEventPage: React.FC<EditEventPageProps> = ({ event, refetch }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const locale = useLocale();
  const { name, publicationStatus, superEventType } = getEventFields(
    event,
    locale
  );
  const [nextPublicationStatus, setNextPublicationStatus] = React.useState(
    publicationStatus
  );

  const {
    cancelEvent,
    closeModal: closeModalHook,
    deleteEvent,
    saving: savingHook,
    openModal,
    postponeEvent,
    setOpenModal,
    updateEvent,
  } = useEventUpdateActions({ event });

  const initialValues = React.useMemo(() => {
    return getEventInitialValues(event);
  }, [event]);

  // Prefetch all related events which are used when postpone/delete/cancel events
  useRelatedEvents(event);

  const goToEventsPage = () => {
    history.push(`/${locale}${ROUTES.EVENTS}`);
  };

  const onCancel = async () => {
    cancelEvent({
      onSuccess: async () => {
        await refetch();
        window.scrollTo(0, 0);
      },
    });
  };

  const onDelete = async () => {
    deleteEvent({
      onSuccess: async () => {
        // This action will change LE response so clear event list page
        await resetEventListPage();
        goToEventsPage();
      },
    });
  };

  const onPostpone = async () => {
    postponeEvent({
      onSuccess: async () => {
        await refetch();
        window.scrollTo(0, 0);
      },
    });
  };

  const onUpdate = async (
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

  return (
    <Formik
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      enableReinitialize={true}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={eventValidationSchema}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ values, setErrors, setTouched }) => {
        const clearErrors = () => {
          setErrors({});
        };

        const handleUpdate = async (publicationStatus: PublicationStatus) => {
          try {
            clearErrors();
            if (publicationStatus === PublicationStatus.Draft) {
              await draftEventValidationSchema.validate(values, {
                abortEarly: false,
              });
            } else {
              await eventValidationSchema.validate(values, {
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
            showErrors(error, setErrors, setTouched);
          }
        };

        return (
          <>
            <ConfirmCancelModal
              event={event}
              isOpen={openModal === MODALS.CANCEL}
              isSaving={savingHook === MODALS.CANCEL}
              onCancel={onCancel}
              onClose={closeModalHook}
            />
            <ConfirmDeleteModal
              event={event}
              isOpen={openModal === MODALS.DELETE}
              isSaving={savingHook === MODALS.DELETE}
              onClose={closeModalHook}
              onDelete={onDelete}
            />
            <ConfirmPostponeModal
              event={event}
              isOpen={openModal === MODALS.POSTPONE}
              isSaving={savingHook === MODALS.POSTPONE}
              onClose={closeModalHook}
              onPostpone={onPostpone}
            />
            <ConfirmUpdateModal
              event={event}
              isOpen={openModal === MODALS.UPDATE}
              isSaving={savingHook === MODALS.UPDATE}
              onClose={closeModalHook}
              onSave={() => {
                onUpdate(values, nextPublicationStatus);
              }}
            />
            <Form noValidate={true}>
              <PageWrapper
                backgroundColor="coatOfArms"
                className={styles.eventPage}
                title={name}
              >
                <MainContent>
                  <EditButtonPanel
                    event={event}
                    onCancel={() => setOpenModal(MODALS.CANCEL)}
                    onDelete={() => setOpenModal(MODALS.DELETE)}
                    onPostpone={() => setOpenModal(MODALS.POSTPONE)}
                    onUpdate={handleUpdate}
                  />
                  <Container>
                    <FormContainer className={styles.editPageContentContainer}>
                      <EventInfo event={event} />

                      <Section title={t('event.form.sections.type')}>
                        <TypeSection />
                      </Section>
                      <Section title={t('event.form.sections.languages')}>
                        <LanguagesSection />
                      </Section>
                      <Section
                        title={t('event.form.sections.responsibilities')}
                      >
                        <ResponsibilitiesSection savedEvent={event} />
                      </Section>
                      <Section title={t('event.form.sections.description')}>
                        <DescriptionSection />
                      </Section>
                      <Section title={t('event.form.sections.time')}>
                        <TimeSection />
                      </Section>
                      <Section title={t('event.form.sections.place')}>
                        <PlaceSection />
                      </Section>
                      <Section title={t('event.form.sections.price')}>
                        <PriceSection />
                      </Section>
                      <Section title={t('event.form.sections.socialMedia')}>
                        <SocialMediaSection />
                      </Section>
                      <Section title={t('event.form.sections.image')}>
                        <ImageSection />
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
                        <EventHierarchy event={event} showSuperEvent={true} />
                      </Section>
                    </FormContainer>
                  </Container>
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
  const { id } = useParams<{ id: string }>();
  const { data: eventData, loading: loadingEvent, refetch } = useEventQuery({
    fetchPolicy: 'no-cache',
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id,
      include: EVENT_INCLUDES,
    },
  });

  // Load options for inLanguage, audience and keywords checkboxes
  const { loading: loadingEventFieldOptions } = useEventFieldOptionsData();

  const loading = loadingEvent || loadingEventFieldOptions;

  return (
    <LoadingSpinner isLoading={loading}>
      {eventData?.event ? (
        <EditEventPage event={eventData.event} refetch={refetch} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditEventPageWrapper;
