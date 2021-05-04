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
              Linked Events is an event interface for the City of Helsinki. The
              events entered in the interface are automatically submitted to
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
              and also applications other than those maintained by the city. The
              description of the event should therefore be made easy to
              understand for various usecases.
            </p>
            <p>
              The input user interface of the API can be found at{' '}
              <ExternalLink href="https://linkedevents.hel.fi/">
                linkedevents.hel.fi
              </ExternalLink>
              . You can access it by first logging in to the service and then
              sending a confirmation request. The control panel can be used from
              anywhere and now also with mobile devices. Edit rights are limited
              to events in your organization.
            </p>
            <p>
              Events may be entered into the interface with the permission of
              the City of Helsinki. Events do not have to be open to everyone,
              but restrictions must be clearly stated in the event description.
            </p>
            <p>The interface can</p>
            <ol type="a">
              <li>search from all city events</li>
              <li>browse and edit events in your organization</li>
              <li>add new events</li>
              <li>
                moderate events, ie. accept events published by third parties
                for publication
              </li>
            </ol>
            <p>All days of a recurring event can be inputed at once.</p>
            <h2>Event input</h2>
            <h3>Add new event</h3>
            <p>
              Event information must be entered at least in Finnish. The
              information in Swedish and English should be filled in at large
              events suitable for language target groups. Fill in the
              information as extensively and accurately as possible. The help
              texts on the form will aid you in filling the form.
            </p>
            <p>
              Always try to find an image for the event. The image can be marked{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.en">
                CC 4.0 BY
              </ExternalLink>{' '}
              or "use limited to only in connection with the event". Some freely
              usable illustrations can be found at{' '}
              <ExternalLink href="https://www.hel.fi/helsinki/fi/tapahtumakalenteri/kuvat">
                hel.fi/tapahtumakuvat
              </ExternalLink>
              .
            </p>
            <p>
              Before uploading an image, edit the image to fit for low bandwith
              use and to a 3: 2 horizontal aspect ratio, such as 1200x800 px. It
              is essential that the file size remains reasonable for mobile use
              as well, preferably less than 200 kilobytes.
            </p>
            <p>
              To add a recurring event spanning several days, there is an “Add
              New Time” button and a “Recurring event” tool to easily add a
              recurring event.
            </p>
            <p>
              The location of the event is selected from the locations of the
              city's office register. Address information among other
              information is retrieved automatically when the correct location
              is found. If you want to add a new location, contact{' '}
              <a href="mailto:linkedevents@hel.fi">linkedevents@hel.fi</a>.
            </p>
            <p>
              Categorizing an event with keywords is important so that users
              using various applications can find the event from a large mass of
              events. Choose multiple keywords and favor the ones that have been
              previously used in events. Keywords (see YSO Glossary) are most
              often found in plural form, e.g. books, families, plays, and
              paintings.
            </p>
            <p>
              The main categories and target groups are primarily for the hel.fi
              website, but they are also visible to other services using the
              interface. If the event has multiple dates, it may take a while to
              save. If you do not receive an error message after pressing the
              Publish Event button, wait for a while and the form should advance
              to the next view.
            </p>
            <h3>Attaching images to events</h3>
            <p>
              Alt text, the alternative text for an image, is a verbal
              description of an image for people who, for one reason or another,
              cannot see the image themselves. The alt text is a required field.
              In the alt text, briefly describe the content of the image, for
              example, "Children playing in the yard." Note that alt text is not
              a caption. Thus, things that do not appear directly in the image
              should not be written down in the alt text. The use of the Alt
              text is regulated by the EU-wide Accessibility Directive. Due to
              the directive, the filling of the alt text field is mandatory for
              each image.
            </p>
            <p>
              The caption and and author information are optional, but it is
              usually still a good idea to fill them out. However, the image
              license (see below) may require the name of the author to be
              mentioned. It is good practice to enter the name of the author
              whenever it is known. Always make sure that you or who you
              represent has the right to use the image to market the event. It
              is always the responsibility of the image uploader to check the
              rights to the image.
            </p>
            <p>
              It is also the user's responsibility to select the correct
              license.
            </p>
            <p>
              Unless otherwise agreed with the author or the rights holder of
              the image, select the license "Use limited to the event" for most
              images. The name of the author and / or the other owner of the
              image must always be specified in the field titled “Author”.{' '}
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
              or equivalent, you must still specify the author name.
            </p>
            <p>
              Use horizontal images with an aspect ratio of 3:2. The recommended
              size for images is 1200 px X 800 px. Images larger than 2
              megabytes cannot be uploaded to the interface.
            </p>
            <h2>Other considerations</h2>
            <p>
              You can use the old event data for a new event by opening the
              event and selecting "Copy as template". My events can be easily
              found in Event Management and you have rights to edit them.
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
            <h2>Allmänt</h2>
            <p>
              Linked Events är evenemangsgränssnittet för Helsingfors stad. De
              evenemang som anges i gränssnittet överförs automatiskt till t.ex.{' '}
              <ExternalLink href="https://tapahtumat.hel.fi/sv/home">
                tapahtumat.hel.fi
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://www.myhelsinki.fi/sv">
                MyHelsinki.fi
              </ExternalLink>
              ,{' '}
              <ExternalLink href="https://palvelukartta.hel.fi/sv/">
                servicekartan
              </ExternalLink>{' '}
              och även för andra applikationer än de som upprätthålls av staden.
              Beskrivningen av evenemanget bör därför göras lätt att förstå på
              de olika användningsställena.
            </p>
            <p>
              Gränssnittet för inmatning finns på{' '}
              <ExternalLink href="https://linkedevents.hel.fi/">
                linkedevents.hel.fi
              </ExternalLink>
              . Du kan få åtkomst genom att först logga in på tjänsten och sedan
              skicka en bekräftelseförfrågan. Kontrollpanelen kan användas var
              som helst och även på mobila enheter. Du har rätt att redigera
              evenemang i din egna organisation.
            </p>
            <p>
              Evenemang kan läggas till i gränssnittet med tillstånd av
              Helsingfors stad. Evenemang behöver inte vara öppna för alla, men
              begränsningar måste anges tydligt i evenemangsbeskrivningen.
            </p>
            <p>Med gränssnittet kan man</p>
            <ol type="a">
              <li>söka bland alla stadsevenemang</li>
              <li>se och redigera evenemang i din egna organisation</li>
              <li>lägg till nya evenemang</li>
              <li>
                moderera evenemang, dvs. acceptera evenemang för publicering som
                är inlagda av tredje part
              </li>
            </ol>
            <p>
              Alla dagar av en återkommande evenemang kan läggas till på en
              gång.
            </p>
            <h2>Evenemangsinmatning</h2>
            <h3>Lägg till ett nytt evenemang</h3>
            <p>
              Evenemangsinformation måste alltid anges på minst finska.
              Informationen på svenska och engelska bör fyllas i vid stora
              evenemang som är lämpliga för språkgrupper. Fyll i informationen
              så omfattande och exakt som möjligt. Hjälptexterna på formuläret
              hjälper dig att fylla i det.
            </p>
            <p>
              Försök alltid hitta en bild för evenemanget. Bilden kan markeras{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                CC 4.0 BY
              </ExternalLink>{' '}
              eller "använd endast i samband med evenemanget". Några fritt
              användbara illustrationer finns på{' '}
              <ExternalLink href="https://www.hel.fi/helsinki/fi/tapahtumakalenteri/kuvat">
                hel.fi/tapahtumakuvat
              </ExternalLink>
              .
            </p>
            <p>
              Innan du laddar upp redigerar du bilden så att den passar internet
              och till ett horisontellt bildförhållande 3: 2, t.ex. 1200x800 px.
              Det är viktigt att filstorleken förblir rimlig även för mobil
              användning, helst mindre än 200 kilobyte.
            </p>
            <p>
              För att lägga till en flerdagars återkommande evenemang finns
              knappen “Lägg till ny tid” och ett verktyg för “återkommande
              evenemang”.
            </p>
            <p>
              Platsen för evenemanget väljs från platserna i stadens
              kontoregister. Således hämtas adress och annan information
              automatiskt när rätt plats hittas. Om du vill lägga till ett nytt
              plats, kontakta{' '}
              <a href="mailto:linkedevents@hel.fi">linkedevents@hel.fi</a>.
            </p>
            <p>
              Att kategorisera ett evenemang med nyckelord är viktigt så att
              användare av olika applikationer kan hitta evenemanget bland en
              stor mängd evenemang. Välj flera nyckelord och gynna de som har
              använts i flera evenemang. Nyckelord (se YSO-ordlista) finns
              oftast i pluralform, t.ex. böcker, familjer, pjäser och målningar.
            </p>
            <p>
              Huvudkategorierna och målgrupperna är främst för hel.fi
              -webbplatsen, men de är också synliga för andra användare av
              gränssnittet. Om evenemanget har flera datum kan det ta en stund
              att spara. Om du inte får något felmeddelande efter att ha tryckt
              på knappen “Publicera evenemang” väntar du på att formuläret
              flyttar till nästa vy.
            </p>
            <h3>Bifoga bilder till evenemang</h3>
            <p>
              Alt-text, eller alternativ text till en bild, är en verbal
              beskrivning av en bild för personer som av en eller annan
              anledning inte kan se bilden själva. Alt-text är ett obligatoriskt
              fält. Beskriv kortfattat innehållet i bilden i alt-texten, till
              exempel "Barn som leker på gården." notera att alt text inte är
              textning. Således bör saker som inte visas direkt i bilden inte
              berättas i alt-texten. Användningen av Alt-texten regleras av
              EU-omfattande tillgänglighetsdirektiv. Det följer av direktivet
              att inmatning av alt-text är obligatorisk för varje bild.
            </p>
            <p>
              Bildtext och författare krävs inte, men de är vanligtvis
              fortfarande bra att fylla i. Bildlicensen (se nedan) kan dock
              kräva att grafens namn nämns. Det är bra praxis att ange grafens
              namn närhelst det är känt. Se alltid till att du eller någon du
              representerar har rätt att använda bilden för att marknadsföra
              evenemanget. Det är alltid bildladdarens ansvar att säkerställa
              åtkomst till bilden.
            </p>
            <p>Det är också användarens ansvar att välja rätt licens.</p>
            <p>
              Om inget annat överenskommits med fotografen eller bildens
              rättighetsinnehavare, välj licensen "Använd begränsad till
              evenemangn" för bilden. Namnet på grafen och / eller annan
              rättighetsinnehavare av bilden måste alltid anges i “Författare”
              <ExternalLink href="https://api.hel.fi/linkedevents/v1/">
                Definition av endast evenemangslicens.
              </ExternalLink>
              .
            </p>
            <p>
              Om bilden du använder har en mer omfattande{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                CC BY 4.0-licens
              </ExternalLink>{' '}
              eller motsvarande, måste du ändå alltid ange ett namn i
              författarenamnet.
            </p>
            <p>
              Använd horisontella bilder med bildförhållandet 3:2. Rekommenderad
              storlek för bilder är 1200 px X 800 px. Bilder som är större än 2
              megabyte kan inte läggas in i gränssnittet.
            </p>
            <h2>Andra överväganden</h2>
            <p>
              Du kan använda informationen från ett äldre evenemang när du ska
              skapa ett nytt, genom att öppna evenemanget och välja "Kopiera som
              mall". Mina evenemang hittar du enkelt i Evenemangshantering och
              dom har du rättighet att redigera.
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
