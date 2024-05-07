import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import ExternalLink from '../../../../common/components/externalLink/ExternalLink';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import SourceCodeLinks from '../../sourceCodeLinks/SourceCodeLinks';

const SourceCodePage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getGeneralContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <p>
            Linked Events is developed for a Django platform in Python and
            Javascript programming languages and utilizes a PostgreSQL database
            to capture data. Linked Events Admin is a React-based application
            for event management and its and the platform's source code can be
            found in Github version control at:
          </p>
        );
      case 'fi':
        return (
          <p>
            Linked Events on kehitetty Django-alustalle Python- ja
            Javascript-ohjelmointikielillä ja se hyödyntää
            PostgreSQL-tietokantaa tietojen taltioimiseen. Linked Events Admin
            on React-pohjainen sovellus tapahtumien hallintaan ja sen sekä
            alustan lähdekoodit löytyvät Github-versionhallinnasta osoitteista:
          </p>
        );
      case 'sv':
        return (
          <p>
            Linked Events är utvecklat för Django-plattformen i
            programmeringsspråk Python och Javascript och använder en
            PostgreSQL-databas för att fånga data. Linked Events Admin är en
            React-baserad applikation för evenemangshantering och dess och
            plattformens källkod finns i Github-versionskontrollen på:
          </p>
        );
    }
  };

  const getImageRightsContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h2>Image Rights</h2>
            <p>
              The City of Helsinki has all the rights to the images. If the
              license of the image to be shared in the interface is marked
              event_only, the image may only be used for information and
              communication about the event. Using images for this purpose is
              free for the user. The use or transfer of the image for other
              purposes is prohibited. When using images, it is essential to
              mention the source and author of the images.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h2>Kuvaoikeudet</h2>
            <p>
              Helsingin kaupungilla on kuviin kaikki oikeudet. Mikäli
              rajapinnassa jaettavan kuvan tietojen kohdassa license on merkintä
              event_only, saa kuvaa käyttää ainoastaan kuvan tapahtumaa
              käsittelevään tiedotukseen ja viestintään. Kuvien käyttäminen
              tähän tarkoitukseen on käyttäjälle ilmaista. Kuvan käyttö tai
              siirto muihin tarkoituksiin on kielletty. Kuvia käytettäessä on
              ehdottomasti mainittava kuvien lähde ja kuvaaja.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h2>Bildrättigheter</h2>
            <p>
              Helsingfors stad har alla rättigheter till bilderna. Om licensen
              för bilden som ska delas i gränssnittet är markerad endast
              evenemang, får bilden endast användas för information och
              kommunikation om bildens evenemang. Att använda bilder för detta
              ändamål är gratis för användaren. Användning eller överföring av
              bilden för andra ändamål är förbjuden. När du använder bilder är
              det viktigt att nämna bildens källa och författare.
            </p>
          </>
        );
    }
  };

  const getApiContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h2>API</h2>
            <p>
              The Linked Events API contains event information about the City of
              Helsinki's events, courses and volunteer assignments. Some of the
              API’s databases have been automatically imported from other
              systems and services, and others have been added manually using
              the tools on this website. The API provides categorized
              information about places and events. You can search for
              information by time, keywords, place and region, as well as by
              free word search, which searches for an event, course or task in
              several different fields.
            </p>
            <p>
              The API has been developed by the Helsinki City Chancellery's
              Linked Events team, which is also responsible for updating the
              documentation and maintaining the service. The location
              information is linked to the City of Helsinki's Office Register,
              which contains e.g. information on accessibility.
            </p>
            <p>
              The API is constantly evolving. If you have any ideas on how to
              improve the API or would like to comment on how it works, please{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>contact us</Link>
              .
            </p>
            <p>The API provides results in JSON-LD format.</p>
            <p>
              The API can be found at:{' '}
              <ExternalLink href="https://api.hel.fi/linkedevents/v1">
                api.hel.fi/linkedevents/v1
              </ExternalLink>
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h2>Rajapinta</h2>
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
                api.hel.fi/linkedevents/v1
              </ExternalLink>
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h2>API</h2>
            <p>
              Linked Events API innehåller evenemangsinformation om Helsingfors
              stads evenemang, kurser och volontäruppdrag. En del av API's
              databaser har automatiskt importerats från andra system och
              tjänster, och andra har lagts till manuellt med hjälp av verktygen
              på denna webbplats. API'et ger kategoriserad information om
              platser och evenemang. Du kan söka efter information efter tid,
              nyckelord, plats och region, samt med gratis ordsökning, som söker
              efter en evenemang, kurs eller uppgift inom flera olika fält.
            </p>
            <p>
              API'et har utvecklats av Helsingfors stadskontor Linked
              Events-team, som också ansvarar för att uppdatera dokumentationen
              och underhålla tjänsten. Platsinformationen är länkad till
              Helsingfors stads kontoregister, som innehåller t.ex. information
              om tillgänglighet.
            </p>
            <p>
              API'et utvecklas ständigt.{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                Kontakta oss
              </Link>{' '}
              om du har några idéer om hur du kan förbättra API’et eller vill
              kommentera hur det fungerar. .
            </p>
            <p>API'et ger resultat i JSON-LD-format.</p>
            <p>
              API'n finns på:{' '}
              <ExternalLink href="https://api.hel.fi/linkedevents/v1">
                api.hel.fi/linkedevents/v1
              </ExternalLink>
            </p>
          </>
        );
    }
  };

  const getFeaturesContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h2>Event management</h2>
            <p>
              The Linked Events user interface lets you enter new events,
              courses, and volunteer assignments, and manage related information
              and materials.
            </p>
            <h2>Linked Events API</h2>
          </>
        );
      case 'fi':
        return (
          <>
            <h2>Tapahtumien hallinta</h2>
            <p>
              Linked Eventsin käyttöliittymän avulla voit syöttää uusia
              tapahtumia, kursseja ja vapaaehtoistehtäviä, sekä hallita niihin
              liittyviä tietoja ja materiaaleja.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h2>Evenemanghantering</h2>
            <p>
              Med Linked Events användargränssnittet kan du ange nya evenemang,
              kurser och volontäruppgifter och hantera relaterad information och
              material.
            </p>
          </>
        );
    }
  };

  return (
    <PageWrapper
      description="helpPage.pageDescriptionSourceCode"
      keywords={[
        'keywords.technology',
        'keywords.sourceCode',
        'keywords.image',
        'keywords.rights',
        'keywords.license',
        'keywords.help',
        'keywords.support',
        'keywords.documentation',
      ]}
      title="helpPage.pageTitleSourceCode"
    >
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('helpPage.pageTitle'), path: ROUTES.HELP },
              {
                title: t('helpPage.pageTitleTechnology'),
                path: ROUTES.TECHNOLOGY,
              },
              {
                title: t('helpPage.pageTitleSourceCode'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.pageTitleSourceCode')}
      />
      {getGeneralContent(locale)}
      <SourceCodeLinks />
      {getApiContent(locale)}
      {getFeaturesContent(locale)}
      {getImageRightsContent(locale)}
    </PageWrapper>
  );
};

export default SourceCodePage;
