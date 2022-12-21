import { IconCalendarClock, IconSpeechbubbleText, IconTicket } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import myHelsinkiImage from '../../assets/images/jpg/myhelsinki-card.jpg';
import tapahtumatImage from '../../assets/images/jpg/tapahtumat-hel-card.jpg';
import Highlight from '../../common/components/highlight/Highlight';
import useLocale from '../../hooks/useLocale';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
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
      <MainContent>
        <Hero />
        <Container withOffset={true}>
          <div className={styles.highlights}>
            <Highlight
              className={styles.highlight}
              icon={<IconCalendarClock aria-hidden={true} />}
              text={t('landingPage.highlight1Text')}
              title={t('landingPage.highlight1Title')}
            />
            <Highlight
              className={styles.highlight}
              icon={<IconTicket aria-hidden={true} />}
              text={t('landingPage.highlight2Text')}
              title={t('landingPage.highlight2Title')}
            />
            <Highlight
              className={styles.highlight}
              icon={<IconSpeechbubbleText aria-hidden={true} />}
              text={
                <span
                  dangerouslySetInnerHTML={{
                    __html: t('landingPage.highlight3Text', {
                      githubUrl:
                        'https://github.com/City-of-Helsinki/linkedevents',
                      openInNewTab: t('common.openInNewTab'),
                    }),
                  }}
                />
              }
              title={t('landingPage.highlight3Title')}
            />
          </div>
        </Container>
        <div className={styles.serviceCardsWrapper}>
          <Container withOffset={true}>
            <h2 className={styles.title}>{t('landingPage.titleServices')}</h2>
            <div className={styles.serviceCards}>
              <ServiceCard
                backgroundColor="metro"
                backgroundImageUrl={myHelsinkiImage}
                description={t('landingPage.myHelsinkiDescription') as string}
                href={myHelsinkiRoute}
                title={t('landingPage.myHelsinkiTitle')}
              />
              <ServiceCard
                backgroundColor="suomenlinna"
                backgroundImageUrl={tapahtumatImage}
                description={
                  t('landingPage.tapahtumatHelDescription') as string
                }
                href={tapahtumatHelRoute}
                imageAuthor={
                  t('landingPage.tapahtumatHelImageAuthor') as string
                }
                title={t('landingPage.tapahtumatHelTitle')}
              />
            </div>
          </Container>
        </div>
      </MainContent>
    </PageWrapper>
  );
};

export default LandingPage;
