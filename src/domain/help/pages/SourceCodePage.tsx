import React from 'react';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import MainContent from '../../app/layout/MainContent';
import PageWrapper from '../../app/layout/PageWrapper';

const SourceCodePage: React.FC = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>Source code</h1>
            <p>
              The complete code base of Linked Events can be found in the City
              of Helsinki's Github:
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                https://github.com/City-of-Helsinki/linkedevents
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedcomponents-ui">
                https://github.com/City-of-Helsinki/linkedcomponents-ui
              </ExternalLink>
            </p>
            <p>
              We regularly review development requests and bug reports sent to
              Github.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Lähdekoodi</h1>
            <p>
              Linked Eventsin koodikanta löytyy kokonaisuudessaan Helsingin
              kaupungin Githubista:
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                https://github.com/City-of-Helsinki/linkedevents
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedcomponents-ui">
                https://github.com/City-of-Helsinki/linkedcomponents-ui
              </ExternalLink>
            </p>
            <p>
              Käymme läpi säännöllisesti Githubiin lähetettyjä kehitystoiveita
              ja virheraportteja.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Källkod</h1>
            <p>
              Den kompletta kodbasen för Linked Events finns i Helsingfors stads
              Github:
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                https://github.com/City-of-Helsinki/linkedevents
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedcomponents-ui">
                https://github.com/City-of-Helsinki/linkedcomponents-ui
              </ExternalLink>
            </p>
            <p>
              Vi granskar regelbundet utvecklingsförfrågningar och felrapporter
              som skickas till Github.
            </p>
          </>
        );
    }
  };
  return (
    <PageWrapper
      description="helpPage.pageDescriptionSourceCode"
      keywords={['keywords.sourceCode', 'keywords.help']}
      title="helpPage.pageTitleSourceCode"
    >
      <MainContent>{getContent(locale)}</MainContent>
    </PageWrapper>
  );
};

export default SourceCodePage;
