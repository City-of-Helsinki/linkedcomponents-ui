import React from 'react';

import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import PageWrapper from '../../app/layout/PageWrapper';

const PlatformPage = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>Platform</h1>
            <p>
              Linked Events is an open interface developed by the City of
              Helsinki for events, courses and volunteer assignments in the City
              of Helsinki. This site provides tools and instructions for
              managing them and documentation to use the public interface.
            </p>
            <p>
              Events may be entered with the permission of the city. They don’t
              have to be organized by the city. You can enter multiple dates for
              an event. In this case, an umbrella event is automatically created
              for the event sequence.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Alusta</h1>
            <p>
              Linked Events on Helsingin kaupungin kehittämä avoin rajapinta
              Helsingin kaupungin tapahtumille, kursseille ja
              vapaaehtoistehtäville. Tämä sivusto tarjoaa työkalut ja ohjeet
              niiden hallintaan sekä dokumentaation julkisen rajapinnan
              käyttämiseen.
            </p>
            <p>
              Tapahtumia saa syöttää kaupungin luvalla. Niiden ei tarvitse olla
              kaupungin järjestämiä. Tapahtumalle voi antaa useita päivämääriä.
              Tässä tapauksessa tapahtumasarjalle luodaan automaattisesti
              kattotapahtuma.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Plattform</h1>
            <p>
              Linked Events är ett öppet gränssnitt utvecklat av Helsingfors
              stad för evenemang, kurser och volontäruppdrag i Helsingfors stad.
              Denna webbplats innehåller verktyg och instruktioner för hantering
              av dem och dokumentation för att använda det offentliga
              gränssnittet.
            </p>
            <p>
              Evenemang kan skrivas in med tillstånd av staden. De behöver inte
              organiseras av staden. Du kan ange flera datum för ett evenemang.
              I det här fallet skapas ett paraplyevenemang automatiskt för
              evenemangssekvensen.
            </p>
          </>
        );
    }
  };
  return (
    <PageWrapper title="helpPage.pageTitlePlatform">
      {getContent(locale)}
    </PageWrapper>
  );
};

export default PlatformPage;
