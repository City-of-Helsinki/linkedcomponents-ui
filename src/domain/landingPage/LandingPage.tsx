import { IconPhoto } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import myHelsinkiImage from '../../assets/images/png/myhelsinki-card.png';
import tapahtumatImage from '../../assets/images/png/tapahtumat-hel-card.png';
import Highlight from '../../common/components/highlight/Highlight';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import PageWrapper from '../app/layout/PageWrapper';
import Hero from './hero/Hero';
import styles from './landingPage.module.scss';
import ServiceCard from './serviceCard/ServiceCard';

const LandingPage: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation();

  const myHelsinkiRoute = `https://www.myhelsinki.fi/${locale}`;
  const tapahtumatHelRoute = `https://tapahtumat.hel.fi/${locale}/home`;

  return (
    <PageWrapper>
      <Hero />
      <Container withOffset={true}>
        <div className={styles.highlights}>
          {/* TODO: Change to real content when material is ready */}
          <Highlight
            className={styles.highlight}
            icon={<IconPhoto aria-hidden={true} />}
            text={t('landingPage.highlight1Text')}
            title={t('landingPage.highlight1Title')}
          />
          <Highlight
            className={styles.highlight}
            icon={<IconPhoto aria-hidden={true} />}
            text={t('landingPage.highlight2Text')}
            title={t('landingPage.highlight2Title')}
          />
          <Highlight
            className={styles.highlight}
            icon={<IconPhoto aria-hidden={true} />}
            text={t('landingPage.highlight3Text')}
            title={t('landingPage.highlight3Title')}
          />
        </div>
      </Container>
      <div className={styles.serviceCardsWrapper}>
        <Container withOffset={true}>
          <h2 className={styles.title}>{t('landingPage.titleServices')}</h2>
          <div className={styles.serviceCards}>
            {/* TODO: Change to real content when material is ready */}
            <ServiceCard
              backgroundColor="metro"
              backgroundImageUrl={myHelsinkiImage}
              description={t('landingPage.myHelsinkiDescription')}
              href={myHelsinkiRoute}
              title={t('landingPage.myHelsinkiTitle')}
            />
            <ServiceCard
              backgroundColor="suomenlinna"
              backgroundImageUrl={tapahtumatImage}
              description={t('landingPage.tapahtumatHelDescription')}
              href={tapahtumatHelRoute}
              title={t('landingPage.tapahtumatHelTitle')}
            />
          </div>
        </Container>
      </div>
    </PageWrapper>
  );
};

export default LandingPage;
