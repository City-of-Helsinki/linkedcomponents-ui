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
import styles from './platformPage.module.scss';

const PlatformPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper
      className={styles.platformPage}
      description="helpPage.platformPage.pageDescription"
      keywords={['keywords.platform', 'keywords.help', 'keywords.instructions']}
      title="helpPage.platformPage.pageTitle"
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
              { title: t('helpPage.platformPage.titlePlatform'), path: null },
            ]}
          />
        }
        title={t('helpPage.platformPage.titlePlatform')}
      />
      <div className={styles.mainContent}>
        <img src={imageUrl} alt={t('helpPage.platformPage.imageAlt')} />
        <div>
          <p>{t('helpPage.platformPage.textMainContent1')}</p>
          <p>{t('helpPage.platformPage.textMainContent2')}</p>
          <p>{t('helpPage.platformPage.textMainContent3')}</p>
        </div>
      </div>
      <h2>{t('helpPage.platformPage.titleServiceHighlights')}</h2>
      <div className={styles.highlights}>
        <Highlight
          headingLevel={3}
          icon={<IconCogwheel />}
          text={t('helpPage.platformPage.textEventManagement')}
          title={t('helpPage.platformPage.titleEventManagement')}
        />
        <Highlight
          headingLevel={3}
          icon={<IconCloud />}
          text={t('helpPage.platformPage.textApi')}
          title={t('helpPage.platformPage.titleApi')}
        />
        <Highlight
          headingLevel={3}
          icon={<IconPhone />}
          text={t('helpPage.platformPage.textSupport')}
          title={t('helpPage.platformPage.titleSupport')}
        />
        <Highlight
          headingLevel={3}
          icon={<IconCalendar />}
          text={t('helpPage.platformPage.textRegistration')}
          title={t('helpPage.platformPage.titleRegistration')}
        />
      </div>
    </PageWrapper>
  );
};

export default PlatformPage;
