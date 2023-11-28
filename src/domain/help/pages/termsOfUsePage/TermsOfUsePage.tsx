import React from 'react';

import ExternalLink from '../../../../common/components/externalLink/ExternalLink';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import styles from './termsOfUsePage.module.scss';

const TermsOfUsePage: React.FC = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>Data protection and terms of use</h1>
            <p>
              The registration for Linked Events uses the City of Helsinki's
              Tunnistamo application, where the registration options can be
              found:
            </p>
            <ul className={styles.termOfUse}>
              <li>City of Helsinki’s AD</li>
              <li>Facebook</li>
              <li>Google</li>
              <li>Yleisradio’s ID (Finnish Broadcasting Company)</li>
            </ul>
            <p>
              This information about your login to Linked Events is stored in
              the records of these service providers.
            </p>
            <p>
              Linked Events collects the following information from people who
              submit event information:
            </p>
            <ul className={styles.termOfUse}>
              <li>First and last name</li>
              <li>Email address</li>
              <li>Organisation represented</li>
              <li>When the user logs in for the first time</li>
            </ul>
            <p>
              The information is stored in the Linked Events database and is not
              passed on through the API. In the service itself, admin users from
              the same organisation will see the email address of the person who
              submitted the event. For non-members of a city organisation, the
              reporter’s email address will be seen by a moderator. There are
              2-5 moderators depending on the entity being moderated. In terms
              of content management, the event reporter data is visible to the
              city's Linked Events administrators (2-5 people) and development
              teams.
            </p>
            <p>
              The Linked Events service is hosted in the cloud on the City of
              Helsinki's Azure Openshift platform, and the database containing
              user data is protected by encryption keys
            </p>
            <p>
              The information required to report event data is collected by the
              user when logging in to the service. For content creation rights,
              the user herself/himself applies the rights either via a form on
              the Service or by e-mail, in accordance with Article 5(1)(a) and
              (c) of the EU General Data Protection Regulation. The user has
              given his/her consent to the processing of personal data or the
              processing is necessary to comply with a legal obligation of the
              controller, i.e. the City of Helsinki.
            </p>
            <p>
              As a rule, data is kept for 5 years, but may be deleted earlier
              upon request. {/*eslint-disable*/}
              <ExternalLink
                href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Sahkoisten%20asiointipalveluiden%20rekisteri.pdf"
                className={styles.listLink}
              >
                City of Helsinki Access Rights Privacy Policy (in Finnish)
              </ExternalLink>
              .
            </p>
            <h2>Cookies</h2>
            <p>
              The Linked Events service uses the City of Helsinki's own Matomo
              visitor tracking installation, which is also hosted on Azure's
              Openshift cloud platform.
            </p>
            <p>By accepting cookies, user data such as</p>
            <ul className={styles.termOfUse}>
              <li>IP-osoite</li>
              <li>Location</li>
              <li>Device used</li>
              <li>Device operation system</li>
              <li>Screen resolution</li>
              <li>Browser used</li>
              <li className={styles.noListStyle}>will be collected.</li>
            </ul>
            <h2>Terms of use for event information</h2>
            <p>
              Event information, images and other material added to the Linked
              Events interface (further the Material) are published under a{' '}
              <ExternalLink
                href="https://creativecommons.org/licenses/by/4.0/deed.fi"
                className={styles.listLink}
              >
                Creative Commons BY 4.0 -lisenssillä
              </ExternalLink>
              , unless otherwise stated.
            </p>
            <p>
              By using the interface, the user of the service who added the
              material agrees to the publication of the Material under a{' '}
              <ExternalLink
                href="https://creativecommons.org/licenses/by/4.0/deed.fi"
                className={styles.listLink}
              >
                Creative Commons BY 4.0 -lisenssillä
              </ExternalLink>
              , except in cases where the person who added the image through the
              interface restricts the right to use the image as described below.
            </p>
            <p>
              It is possible to restrict the use of the image entered in the
              interface per image in connection with the individual event in
              question (Event only license). The access restriction binds
              applications that use the interface and other users of the
              interface.
            </p>
            <p>
              If the “License” section of the information in the image to be
              shared is marked “Use Restricted to the Event,” the image in the
              Linked Events interface may only be used for information and
              communication about the event. Use or transfer of the image for
              other purposes is prohibited. When using images, it is essential
              to mention the source and author of the images.
            </p>
            <p>
              The user of the service who adds material to the service
              guarantees that he or she has the necessary rights to add material
              to the service. The City of Helsinki is not responsible for the
              content of the Material or related intellectual property rights.
              The person adding material to the service is responsible for the
              materials they add, and the fact that it does not infringe any 3rd
              party intellectual property rights or other rights and that it is
              not content otherwise contrary to law or good practice.
            </p>
            <p>
              The City of Helsinki does not guarantee the correctness of the
              Materials added to the page by the users of the service and is not
              responsible for their inaccuracy.
            </p>
            <p>
              The City of Helsinki has all the rights to edit and delete the
              Materials entered in the event interface. The City of Helsinki
              does not undertake to publish any materials.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Tietosuoja ja käyttöehdot</h1>
            <p>
              Linked Events -palveluun kirjaudutaan Helsingin kaupungin
              Tunnistamo-sovelluksella, jossa kirjautumisvaihtoehtoina ovat:
            </p>
            <ul className={styles.termOfUse}>
              <li>Helsingin kaupungin AD</li>
              <li>Facebook</li>
              <li>Google</li>
              <li>Yle</li>
            </ul>
            <p>
              Tieto Linked Eventsiin kirjautumisesta tallentuu näiden
              palvelutarjoajien tietoihin.
            </p>
            <p>Linked Events kerää tapahtumailmoittajista seuraavat tiedot:</p>
            <ul className={styles.termOfUse}>
              <li>Etu- ja sukunimi</li>
              <li>Sähköpostiosoite</li>
              <li>
                Mitä organisaatiota/yrityksiä/yhteisöjä/järjestöjä käyttäjä
                edustaa
              </li>
              <li>Milloin käyttäjä kirjautuu palveluun ensimmäistä kertaa</li>
            </ul>
            <p>
              Tiedot tallennetaan Linked Events -tietokantaan, eikä niitä
              välitetä rajapinnan kautta eteenpäin. Itse palvelussa saman
              organisaation admin-käyttäjät näkevät tapahtuman ilmoittaneen
              sähköpostiosoitteen. Kaupunkiorganisaation ulkopuolisten osalta
              ilmoittajan sähköpostiosoitteen näkee moderaattori, joita on 2-5
              riippuen moderoitavasta kokonaisuudesta.
            </p>
            <p>
              Käyttöoikeuksien hallinnan osalta tapahtumailmoittajien tiedot
              näkevät kaupungin Linked Events -pääkäyttäjät (2-5 henkilöä) sekä
              kehitystiimit.
            </p>
            <p>
              Linked Events -palvelu sijaitsee pilvipalvelussa Helsingin
              kaupungin Azure Openshift -alustalla, ja käyttäjätietoja sisältävä
              tietokanta on suojattu salausavaimin.
            </p>
            <p>
              Tapahtumatietojen syöttämiseen tarvittavat tiedot kerätään
              käyttäjän itsensä antamana palveluun kirjauduttaessa.
              Sisällöntuotanto-oikeuksien osalta käyttäjä itse pyytää oikeuksia
              joko palvelusta löytyvällä lomakkeella tai sähköpostitse
              noudattaen EU:n yleisen tietosuoja-asetuksen 5 artiklan 1 a- ja
              c-kohtaa. Käyttäjä on antanut luvan henkilötietojensa käsittelyyn
              tai käsittely on tarpeen rekisterinpitäjän eli Helsingin kaupungin
              lakisääteisen velvoitteen noudattamiseksi.
            </p>
            <p>
              Tietoja säilytetään pääsääntöisesti 5 vuotta, mutta pyynnöstä ne
              poistetaan nopeammin.
            </p>
            <p>
              Helsingin kaupungin käyttöoikeuksien {/*eslint-disable*/}
              <ExternalLink
                href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Sahkoisten%20asiointipalveluiden%20rekisteri.pdf"
                className={styles.listLink}
              >
                tietosuojaseloste
              </ExternalLink>
              .
            </p>
            <h2>Evästeet</h2>
            <p>
              Linked Events -palvelu hyödyntää Helsingin kaupungin omaa
              Matomo-kävijäseurannan asennusta, joka sijaitsee myös Azuren
              Openshift -pilvialustalla
            </p>
            <p>Evästeet hyväksymällä käyttäjän tiedoista tallennetaan</p>
            <ul className={styles.termOfUse}>
              <li>IP-osoite</li>
              <li>Sijainti</li>
              <li>Käytetty laite</li>
              <li>Käyttöjärjestelmä</li>
              <li>Ruudun resoluutio</li>
              <li>Käytetty selain</li>
            </ul>
            <h2>Tapahtumatietoihin liittyvät käyttöehdot</h2>
            <p>
              Linked Events –tapahtumarajapintaan lisätyt tapahtumatiedot, kuvat
              ja muu materiaali (yhdessä Materiaali) julkaistaan{' '}
              <ExternalLink
                href="https://creativecommons.org/licenses/by/4.0/deed.fi"
                className={styles.listLink}
              >
                Creative Commons BY 4.0 -lisenssillä
              </ExternalLink>
              , ellei toisin mainita.
            </p>
            <p>
              Käyttämällä rajapintaa Materiaalia lisännyt palvelun käyttäjä
              hyväksyy Materiaalin julkaisemisen{' '}
              <ExternalLink
                href="https://creativecommons.org/licenses/by/4.0/deed.fi"
                className={styles.listLink}
              >
                Creative Commons BY 4.0 -lisenssillä
              </ExternalLink>
              , lukuun ottamatta tilanteita, joissa kuvan rajapinnan kautta
              lisännyt rajoittaa kuvan käyttöoikeutta jäljempänä kuvatulla
              tavalla.
            </p>
            <p>
              Rajapintaan syötetyn kuvan käyttöä on mahdollista rajoittaa
              kuvakohtaisesti kyseiseen yksittäiseen tapahtumaan liittyen (Event
              only –lisenssi). Käyttöoikeuden rajoitus sitoo rajapintaa
              käyttäviä sovelluksia ja muita rajapinnan käyttäjiä.
            </p>
            <p>
              Mikäli jaettavan kuvan tietojen kohdassa ”Lisenssi” on merkintä
              ”Käyttö rajattu tapahtuman yhteyteen”, saa Linked Events
              -tapahtumarajapinnassa olevaa kuvaa käyttää ainoastaan kuvan
              tapahtumaa käsittelevään tiedotukseen ja viestintään. Kuvan käyttö
              tai siirto muihin tarkoituksiin on kielletty. Kuvia käytettäessä
              on ehdottomasti mainittava kuvien lähde ja kuvaaja.
            </p>
            <p>
              Materiaalia palveluun lisäävä palvelun käyttäjä takaa, että
              hänellä on tarvittavat oikeudet Materiaalin lisäämiseen palveluun.
              Helsingin kaupunki ei vastaa Materiaalin sisällöstä tai siihen
              liittyvistä immateriaalioikeuksista. Materiaalin palveluun
              lisännyt palvelun käyttäjä vastaa lisäämästään materiaalista ja
              siitä, ettei se loukkaa kolmannen osapuolen immateriaali- tai
              muita oikeuksia ja ettei se ole sisällöltään muutoin lain tai
              hyvän tavan vastainen.
            </p>
            <p>
              Helsingin kaupunki ei takaa palvelun käyttäjien sivulle lisäämien
              Materiaalien oikeellisuutta eikä vastaa niiden virheellisyydestä.
            </p>
            <p>
              Helsingin kaupungilla on kaikki oikeudet muokata ja poistaa
              tapahtumarajapintaan syötettyjä Materiaaleja. Helsingin kaupunki
              ei sitoudu julkaisemaan mitään Materiaaleja.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Dataskydd och användarvillkor</h1>
            <p>
              Anmälan till länkade evenemang sker via Helsingfors stads
              applikation Tunnistamo, där anmälningsalternativen finns:
            </p>
            <ul className={styles.termOfUse}>
              <li>Helsingin kaupungin AD</li>
              <li>Facebook</li>
              <li>Google</li>
              <li>Yleisradio</li>
            </ul>
            <p>
              Denna information om din inloggning till Linked Events lagras i
              dessa tjänsteleverantörers register.
            </p>
            <p>
              Linked Events samlar in följande information från personer som
              skickar in information om evenemang:
            </p>
            <ul className={styles.termOfUse}>
              <li>För- och efternamn</li>
              <li>E-postadress</li>
              <li>Representerad organisation</li>
              <li>När användaren loggar in för första gången</li>
            </ul>
            <p>
              Informationen lagras i Linked Events databas och skickas inte
              vidare via API:et. I själva tjänsten kommer administratörer från
              samma organisation att se e-postadressen till den person som
              skickade in evenemanget. För icke-medlemmar i en stadsorganisation
              kommer reporterns e-postadress att ses av en moderator. Det finns
              2-5 moderatorer beroende på vilken enhet som modereras. När det
              gäller innehållshantering är uppgifterna från
              evenemangsrapportörerna synliga för stadens Linked
              Events-administratörer (2-5 personer) och utvecklingsteam.
            </p>
            <p>
              Linked Events-tjänsten finns i molnet på Helsingfors stads Azure
              Openshift-plattform, och databasen med användardata skyddas av
              krypteringsnycklar.
            </p>
            <p>
              Den information som krävs för att rapportera händelsedata samlas
              in från användaren när han/hon loggar in på tjänsten. För
              rättigheter att skapa innehåll ansöker användaren själv om
              rättigheterna antingen via ett formulär på tjänsten eller via
              e-post, i enlighet med artikel 5.1 (a) och (c) i EU:s allmänna
              dataskyddsförordning. Användaren har gett sitt samtycke till
              behandlingen av personuppgifter eller behandlingen är nödvändig
              för att uppfylla en rättslig skyldighet för den registeransvarige,
              dvs. Helsingfors stad.
            </p>
            <p>
              Uppgifterna sparas i regel i 5 år, men kan raderas tidigare på
              begäran {/*eslint-disable*/}
              <ExternalLink
                href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Sahkoisten%20asiointipalveluiden%20rekisteri.pdf"
                className={styles.listLink}
              >
                City of Helsinki Access Rights Privacy Policy (in Finnish)
              </ExternalLink>
              .
            </p>
            <h2>Kakor</h2>
            <p>
              Linked Events-tjänsten använder Helsingfors stads egen
              Matomo-installation för spårning av besökare, som också finns på
              Azures Openshift-molnplattform.
            </p>
            <p>Genom att acceptera kakor lagras användardata:</p>
            <ul className={styles.termOfUse}>
              <li>IP-adress</li>
              <li>Plats</li>
              <li>Enhet som används</li>
              <li>Enhetens operativsyste</li>
              <li>Upplösning på skärmen</li>
              <li>Webbläsare som används</li>
            </ul>
            <h2>Användarvillkor för evenemangsinformation</h2>
            <p>
              Evenemangsinformation, bilder och annat material som läggs till i
              gränssnittet för Linked Events (vidare Materialet) publiceras
              under en{' '}
              <ExternalLink
                href="https://creativecommons.org/licenses/by/4.0/deed.fi"
                className={styles.listLink}
              >
                Creative Commons BY 4.0 -licens
              </ExternalLink>
              , om inte annat anges.
            </p>
            <p>
              Genom att använda gränssnittet samtycker den användare av tjänsten
              som lagt till materialet till publicering av materialet under en{' '}
              <ExternalLink
                href="https://creativecommons.org/licenses/by/4.0/deed.fi"
                className={styles.listLink}
              >
                Creative Commons BY 4.0 -licens
              </ExternalLink>
              , utom i de fall där den person som lagt till bilden via
              gränssnittet begränsar rätten att använda bilden enligt nedan.
            </p>
            <p>
              Det är möjligt att begränsa användningen av den bild som anges i
              gränssnittet per bild i samband med det enskilda evenemanget i
              fråga (Event only-licens). Åtkomstbegränsningen binder program som
              använder gränssnittet och andra användare av gränssnittet.
            </p>
            <p>
              Om avsnittet "Licens" i informationen i den bild som ska delas är
              markerat med "Användning begränsad till evenemanget", får bilden i
              gränssnittet Linked Events endast användas för information och
              kommunikation om evenemanget. Användning eller överföring av
              bilden för andra ändamål är förbjuden. Vid användning av bilder är
              det viktigt att ange källan och upphovsmannen till bilderna.
            </p>
            <p>
              Den användare av tjänsten som lägger till material i tjänsten
              garanterar att han eller hon har de nödvändiga rättigheterna för
              att lägga till material i tjänsten. Helsingfors stad ansvarar inte
              för innehållet i Materialet eller relaterade immateriella
              rättigheter. Den person som lägger till material i tjänsten är
              ansvarig för det material som läggs till och för att det inte gör
              intrång i tredje parts immateriella rättigheter eller andra
              rättigheter och att det inte är innehåll som på annat sätt strider
              mot lag eller god sed.
            </p>
            <p>
              Helsingfors stad garanterar inte att det material som användarna
              av tjänsten lägger till på sidan är korrekt och ansvarar inte för
              felaktigheter i materialet.
            </p>
            <p>
              Helsingfors stad har alla rättigheter att redigera och radera
              material som lagts in i evenemangets gränssnitt. Helsingfors stad
              åtar sig inte att publicera något material.
            </p>
          </>
        );
    }
  };
  return (
    <PageWrapper
      description="helpPage.pageDescriptionTermsOfUse"
      keywords={['keywords.termsOfUse']}
      title="helpPage.pageTitleTermsOfUse"
    >
      {getContent(locale)}
    </PageWrapper>
  );
};

export default TermsOfUsePage;
