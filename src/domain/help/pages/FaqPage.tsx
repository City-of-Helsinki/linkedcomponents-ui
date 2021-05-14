import React from 'react';
import { useTranslation } from 'react-i18next';

import MainContent from '../../app/layout/MainContent';
import PageWrapper from '../../app/layout/PageWrapper';
import AddingEventsFaq from '../faq/AddingEventsFaq';
import AddingToOwnProjectsFaq from '../faq/AddingToOwnProjectsFaq';
import EventFormNotWorkingFaq from '../faq/EventFormNotWorkingFaq';
import EventNotShownFaq from '../faq/EventNotShownFaq';
import ImageRightsFaq from '../faq/ImageRightsFaq';
import PublishingPermissionsFaq from '../faq/PublishingPermissionsFaq';
import SlowRequestsFaq from '../faq/SlowRequests';
import styles from './faqPage.module.scss';

const FaqPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper
      backgroundColor="gray"
      description="helpPage.pageDescriptionFaq"
      keywords={['keywords.faq', 'keywords.asked', 'keywords.questions']}
      title="helpPage.pageTitleFaq"
    >
      <MainContent>
        <h1>{t('helpPage.pageTitleFaq')}</h1>
        <div className={styles.accordions}>
          <AddingEventsFaq />
          <ImageRightsFaq />
          <EventFormNotWorkingFaq />
          <EventNotShownFaq />
          <AddingToOwnProjectsFaq />
          <PublishingPermissionsFaq />
          <SlowRequestsFaq />
        </div>
      </MainContent>
    </PageWrapper>
  );
};

export default FaqPage;
