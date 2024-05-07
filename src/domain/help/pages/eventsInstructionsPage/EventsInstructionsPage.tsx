/* eslint-disable import/no-duplicates */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import imageEn1 from '../../../../assets/images/png/events_instructions_1_EN.png';
import imageFi1 from '../../../../assets/images/png/events_instructions_1_FI.png';
import imageSv1 from '../../../../assets/images/png/events_instructions_1_SV.png';
import imageEn2 from '../../../../assets/images/png/events_instructions_2_EN.png';
import imageFi2 from '../../../../assets/images/png/events_instructions_2_FI.png';
import imageSv2 from '../../../../assets/images/png/events_instructions_2_SV.png';
import imageEn3 from '../../../../assets/images/png/events_instructions_3_EN.png';
import imageFi3 from '../../../../assets/images/png/events_instructions_3_FI.png';
import imageSv3 from '../../../../assets/images/png/events_instructions_3_SV.png';
import imageEn4 from '../../../../assets/images/png/events_instructions_4_EN.png';
import imageFi4 from '../../../../assets/images/png/events_instructions_4_FI.png';
import imageSv4 from '../../../../assets/images/png/events_instructions_4_SV.png';
import imageEn5 from '../../../../assets/images/png/events_instructions_5_EN.png';
import imageFi5 from '../../../../assets/images/png/events_instructions_5_FI.png';
import imageSv5 from '../../../../assets/images/png/events_instructions_5_SV.png';
import imageEn6 from '../../../../assets/images/png/events_instructions_6_EN.png';
import imageFi6 from '../../../../assets/images/png/events_instructions_6_FI.png';
import imageSv6 from '../../../../assets/images/png/events_instructions_6_SV.png';
import imageEn7 from '../../../../assets/images/png/events_instructions_7_EN.png';
import imageFi7 from '../../../../assets/images/png/events_instructions_7_FI.png';
import imageSv7 from '../../../../assets/images/png/events_instructions_7_SV.png';
import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import ExternalLink from '../../../../common/components/externalLink/ExternalLink';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import styles from './eventsInstructionsPage.module.scss';

const EventsInstructionsPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

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
            <h2>General</h2>
            <p>
              Linked Events is the event interface of the City of Helsinki.
              Events entered into the interface are automatically transferred to
              the{' '}
              <ExternalLink href="https://tapahtumat.hel.fi/en/home">
                tapahtumat.hel.fi page
              </ExternalLink>
              , the{' '}
              <ExternalLink href="https://www.myhelsinki.fi/en">
                MyHelsinki.fi page
              </ExternalLink>
              , the{' '}
              <ExternalLink href="https://palvelukartta.hel.fi/en/">
                Service map
              </ExternalLink>{' '}
              and other applications not maintained by the City. It is therefore
              advisable to make the description of the event easy to understand
              in the different places where it is used.
            </p>
            <p>
              The interface's input interface can be found at{' '}
              <ExternalLink href="https://linkedevents.hel.fi/">
                linkedevents.hel.fi
              </ExternalLink>
              . Access is granted by first logging in to the service and then
              sending a request for confirmation of access. The UI can be
              accessed from anywhere, including mobile devices. Editing rights
              are available for events in your own organisation.
            </p>
            <p>
              You can enter events into the interface with the permission of the
              City of Helsinki. Events do not have to be open to everyone, but
              the restrictions must be clearly stated in the event description.
            </p>
            <p>In the interface you can</p>
            <ol type="a">
              <li>search for all events in the city</li>
              <li>browse and edit events in your organisation</li>
              <li>add new events</li>
              <li>
                moderate events, i.e. accept events added by third parties for
                publication
              </li>
            </ol>
            <p>
              All the days of a recurring event can be added at the same time
            </p>

            <h2>Creating an event</h2>
            <p>To start creating an event, press the Add new event button.</p>
            {getImage(1, locale)}
            <p>
              Event information must be entered at least in Finnish. Swedish and
              English should be filled in for large events and events suitable
              for language target groups. Fill in the information as widely and
              accurately as possible. The help texts on the form will assist you
              in filling in the form.
            </p>
            {getImage(2, locale)}

            <p>
              In the Time section, once the dates and times have been entered,
              remember to press the Add time button. Otherwise, the desired time
              will not be saved in the event data and the event will not be
              published.
            </p>
            <p>
              To add a recurring event, there is an Add date button and a
              Recurring event tab for a regularly recurring event.
            </p>
            {getImage(3, locale)}
            {getImage(4, locale)}

            <p>
              The venue of the event is chosen from the locations on the city's
              register of business locations. The address and other details are
              therefore automatically retrieved when the right venue is found.
            </p>
            {getImage(5, locale)}

            <h3>Add an image</h3>
            <p>
              Always try to find a image of the event. You can label the image
              with{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.en">
                CC 4.0 BY
              </ExternalLink>{' '}
              or "use only in connection with the event".
            </p>
            <p>
              Before uploading, edit the image to fit the web and to a 3:2
              aspect ratio, for example 1200x800px. It is essential that the
              file size remains reasonable also for mobile use, preferably less
              than 200 kilobytes.
            </p>
            <p>
              Alt text, or alternative text to the image, is a verbal
              description of the image for people who cannot see the image
              itself for one reason or another. Alt text is a required field. In
              the alt text, briefly describe the content of the image, e.g.
              "Children playing in the yard". The alt text should not be used to
              describe things that are not directly visible in the image. The
              use of alt text is regulated by the EU-wide Accessibility
              Directive. The directive makes it mandatory to include alt text in
              every image.
            </p>
            <p>
              Caption and descriptor are not mandatory, but it is a good idea to
              fill them in. However, the image licence (see below for more
              details) may require the name of the caption to be included. It is
              good practice to enter the name of the photographer whenever it is
              known. Always ensure that you or the party you represent has the
              right to use the image in the marketing of the event. It is always
              the responsibility of the person entering the image to ensure that
              they have the right to use it.
            </p>
            <p>
              It is also the responsibility of the user to choose the correct
              licence.
            </p>
            <p>
              Unless otherwise agreed with the photographer or the owner of the
              rights to the image, choose the licence "Use limited to event".
              The name of the photographer and/or other rights holder of the
              image must always be specified in the Photographer section.
              <ExternalLink href="https://api.hel.fi/linkedevents/v1/">
                Definition of the Event only licence
              </ExternalLink>
              .
            </p>
            <p>
              If the image you are using has an extended{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.en">
                CC 4.0 BY
              </ExternalLink>{' '}
              or equivalent licence, the name of the photographer must still
              always be specified in the Name of the photographer section.
            </p>
            <p>
              Use horizontal images with an aspect ratio of 3:2. The recommended
              size for images is 1200px X 800px. Images larger than 2 megabytes
              cannot be uploaded to the interface.
            </p>
            {getImage(6, locale)}

            <h3>Classification</h3>
            <p>
              Classifying an event by keywords is important so that users of
              different applications can find the event in a large mass of
              events. Choose more than one keyword and give preference to those
              that have been used in several events. Keywords (see YSO glossary)
              are most often found in plural form, e.g. books, families, plays
              and paintings.
            </p>
            <p>
              The main categories and target groups are primarily for hel.fi,
              but are also visible to other users of the interface. If an event
              has multiple dates, it may take a while to save. If you do not
              receive an error message after pressing the Publish Event button,
              please wait a moment, when the form should move to the next
              screen.
            </p>

            <h2>Event management</h2>
            <p>
              In the My Events section, you can see lists of events that have
              been published or saved in draft form at the organisational level
              to which you have access.
            </p>
            {getImage(7, locale)}
            <p>
              You can process these events from the three-dot menu at the end of
              the event bar:
            </p>
            <ul>
              <li>edit event information</li>
              <li>copy the event to create a new event</li>
              <li>send email</li>
              <li>postpone an event</li>
              <li>cancel an event</li>
              <li>delete an event</li>
            </ul>
            <p>
              A cancelled event cannot be edited and a deleted event cannot be
              restored.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h2>Yleistä</h2>
            <p>
              Linked Events on Helsingin kaupungin tapahtumarajapinta.
              Rajapintaan syötetyt tapahtumat siirtyvät automaattisesti mm.{' '}
              <ExternalLink href="https://tapahtumat.hel.fi/fi/home">
                tapahtumat.hel.fi-sivulle
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://www.myhelsinki.fi/fi">
                MyHelsinki.fi-sivulle
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://palvelukartta.hel.fi/fi/">
                Palvelukartalle
              </ExternalLink>{' '}
              ja myös muihin kuin kaupungin ylläpitämiin sovelluksiin.
              Tapahtuman kuvaus kannattaa siksi laatia helposti ymmärrettäväksi
              eri käyttöpaikoissa.
            </p>
            <p>
              Rajapinnan syöttökäyttöliittymä löytyy osoitteesta{' '}
              <ExternalLink href="https://linkedevents.hel.fi/">
                linkedevents.hel.fi
              </ExternalLink>
              . Käyttöoikeuden saa kirjautumalla ensin palveluun ja lähettämällä
              tämän jälkeen oikeuksien vahvistuspyynnön. Käyttöliittymää voi
              käyttää mistä vain ja myös mobiililaitteilla. Muokkausoikeus on
              oman organisaation tapahtumille.
            </p>
            <p>
              Rajapintaan saa syöttää tapahtumia Helsingin kaupungin luvalla.
              Tapahtumien ei tarvitse olla kaikille avoimia, mutta rajoitukset
              on kerrottava selkeästi tapahtuman kuvauksessa.
            </p>
            <p>Käyttöliittymässä voi</p>
            <ol type="a">
              <li>hakea kaikista kaupungin tapahtumista</li>
              <li>selata ja muokata oman organisaation tapahtumia</li>
              <li>lisätä uusia tapahtumia</li>
              <li>
                moderoida tapahtumia, eli hyväksyä julkaistavaksi kolmansien
                osapuolien lisäämiä tapahtumia
              </li>
            </ol>
            <p>Toistuvan tapahtuman kaikki päivät voi lisätä samalla kertaa</p>
            <h2>Tapahtuman luominen</h2>
            <p>
              Aloita tapahtuman luominen painamalla Lisää uusi tapahtuma
              -painiketta.
            </p>
            {getImage(1, locale)}
            <p>
              Tapahtuman tiedot on syötettävä ainakin suomeksi. Ruotsin- ja
              englanninkieliset tiedot on syytä täyttää suurissa ja
              kielikohderyhmille sopivissa tapahtumissa. Täytä tiedot niin
              laajasti ja tarkasti kuin mahdollista. Lomakkeen ohjetekstit
              avustavat täyttämisessä.
            </p>
            {getImage(2, locale)}
            <p>
              Ajankohta-kohdassa kun on annettu päivämäärät ja kellonajat, tulee
              muistaa painaa Lisää ajankohta - painiketta. Muutoin haluttu
              ajankohta ei tallennu tapahtuman tietoihin ja tapahtuman julkaisu
              estyy.
            </p>
            <p>
              Useana päivänä toistuvan tapahtuman lisäämiseksi on Lisää uusi
              ajankohta -nappi ja säännöllisesti toistuvalle tapahtumalle oma
              Toistuva tapahtuma -työkalu.
            </p>
            {getImage(3, locale)}
            {getImage(4, locale)}
            <p>
              Tapahtuman paikka valitaan kaupungin toimipisterekisterin
              paikoista. Osoite- ja muut tiedot haetaan siis automaattisesti,
              kun oikea paikka löytyy.
            </p>
            {getImage(5, locale)}
            <h3>Kuvan lisääminen</h3>
            <p>
              Pyri aina löytämään tapahtumalle kuva. Kuvalle voi merkitä
              käyttöoikeuden{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.fi">
                CC 4.0 BY
              </ExternalLink>{' '}
              tai "käyttö vain tapahtuman yhteydessä".
            </p>
            <p>
              Muokkaa kuva ennen syöttöä verkkoon sopivaksi ja
              3:2-vaakakuvasuhteeseen, esimerkiksi 1200x800px. Olennaista on,
              että tiedostokoko pysyy kohtuullisena myös mobiilikäyttöön eli
              mieluiten alle 200 kilotavua.
            </p>
            <p>
              Alt-teksti eli kuvan vaihtoehtoinen teksti on kuvan sanallinen
              kuvailu sellaisille henkilöille, jotka eivät syystä tai toisesta
              voi nähdä itse kuvaa. Alt-teksti on pakollinen kenttä. Kuvaile
              alt-tekstissä lyhyesti kuvan sisältö, esimerkiksi "Lapsia
              leikkimässä pihalla". huomioi, että alt-teksti ei ole kuvateksti.
              Alt-tekstissä ei siis saa kertoa sellaisista asioita, jotka eivät
              näy suoraan kuvassa. Alt-tekstin käyttöä säätelee EU:n laajuinen
              saavutettavuusdirektiivi. Direktiivistä seuraa, että alt-tekstin
              syöttäminen on pakollista jokaiselle kuvalle.
            </p>
            <p>
              Kuvateksti ja kuvaaja eivät ole pakollisia, mutta ne on hyvä
              täyttää. Kuvan lisenssissä (katso alta lisää) voidaan kuitenkin
              vaatia, että kuvaajan nimi mainitaan. On hyvä käytäntö syöttää
              kuvaajan nimi aina jos se on tiedossa. Varmista aina, että sinulla
              tai edustamallasi taholla on oikeus käyttää kuvaa tapahtuman
              markkinoinnissa. Kuvan käyttöoikeuden varmistaminen on aina kuvan
              syöttäjän vastuulla.
            </p>
            <p>Myös oikean lisenssin valinta on käyttäjän vastuulla.</p>
            <p>
              Jos kuvaajan tai kuvan oikeudenomistajan kanssa ei ole erikseen
              muuta sovittu, valitse kuvalle lisenssi "Käyttö rajattu tapahtuman
              yhteyteen". Kuvaajan nimi ja/tai muu kuvan oikeudenomistaja pitää
              aina määritellä kohdassa Kuvaaja.{' '}
              <ExternalLink href="https://api.hel.fi/linkedevents/v1/">
                Event only -lisenssin määritelmä
              </ExternalLink>
              .
            </p>
            <p>
              Jos käyttämälläsi kuvalla on laajempi{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.fi">
                CC 4.0 BY -lisenssi
              </ExternalLink>{' '}
              tai vastaava lisenssi, pitää kuvaajan nimi silti aina määritellä
              kohdassa Kuvaajan nimi.
            </p>
            <p>
              Käytä vaakakuvia, jotka ovat kuvasuhteessa 3:2. Suositeltu mitta
              kuville on 1200px X 800px. Yli 2 megatavun kokoisia kuvia ei voi
              syöttää rajapintaan.
            </p>
            {getImage(6, locale)}

            <h3>Luokittelu</h3>
            <p>
              Tapahtuman luokittelu asiasanoilla on tärkeää, jotta eri
              sovellusten käyttäjät löytävät tapahtuman suuresta
              tapahtumamassasta. Valitse useampi asiasana ja suosi niitä, joita
              on käytetty useissa tapahtumissa. Asiasanat (ks. YSO-sanasto)
              löytyvät useimmiten monikkomuodossa, esim. kirjat, perheet,
              näytelmät ja maalaukset.
            </p>
            <p>
              Pääkategoriat ja kohderyhmät ovat ensijaisesti hel.fi-sivustoa
              varten, mutta ne näkyvät myös muille rajapinnan hyödyntäjille. Jos
              tapahtumalla on useita päivämääräkertoja, voi tallentamisessa
              kestää hetken. Jos et saa Julkaise tapahtuma -napin painamisen
              jälkeen virheilmoitusta, odota hetki, jolloin lomakkeen pitäisi
              siirtyä seuraavaan näkymään.
            </p>

            <h2>Tapahtuman hallinta</h2>
            <p>
              Omat tapahtumat -osiossa näet listat tapahtumista, jotka on
              julkaistu tai tallennettu luonnokseksi organisaatiotasossa, johon
              sinulla on käyttöoikeus.
            </p>
            {getImage(7, locale)}
            <p>
              Näitä tapahtumia voit käsitellä tapahtumarivin lopusta kolmen
              pisteen valikosta:
            </p>
            <ul>
              <li>muokata tapahtuman tietoja</li>
              <li>kopioida tapahtuma uuden tapahtuman pohjaksi</li>
              <li>lähettää sähköpostia</li>
              <li>lykätä tapahtumaa</li>
              <li>peruuttaa tapahtuman</li>
              <li>poistaa tapahtuman</li>
            </ul>
            <p>
              Peruutettua tapahtumaa ei pysty muokkaamaan eikä poistettua
              tapahtumaa pystytä palauttamaan.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h2>Allmänt</h2>
            <p>
              Linked Events är Helsingfors stads gränssnitt för evenemang.
              Evenemang som registreras i gränssnittet överförs automatiskt till
              sidan{' '}
              <ExternalLink href="https://tapahtumat.hel.fi/sv/home">
                tapahtumat.hel.fi
              </ExternalLink>
              , sidan{' '}
              <ExternalLink href="https://www.myhelsinki.fi/sv">
                MyHelsinki.fi
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://palvelukartta.hel.fi/sv/">
                Servicekartan
              </ExternalLink>{' '}
              och andra applikationer som inte upprätthålls av staden. Det lönar
              sig därför att göra beskrivningen av evenemanget så lättförståelig
              som möjligt på de olika ställen där den används.
            </p>
            <p>
              Gränssnittets inmatningsgränssnitt finns på adressen
              <ExternalLink href="https://linkedevents.hel.fi/">
                linkedevents.hel.fi
              </ExternalLink>
              . Åtkomst beviljas genom att först logga in på tjänsten och sedan
              skicka en begäran om bekräftelse på åtkomst. Kontrollpanelen kan
              nås från var som helst, även från mobila enheter.
              Redigeringsrättigheter finns för evenemang i den egna
              organisationen.
            </p>
            <p>
              Du kan lägga in evenemang i gränssnittet med tillstånd från
              Helsingfors stad. Evenemangen behöver inte vara öppna för alla,
              men begränsningarna ska tydligt framgå av evenemangsbeskrivningen.
            </p>
            <p>I gränssnittet kan du</p>
            <ol type="a">
              <li>söka efter alla evenemang i staden</li>
              <li>bläddra bland och redigera evenemang i din organisation</li>
              <li>lägga till nya evenemang</li>
              <li>
                moderera evenemang, dvs. godkänna evenemang som lagts till av
                tredje part för publicering
              </li>
            </ol>
            <p>
              Alla dagar för ett återkommande evenemang kan läggas till
              samtidigt
            </p>

            <h2>Skapa ett evenemangg</h2>
            <p>
              För att börja skapa ett evenemang trycker du på knappen Lägg till
              nytt evenemang.
            </p>
            {getImage(1, locale)}
            <p>
              Evenemangsuppgifterna ska anges åtminstone på finska. Svenska och
              engelska bör fyllas i för stora evenemang och evenemang som lämpar
              sig för språkliga målgrupper. Fyll i uppgifterna så mångsidigt och
              noggrant som möjligt. Hjälptexterna på blanketten hjälper dig att
              fylla i blanketten.
            </p>
            {getImage(2, locale)}
            <p>
              När du har angett datum och tid i avsnittet Tid måste du komma
              ihåg att trycka på knappen Lägg till tid för evenemang. Annars
              sparas inte den önskade tiden i evenemangsdata och evenemanget
              publiceras inte.
            </p>
            <p>
              Om du vill lägga till en återkommande evenemang finns det en knapp
              Lägg till tid för evenemang och en flik återkommande evenemang för
              en regelbundet återkommande evenemang.
            </p>
            {getImage(3, locale)}
            {getImage(4, locale)}

            <p>
              Platsen för evenemanget väljs bland de platser som finns i stadens
              register över affärslokaler. Adressen och andra uppgifter hämtas
              därför automatiskt när rätt plats hittas.
            </p>
            {getImage(5, locale)}

            <h3>Lägg till en bild</h3>
            <p>
              Försök alltid att hitta en bild av evenemanget. Du kan märka
              bilden med{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                CC 4.0 BY
              </ExternalLink>{' '}
              eller "använd endast i samband med evenemanget".
            </p>
            <p>
              Innan du laddar upp bilden ska du redigera den så att den passar
              webben och ett bildförhållande på 3:2, till exempel 1200x800px.
              Det är viktigt att filstorleken förblir rimlig även för mobil
              användning, helst mindre än 200 kilobyte.
            </p>
            <p>
              Alt-text, eller alternativ text till bilden, är en verbal
              beskrivning av bilden för personer som av olika anledningar inte
              kan se själva bilden. Alt-text är ett obligatoriskt fält. I
              alt-texten ska du kortfattat beskriva bildens innehåll, t.ex.
              "Barn som leker på gården". Alt-texten ska inte användas för att
              beskriva sådant som inte direkt syns i bilden. Användningen av
              alt-text regleras av det EU-omfattande tillgänglighetsdirektivet.
              Direktivet gör det obligatoriskt att inkludera alt-text i varje
              bild.
            </p>
            <p>
              Bildtext och fotograf är inte obligatoriska, men det är en god idé
              att fylla i dem. Bildlicensen (se nedan för mer information) kan
              dock kräva att namnet på bildtexten anges. Det är god praxis att
              ange fotografens namn när det är känt. Försäkra dig alltid om att
              du eller den du representerar har rätt att använda bilden i
              marknadsföringen av evenemanget. Det är alltid den som lägger in
              bilden som ansvarar för att säkerställa att han eller hon har rätt
              att använda den.
            </p>
            <p>Det är också användarens ansvar att välja rätt licens.</p>
            <p>
              Om inte annat avtalats med fotografen eller den som äger
              rättigheterna till bilden, välj licensen "Användning begränsad
              till evenemanget". Namnet på fotografen och/eller annan
              rättighetsinnehavare till bilden måste alltid anges i avsnittet
              Fotograf.{' '}
              <ExternalLink href="https://api.hel.fi/linkedevents/v1/">
                Definition av licensen "Endast för evenemang"
              </ExternalLink>
              .
            </p>
            <p>
              Om bilden du använder har en utökad{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                CC BY 4.0-licens
              </ExternalLink>{' '}
              eller motsvarande, måste fotografens namn ändå alltid anges i
              avsnittet Fotografens namn.
            </p>
            <p>
              Använd horisontella bilder med ett bildförhållande på 3:2.
              Rekommenderad storlek på bilder är 1200px X 800px. Bilder som är
              större än 2 megabyte kan inte laddas upp till gränssnittet.
            </p>
            {getImage(6, locale)}

            <h3>Klassificering</h3>
            <p>
              Att klassificera ett evenemang med nyckelord är viktigt för att
              användare av olika applikationer ska kunna hitta evenemanget i en
              stor mängd evenemang. Välj mer än ett nyckelord och ge företräde
              åt dem som har använts i flera evenemang. Nyckelord (se YSO:s
              ordlista) förekommer oftast i pluralform, t.ex. böcker, familjer,
              pjäser och målningar.
            </p>
            <p>
              Huvudkategorierna och målgrupperna är i första hand avsedda för
              hel.fi, men de är också synliga för andra användare av
              gränssnittet. Om ett evenemang har flera datum kan det ta en stund
              att spara. Om du inte får ett felmeddelande efter att ha tryckt på
              knappen Publicera evenemang, vänligen vänta en stund, då
              formuläret bör gå till nästa skärm.
            </p>

            <h2>Eventhantering</h2>
            <p>
              I avsnittet Mina evenemangen kan du se listor över evenemangen som
              har publicerats eller sparats i utkastform på den
              organisationsnivå som du har tillgång till.
            </p>
            {getImage(7, locale)}
            <p>
              Du kan bearbeta dessa evenemang från trepunktsmenyn i slutet av
              händelsefältet:
            </p>
            <ul>
              <li>redigera evenemang</li>
              <li>kopiera som mall</li>
              <li>skicka e-post</li>
              <li>skjut upp evenemang</li>
              <li>avbryt evenemang</li>
              <li>tat bort evenemang</li>
            </ul>
            <p>
              En avbruten evenemang kan inte redigeras och en borttagen
              evenemang kan inte återställas.
            </p>
          </>
        );
    }
  };

  return (
    <PageWrapper
      className={styles.eventsInstructions}
      description="helpPage.pageDescriptionEventsInstructions"
      keywords={['keywords.eventsInstructions', 'keywords.help']}
      title="helpPage.pageTitleEventsInstructions"
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
                title: t('helpPage.sideNavigation.labelEventsInstructions'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.sideNavigation.labelEventsInstructions')}
      />
      {getContent(locale)}
    </PageWrapper>
  );
};

export default EventsInstructionsPage;
