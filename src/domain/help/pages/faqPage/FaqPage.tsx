import React from 'react';
import { useTranslation } from 'react-i18next';

import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import AddingEventsFaq from '../../faq/addingEventsFaq/AddingEventsFaq';
import AddingToOwnProjectsFaq from '../../faq/addingToOwnProjectsFaq/AddingToOwnProjectsFaq';
import EventFormNotWorkingFaq from '../../faq/eventFormNotWorkingFaq/EventFormNotWorkingFaq';
import EventNotShownFaq from '../../faq/eventNotShownFaq/EventNotShownFaq';
import ImageRightsFaq from '../../faq/imageRightsFaq/ImageRightsFaq';
import PublishingPermissionsFaq from '../../faq/publishingPermissionsFaq/PublishingPermissionsFaq';
import SlowRequestsFaq from '../../faq/slowRequestsFaq/SlowRequestsFaq';
import styles from './faqPage.module.scss';

const FaqPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper
      description="helpPage.pageDescriptionFaq"
      keywords={['keywords.faq', 'keywords.asked', 'keywords.questions']}
      title="helpPage.pageTitleFaq"
    >
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
    </PageWrapper>
  );
};

export default FaqPage;
