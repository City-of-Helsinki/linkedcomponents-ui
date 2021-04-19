import { IconPhoto } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import flowLogo from '../../assets/images/png/flow-logo.png';
import helsinkiLogo from '../../assets/images/png/helsinki-logo.png';
import korkeasaariLogo from '../../assets/images/png/korkeasaari-logo.png';
import luxLogo from '../../assets/images/png/lux-logo.png';
import myHelsinkiImage from '../../assets/images/png/myhelsinki-card.png';
import slushLogo from '../../assets/images/png/slush-logo.png';
import tapahtumatImage from '../../assets/images/png/tapahtumat-hel-card.png';
import Highlight from '../../common/components/highlight/Highlight';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import PageWrapper from '../app/layout/PageWrapper';
import Hero from './hero/Hero';
import styles from './landingPage.module.scss';
import Partner from './partner/Partner';
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
        </FormContainer>
      </Container>
      <div className={styles.serviceCardsWrapper}>
        <Container>
          <FormContainer className={styles.serviceCards}>
            {/* TODO: Change to real content when material is ready */}
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

      <div className={styles.partnersWrapper}>
        <Container>
          <FormContainer>
            <h2>{t('landingPage.titlePartners')}</h2>
            <div className={styles.partners}>
              {/* TODO: Change to real content when material is ready */}
              <Partner
                href="https://www.slush.org/"
                imageUrl={slushLogo}
                name="Slush"
              />
              <Partner
                href="https://www.korkeasaari.fi/"
                imageUrl={korkeasaariLogo}
                name="Korkeasaari"
              />
              <Partner
                href="https://luxhelsinki.fi/"
                imageUrl={luxLogo}
                name="Lux Helsinki"
              />
              <Partner
                href="https://www.flowfestival.com/"
                imageUrl={flowLogo}
                name="Flow festival"
              />
              <Partner
                href="https://www.hel.fi/"
                imageUrl={helsinkiLogo}
                name="Helsingin kaupunki"
              />
            </div>
          </FormContainer>
        </Container>
      </div>
    </PageWrapper>
  );
};

export default LandingPage;
