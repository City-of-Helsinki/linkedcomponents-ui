import { IconPhoto } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import myHelsinkiImage from '../../assets/images/png/myhelsinki-card.png';
import tapahtumatImage from '../../assets/images/png/tapahtumat-hel-card.png';
import Highlight from '../../common/components/highlight/Highlight';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
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
      <Container>
        <FormContainer>
          <div className={styles.highlights}>
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
        </FormContainer>
      </Container>
      <div className={styles.serviceCardsWrapper}>
        <Container>
          <FormContainer className={styles.serviceCards}>
            <ServiceCard
              backgroundImageUrl={myHelsinkiImage}
              href={myHelsinkiRoute}
              size="large"
              title={t('landingPage.myHelsinkiTitle')}
            />
            <ServiceCard
              backgroundImageUrl={tapahtumatImage}
              description={t('landingPage.tapahtumatHelDescription')}
              href={tapahtumatHelRoute}
              title={t('landingPage.tapahtumatHelTitle')}
            />
          </FormContainer>
        </Container>
      </div>
    </PageWrapper>
  );
};

export default LandingPage;
