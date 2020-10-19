import React from 'react';
import { useTranslation } from 'react-i18next';

import PageWrapper from '../app/layout/PageWrapper';
import EventNavigation from './eventNavigation/EventNavigation';

const CreateEventPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper title="createEventPage.pageTitle">
      <EventNavigation
        items={[
          {
            component: <div>{t('event.navigation.steps.type')}</div>,
            isCompleted: true,
            label: t('event.navigation.steps.type'),
          },
          {
            component: <div>{t('event.navigation.steps.languages')}</div>,
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
            component: <div>{t('event.navigation.steps.classification')}</div>,
            isCompleted: false,
            label: t('event.navigation.steps.classification'),
          },
          {
            component: <div>{t('event.navigation.steps.targets')}</div>,
            isCompleted: false,
            label: t('event.navigation.steps.targets'),
          },
          {
            component: <div>{t('event.navigation.steps.commitment')}</div>,
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
    </PageWrapper>
  );
};

export default CreateEventPage;
