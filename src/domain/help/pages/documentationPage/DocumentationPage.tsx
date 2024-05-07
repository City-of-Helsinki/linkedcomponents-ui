import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import SwaggerLink from '../swaggerLink/SwaggerLink';

const DocumentationPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <p>
              The latest documentation for the API in the Open API 3.0 markup
              language can be found at:
            </p>
            <SwaggerLink />
            <p>
              We will also update the documentation to Github in upcoming
              releases.
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <p>
              Rajapinnan tuorein dokumentaatio Open API 3.0-kuvauskielellä
              löytyy osoitteesta:
            </p>
            <SwaggerLink />
            <p>
              Päivitämme dokumentaation myös Githubiin julkaisujen yhteydessä.
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <p>
              Den senaste dokumentationen för gränssnittet i Open API
              3.0-märkningsspråket finns på:
            </p>
            <SwaggerLink />
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
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('helpPage.pageTitle'), path: ROUTES.HELP },
              {
                title: t('helpPage.pageTitleTechnology'),
                path: ROUTES.TECHNOLOGY,
              },
              {
                title: t('helpPage.pageTitleDocumentation'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.pageTitleDocumentation')}
      />
      {getContent(locale)}
    </PageWrapper>
  );
};

export default DocumentationPage;
