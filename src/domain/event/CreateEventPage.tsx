import { Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import PageWrapper from '../app/layout/PageWrapper';
import { EVENT_INITIAL_VALUES } from './constants';
import EventNavigation from './eventNavigation/EventNavigation';
import styles from './eventPage.module.scss';
import AudienceSection from './formSections/audienceSection/AudienceSection';
import ClassificationSection from './formSections/classificationSection/ClassificationSection';
import DescriptionSection from './formSections/descriptionSection/DescriptionSection';
import LanguagesSection from './formSections/languagesSection/LanguagesSection';
import PlaceSection from './formSections/placeSection/PlaceSection';
import PriceSection from './formSections/priceSection/PriceSection';
import ResponsibilitiesSection from './formSections/responsibilitiesSection/ResponsibilitiesSection';
import SocialMediaSection from './formSections/socialMediaSection/SocialMediaSection';
import TimeSection from './formSections/timeSection/TimeSection';
import TypeSection from './formSections/typeSection/TypeSection';
import { createValidationSchema } from './utils';

const CreateEventPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={EVENT_INITIAL_VALUES}
      onSubmit={(values) => {
        console.log('TODO: Submit event form with values: ', values);
      }}
      validationSchema={createValidationSchema}
      validateOnBlur={true}
      validateOnChange={false}
      validateOnMount
    >
      {({ values: { type } }) => {
        return (
          <Form>
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
                      component: <LoadingSpinner isLoading={true} />,
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
                      component: (
                        <div>{t('event.navigation.steps.commitment')}</div>
                      ),
                      isCompleted: false,
                      label: t('event.navigation.steps.commitment'),
                    },
                    {
                      component: <div>{t('event.navigation.steps.ready')}</div>,
                      disabled: true,
                      isCompleted: false,
                      label: t('event.navigation.steps.ready'),
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
