import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../common/components/button/Button';
import FormikPersist from '../../common/components/formikPersist/FormikPersist';
import { FORM_NAMES } from '../../constants';
import PageWrapper from '../app/layout/PageWrapper';
import { EVENT_INITIAL_VALUES } from './constants';
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
import Section from './section/Section';
import { createEventValidationSchema } from './utils';

const CreateEventPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={EVENT_INITIAL_VALUES}
      onSubmit={(values) => {
        alert('TODO: Publish event');
        console.log('TODO: Submit event form with values: ', values);
      }}
      validationSchema={createEventValidationSchema}
      validateOnMount
    >
      {({ isValid, values: { isVerified, type, ...restValues } }) => {
        const saveDraft = () => {
          alert('TODO: Save draft');
          console.log('TODO: Save draft with values: ', {
            type,
            isVerified,
            ...restValues,
          });
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
              <Section title={t('event.navigation.steps.type')}>
                <TypeSection />
              </Section>
              <Section title={t('event.navigation.steps.languages')}>
                <LanguagesSection />
              </Section>
              <Section title={t('event.navigation.steps.responsibilities')}>
                <ResponsibilitiesSection />
              </Section>
              <Section title={t('event.navigation.steps.description')}>
                <DescriptionSection />
              </Section>
              <Section title={t('event.navigation.steps.time')}>
                <TimeSection />
              </Section>
              <Section title={t('event.navigation.steps.place')}>
                <PlaceSection />
              </Section>
              <Section title={t('event.navigation.steps.price')}>
                <PriceSection />
              </Section>
              <Section title={t('event.navigation.steps.socialMedia')}>
                <SocialMediaSection />
              </Section>
              <Section title={t('event.navigation.steps.image')}>
                <ImageSection />
              </Section>
              <Section title={t('event.navigation.steps.classification')}>
                <ClassificationSection />
              </Section>
              <Section title={t('event.navigation.steps.audience')}>
                <AudienceSection />
              </Section>
              <Section title={t('event.navigation.steps.additionalInfo')}>
                <AdditionalInfoSection />
              </Section>
              <SummarySection />

              <div className={styles.buttonPanel}>
                <div className={styles.saveButtonWrapper}>
                  <Button
                    disabled={!isVerified}
                    onClick={saveDraft}
                    variant="secondary"
                  >
                    {t('event.form.buttonSaveDraft')}
                  </Button>
                  <Button disabled={!isValid} type="submit">
                    {t(`event.form.buttonPublish.${type}`)}
                  </Button>
                </div>
              </div>
            </PageWrapper>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateEventPage;
