import { Form, Formik } from 'formik';
import set from 'lodash/set';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import FormikPersist from '../../common/components/formikPersist/FormikPersist';
import { FORM_NAMES, ROUTES } from '../../constants';
import {
  PublicationStatus,
  useCreateEventMutation,
  useCreateEventsMutation,
  useUpdateImageMutation,
} from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import parseIdFromAtId from '../../utils/parseIdFromAtId';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import PageWrapper from '../app/layout/PageWrapper';
import {
  clearEventFormData,
  createEventValidationSchema,
  draftEventValidationSchema,
  getEventPayload,
  getRecurringEventPayload,
} from './/utils';
import { EVENT_INITIAL_VALUES } from './constants';
import EventNavigation from './eventNavigation/EventNavigation';
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
import SummarySection from './formSections/summarySection/SummarySection';
import TimeSection from './formSections/timeSection/TimeSection';
import TypeSection from './formSections/typeSection/TypeSection';
import { EventFormFields } from './types';

const CreateEventPage: React.FC = () => {
  const history = useHistory();
  const locale = useLocale();
  const { t } = useTranslation();
  const [createEventMutation] = useCreateEventMutation();
  const [createEventsMutation] = useCreateEventsMutation();
  const [updateImage] = useUpdateImageMutation();

  const goToEventSavedPage = (id: string) => {
    clearEventFormData();
    history.push(`/${locale}${ROUTES.EVENT_SAVED.replace(':id', id)}`);
  };

  const saveImageIfNeeded = async (values: EventFormFields) => {
    const { imageDetails, images } = values;
    const imageId = images[0];

    if (imageId) {
      await updateImage({
        variables: {
          input: {
            id: parseIdFromAtId(imageId) as string,
            ...imageDetails,
          },
        },
      });
    }
  };

  const saveEvent = async (
    values: EventFormFields,
    publicationStatus: PublicationStatus
  ) => {
    try {
      await saveImageIfNeeded(values);

      const payload = getEventPayload(values, publicationStatus);

      if (Array.isArray(payload)) {
        const eventsData = await createEventsMutation({
          variables: {
            input: payload,
          },
        });

        const subEventIds =
          eventsData.data?.createEvents.map((item) => item.atId as string) ||
          [];
        const recurringEventPayload = getRecurringEventPayload(
          payload,
          subEventIds
        );

        const recurringEventData = await createEventMutation({
          variables: {
            input: recurringEventPayload,
          },
        });

        goToEventSavedPage(recurringEventData.data?.createEvent.id as string);
      } else {
        const data = await createEventMutation({
          variables: {
            input: payload,
          },
        });

        goToEventSavedPage(data.data?.createEvent.id as string);
      }
    } catch (e) {
      const { networkError } = e;

      if (networkError) {
        switch (networkError.statusCode) {
          case 400:
            toast.error(t('errors.validationError'));
            break;
          case 401:
            toast.error(t('errors.authorizationRequired'));
            break;
          default:
            toast.error(t('errors.serverError'));
        }
      }
      // eslint-disable-next-line no-console
      console.error('Failed to save event with error', e);
    }
  };

  return (
    <Formik
      initialValues={EVENT_INITIAL_VALUES}
      onSubmit={(values) => {
        saveEvent(values, PublicationStatus.Public);
      }}
      validationSchema={createEventValidationSchema}
      validateOnMount
    >
      {({ values: { type, ...restValues }, setErrors }) => {
        const saveDraft = async () => {
          try {
            const values = { type, ...restValues };

            await draftEventValidationSchema.validate(values, {
              abortEarly: false,
            });

            saveEvent(values, PublicationStatus.Draft);
          } catch (error) {
            if (error.name === 'ValidationError') {
              const newErrors = error.inner.reduce(
                (acc: object, e: Yup.ValidationError) =>
                  e.errors[0] ? set(acc, e.path, e.errors[0]) : acc,
                {}
              );
              // TODO: Show validations errors and scroll to first error.
              // Implement when all event fields are at same page
              toast.error(
                'TODO: Show validation errors and scroll to first error. Implement when all fields are at same page'
              );
              setErrors(newErrors);
            }
          }
        };

        return (
          <Form>
            <FormikPersist
              name={FORM_NAMES.EVENT_FORM}
              isSessionStorage={true}
            />
            <PageWrapper
              className={styles.eventPage}
              title={`createEventPage.pageTitle.${type}`}
            >
              <Container>
                <FormContainer>
                  <h1>{t(`createEventPage.title.${type}`)}</h1>
                </FormContainer>
                <EventNavigation
                  items={[
                    {
                      component: <TypeSection />,
                      isCompleted: true,
                      label: t('event.navigation.steps.type'),
                    },
                    {
                      component: <LanguagesSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.languages'),
                    },
                    {
                      component: <ResponsibilitiesSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.responsibilities'),
                    },
                    {
                      component: <DescriptionSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.description'),
                    },
                    {
                      component: <TimeSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.time'),
                    },
                    {
                      component: <PlaceSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.place'),
                    },
                    {
                      component: <PriceSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.price'),
                    },
                    {
                      component: <SocialMediaSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.socialMedia'),
                    },
                    {
                      component: <ImageSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.image'),
                    },
                    {
                      component: <ClassificationSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.classification'),
                    },
                    {
                      component: <AudienceSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.audience'),
                    },
                    {
                      component: <AdditionalInfoSection />,
                      isCompleted: false,
                      label: t('event.navigation.steps.additionalInfo'),
                    },
                    {
                      component: <SummarySection onSaveDraft={saveDraft} />,
                      isCompleted: false,
                      label: t('event.navigation.steps.summary'),
                    },
                  ]}
                ></EventNavigation>
              </Container>
            </PageWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateEventPage;
