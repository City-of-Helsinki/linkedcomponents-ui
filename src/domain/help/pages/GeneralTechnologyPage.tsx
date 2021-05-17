import React from 'react';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import MainContent from '../../app/layout/MainContent';
import PageWrapper from '../../app/layout/PageWrapper';

const GeneralTechnologyPage: React.FC = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>General</h1>
            <p>
              Linked Events is developed for a Django platform in Python and
              Javascript programming languages and utilizes a PostgreSQL
              database to capture data. Linked Events Admin is a React-based
              application for event management and its and the platform's source
              code can be found in Github version control at:
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                github.com/City-of-Helsinki/linkedevents
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedcomponents-ui">
                github.com/City-of-Helsinki/linkedcomponents-ui
              </ExternalLink>
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Yleistä</h1>
            <p>
              Linked Events on kehitetty Django-alustalle Python- ja
              Javascript-ohjelmointikielillä ja se hyödyntää
              PostgreSQL-tietokantaa tietojen taltioimiseen. Linked Events Admin
              on React-pohjainen sovellus tapahtumien hallintaan ja sen sekä
              alustan lähdekoodit löytyvät Github-versionhallinnasta
              osoitteista:
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                github.com/City-of-Helsinki/linkedevents
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedcomponents-ui">
                github.com/City-of-Helsinki/linkedcomponents-ui
              </ExternalLink>
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Allmänt</h1>
            <p>
              Linked Events är utvecklat för Django-plattformen i
              programmeringsspråk Python och Javascript och använder en
              PostgreSQL-databas för att fånga data. Linked Events Admin är en
              React-baserad applikation för evenemangshantering och dess och
              plattformens källkod finns i Github-versionskontrollen på:
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                github.com/City-of-Helsinki/linkedevents
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedcomponents-ui">
                github.com/City-of-Helsinki/linkedcomponents-ui
              </ExternalLink>
            </p>
          </>
        );
    }
  };
  return (
    <PageWrapper
      description="helpPage.pageDescriptionTechnology"
      keywords={['keywords.technology', 'keywords.help', 'keywords.support']}
      title="helpPage.pageTitleTechnology"
    >
      <MainContent>{getContent(locale)}</MainContent>
    </PageWrapper>
  );
};

export default GeneralTechnologyPage;
