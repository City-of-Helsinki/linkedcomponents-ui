import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';

const FeaturesPage: React.FC = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>Service features</h1>
            <h2>Event management</h2>
            <p>
              The Linked Events dashboard lets you enter new events, courses,
              and volunteer assignments, and manage related information and
              materials.
            </p>
            <h2>Linked Events API</h2>
            <p>
              The public interface allows you to freely search for events for
              your own service. You can also suggest a database that should be
              linked to Linked Events.
            </p>
            <h2>Support and further development</h2>
            <p>
              Contact us if you would like more information or have any
              suggestions on how we could improve the service. In the Support
              section you will find more detailed information and a{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                contact form
              </Link>
              .
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Palvelun ominaisuudet</h1>
            <h2>Tapahtumien hallinta</h2>
            <p>
              Linked Eventsin hallintapaneelin avulla voit syöttää uusia
              tapahtumia, kursseja ja vapaaehtoistehtäviä, sekä hallita niihin
              liittyviä tietoja ja materiaaleja.
            </p>
            <h2>Linked Events API</h2>
            <p>
              Julkisen rajapinnan avulla voit vapaasti hakea tapahtumia omaan
              palveluusi. Voit myös ehdottaa meille, jos on olemassa jokin
              tietopankki, mikä tulisi kytkeä Linked Evensiin.
            </p>
            <h2>Tuki ja jatkokehitys</h2>
            <p>
              Ota meihin yhteyttä jos haluat lisätietoa tai sinulla on
              ehdotuksia miten voisimme parantaa palvelua. Tuki-osiosta löydät
              tarkempaa tietoa ja{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                yhteydenottolomakkeen
              </Link>
              .
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Tjänstens egenskaper</h1>
            <h2>Evenemanghantering</h2>
            <p>
              Med instrumentpanelen för Linked Events kan du ange nya evenemang,
              kurser och volontäruppgifter och hantera relaterad information och
              material.
            </p>
            <h2>Linked Events API</h2>
            <p>
              Det offentliga gränssnittet låter dig fritt söka efter evenemang
              för din egen tjänst. Du kan också föreslå för oss om det finns en
              databas som ska länkas till Linked Events.
            </p>
            <h2>Stöd och vidareutveckling</h2>
            <p>
              Kontakta oss om du vill ha mer information eller har några förslag
              på hur vi kan förbättra tjänsten. I avsnittet Hjälp hittar du mer
              detaljerad information och ett{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                kontaktformulär
              </Link>
              .
            </p>
          </>
        );
    }
  };

  return (
    <PageWrapper
      description="helpPage.pageDescriptionFeatures"
      keywords={['keywords.features']}
      title="helpPage.pageTitleFeatures"
    >
      {getContent(locale)}
    </PageWrapper>
  );
};

export default FeaturesPage;
