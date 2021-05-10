import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Accordion from '../../../common/components/accordion/Accordion';
import { ROUTES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import PageWrapper from '../../app/layout/PageWrapper';
import styles from './faqPage.module.scss';

const FaqPage = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getLocalePath = (path: string) => {
    return `/${locale}${path}`;
  };

  const getContent = (language: Language) => {
    switch (language) {
      case 'en':
        return (
          <>
            <Accordion
              toggleButtonLabel={'How do I enter events into Linked Events?'}
            >
              <p>
                You must log in to the service first. To do this, I need one of
                the following:
              </p>
              <ul>
                <li>YLE ID</li>
                <li>Helsinki-ID</li>
                <li>City of Helsinki employee ID</li>
                <li>City of Espoo employee ID</li>
                <li>Facebook, Google or Twitter ID</li>
              </ul>
              <p>
                Once you are logged in, you can{' '}
                <Link to={ROUTES.INSTRUCTIONS_CONTROL_PANEL}>add events</Link>,
                but you will not be able to publish them yet. Contact us using
                the{' '}
                <Link to={getLocalePath(ROUTES.SUPPORT_CONTACT)}>
                  contact form
                </Link>{' '}
                and tell us which organization you need publishing rights for.
              </p>
            </Accordion>
            <Accordion toggleButtonLabel={'Can I add any image to events?'}>
              <p>
                You must have rights to the image you uploaded. See section:{' '}
                <Link to={getLocalePath(ROUTES.INSTRUCTIONS_CONTROL_PANEL)}>
                  attaching an image to events
                </Link>
                .
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                "The event I added doesn't appear in the service, where's the problem?"
              }
            >
              <p>
                Events are always listed according to different search criteria.
                If no search criteria are specified, then the interface returns
                future events within the selected base organization with an
                event type of “event”. As a result, courses, for example, will
                not appear in search results unless specifically defined. Also,
                check that the event you added has been published and that its
                date is in the future.
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={'Can I use Linked Events in my own projects?'}
            >
              <p>
                Yes. The Linked Events interface is public and open to everyone.
                Its use is also permitted in commercial services in accordance
                with the{' '}
                <Link to={getLocalePath(ROUTES.SUPPORT_TERMS_OF_USE)}>
                  terms of use
                </Link>{' '}
                .
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'API searches are slow, how do I make them faster?'
              }
            >
              <p>
                First, check the search criteria to find only the information
                you need for your service. We also recommend that you keep the
                information in your own service, in which case you only need to
                retrieve the changed or added information from the Linked Events
                interface.
              </p>
            </Accordion>
          </>
        );
      case 'fi':
        return (
          <>
            <Accordion
              toggleButtonLabel={
                'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?'
              }
            >
              <p>
                Sinun tulee kirjautua palveluun ensin. Tähän tarvitsen jonkun
                seuraavista:
              </p>
              <ul>
                <li>YLE-tunnus</li>
                <li>Helsinki-tunnus</li>
                <li>Helsingin kaupungin työntekijä -tunnus</li>
                <li>Espoon kaupungin työntekijä -tunnus</li>
                <li>Facebook, Google tai Twitter tunnus</li>
              </ul>
              <p>
                Kun olet kirjautunut, voit{' '}
                <Link to={ROUTES.INSTRUCTIONS_CONTROL_PANEL}>
                  lisätä tapahtumia
                </Link>
                , mutta et voi vielä julkaista niitä. Ota yhteyttä meihin{' '}
                <Link to={getLocalePath(ROUTES.SUPPORT_CONTACT)}>
                  yhteydenottolomakkeella
                </Link>{' '}
                ja kerro mihin organisaatioon tarvitset julkaisuoikeudet.
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'Voinko lisätä mitä tahansa kuvia tapahtumiin?'
              }
            >
              <p>
                Sinulla tulee olla oikeudet lataamaasi kuvaan. Katso kohta:{' '}
                <Link to={getLocalePath(ROUTES.INSTRUCTIONS_CONTROL_PANEL)}>
                  kuvan liittäminen tapahtumiin
                </Link>
                .
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'Lisäämäni tapahtuma ei näy palvelussa, missä vika?'
              }
            >
              <p>
                Tapahtumat listataan aina eri hakuehtojen mukaan. Jos hakuehtoja
                ei ole määritelty, niin rajapinta palauttaa valitun
                pohja-organisaation sisällä olevat tulevat tapahtumat, joiden
                tapahtumatyyppi on “event”. Tästä johtuen esimerkiksi kurssit,
                eivät tule hakutuloksiin jos sitä ei ole erikseen määritelty.
                Tarkista myös, että lisäämäsi tapahtuma on julkaistu, ja että
                sen ajankohta on tulevaisuudessa.
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'Saako Linked Events-rajapintaa käyttää omiin projekteihin?'
              }
            >
              <p>
                Kyllä. Linked Events rajapinta on julkinen ja avoin kaikille.
                Sen käyttö on sallittu{' '}
                <Link to={getLocalePath(ROUTES.SUPPORT_TERMS_OF_USE)}>
                  käyttöehtojen mukaisesti
                </Link>{' '}
                myös kaupallisissa palveluissa.
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'Rajapinnan haut on hitaita, miten saan ne nopeammaksi?'
              }
            >
              <p>
                Tarkista ensin hakuehdot, että haet vain ne tiedot mitä
                palveluusi tarvitset. Suosittelemme myös tiedon säilyttämistä
                omassa palvelussa, jolloin Linked Events rajapinnasta tarvitsee
                hakea vain muuttuneet tai lisätyt tiedot.
              </p>
            </Accordion>
          </>
        );
      case 'sv':
        return (
          <>
            <Accordion
              toggleButtonLabel={'Hur anger jag evenemang i Linked Events?'}
            >
              <p>
                Du måste logga in på tjänsten först. För att göra detta behöver
                jag något av följande:
              </p>
              <ul>
                <li>YLE ID</li>
                <li>Helsinki-ID</li>
                <li>Stad Helsinki anställd ID</li>
                <li>Stad Esbo anställd ID</li>
                <li>Facebook, Google eller Twitter ID</li>
              </ul>
              <p>
                När du är inloggad kan du{' '}
                <Link to={ROUTES.INSTRUCTIONS_CONTROL_PANEL}>
                  lägga till evenemang
                </Link>{' '}
                , men du kan inte publicera dem ännu. Kontakta oss med hjälp av{' '}
                <Link to={getLocalePath(ROUTES.SUPPORT_CONTACT)}>
                  kontaktformuläret
                </Link>{' '}
                och berätta vilken organisation du behöver
                publiceringsrättigheter för.
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'Kan jag lägga till vilka bilder som helst till evenemang?'
              }
            >
              <p>
                Du måste ha rättigheter till bilden du laddade upp. Se avsnitt:{' '}
                <Link to={getLocalePath(ROUTES.INSTRUCTIONS_CONTROL_PANEL)}>
                  bifoga en bild till evenemang
                </Link>
                .{' '}
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'Evenemangen jag lade till visas inte på tjänsten, var är felet?'
              }
            >
              <p>
                Evenemang listas alltid enligt olika sökkriterier. Om inga
                sökkriterier anges, returnerar gränssnittet framtida evenemang
                inom vald basorganisation med ett evenemangstyp av "event". Som
                ett resultat visas till exempel kurser inte i sökresultaten om
                de inte specifikt definierats. Kontrollera också att evenemanget
                du lade till har publicerats och att datumet är i framtiden.
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'Kan gränssnittet för Linked Events användas för mina egna projekt?'
              }
            >
              <p>
                Ja. Gränssnittet för Linked Events är offentligt och öppet för
                alla. Dess användning är också tillåten i kommersiella tjänster
                i{' '}
                <Link to={getLocalePath(ROUTES.SUPPORT_TERMS_OF_USE)}>
                  enlighet med villkoren
                </Link>{' '}
                .
              </p>
            </Accordion>
            <Accordion
              toggleButtonLabel={
                'Gränssnittssökningar är långsamma, hur gör jag dem snabbare?'
              }
            >
              <p>
                Kontrollera först sökkriterierna för att bara hitta den
                information du behöver för din tjänst. Vi rekommenderar också
                att du förvarar informationen i din egen tjänst, i vilket fall
                du bara behöver hämta den ändrade eller tillagda informationen
                från gränssnittet för Linked Events.
              </p>
            </Accordion>
          </>
        );
    }
  };
  return (
    <PageWrapper
      backgroundColor="gray"
      description="helpPage.pageDescriptionFaq"
      keywords={['keywords.faq', 'keywords.asked', 'keywords.questions']}
      title="helpPage.pageTitleFaq"
    >
      <h1>{t('helpPage.pageTitleFaq')}</h1>
      <div className={styles.accordions}>{getContent(locale)}</div>
    </PageWrapper>
  );
};

export default FaqPage;
