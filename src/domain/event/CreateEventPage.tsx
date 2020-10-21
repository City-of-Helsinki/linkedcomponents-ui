import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useEventsQuery } from '../../generated/graphql';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import { eventsPathBuilder } from '../events/utils';
import { EVENT_INITIALVALUES } from './constants';
import EventNavigation from './eventNavigation/EventNavigation';
import styles from './eventPage.module.scss';
import LanguagesSection from './formSections/languagesSection/LanguagesSection';
import TypeSection from './formSections/typeSection/TypeSection';
import { createValidationSchema } from './utils';

const CreateEventPage: React.FC = () => {
  const { t } = useTranslation();
  const validationSchema = createValidationSchema();
  const { data, loading } = useEventsQuery({
    variables: {
      superEventType: ['umbrella'],
      text: 'Cine',
      createPath: eventsPathBuilder,
    },
  });
  console.log(data, loading);
  return (
    <PageWrapper className={styles.eventPage} title="createEventPage.pageTitle">
      <Formik
        initialValues={EVENT_INITIALVALUES}
        onSubmit={(values) => {
          console.log('TODO: Submit event form with values: ', values);
        }}
        validationSchema={validationSchema}
      >
        {() => {
          return (
            <>
              <Container>
                <h1>{t('createEventPage.title')}</h1>
              </Container>
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
                    component: (
                      <div>{t('event.navigation.steps.responsibilities')}</div>
                    ),
                    isCompleted: false,
                    label: t('event.navigation.steps.responsibilities'),
                  },
                  {
                    component: <div>{t('event.navigation.steps.time')}</div>,
                    isCompleted: false,
                    label: t('event.navigation.steps.time'),
                  },
                  {
                    component: <div>{t('event.navigation.steps.place')}</div>,
                    isCompleted: false,
                    label: t('event.navigation.steps.place'),
                  },
                  {
                    component: <div>{t('event.navigation.steps.price')}</div>,
                    isCompleted: false,
                    label: t('event.navigation.steps.price'),
                  },
                  {
                    component: <div>{t('event.navigation.steps.media')}</div>,
                    isCompleted: false,
                    label: t('event.navigation.steps.media'),
                  },
                  {
                    component: (
                      <div>{t('event.navigation.steps.classification')}</div>
                    ),
                    isCompleted: false,
                    label: t('event.navigation.steps.classification'),
                  },
                  {
                    component: <div>{t('event.navigation.steps.targets')}</div>,
                    isCompleted: false,
                    label: t('event.navigation.steps.targets'),
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
            </>
          );
        }}
      </Formik>
    </PageWrapper>
  );
};

export default CreateEventPage;
