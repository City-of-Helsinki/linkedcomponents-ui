import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import imageEn1 from '../../../../assets/images/png/registration_instructions_1_EN.png';
import imageFi1 from '../../../../assets/images/png/registration_instructions_1_FI.png';
import imageSv1 from '../../../../assets/images/png/registration_instructions_1_SV.png';
import imageEn2 from '../../../../assets/images/png/registration_instructions_2_EN.png';
import imageFi2 from '../../../../assets/images/png/registration_instructions_2_FI.png';
import imageSv2 from '../../../../assets/images/png/registration_instructions_2_SV.png';
import imageEn3 from '../../../../assets/images/png/registration_instructions_3_EN.png';
import imageFi3 from '../../../../assets/images/png/registration_instructions_3_FI.png';
import imageSv3 from '../../../../assets/images/png/registration_instructions_3_SV.png';
import imageEn4 from '../../../../assets/images/png/registration_instructions_4_EN.png';
import imageFi4 from '../../../../assets/images/png/registration_instructions_4_FI.png';
import imageSv4 from '../../../../assets/images/png/registration_instructions_4_SV.png';
import imageEn5 from '../../../../assets/images/png/registration_instructions_5_EN.png';
import imageFi5 from '../../../../assets/images/png/registration_instructions_5_FI.png';
import imageSv5 from '../../../../assets/images/png/registration_instructions_5_SV.png';
import imageEn6 from '../../../../assets/images/png/registration_instructions_6_EN.png';
import imageFi6 from '../../../../assets/images/png/registration_instructions_6_FI.png';
import imageSv6 from '../../../../assets/images/png/registration_instructions_6_SV.png';
import imageEn7 from '../../../../assets/images/png/registration_instructions_7_EN.png';
import imageFi7 from '../../../../assets/images/png/registration_instructions_7_FI.png';
import imageSv7 from '../../../../assets/images/png/registration_instructions_7_SV.png';
import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import styles from './registrationInstructions.module.scss';

const DocumentationPage: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation();

  const images = useMemo(
    () => ({
      1: {
        altText: t('helpPage.registrationInstructionsPage.imageAltText1'),
        url: { en: imageEn1, fi: imageFi1, sv: imageSv1 },
      },
      2: {
        altText: t('helpPage.registrationInstructionsPage.imageAltText2'),
        url: { en: imageEn2, fi: imageFi2, sv: imageSv2 },
      },
      3: {
        altText: t('helpPage.registrationInstructionsPage.imageAltText3'),
        url: { en: imageEn3, fi: imageFi3, sv: imageSv3 },
      },
      4: {
        altText: t('helpPage.registrationInstructionsPage.imageAltText4'),
        url: { en: imageEn4, fi: imageFi4, sv: imageSv4 },
      },
      5: {
        altText: t('helpPage.registrationInstructionsPage.imageAltText5'),
        url: { en: imageEn5, fi: imageFi5, sv: imageSv5 },
      },
      6: {
        altText: t('helpPage.registrationInstructionsPage.imageAltText6'),
        url: { en: imageEn6, fi: imageFi6, sv: imageSv6 },
      },
      7: {
        altText: t('helpPage.registrationInstructionsPage.imageAltText7'),
        url: { en: imageEn7, fi: imageFi7, sv: imageSv7 },
      },
    }),
    [t]
  );

  const getImage = (
    index: 1 | 2 | 3 | 4 | 5 | 6 | 7,
    lang: 'en' | 'fi' | 'sv'
  ) => <img src={images[index].url[lang]} alt={images[index].altText} />;

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h2>Creating a registration</h2>
            <p>
              After publishing an event: go to the Registration section in
              Linked Events. Press the Add New button.
            </p>

            {getImage(1, 'en')}
            <p>
              Select the event for which you want to create a registration; you
              can also type in the field.
            </p>
            <p>
              You can also limit the search results by the date of the event. If
              you are creating an entry for a series, tick the Season entry box
              and the search results will show the umbrella event for the
              series.
            </p>
            {getImage(2, 'en')}
            <p>
              Once an event is selected, the system automatically imports the
              registration time, seat and queue information and age limits for
              the event.
            </p>
            <p>
              If necessary, specify the maximum size of the group. This
              determines how many participants can register on one form. If no
              value is entered here, the number of available places in the event
              determines the number of people who can register on a single form.
              If it is not desired that more than one person can be registered
              per form, this will be set to 1.
            </p>
            <p>
              Select the input languages you wish to use and enter any
              registration instructions and additional text for the confirmation
              message in the languages you have chosen. Please note that the
              languages displayed above the input fields for registration
              instructions and confirmation messages are tab options.
            </p>
            <p>
              The registration instructions field is automatically filled in
              with the contact details of the Helsinki Service Centre customer
              service. You can add text to the field and the automatic text can
              be removed if you wish.
            </p>
            {getImage(3, 'en')}
            <p>
              Please select the mandatory personal data fields on the
              registration form.
            </p>
            <p>
              <strong>
                Note! In accordance with the EU Data Protection Regulation,
                personal data should not be collected unnecessarily, so please
                exercise discretion as to which personal data are necessary for
                registration.
              </strong>
            </p>
            {getImage(4, 'en')}
            <p>
              Finally, add read access rights to the participant list for people
              who need to access the participant list.
            </p>
            <p>
              It is also possible here to assign a substitute for the enrolment
              in question from another city employee, so that the substitute has
              the same access rights to the enrolment as the enrolment creator.
            </p>
            <p>Save your registration.</p>
            {getImage(5, 'en')}

            <h2>Enrolment management</h2>
            <p>
              On the front page of the registration section, you will see a list
              of events for which registration has been created.
            </p>
            {getImage(6, 'en')}
            <p>
              From the front page, you can create a new registration by clicking
              on the Add new button.
            </p>
            <p>
              You can also use the three-dot menu at the end of the events bar
              to:
            </p>
            <ul>
              <li>Edit already created enrolment</li>
              <li>View the list of participants</li>
              <li>Mark attendees</li>
              <li>Export participants to an Excel</li>
              <li>Copy the enrolment as the basis for a new enrolment</li>
              <li>Copy the link to the registration form</li>
              <li>Delete the registration</li>
            </ul>

            <h2>Review of registrants</h2>
            <p>
              You can view the participants on the registration section home
              page by selecting the event from three-dot menu Show participants.
            </p>
            {getImage(7, 'en')}
            <p>
              On the event participants view, you can see both confirmed
              participants and those who have registered for the waiting list.
            </p>
            <p>On the view, you can</p>
            <ul>
              <li>Add a new participant</li>
              <li>Send a message to all participants</li>
              <li>Mark present attendess</li>
              <li>Export participants to an Excel</li>
              <li>View and edit individual participant data</li>
              <li>Send a message to an individual participant</li>
              <li>Withdraw a participant from the event</li>
            </ul>
            <p>
              A user with the administrator role can add participants to an
              event if there are still places available.
            </p>
            <p>
              If one of the participants cancels his/her participation, the
              first person on the waiting list will automatically be moved to
              the list of participants and the system will send an automatic
              message to that person confirming his/her participation.
            </p>
            <p>
              You can view and edit more detailed information about participant
              by clicking on the participant’s name or by using the three-dot
              menu on the right-hand side of the participant’s row.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h2>Ilmoittautumisen luominen</h2>
            <p>
              Julkaistuasi tapahtuman: Siirry Linked Eventsissä
              Ilmoittautuminen-osioon. Paina Lisää uusi -painiketta.
            </p>
            {getImage(1, 'fi')}
            <p>
              Valitse tapahtuma, jolle haluat luoda ilmoittautumisen; kenttään
              voi myös kirjoittaa.
            </p>
            <p>
              Voit myös rajata hakutuloksia tapahtuman ajankohdalla. Jos olet
              tekemässä ilmoittautumista sarjalle, täppää Kauden
              ilmoittautuminen -täppä, jolloin hakutuloksiin tulee näkyviin
              sarjan kattotapahtuma.
            </p>
            {getImage(2, 'fi')}
            <p>
              Kun tapahtuma on valittu, järjestelmä tuo automaattisesti
              tapahtumalta ilmoittautumisaika-, paikka- ja jonopaikkatiedot sekä
              ikärajat.
            </p>
            <p>
              Määritä tarvittaessa ryhmän enimmäiskoko. Tämä määrää kuinka monta
              osallistujaa voi ilmoittautua yhdellä lomakkeella. Jos tähän ei
              anna mitään arvoa, määrää tapahtumassa olevien vapaiden paikkojen
              määrä yhdellä lomakkeella ilmoitettavien määrän. Jos ei haluta,
              että lomakkeella voi ilmoittaa yhtä henkilöä enempää, tämä
              määritetään 1:ksi.
            </p>
            <p>
              Valitse haluamasi syöttökielet ja anna mahdolliset
              ilmoittautumisohjeet ja vahvistusviestin lisäteksti valitsemillasi
              kielillä. Huomaa, että ilmoittautumisohjeen ja vahvistusviestien
              syöttökenttien yläpuolella näkyvät kielet ovat välilehtivalintoja.
            </p>
            <p>
              lmoittautumisohjeet kentässä on automaattisesti täytettynä
              Palvelukeskus Helsingin asiakaspalvelun yhteystiedot. Kenttään voi
              lisätä tekstiä ja automaattitekstin saa poistettua niin
              halutessaan.
            </p>
            {getImage(3, 'fi')}
            <p>
              Valitse ilmoittautumislomakkeelle pakolliset henkilötietokentät.
            </p>
            <p>
              <strong>
                Huom! EU:n tietosuoja-asetuksen mukaisesti henkilötietoja ei
                tule kerätä tarpeettomasti, joten käytä harkintaa, mitkä
                henkilötiedot ovat ilmoittautumisen kannalta välttämättömiä.
              </strong>
            </p>
            {getImage(4, 'fi')}
            <p>
              Lisää lopuksi osallistujalistan lukuoikeudet niille henkilöille,
              joilla on tarve päästä lukemaan osallistujalistaa.
            </p>
            <p>
              Tässä voidaan myös määrittää toisesta kaupungin työntekijästä
              ilmoittautumisen tekijälle sijainen kyseiseen ilmoittautumiseen,
              jolloin sijaiseksi määritetty saa vastaavat käyttöoikeudet
              ilmoittautumiseen kuin sen tekijällä on.
            </p>
            <p>Tallenna ilmoittautuminen.</p>
            {getImage(5, 'fi')}

            <h2>Ilmoittautumisen hallinta</h2>
            <p>
              Ilmoittautuminen-osion etusivulla näet listan tapahtumista, joille
              on luotu ilmoittautuminen.
            </p>
            {getImage(6, 'fi')}
            <p>
              Etusivulta voit lähteä luomaan uutta ilmoittautumista Lisää uusi
              -painikkeella.
            </p>
            <p>Lisäksi voit tapahtumarivin lopusta kolmen pisteen valikosta:</p>
            <ul>
              <li>Muokata jo luotua ilmoittautumista</li>
              <li>Tarkastella osallistujalistaa</li>
              <li>Merkata läsnäolijat</li>
              <li>Tulostaa osallistujat Exceliin</li>
              <li>Kopioida ilmoittautuminen uuden ilmoittautumisen pohjaksi</li>
              <li>Kopioida linkin ilmoittautumislomakkeelle</li>
              <li>Poistaa ilmoittautumisen.</li>
            </ul>

            <h2>Ilmoittautuneiden tarkastelu</h2>
            <p>
              Ilmoittautuneita pääsee tarkastelemaan ilmoittautuminen-osion
              etusivulla valitsemalla tapahtuman kolmen pisteen valikosta Näytä
              ilmoittautuneet.
            </p>
            {getImage(7, 'fi')}
            <p>
              Tapahtumaan ilmoittautuneiden tarkastelunäkymässä näet sekä
              vahvistetut osallistujat että jonopaikoille ilmoittautuneet.
            </p>
            <p>Tarkastelunäkymässä voit</p>
            <ul>
              <li>Lisätä uuden osallistujan</li>
              <li>Lähettää viestin kaikille osallistujille</li>
              <li>Merkata läsnäolijat</li>
              <li>Tulostaa osallistujat exceliin</li>
              <li>Tarkastella ja muokata yksittäisen osallistujan tietoja</li>
              <li>Lähettää viestin yksittäiselle osallistujalle</li>
              <li>Peruuttaa osallistuja tapahtumasta</li>
            </ul>
            <p>
              Ylläpitäjä-roolin omaava käyttäjä voi lisätä tapahtumalle
              osallistujia, mikäli tapahtumalla on vapaita paikkoja jäljellä.
            </p>
            <p>
              Mikäli joku osallistujista peruu osallistumisensa, siirtyy
              ensimmäinen jonopaikkalistalta automaattisesti osallistujalistalle
              ja järjestelmästä lähtee automaattiviesti ko. henkilölle hänen
              vahvistetusta osallistumisestaan.
            </p>
            <p>
              Osallistujan tarkempia tietoja pääsee katsomaan ja muokkaamaan
              joko klikkaamalla osallistujan nimeä tai kolmen pisteen valikosta
              osallistujan rivin oikeasta reunasta.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h2>Skapa en anmälan</h2>
            <p>
              När du har publicerat ett evenemang: gå till avsnittet
              Registrering i Linked Events. Tryck på knappen Lägg till ny.
            </p>
            {getImage(1, 'sv')}
            <p>
              Välj det evenemang som du vill skapa en registrering för; du kan
              också skriva i fältet.
            </p>
            <p>
              Du kan också begränsa sökresultaten efter datumet för evenemanget.
              Om du skapar en anmälan för en serie, kryssa i rutan
              Säsongsanmälan så kommer sökresultaten att visa paraplytävlingen
              för serien.
            </p>
            {getImage(2, 'sv')}
            <p>
              När ett evenemang har valts importerar systemet automatiskt
              registreringstiden, plats- och köinformationen och åldersgränserna
              för evenemanget.
            </p>
            <p>
              Ange vid behov den maximala gruppstorleken. Detta avgör hur många
              deltagare som kan registreras på ett enda formulär. Om inget värde
              anges här, avgör antalet tillgängliga platser på evenemanget hur
              många personer som kan registrera sig på ett enda formulär. Om det
              inte är önskvärt att mer än en person kan registreras per
              formulär, kommer detta att sättas till 1.
            </p>
            <p>
              Välj de inmatningsspråk du vill använda och ange eventuella
              registreringsinstruktioner och ytterligare text för
              bekräftelsemeddelandet på de språk du har valt. Observera att de
              språk som visas ovanför inmatningsfälten för
              registreringsinstruktioner och bekräftelsemeddelanden är
              flikalternativ.
            </p>
            <p>
              Fältet för registreringsanvisningar fylls automatiskt i med
              kontaktuppgifterna för Helsingfors servicecenters kundtjänst. Du
              kan lägga till text i fältet och den automatiska texten kan tas
              bort om du vill.
            </p>
            {getImage(3, 'sv')}
            <p>
              Vänligen välj de obligatoriska fälten för personuppgifter på
              registreringsformuläret.
            </p>
            <p>
              <strong>
                Observera! I enlighet med EU:s dataskyddsförordning ska
                personuppgifter inte samlas in i onödan, så vi ber dig att
                avgöra vilka personuppgifter som är nödvändiga för
                registreringen.
              </strong>
            </p>
            {getImage(4, 'sv')}
            <p>
              Slutligen, lägg till läsbehörighet till deltagarlistan för
              personer som behöver komma åt deltagarlistan.
            </p>
            <p>
              Här är det också möjligt att tilldela en ersättare för den
              aktuella inskrivningen från en annan stadsanställd, så att
              ersättaren har samma åtkomsträttigheter till inskrivningen som
              skaparen av inskrivningen.
            </p>

            <h2>Spara inskrivningen.</h2>
            {getImage(5, 'sv')}
            <h2>Hantering av inskrivningar</h2>
            <p>
              På förstasidan i registreringsavsnittet ser du en lista över
              evenemang för vilka registrering har skapats.
            </p>
            {getImage(6, 'sv')}
            <p>
              Från förstasidan kan du skapa en ny registrering genom att klicka
              på knappen Lägg till ny.
            </p>
            <p>
              Du kan också använda menyn med tre punkter i slutet av
              evenemangsfältet:
            </p>
            <ul>
              <li>Redigera redan skapad enrolmet</li>
              <li>Visa listan över deltagare</li>
              <li>Markera deltagare</li>
              <li>Exportera deltagare till en Excel-fil</li>
              <li>Kopiera inskrivningen som grund för en ny inskrivning</li>
              <li>Kopiera länken till registreringsformuläret</li>
              <li>Ta bort registreringen</li>
            </ul>
            <h2>Granskning av registranter</h2>
            <p>
              Du kan se deltagarna på startsidan för registreringsavsnittet
              genom att välja evenemanget i menyn Visa deltagare.
            </p>
            {getImage(7, 'sv')}
            <p>
              I vyn för deltagare i evenemanget kan du se både bekräftade
              deltagare och de som har registrerat sig på väntelistan.
            </p>
            <p>I vyn kan du</p>
            <ul>
              <li>Lägg till en ny deltagare</li>
              <li>Skicka ett meddelande till alla deltagare</li>
              <li>Mark närvarande deltagare</li>
              <li>Exportera deltagare till en Excel-fil</li>
              <li>Visa och redigera uppgifter om enskilda deltagare</li>
              <li>Skicka ett meddelande till en enskild deltagare</li>
              <li>Dra tillbaka en deltagare från evenemanget</li>
            </ul>
            <p>
              En användare med administratörsrollen kan lägga till deltagare i
              ett evenemang om det fortfarande finns lediga platser.
            </p>
            <p>
              Om en av deltagarna ställer in sitt deltagande flyttas den första
              personen på väntelistan automatiskt till deltagarlistan och
              systemet skickar ett automatiskt meddelande till den personen för
              att bekräfta hans/hennes deltagande.
            </p>
            <p>
              Du kan visa och redigera mer detaljerad information om deltagaren
              genom att klicka på deltagarens namn eller genom att använda menyn
              med tre punkter på höger sida av deltagarens rad.
            </p>
          </>
        );
    }
  };

  return (
    <PageWrapper
      className={styles.registrationInstructions}
      title="helpPage.registrationInstructionsPage.pageTitle"
    >
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('helpPage.pageTitle'), path: ROUTES.HELP },
              {
                title: t('helpPage.sideNavigation.labelInstructions'),
                path: ROUTES.INSTRUCTIONS,
              },
              {
                title: t(
                  'helpPage.sideNavigation.labelRegistrationInstructions'
                ),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.sideNavigation.labelRegistrationInstructions')}
      />
      {getContent(locale)}
    </PageWrapper>
  );
};

export default DocumentationPage;
