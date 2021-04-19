import { IconPhoto } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Highlight from '../../common/components/highlight/Highlight';
import Container from '../app/layout/Container';
import FormContainer from '../app/layout/FormContainer';
import PageWrapper from '../app/layout/PageWrapper';
import Hero from './hero/Hero';
import styles from './landingPage.module.scss';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
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
    </PageWrapper>
  );
};

export default LandingPage;
