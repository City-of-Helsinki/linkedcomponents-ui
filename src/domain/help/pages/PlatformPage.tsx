import { IconCogwheel, IconPhone } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import imageUrl from '../../../assets/images/png/platform-page.png';
import Highlight from '../../../common/components/highlight/Highlight';
import IconCloud from '../../../icons/IconCloud';
import PageWrapper from '../../app/layout/PageWrapper';
import styles from './platformPage.module.scss';

const PlatformPage = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper
      className={styles.platformPage}
      description="helpPage.platformPage.pageDescription"
      keywords={['keywords.platform', 'keywords.help', 'keywords.instructions']}
      title="helpPage.platformPage.pageTitle"
    >
      <h1>{t('helpPage.platformPage.titlePlatform')}</h1>
      <div className={styles.mainContent}>
        <div>
          <p>{t('helpPage.platformPage.textMainContent1')}</p>
          <p>{t('helpPage.platformPage.textMainContent2')}</p>
        </div>
        <img src={imageUrl} alt={t('helpPage.platformPage.imageAlt')} />
      </div>
      <h2>{t('helpPage.platformPage.titleServiceHighlights')}</h2>
      <div className={styles.highlights}>
        <Highlight
          icon={<IconCogwheel />}
          text={t('helpPage.platformPage.textEventManagement')}
          title={t('helpPage.platformPage.titleEventManagement')}
        />
        <Highlight
          icon={<IconCloud />}
          text={t('helpPage.platformPage.textApi')}
          title={t('helpPage.platformPage.titleApi')}
        />
        <Highlight
          icon={<IconPhone />}
          text={t('helpPage.platformPage.textSupport')}
          title={t('helpPage.platformPage.titleSupport')}
        />
      </div>
    </PageWrapper>
  );
};

export default PlatformPage;
