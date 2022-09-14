import React from 'react';

import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import SourceCodeLinks from '../../sourceCodeLinks/SourceCodeLinks';

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
            <SourceCodeLinks />
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
            <SourceCodeLinks />
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
            <SourceCodeLinks />
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
      {getContent(locale)}
    </PageWrapper>
  );
};

export default SourceCodePage;
