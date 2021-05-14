import 'swagger-ui-react/swagger-ui.css';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import MainContent from '../../app/layout/MainContent';
import PageWrapper from '../../app/layout/PageWrapper';

const DocumentationPage: React.FC = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>Documentation</h1>
            <p>
              The latest documentation for the API in the Open API 3.0 markup
              language can be found at:
            </p>
            <p>
              <ExternalLink href="https://app.swaggerhub.com/apis-docs/lakoutan/LinkedEvents/2.0.2">
                https://app.swaggerhub.com/apis-docs/lakoutan/LinkedEvents/2.0.2
              </ExternalLink>
            </p>
            <p>
              We will also update the documentation to Github in upcoming
              releases.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Dokumentaatio</h1>
            <p>
              Rajapinnan tuorein dokumentaatio Open API 3.0-kuvauskielellä
              löytyy osoitteesta:
            </p>
            <p>
              <ExternalLink href="https://app.swaggerhub.com/apis-docs/lakoutan/LinkedEvents/2.0.2">
                https://app.swaggerhub.com/apis-docs/lakoutan/LinkedEvents/2.0.2
              </ExternalLink>
            </p>
            <p>
              Päivitämme dokumentaation myös Githubiin julkaisujen yhteydessä.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Dokumentation</h1>
            <p>
              Den senaste dokumentationen för gränssnittet i Open API
              3.0-märkningsspråket finns på:
            </p>
            <p>
              <ExternalLink href="https://app.swaggerhub.com/apis-docs/lakoutan/LinkedEvents/2.0.2">
                https://app.swaggerhub.com/apis-docs/lakoutan/LinkedEvents/2.0.2
              </ExternalLink>
            </p>
            <p>
              Vi kommer också att uppdatera dokumentationen till Github i
              samband med utgåvor.
            </p>
          </>
        );
    }
  };
  return (
    <PageWrapper
      description="helpPage.pageDescriptionDocumentation"
      keywords={['keywords.documentation', 'keywords.help']}
      title="helpPage.pageTitleDocumentation"
    >
      <MainContent>{getContent(locale)}</MainContent>
      <SwaggerUI url={process.env.REACT_APP_SWAGGER_SCHEMA_URL} />
    </PageWrapper>
  );
};

export default DocumentationPage;
