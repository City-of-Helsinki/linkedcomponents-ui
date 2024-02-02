import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import SourceCodeLinks from '../../sourceCodeLinks/SourceCodeLinks';

const SourceCodePage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
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
                title: t('helpPage.pageTitleSourceCode'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.pageTitleSourceCode')}
      />
      {getContent(locale)}
    </PageWrapper>
  );
};

export default SourceCodePage;
