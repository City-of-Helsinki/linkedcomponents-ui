import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { EventFieldsFragment, useEventQuery } from '../../generated/graphql';
import useLocale from '../../hooks/useLocale';
import getPathBuilder from '../../utils/getPathBuilder';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import MainContent from '../app/layout/MainContent';
import PageWrapper from '../app/layout/PageWrapper';
import NotFound from '../notFound/NotFound';
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
import Section from './layout/Section';
import {
  eventPathBuilder,
  eventValidationSchema,
  getEventFields,
  getEventInitialValues,
} from './utils';

interface EditEventPageProps {
  event: EventFieldsFragment;
}

const EditEventPage: React.FC<EditEventPageProps> = ({ event }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { name } = getEventFields(event, locale);
  const initialValues = React.useMemo(() => {
    return getEventInitialValues(event);
  }, [event]);

  return (
    <Formik
      initialValues={initialValues}
      // We have custom way to handle onSubmit so here is empty function
      // to silent TypeScript error. The reason for custom onSubmit is that
      // we want to scroll to first invalid field if error occurs
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={eventValidationSchema}
      validateOnMount
      validateOnBlur={true}
      validateOnChange={true}
    >
      {() => {
        return (
          <Form noValidate={true}>
            <PageWrapper
              backgroundColor="coatOfArms"
              className={styles.eventPage}
              title={name}
            >
              <MainContent>
                <Container>
                  <FormContainer className={styles.editPageContentContainer}>
                    <EventInfo event={event} />

                    <Section title={t('event.form.sections.type')}>
                      <TypeSection />
                    </Section>
                    <Section title={t('event.form.sections.languages')}>
                      <LanguagesSection />
                    </Section>
                    <Section title={t('event.form.sections.responsibilities')}>
                      <ResponsibilitiesSection />
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
                  </FormContainer>
                </Container>
              </MainContent>
            </PageWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

const EditEventPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: eventData, loading } = useEventQuery({
    fetchPolicy: 'no-cache',
    variables: {
      createPath: getPathBuilder(eventPathBuilder),
      id,
      include: ['audience', 'keywords', 'location', 'super_event'],
    },
  });

  return (
    <LoadingSpinner isLoading={loading}>
      {eventData?.event ? (
        <EditEventPage event={eventData.event} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditEventPageWrapper;
