/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import ExternalLink from '../../../../common/components/externalLink/ExternalLink';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';

const TermsOfUsePage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <p>
              Linked Events, the event data management service, is logged in
              with the Helsinki profile of the City of Helsinki, either as an
              employee of the City of Helsinki with an AD login or with a
              Helsinki ID consisting of an e-mail address and a password. Login
              to Linked Registration, i.e. registering for an event, is also
              possible with a Helsinki profile and strong authentication.
            </p>
            <p>
              The Helsinki profile provides Linked Events with the information
              of the advertiser of the event:
            </p>
            <ul>
              <li>First and last name</li>
              <li>E-mail</li>
              <li>
                What organization/company/community/association does the user
                represent?
              </li>
              <li>When the user first logs in</li>
            </ul>
            <p>
              Linked Registration collects the following information on
              registrations:
            </p>
            <ul>
              <li>
                Participant:
                <ul>
                  <li>First and last name</li>
                  <li>Date of birth</li>
                  <li>Address</li>
                  <li>Postal code</li>
                  <li>City</li>
                  <li>
                    Additional information (allergies, accessibility or other
                    additional information related to participation)
                  </li>
                </ul>
              </li>
              <li>
                Declarant:
                <ul>
                  <li>First and last name</li>
                  <li>E-mail address</li>
                  <li>Telephone number</li>
                  <li>Membership card number</li>
                  <li>Mother tongue</li>
                  <li>Language of service</li>
                </ul>
              </li>
            </ul>
            <p>
              This information is stored in the Linked Events database and is
              not passed through the API. In the service itself, admin users
              from the same organization will see the email address of the
              person who submitted the event and the list of participants and
              details of the participants of the registrations they have made.
              For non-members of a city organization, the reporter's email
              address will be seen by a moderator. There are 2- 5 moderators,
              depending on the entity being moderated. In terms of content
              management, event reporter data is visible to the city's Linked
              Events administrators (2-5 people) and development teams
            </p>
            <p>
              The Linked Events and Linked Registrations service is hosted on
              the City of Helsinki's Azure cloud, with servers located in
              Ireland. They are not mirrored to other Azure locations. Backups
              are stored in Azure in the same region as the servers themselves.
              No personal data is processed outside Helsinki.
            </p>
            <p>
              All personal data processed in the City's cloud service is
              protected by appropriate security keys (Microsoft EU Data
              Boundary). The data is kept for ten years after the event, in
              accordance with the retention period for municipal records.
            </p>
            <p>
              More information about{' '}
              <ExternalLink href="https://www.hel.fi/en/decision-making/information-on-helsinki/data-protection-and-information-management/data-protection/rights-of-data-subjects-and-exercising-these-rights">
                your rights under the EU General Data Protection Regulation in
                the City of Helsinki's online services
              </ExternalLink>
              .
            </p>
            <p>
              You can manage your user data in your Helsinki Profile or request
              the deletion of your user data by sending an email to linkedevents
              at hel.fi.
            </p>
            <p>
              The service also uses the City's Matomo visitor tracking solution,
              the data collected by which is described in the Cookies section.
            </p>
            <p>
              The information necessary for the reporting of event data will be
              collected by the user upon registration to the service. The User
              himself/herself applies for the rights to create content either by
              filling in a form on the Service or by sending an email, in
              accordance with Article 6 1(a) and (c) of the EU General Data
              Protection Regulation. The user has given his/her consent to the
              processing of personal data or the processing is necessary to
              comply with a legal obligation of the controller, i.e. the City of
              Helsinki.
            </p>
            <p>
              Participant data are collected based on the data provided by the
              notifier and are collected in accordance with Article 6 1(a)
              consent and Article 9 2(a) explicit consent of the EU General Data
              Protection Regulation.
            </p>
            <p>
              As a rule, data is kept for 5 years, but may be deleted earlier
              upon request. The data of registrants will be anonymised 30 days
              after the end of the event, after which it cannot be linked to an
              individual.
            </p>
            <p>
              <ExternalLink href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Sahkoisten%20asiointipalveluiden%20rekisteri.pdf">
                City of Helsinki’s Privacy Policy
              </ExternalLink>{' '}
              (in Finnish)
            </p>
            <p>
              <ExternalLink href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Tietosuojaseloste%20Linked%20Registrations.pdf">
                Registration tietosuojaseloste
              </ExternalLink>{' '}
              (in Finnish).
            </p>

            <h2>Cookies</h2>
            <p>
              The Linked Events service uses the City of Helsinki's own Matomo
              visitor tracking installation, which is also hosted on Azure's
              Openshift cloud platform.
            </p>
            <p>
              Cookies are files stored by the browser on the user's device.
              Cookies are used to enable features that make the Service easier
              to use and to collect information about users to improve the
              Service. Cookies allow us to provide you with a more user-friendly
              and functional website that better meets your needs.
            </p>
            <p>
              In terms of user data collection, cookies contain anonymous unique
              identifiers that allow us to collect information about users who
              visit our website, such as information about their browsers and
              devices. Website administrators do not have access to users'
              unique identifiers. Cookies provide us with information about
              which browsers are used on our sites and which pages are most
              frequently viewed.
            </p>
            <p>
              This website also contains content provided by external online
              service providers. External online service providers may install
              their own cookies on browsers.
            </p>
            <p>
              The user can control the use of cookies through a cookie consent.
            </p>
            <p>
              The information collected by Matomo solution for the purposes of
              visitor statistics is anonymous and cannot be linked to any
              individual person. This information includes
            </p>
            <ul>
              <li>IP address</li>
              <li>Geographical location on a city level</li>
              <li>Device model and operating system</li>
              <li>Browser used</li>
              <li>Timestamp</li>
              <li>Pages entering and leaving the service</li>
              <li>Pages visited and site activity</li>
            </ul>

            <h2>Terms of use for event information</h2>
            <p>
              Event information, images and other material added to the Linked
              Events interface (further the Material) are published under a{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.en">
                Creative Commons BY 4.0 license
              </ExternalLink>
              , unless otherwise stated.
            </p>
            <p>
              By using the interface, the user of the service who added the
              material agrees to the publication of the Material under a{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.en">
                Creative Commons BY 4.0 license
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
            <p>
              Linked Events, tapahtumatietojen hallintapalveluun, kirjaudutaan
              Helsingin kaupungin Helsinki profiililla joko kaupungin
              työntekijänä AD-kirjautuen tai Helsinki-tunnuksella, joka koostuu
              sähköpostiosoite ja salasana -yhdistelmästä. Linked Registration
              eli tapahtumiin ilmoittautuminen on mahdollista myös Helsinki
              profiililla vahvasti tunnistautuen.
            </p>
            <p>
              Helsinki profiili luovuttaa Linked Eventsille
              tapahtumailmoittajien tiedot:
            </p>
            <ul>
              <li>Etu- ja sukunimi</li>
              <li>Sähköpostiosoite</li>
              <li>
                Mitä organisaatiota/yrityksiä/yhteisöjä/järjestöjä käyttäjä
                edustaa
              </li>
              <li>Milloin käyttäjä kirjautuu palveluun ensimmäistä kertaa</li>
            </ul>
            <p>Linked Registration kerää ilmoittautujasta seuraavat tiedot:</p>
            <ul>
              <li>
                Osallistuja:
                <ul>
                  <li>Etu- ja sukunimi</li>
                  <li>Syntymäaika</li>
                  <li>Osoite</li>
                  <li>Postinumero</li>
                  <li>Kaupunki</li>
                  <li>
                    Lisätiedot (allergia-, esteettömyys- tai muu osallistumiseen
                    liittyvä lisätieto)
                  </li>
                </ul>
              </li>
              <li>
                Ja ilmoittajasta:
                <ul>
                  <li>Etu- ja sukunimi</li>
                  <li>Sähköpostiosoite</li>
                  <li>Puhelinnumero</li>
                  <li>Jäsenkortin numero</li>
                  <li>Äidinkieli</li>
                  <li>Asiointikieli</li>
                </ul>
              </li>
            </ul>
            <p>
              Tiedot tallennetaan Linked Events -tietokantaan, eikä niitä
              välitetä rajapinnan kautta eteenpäin. Itse palvelussa saman
              organisaation admin-käyttäjät näkevät tapahtuman ilmoittaneen
              sähköpostiosoitteen ja itse tekemiensä ilmoittautumisten
              osallistujalistan ja osallistujien tarkat tiedot.
              Kaupunkiorganisaation ulkopuolisten osalta ilmoittajan
              yhteystiedot näkee moderaattori, joita on 2-5 riippuen
              moderoitavasta kokonaisuudesta.
            </p>
            <p>
              Käyttöoikeuksien hallinnan osalta tapahtumailmoittajien tiedot
              näkevät kaupungin Linked Events -pääkäyttäjät (2-5 henkilöä) sekä
              kehitystiimit.
            </p>
            <p>
              Tapahtumiin ilmoittautuvien tiedot näkevät kaupungin Linked Events
              -pääkäyttäjät itse luomiensa tapahtumailmoittautumisten osalta,
              Linked Registration -pääkäyttäjät (2-6 henkilöä) näkevät kaikki
              oman toimialansa ilmoittautumisten osallistujatiedot ja
              Palvelukeskus Helsingin tapahtumailmoittautumisen asiakaspalvelun
              asiakaspalvelijat näkevät koko kaupungin tasoisesti kaikkien
              ilmoittautumisten osallistujalistat.
            </p>
            <p>
              Linked Events ja Registration -palvelu sijaitsee Helsingin
              kaupungin Azure-pilvipalvelussa, ja palvelimet sijaitsevat
              Irlannissa. Niitä ei peilata muihin Azure-lokaatioihin.
              Varmuuskopiot sijaitsevat Azuressa samalla alueella kuin itse
              palvelimetkin. Henkilötietoja ei käsitellä muualla kuin
              Helsingissä.
            </p>
            <p>
              Kaikki kaupungin pilvipalvelussa käsiteltävät henkilötiedot on
              suojattu asianmukaisin suojausavaimin (Microsoftin EU Data
              Boundary). Tietoja säilytetään viisi vuotta tapahtumasta
              kunnallisten asiakirjojen säilytysajan mukaisesti.
            </p>
            <p>
              Lisätietoa{' '}
              <ExternalLink href="https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja/rekisteroidyn-oikeudet-ja-niiden-toteuttaminen">
                EU:n yleisen tietosuoja-asetuksen mukaisista oikeuksista
              </ExternalLink>{' '}
              Helsingin kaupungin verkkopalveluissa
            </p>
            <p>
              Voit hallinnoida käyttäjätietojasi Helsinki profiilissa tai pyytää
              käyttäjätietojen poistoa lähettämällä viestin
              sähköpostiosoitteeseen linkedevents at hel.fi
            </p>
            <p>
              Palvelussa hyödynnetään myös kävijäseurantaan kaupungin
              Matomo-ratkaisua, jonka keräämät tiedot on kuvattu
              Evästeet-kohdassa.
            </p>
            <p>
              Tapahtumatietojen syöttämiseen tarvittavat tiedot kerätään
              käyttäjän itsensä antamana palveluun kirjauduttaessa.
              Sisällöntuotanto-oikeuksien osalta käyttäjä itse pyytää oikeuksia
              joko palvelusta löytyvällä lomakkeella tai sähköpostitse
              noudattaen EU:n yleisen tietosuoja-asetuksen 6 artiklan 1 a- ja
              c-kohtaa. Käyttäjä on antanut luvan henkilötietojensa käsittelyyn
              tai käsittely on tarpeen rekisterinpitäjän eli Helsingin kaupungin
              lakisääteisen velvoitteen noudattamiseksi.
            </p>
            <p>
              Osallistujatiedot kerätään ilmoittajan itsensä antamina ja tiedot
              kerätään noudattaen EU:n yleisen tietosuoja-asetuksen 6 artiklan 1
              a-kohtaa suostumus sekä 9 artiklan 2 a-kohtaa nimenomainen
              suostumus
            </p>
            <p>
              Tietoja säilytetään pääsääntöisesti 5 vuotta, mutta pyynnöstä ne
              poistetaan nopeammin. Ilmoittautuneiden tiedot anonymisoidaan 30
              päivää tapahtuman päättymisen jälkeen, jonka jälkeen niitä ei voi
              yhdistää henkilöön.
            </p>
            <p>
              <ExternalLink href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Sahkoisten%20asiointipalveluiden%20rekisteri.pdf">
                Helsingin kaupungin käyttöoikeuksien tietosuojaseloste.
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Tietosuojaseloste%20Linked%20Registrations.pdf">
                Registration tietosuojaseloste
              </ExternalLink>
            </p>

            <h2>Evästeet</h2>
            <p>
              Eväste (cookie) on tiedosto, jonka selain tallentaa käyttäjän
              päätelaitteelle. Evästeitä käytetään tarjoamaan palvelun käyttöä
              helpottavia ominaisuuksia ja niiden avulla voidaan myös kerätä
              tietoa käyttäjistä palvelun parantamiseksi. Evästeiden avulla
              tarjoamme sujuvammin käytettävän ja toimivan verkkosivuston, joka
              vastaa entistä paremmin käyttäjien tarpeita.
            </p>
            <p>
              Käyttäjäseurannan osalta evästeet sisältävät nimettömän,
              yksilöllisen tunnisteen, jonka avulla saamme tietoa sivustollamme
              vierailevista eri käyttäjistä, muun muassa heidän selaimistaan ja
              päätelaitteistaan. Käyttäjän yksilöiviä tietoja ei niistä näy
              sivuston ylläpitäjille. Evästeiden kautta saadaan tietoa siitä,
              miten selaimella liikutaan sivustoillamme ja minkälaisia sivuja
              katsotaan.
            </p>
            <p>
              Käyttäjällä on mahdollisuus vaikuttaa evästeiden käyttöön
              evästekyselyn kautta.
            </p>
            <p>
              Palvelun kävijätilastointia varten Matomo-ratkaisun keräämät
              tiedot anonymisoidaan, joten niitä ei voida liittää yksittäiseen
              henkilöön. Tällaisia tietoja ovat:
            </p>
            <ul>
              <li>IP-osoite</li>
              <li>Kaupunki-tasolla maantieteellinen sijainti</li>
              <li>Käytetty laitemalli ja käyttöjärjestelmä</li>
              <li>Käytetty selain</li>
              <li>Ajankohta</li>
              <li>Palveluun saapumis- ja palvelusta lähtösivut</li>
              <li>Palvelussa vieraillut sivut ja toiminta sivustolla</li>
            </ul>
            <h3>Hallitse evästeitä</h3>
            <p>
              Kävijäseurannan lisäksi erilaiset sisältöupotukset, kuten
              Youtube-videot hyödyntävät lisäksi omia evästeitään, joiden
              hallinta tapahtuu evästeasetusten kautta.
            </p>

            <h2>Tapahtumatietoihin liittyvät käyttöehdot</h2>
            <p>
              Linked Events –tapahtumarajapintaan lisätyt tapahtumatiedot, kuvat
              ja muu materiaali (yhdessä Materiaali) julkaistaan{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.fi">
                Creative Commons BY 4.0 -lisenssillä
              </ExternalLink>
              , ellei toisin mainita.
            </p>
            <p>
              Käyttämällä rajapintaa Materiaalia lisännyt palvelun käyttäjä
              hyväksyy Materiaalin julkaisemisen{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.fi">
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
            <p>
              Linked Events, tjänsten för hantering av evenemangsdata, är
              inloggad med Helsingfors stads profil, antingen som anställd vid
              Helsingfors stad med en AD-inloggning eller med ett Helsingfors-ID
              som består av en e-postadress och ett lösenord. Inloggning till
              länkad registrering, dvs. registrering till ett evenemang, är
              också möjlig med en Helsingforsprofil och stark autentisering.
            </p>
            <p>
              Helsingforsprofilen ger Linked Events information om annonsören av
              evenemanget:
            </p>
            <ul>
              <li>För- och efternamn</li>
              <li>E-post</li>
              <li>
                Vilken organisation/företag/samhälle/ förening representerar
                användaren
              </li>
              <li>När användaren loggar in första gången</li>
            </ul>
            <p>
              Linked Registration samlar in följande information om
              registreringar:
            </p>
            <ul>
              <li>
                Deltagare:
                <ul>
                  <li>För- och efternamn</li>
                  <li>Födelsedatum</li>
                  <li>Adress</li>
                  <li>Postnummer</li>
                  <li>Stad</li>
                  <li>
                    Ytterligare information (allergier, tillgänglighet eller
                    annan ytterligare information som rör deltagandet)
                  </li>
                </ul>
              </li>
              <li>
                Deklarant:
                <ul>
                  <li>För- och efternamn</li>
                  <li>E-postadress</li>
                  <li>Telefonnummer</li>
                  <li>Nummer på medlemskort</li>
                  <li>Modersmål</li>
                  <li>Språk för tjänsten</li>
                </ul>
              </li>
            </ul>
            <p>
              Denna information lagras i databasen för Linked Events och skickas
              inte via API:et. I själva tjänsten kommer administratörer från
              samma organisation att se e-postadressen till den person som
              skickade in evenemanget och listan över deltagare och uppgifter om
              deltagarna i de anmälningar som de har gjort. För icke-medlemmar i
              en stadsorganisation kommer reporterns e-postadress att ses av en
              moderator. Det finns 2-5 moderatorer, beroende på vilken enhet som
              modereras. När det gäller innehållshantering är uppgifter från
              evenemangsrapportörer synliga för stadens Linked
              Events-administratörer (2-5 personer) och utvecklingsteam.
            </p>
            <p>
              Tjänsten Linked Events och Linked Registration finns i Helsingfors
              stads Azure-moln med servrar i Irland. De speglas inte till andra
              Azure-platser. Säkerhetskopiorna finns i Azure i samma region som
              själva servrarna. Inga personuppgifter behandlas utanför
              Helsingfors.
            </p>
            <p>
              Alla personuppgifter som behandlas i stadens molntjänst skyddas av
              lämpliga säkerhetsnycklar (Microsoft EU Data Boundary).
              Uppgifterna sparas i tio år efter händelsen, i enlighet med
              arkiveringstiden för kommunala register.
            </p>
            <p>
              Mer information om{' '}
              <ExternalLink href="https://www.hel.fi/sv/beslutsfattande-och-forvaltning/information-om-helsingfors/dataskydd-och-informationshantering/dataskydd/den-registrerades-rattigheter-och-hur-man-kan-havda-dem">
                dina rättigheter enligt EU:s allmänna dataskyddsförordning på
                Helsingfors stads webbtjänster
              </ExternalLink>
              .
            </p>
            <p>
              Du kan hantera dina användaruppgifter i din Helsingfors profil
              eller begära radering av dina användaruppgifter genom att skicka
              ett e-postmeddelande till linkedevents at hel.fi.
            </p>
            <p>
              I tjänsten används också stadens Matomo-lösning för
              besökaruppföljning, vars insamlade uppgifter beskrivs i avsnittet
              Kakor.
            </p>
            <p>
              Den information som krävs för rapportering av händelsedata kommer
              att samlas in av användaren vid registrering i tjänsten.
              Användaren ansöker själv om rätten att skapa innehåll antingen
              genom att fylla i ett formulär på Tjänsten eller genom att skicka
              ett e-postmeddelande, i enlighet med artikel 6.1 a och c i EU:s
              allmänna dataskyddsförordning. Användaren har gett sitt samtycke
              till behandlingen av personuppgifter eller behandlingen är
              nödvändig för att uppfylla en rättslig skyldighet för den
              registeransvarige, dvs. Helsingfors stad.
            </p>
            <p>
              Deltagaruppgifter samlas in på grundval av de uppgifter som
              anmälaren tillhandahåller och samlas in i enlighet med artikel
              6.1a (samtycke) och artikel 9.2a (uttryckligt samtycke) i EU:s
              allmänna dataskyddsförordning.
            </p>
            <p>
              Uppgifterna sparas i regel i 5 år, men kan på begäran raderas
              tidigare. De registrerades uppgifter anonymiseras 30 dagar efter
              evenemangets slut, varefter de inte kan kopplas till en enskild
              person.
            </p>
            <p>
              <ExternalLink href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Sahkoisten%20asiointipalveluiden%20rekisteri.pdf">
                Helsingfors stads integritetspolicy
              </ExternalLink>{' '}
              (på finska).
            </p>
            <p>
              <ExternalLink href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Tietosuojaseloste%20Linked%20Registrations.pdf">
                Registration tietosuojaseloste
              </ExternalLink>{' '}
              (på finska).
            </p>

            <h2>Om kakor</h2>
            <p>
              Linked Events-tjänsten använder Helsingfors stads egen
              Matomo-installation för spårning av besökare, som också är hostad
              på Azures Openshift-molnplattform.
            </p>
            <p>
              En webbkaka (cookie) är filer som lagras av webbläsaren på
              användarens enhet. Kakor används för att möjliggöra funktioner som
              gör tjänsten enklare att använda och för att samla in information
              om användare i syfte att förbättra tjänsten. Kakor gör det möjligt
              för oss att ge dig en mer användarvänlig och funktionell webbplats
              som bättre uppfyller dina behov.
            </p>
            <p>
              När det gäller insamling av användardata innehåller kakor anonyma
              unika identifierare som gör det möjligt för oss att samla in
              information om användare som besöker vår webbplats, t.ex.
              information om deras webbläsare och enheter.
            </p>
            <p>
              Webbplatsadministratörer har inte tillgång till användarnas unika
              identifierare. Kakor ger oss information om vilka webbläsare som
              används på våra webbplatser och vilka sidor som oftast besöks.
            </p>
            <p>
              Denna webbplats innehåller också innehåll som tillhandahålls av
              externa leverantörer av onlinetjänster. Externa leverantörer av
              onlinetjänster kan installera sina egna kakor i webbläsare.
            </p>
            <p>
              Användaren har möjlighet att kontrollera användningen av kakor
              genom ett kakor samtycke.
            </p>
            <p>
              Den information som Matomo samlar in för besöksstatistik är anonym
              och kan inte kopplas till någon enskild person. Denna information
              omfattar
            </p>
            <ul>
              <li>IP-adress</li>
              <li>Geografisk plats på stadsnivå</li>
              <li>Enhetsmodell och operativsystem</li>
              <li>Webbläsare som används</li>
              <li>Tid</li>
              <li>Sidor som går in i och ut ur tjänsten</li>
              <li>Besökta sidor och aktivitet på webbplatsen</li>
            </ul>

            <h2>Användarvillkor för information om evenemang</h2>
            <p>
              Information om evenemang, bilder och annat material som läggs till
              i gränssnittet för Linked Events (vidare Materialet) publiceras
              under{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                Creative Commons BY 4.0 licens
              </ExternalLink>
              , om inte annat anges.
            </p>
            <p>
              Genom att använda gränssnittet samtycker den användare av tjänsten
              som lagt till materialet till publicering av materialet under en{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                Creative Commons BY 4.0 licens
              </ExternalLink>
              , utom i de fall då den person som lagt till bilden via
              gränssnittet inskränker rätten att använda bilden enligt
              beskrivningen nedan.
            </p>
            <p>
              Det är möjligt att begränsa användningen av den bild som anges i
              gränssnittet per bild i samband med det enskilda evenemanget i
              fråga (Event only-licens). Åtkomstbegränsningen binder
              applikationer som använder gränssnittet och andra användare av
              gränssnittet.
            </p>
            <p>
              Om avsnittet "Licens" i informationen i den bild som ska delas är
              markerat med "Användning begränsad till evenemanget", får bilden i
              gränssnittet Linked Events endast användas för information och
              kommunikation om evenemanget. Det är förbjudet att använda eller
              överföra bilden för andra ändamål. Vid användning av bilder är det
              viktigt att ange källan och upphovsmannen till bilderna.
            </p>
            <p>
              Den användare av tjänsten som lägger till material i tjänsten
              garanterar att han eller hon har de nödvändiga rättigheterna för
              att lägga till material i tjänsten. Helsingfors stad ansvarar inte
              för innehållet i Materialet eller relaterade immateriella
              rättigheter. Den person som lägger till material i tjänsten
              ansvarar för det material de lägger till och för att det inte gör
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
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('helpPage.pageTitle'), path: ROUTES.HELP },
              {
                title: t('helpPage.pageTitle'),
                path: ROUTES.SUPPORT,
              },
              {
                title: t('helpPage.pageTitleTermsOfUse'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.pageTitleTermsOfUse')}
      />
      {getContent(locale)}
    </PageWrapper>
  );
};

export default TermsOfUsePage;
