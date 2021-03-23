import React from 'react';
import { Link } from 'react-router-dom';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import PageWrapper from '../../app/layout/PageWrapper';

const ApiPage = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>API</h1>
            <p>
              The Linked Events interface contains event information about the
              City of Helsinki's events, courses and volunteer assignments. Some
              of the interface records have been automatically imported from
              other systems and services, and others have been added manually
              using the tools on this website. The interface provides
              categorized information about places and events. You can search
              for information by time, keywords, place and region, as well as by
              free word search, which searches for an event, course or task in
              several different fields.
            </p>
            <p>
              The interface has been developed by the Helsinki City
              Chancellery's Linked Events team, which is also responsible for
              updating the documentation and maintaining the service. The
              location information is linked to the City of Helsinki's Office
              Register, which contains e.g. information on accessibility.
            </p>
            <p>
              The interface is constantly evolving. If you have ideas on how to
              improve the interface or would like to comment on how it works,
              please{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>contact us</Link>
              .
            </p>
            <p>The interface provides results in JSON-LD format.</p>
            <p>
              The interface can be found at:{' '}
              <ExternalLink href="https://api.hel.fi/linkedevents/v1">
                https://api.hel.fi/linkedevents/v1
              </ExternalLink>
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Rajapinta</h1>
            <p>
              Linked Events -rajapinta pitää sisällään tapahtumatietoja
              Helsingin kaupungin tapahtumista, kursseista ja
              vapaaehtoistehtävistä. Osa rajapinnan tietueista on tuotu
              automaattisesti muista järjestelmistä ja palveluista, ja muut
              lisätty manuaalisesti tämän verkkosivun työkalujen avulla.
              Rajapinta tarjoaa kategorisoitua tietoa paikoista ja tapahtumista.
              Tietoa voi hakea ajankohdan, avainsanojen, paikan ja alueen mukaan
              sekä vapaasanahaulla, joka hakee tapahtuman, kurssin tai tehtävän
              useista eri kentistä.
            </p>
            <p>
              Rajapinnan on kehittänyt Helsingin Kaupunginkanslian Linked
              Events-tiimi, joka vastaa myös dokumentaation päivittämisestä ja
              palvelun ylläpidosta. Sijaintitiedot linkitetään Helsingin
              kaupungin Toimipisterekisteriin, joka sisältää mm. tietoa
              esteettömyydestä.
            </p>
            <p>
              Rajapinta on jatkuvassa kehityksessä. Jos sinulla on ideoita miten
              parantaa rajapintaa tai haluat antaa kommentteja sen
              toimivuudesta,{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                ota yhteyttä meihin
              </Link>
              .
            </p>
            <p>Rajapinta tarjoaa tulokset JSON-LD formaatissa.</p>
            <p>
              Rajapinta löytyy osoitteesta:{' '}
              <ExternalLink href="https://api.hel.fi/linkedevents/v1">
                https://api.hel.fi/linkedevents/v1
              </ExternalLink>
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>API</h1>
            <p>
              Gränssnittet "Linked Events" innehåller evenemanginformation om
              Helsingfors stads evenemang, kurser och volontäruppdrag. En del av
              gränssnittsposterna har importerats automatiskt från andra system
              och tjänster, och andra har lagts till manuellt med hjälp av
              verktygen på denna webbplats. Gränssnittet ger kategoriserad
              information om platser och evenemang. Du kan söka efter
              information efter tid, nyckelord, plats och region samt genom
              gratis ordsökning som söker efter en händelse, kurs eller uppgift
              inom flera olika fält.
            </p>
            <p>
              Gränssnittet har utvecklats av Helsingfors stads kanslerys Linked
              Events -team, som också ansvarar för att uppdatera dokumentationen
              och underhålla tjänsten. Platsinformationen är länkad till
              Helsingfors stads kontoregister, som innehåller t.ex. information
              om tillgänglighet.
            </p>
            <p>
              Gränssnittet utvecklas ständigt. Om du har några idéer om hur du
              kan förbättra gränssnittet eller vill kommentera hur det fungerar,
              vänligen{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                kontakta oss
              </Link>{' '}
              .
            </p>
            <p>Gränssnittet ger resultat i JSON-LD-format.</p>
            <p>
              Gränssnittet finns på:{' '}
              <ExternalLink href="https://api.hel.fi/linkedevents/v1">
                https://api.hel.fi/linkedevents/v1
              </ExternalLink>
            </p>
          </>
        );
    }
  };
  return (
    <PageWrapper title="helpPage.pageTitleApi">
      {getContent(locale)}
    </PageWrapper>
  );
};

export default ApiPage;
