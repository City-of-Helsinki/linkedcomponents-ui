/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../../constants';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import AddingEventsFaq from '../../faq/addingEventsFaq/AddingEventsFaq';
import AddingToOwnProjectsFaq from '../../faq/addingToOwnProjectsFaq/AddingToOwnProjectsFaq';
import EventFormNotWorkingFaq from '../../faq/eventFormNotWorkingFaq/EventFormNotWorkingFaq';
import EventNotShownFaq from '../../faq/eventNotShownFaq/EventNotShownFaq';
import ImageRightsFaq from '../../faq/imageRightsFaq/ImageRightsFaq';
import PublishingPermissionsFaq from '../../faq/publishingPermissionsFaq/PublishingPermissionsFaq';
import RegistrationForRecurringEventFaq from '../../faq/registrationForRecurringEventFaq/RegistrationForRecurringEventFaq';
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
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('helpPage.pageTitle'), path: ROUTES.HELP },
              {
                title: t('helpPage.sideNavigation.labelInstructions'),
                path: ROUTES.INSTRUCTIONS,
              },
              {
                title: t('helpPage.pageTitleFaq'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.pageTitleFaq')}
      />
      <div className={styles.accordions}>
        <AddingEventsFaq />
        <ImageRightsFaq />
        <EventFormNotWorkingFaq />
        <EventNotShownFaq />
        <AddingToOwnProjectsFaq />
        <PublishingPermissionsFaq />
        <SlowRequestsFaq />
        <RegistrationForRecurringEventFaq />
      </div>
    </PageWrapper>
  );
};

export default FaqPage;
