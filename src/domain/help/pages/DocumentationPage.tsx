import 'swagger-ui-react/swagger-ui.css';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import { SWAGGER_SCHEMA_URL, SWAGGER_URL } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import isTestEnv from '../../../utils/isTestEnv';
import removeProtocolFromUrl from '../../../utils/removeProtocolFromUrl';
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
              The latest documentation for the API in the Open API 2.0 markup
              language can be found at:
            </p>
            <p>
              <ExternalLink href={SWAGGER_URL}>
                {removeProtocolFromUrl(SWAGGER_URL)}
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
              Rajapinnan tuorein dokumentaatio Open API 2.0-kuvauskielellä
              löytyy osoitteesta:
            </p>
            <p>
              <ExternalLink href={SWAGGER_URL}>
                {removeProtocolFromUrl(SWAGGER_URL)}
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
              2.0-märkningsspråket finns på:
            </p>
            <p>
              <ExternalLink href={SWAGGER_URL}>
                {removeProtocolFromUrl(SWAGGER_URL)}
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

      {!isTestEnv && (
        /* istanbul ignore next */
        <SwaggerUI url={SWAGGER_SCHEMA_URL} />
      )}
    </PageWrapper>
  );
};

export default DocumentationPage;
