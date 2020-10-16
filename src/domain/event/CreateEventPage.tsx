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
            component: <div>{t('createEventPage.steps.type')}</div>,
            isCompleted: true,
            label: t('createEventPage.steps.type'),
          },
          {
            component: <div>{t('createEventPage.steps.languages')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.languages'),
          },
          {
            component: <div>{t('createEventPage.steps.responsibilities')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.responsibilities'),
          },
          {
            component: <div>{t('createEventPage.steps.time')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.time'),
          },
          {
            component: <div>{t('createEventPage.steps.place')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.place'),
          },
          {
            component: <div>{t('createEventPage.steps.price')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.price'),
          },
          {
            component: <div>{t('createEventPage.steps.media')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.media'),
          },
          {
            component: <div>{t('createEventPage.steps.classification')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.classification'),
          },
          {
            component: <div>{t('createEventPage.steps.targets')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.targets'),
          },
          {
            component: <div>{t('createEventPage.steps.commitment')}</div>,
            isCompleted: false,
            label: t('createEventPage.steps.commitment'),
          },
          {
            component: <div>{t('createEventPage.steps.ready')}</div>,
            disabled: true,
            isCompleted: false,
            label: t('createEventPage.steps.ready'),
          },
        ]}
      ></EventNavigation>
    </PageWrapper>
  );
};

export default CreateEventPage;
