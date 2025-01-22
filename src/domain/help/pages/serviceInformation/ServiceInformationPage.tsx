import { IconCalendar, IconCogwheel, IconPhone } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import imageUrl from '../../../../assets/images/png/platform-page.png';
import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import Highlight from '../../../../common/components/highlight/Highlight';
import { ROUTES } from '../../../../constants';
import IconCloud from '../../../../icons/IconCloud';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import styles from './serviceInformationPage.module.scss';

const ServiceInformationPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper
      className={styles.serviceInformationPage}
      description="helpPage.serviceInformationPage.pageDescription"
      keywords={[
        'keywords.serviceInformation',
        'keywords.help',
        'keywords.instructions',
      ]}
      title="helpPage.serviceInformationPage.pageTitle"
    >
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('helpPage.pageTitle'), path: ROUTES.HELP },
              {
                title: t('helpPage.sideNavigation.labelSupport'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.serviceInformationPage.titleServiceInformation')}
      />
      <div className={styles.mainContent}>
        <img
          src={imageUrl}
          alt={t('helpPage.serviceInformationPage.imageAlt')}
        />
        <div>
          <p>{t('helpPage.serviceInformationPage.textMainContent1')}</p>
          <p>{t('helpPage.serviceInformationPage.textMainContent2')}</p>
          <p>{t('helpPage.serviceInformationPage.textMainContent3')}</p>
        </div>
      </div>
      <h2>{t('helpPage.serviceInformationPage.titleServiceHighlights')}</h2>
      <div className={styles.highlights}>
        <Highlight
          headingLevel={3}
          icon={<IconCogwheel />}
          text={t('helpPage.serviceInformationPage.textEventManagement')}
          title={t('helpPage.serviceInformationPage.titleEventManagement')}
        />
        <Highlight
          headingLevel={3}
          icon={<IconCloud />}
          text={t('helpPage.serviceInformationPage.textApi')}
          title={t('helpPage.serviceInformationPage.titleApi')}
        />
        <Highlight
          headingLevel={3}
          icon={<IconPhone />}
          text={t('helpPage.serviceInformationPage.textSupport')}
          title={t('helpPage.serviceInformationPage.titleSupport')}
        />
        <Highlight
          headingLevel={3}
          icon={<IconCalendar />}
          text={t('helpPage.serviceInformationPage.textRegistration')}
          title={t('helpPage.serviceInformationPage.titleRegistration')}
        />
      </div>
    </PageWrapper>
  );
};

export default ServiceInformationPage;
