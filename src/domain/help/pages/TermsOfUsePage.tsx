import React from 'react';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import PageWrapper from '../../app/layout/PageWrapper';

const TermsOfUsePage = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>Terms of use</h1>
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
              materials they add, and the fact that it does not infringe any
              third party intellectual property rights or other rights and that
              it is not content otherwise contrary to law or good practice.
            </p>
            <p>
              The City of Helsinki does not guarantee the correctness of the
              Materials added to the page by the users of the service and is not
              responsible for their inaccuracy.
            </p>
            <p>
              The City of Helsinki has all the rights to edit and delete the
              Materials entered in the event interface. The City of Helsinki
              does not undertake to publish any Materials.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Käyttöehdot</h1>
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
                Creative Commons BY 4.0 –lisenssillä
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
            <h1>Villkor</h1>
            <p>
              Evenemangsinformation, bilder och annat material som läggs till i
              gränssnittet för länkade evenemang (tillsammans med materialet)
              publiceras under en{' '}
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                Creative Commons BY 4.0-licens
              </ExternalLink>
              , om inte annat anges.
            </p>
            <p>
              Genom att använda gränssnittet samtycker användaren av tjänsten
              som lade till materialet publiceringen av materialet under en
              <ExternalLink href="https://creativecommons.org/licenses/by/4.0/deed.sv">
                Creative Commons BY 4.0-licens
              </ExternalLink>
              , förutom i de fall där den person som lade till bilden genom
              gränssnittet begränsar rätten att använda bilden som beskrivet
              nedan.
            </p>
            <p>
              Det är möjligt att begränsa användningen av den bild som matats in
              i gränssnittet per bild i samband med den enskilda evenemangen i
              fråga (endast evenemangslicens). Åtkomstbegränsningen binder
              applikationer som använder gränssnittet och andra användare av
              gränssnittet.
            </p>
            <p>
              Om avsnittet "Licens" för informationen i bilden som ska delas är
              markerad med "Använd begränsad till en evenemang" får bilden i
              gränssnittet för Linked Events endast användas för information och
              kommunikation om bildens evenemang. Användning eller överföring av
              bilden för andra ändamål är förbjuden. När du använder bilder är
              det viktigt att nämna bildens källa och graf.
            </p>
            <p>
              Användaren av tjänsten som lägger till material i tjänsten
              garanterar att han eller hon har nödvändiga rättigheter att lägga
              till material i tjänsten. Helsingfors stad är inte ansvarig för
              innehållet i materialet eller relaterade immateriella rättigheter.
              Den person som lagt till material till tjänsten ansvarar för
              materialet, och att det inte bryter mot en tredje parts
              immateriella rättigheter eller andra rättigheter och att det inte
              är innehåll som annars strider mot lag eller god praxis.
            </p>
            <p>
              Helsingfors stad garanterar inte riktigheten för det material som
              läggs till på sidan av användarna av tjänsten och ansvarar inte
              för deras felaktighet.
            </p>
            <p>
              Helsingfors stad har alla rättigheter att redigera och ta bort det
              material som anges i evenemangsgränssnittet. Helsingfors stad åtar
              sig inte att publicera något material.
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
