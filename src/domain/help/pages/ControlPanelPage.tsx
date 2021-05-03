import React from 'react';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import PageWrapper from '../../app/layout/PageWrapper';

const ControlPanelPage = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>Control panel</h1>
            <h2>General</h2>
            <p>
              Linked Events is the event interface of the City of Helsinki. The
              events entered in the interface are automatically transferred to
              e.g.{' '}
              <ExternalLink href="https://tapahtumat.hel.fi/en/home">
                tapahtumat.hel.fi page
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://www.myhelsinki.fi/en">
                MyHelsinki.fi page
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://palvelukartta.hel.fi/en/">
                Service map
              </ExternalLink>{' '}
              and also for applications other than those maintained by the city.
              The description of the event should therefore be made easy to
              understand in the various places of use.
            </p>
            <p>
              The input user interface of the API can be found at{' '}
              <ExternalLink href="https://linkedevents.hel.fi/">
                linkedevents.hel.fi
              </ExternalLink>
              . You can get access by first logging in to the service and then
              sending a confirmation request. The control panel can be used from
              anywhere and also on mobile devices. You have the right to edit
              events in your organization.
            </p>
            <p>
              Events may be entered into the interface with the permission of
              the City of Helsinki. Events do not have to be open to everyone,
              but restrictions must be clearly stated in the event description.
            </p>
            <p>The user interface can be used to</p>
            <ol type="a">
              <li>search all city events</li>
              <li>search and edit events in your organization</li>
              <li>add new events</li>
              <li>
                moderate events, ie accept events added by third parties for
                publication
              </li>
            </ol>
            <p>All days of a recurring event can be added at once</p>
            <h2>Event input</h2>
            <h3>Add new event</h3>
            <p>
              Event information must be entered at least in Finnish. The
              information in Swedish and English should be filled in at large
              events suitable for language target groups. Fill in the
              information as extensively and accurately as possible. The help
              texts on the form will help you to complete it.
            </p>
            <p>
              Always try to find a picture for the event. The image can be
              marked{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.en">
                CC 4.0 BY
              </ExternalLink>{' '}
              or "use only in connection with an event". Some freely usable
              illustrations can be found at{' '}
              <ExternalLink href="https://www.hel.fi/helsinki/fi/tapahtumakalenteri/kuvat">
                hel.fi/tapahtumakuvat
              </ExternalLink>
              .
            </p>
            <p>
              Before feeding, edit the image to fit the network and to a 3: 2
              horizontal aspect ratio, such as 1200x800px. It is essential that
              the file size remains reasonable for mobile use as well,
              preferably less than 200 kilobytes.
            </p>
            <p>
              To add a multi-day recurring event, there is an Add New Time
              button and a recurring event tool for a recurring event.
            </p>
            <p>
              The venue of the event is selected from the places in the city's
              office register. Thus, address and other information is retrieved
              automatically when the correct location is found. If you want to
              add a new office, contact{' '}
              <a href="mailto:linkedevents@hel.fi">linkedevents@hel.fi</a>.
            </p>
            <p>
              Categorizing an event with keywords is important so that users of
              different applications can find the event in a large mass of
              events. Choose multiple keywords and favor those that have been
              used in multiple events. Keywords (see YSO Glossary) are most
              often found in plural form, e.g., books, families, plays, and
              paintings.
            </p>
            <p>
              The main categories and target groups are primarily for the hel.fi
              website, but they are also visible to other users of the
              interface. If the event has multiple dates, it may take a while to
              save. If you do not receive an error message after pressing the
              Publish Event button, wait for the form to move to the next view.
            </p>
            <h3>Attaching images to events</h3>
            <p>
              Alt text, or alternative text to an image, is a verbal description
              of an image for people who, for one reason or another, cannot see
              the image itself. Alt text is a required field. In the alt text,
              briefly describe the content of the image, for example, "Children
              playing in the yard." note that alt text is not caption. Thus,
              things that do not appear directly in the image should not be told
              in the alt text. The use of the Alt text is regulated by the
              EU-wide Accessibility Directive. It follows from the Directive
              that the entry of alt text is mandatory for each image.
            </p>
            <p>
              Caption and graph are optional, but are good to fill out. However,
              the image license (see below below) may require the name of the
              graph to be mentioned. It is good practice to enter the name of
              the graph whenever it is known. Always make sure that you or the
              person you represent have the right to use the image to market the
              event. It is always the responsibility of the image feeder to
              ensure that the image is licensed.
            </p>
            <p>
              It is also the user's responsibility to select the correct
              license.
            </p>
            <p>
              Unless otherwise agreed with the photographer or the rights holder
              of the image, select the license "Image may be used only for this
              event" for the image. The name of the graph and / or other right
              holder of the image must always be specified in Graph.{' '}
              <ExternalLink href="https://api.hel.fi/linkedevents/v1/">
                Event only license definition
              </ExternalLink>
              .
            </p>
            <p>
              If the image you are using has a more extensive{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.en">
                CC 4.0 BY license
              </ExternalLink>{' '}
              or equivalent, you must still always specify a photographer name
              in Photographer name.
            </p>
            <p>
              Use horizontal images with an aspect ratio of 3: 2. The
              recommended size for images is 1200px X 800px. Images larger than
              2 megabytes cannot be input to the interface.
            </p>
            <h2>Other considerations</h2>
            <p>
              You can use the old one as the basis for the data for a new event,
              by opening the event and selecting "Copy as template". My events
              can be easily found in the Event Management and have the right to
              edit them.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Hallintapaneeli</h1>
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
              tämän jälkeen oikeuksien vahvistuspyynnön. Hallintapaneelia voi
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
            <h2>Tapahtuman syöttö</h2>
            <h3>Lisää uusi tapahtuma</h3>
            <p>
              Tapahtuman tiedot on syötettävä ainakin suomeksi. Ruotsin- ja
              englanninkieliset tiedot on syytä täyttää suurissa ja
              kielikohderyhmille sopivissa tapahtumissa. Täytä tiedot niin
              laajasti ja tarkasti kuin mahdollista. Lomakkeen ohjetekstit
              avustavat täyttämisessä.
            </p>
            <p>
              Pyri aina löytämään tapahtumalle kuva. Kuvalle voi merkitä
              käyttöoikeuden{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.fi">
                CC 4.0 BY
              </ExternalLink>{' '}
              tai "käyttö vain tapahtuman yhteydessä". Joitakin vapaasti
              käytettäviä kuvituskuvia löytyy osoitteesta{' '}
              <ExternalLink href="https://www.hel.fi/helsinki/fi/tapahtumakalenteri/kuvat">
                hel.fi/tapahtumakuvat
              </ExternalLink>
              .
            </p>
            <p>
              Muokkaa kuva ennen syöttöä verkkoon sopivaksi ja
              3:2-vaakakuvasuhteeseen, esimerkiksi 1200x800px. Olennaista on,
              että tiedostokoko pysyy kohtuullisena myös mobiilikäyttöön eli
              mieluiten alle 200 kilotavua.
            </p>
            <p>
              Useana päivänä toistuvan tapahtuman lisäämiseksi on Lisää uusi
              ajankohta -nappi ja säännöllisesti toistuvalle tapahtumalle oma
              Toistuva tapahtuma -työkalu.
            </p>
            <p>
              Tapahtuman paikka valitaan kaupungin toimipisterekisterin
              paikoista. Osoite- ja muut tiedot haetaan siis automaattisesti,
              kun oikea paikka löytyy. Jos haluat lisätä uuden toimipisteen, ota
              yhteyttä{' '}
              <a href="mailto:linkedevents@hel.fi">linkedevents@hel.fi</a>.
            </p>
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
            <h3>Kuvien liittäminen tapahtumiin</h3>
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
            <h2>Muuta huomioitavaa</h2>
            <p>
              Uuden tapahtuman tietojen pohjana voi käyttää vanhaa, avaamalla
              tapahtuman ja valitsemalla "Kopioi pohjaksi". Omat tapahtumat
              löytyvät helposti Tapahtumien hallinnasta ja niihin on
              muokkausoikeus.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Kontrollpanel</h1>
            <h2>Allmän</h2>
            <p>
              Linked Events är evenemangsgränssnittet för Helsingfors stad. De
              evenemang som anges i gränssnittet överförs automatiskt till t.ex.{' '}
              <ExternalLink href="https://tapahtumat.hel.fi/sv/home">
                tapahtumat.hel.fi-sida
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://www.myhelsinki.fi/sv">
                MyHelsinki.fi-sida
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://palvelukartta.hel.fi/sv/">
                Servicekarta
              </ExternalLink>{' '}
              och även för andra applikationer än de som underhålls av staden.
              Beskrivningen av evenemanget bör därför göras lätt att förstå på
              de olika användningsställena.
            </p>
            <p>
              API: ns ingångsgränssnitt finns på{' '}
              <ExternalLink href="https://linkedevents.hel.fi/">
                linkedevents.hel.fi
              </ExternalLink>
              . Du kan få åtkomst genom att först logga in på tjänsten och sedan
              skicka en bekräftelseförfrågan. Kontrollpanelen kan användas var
              som helst och även på mobila enheter. Du har rätt att redigera
              händelser i din organisation.
            </p>
            <p>
              Evenemang kan komma in i gränssnittet med tillstånd av Helsingfors
              stad. Evenemang behöver inte vara öppna för alla, men
              begränsningar måste anges tydligt i evenemangskrivningen.
            </p>
            <p>Användargränssnittet kan användas för att</p>
            <ol type="a">
              <li>söka efter alla evenemang i staden</li>
              <li>söka och redigera evenemanget i din organisation</li>
              <li>lägga till nya evenemang</li>
              <li>
                moderera evenemang, dvs. acceptera evenemang som lagts till av
                tredje part för publicering
              </li>
            </ol>
            <p>
              Alla dagar av en återkommande evenemang kan läggas till på en gång
            </p>
            <h2>Ingång för evenemang</h2>
            <h3>Lägg till ett nytt evenemang</h3>
            <p>
              Evenemanginformation måste anges minst på finska. Informationen på
              svenska och engelska bör fyllas i vid stora evenemang som passar
              språkmålgrupper. Fyll i informationen så omfattande och exakt som
              möjligt. Hjälptexterna på formuläret hjälper dig att fylla i det.
            </p>
            <p>
              Försök alltid hitta en bild för evenemanget. Bilden kan markeras{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                CC 4.0 BY
              </ExternalLink>{' '}
              eller "använd endast i samband med en händelse". Några fritt
              användbara illustrationer finns på{' '}
              <ExternalLink href="https://www.hel.fi/helsinki/fi/tapahtumakalenteri/kuvat">
                hel.fi/tapahtumakuvat
              </ExternalLink>
              .
            </p>
            <p>
              Innan du matar redigerar du bilden så att den passar nätverket och
              till ett horisontellt bildförhållande 3: 2, till exempel
              1200x800px. Det är viktigt att filstorleken förblir rimlig även
              för mobil användning, helst mindre än 200 kilobyte.
            </p>
            <p>
              För att lägga till en flerdagars återkommande evenemang finns
              knappen Lägg till ny tid och ett vanligt återkommande
              evenemangverktyg för ett återkommande evenemant.
            </p>
            <p>
              Platsen för evenemanget väljs från platserna i stadens
              kontoregister. Således hämtas adress och annan information
              automatiskt när rätt plats hittas. Om du vill lägga till ett nytt
              kontor, kontakta{' '}
              <a href="mailto:linkedevents@hel.fi">linkedevents@hel.fi</a>.
            </p>
            <p>
              Att kategorisera ett evenemang med nyckelord är viktigt så att
              användare av olika applikationer kan hitta evenemanget i en stor
              massa evenemang. Välj flera nyckelord och gynna de som har använts
              i flera evenemang. Nyckelord (se YSO-ordlista) finns oftast i
              pluralform, t.ex. böcker, familjer, pjäser och målningar.
            </p>
            <p>
              Huvudkategorierna och målgrupperna är främst för
              hel.fi-webbplatsen, men de är också synliga för andra användare av
              gränssnittet. Om evenemanget har flera datum kan det ta en stund
              att spara. Om du inte får något felmeddelande efter att ha tryckt
              på knappen Publicera evenemang väntar du på att formuläret flyttar
              till nästa vy.
            </p>
            <p>
              Bildtext och diagram är valfria, men är bra att fylla i.
              Bildlicensen (se nedan) kan dock kräva att grafens namn nämns. Det
              är bra praxis att ange grafens namn närhelst det är känt. Se
              alltid till att du eller någon du representerar har rätt att
              använda bilden för att marknadsföra evenemanget. Det är alltid
              bildmatarens ansvar att säkerställa åtkomst till bilden.
            </p>
            <p>
              Om inget annat överenskommits med fotografen eller bildens
              rättighetsinnehavare, välj licensen "Bilden får endast användas
              för detta evenemang" för bilden. Namnet på fotografen och / eller
              den andra ägaren till bilden måste alltid anges i avsnittet Graf.
              <ExternalLink href="https://api.hel.fi/linkedevents/v1/">
                Definition av Event only -licens.
              </ExternalLink>
              .
            </p>
            <h3>Bifoga bilder till evenemang</h3>
            <p>
              Alt-text, eller alternativ text till en bild, är en verbal
              beskrivning av en bild för människor som av en eller annan
              anledning inte kan se själva bilden. Alt-text är ett obligatoriskt
              fält. Beskriv kortfattat innehållet i bilden i alt-texten, till
              exempel "Barn som leker på gården." notera att alt text inte är
              textning. Således bör saker som inte visas direkt i bilden inte
              berättas i alt-texten. Användningen av Alt-texten regleras av
              EU-omfattande tillgänglighetsdirektiv. Det följer av direktivet
              att inmatning av alt-text är obligatorisk för varje bild.
            </p>
            <p>Det är också användarens ansvar att välja rätt licens.</p>
            <p>
              Om inget annat överenskommits med fotografen eller bildens
              rättighetsinnehavare, välj licensen "Använd begränsad till
              händelsen" för bilden. Namnet på fotografen och / eller den andra
              ägaren till bilden måste alltid anges i avsnittet Graf. Definition
              av endast licenshändelse.
            </p>
            <p>
              Om bilden du använder har en mer omfattande{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                CC BY 4.0-licens
              </ExternalLink>{' '}
              eller motsvarande, måste du ändå alltid ange ett grafnamn i Graph.
            </p>
            <p>
              Använd horisontella bilder med bildförhållandet 3: 2.
              Rekommenderad storlek för bilder är 1200px X 800px. Bilder som är
              större än 2 megabyte kan inte matas in i gränssnittet.
            </p>
            <h2>Andra överväganden</h2>
            <p>
              Du kan använda den gamla som bas för dett nya evenemanget genom
              att öppna evenemanget och välja "Kopiera som mall". Mina evenemang
              hittar du enkelt i Evenemangshantering och du har rätt att
              redigera dem.
            </p>
          </>
        );
    }
  };

  return (
    <PageWrapper title="helpPage.pageTitleControlPanel">
      {getContent(locale)}
    </PageWrapper>
  );
};

export default ControlPanelPage;
