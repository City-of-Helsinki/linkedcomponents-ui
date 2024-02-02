import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import SourceCodeLinks from '../../sourceCodeLinks/SourceCodeLinks';

const GeneralTechnologyPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <p>
            Linked Events is developed for a Django platform in Python and
            Javascript programming languages and utilizes a PostgreSQL database
            to capture data. Linked Events Admin is a React-based application
            for event management and its and the platform's source code can be
            found in Github version control at:
          </p>
        );
      case 'fi':
        return (
          <p>
            Linked Events on kehitetty Django-alustalle Python- ja
            Javascript-ohjelmointikielillä ja se hyödyntää
            PostgreSQL-tietokantaa tietojen taltioimiseen. Linked Events Admin
            on React-pohjainen sovellus tapahtumien hallintaan ja sen sekä
            alustan lähdekoodit löytyvät Github-versionhallinnasta osoitteista:
          </p>
        );
      case 'sv':
        return (
          <p>
            Linked Events är utvecklat för Django-plattformen i
            programmeringsspråk Python och Javascript och använder en
            PostgreSQL-databas för att fånga data. Linked Events Admin är en
            React-baserad applikation för evenemangshantering och dess och
            plattformens källkod finns i Github-versionskontrollen på:
          </p>
        );
    }
  };
  return (
    <PageWrapper
      description="helpPage.pageDescriptionTechnology"
      keywords={['keywords.technology', 'keywords.help', 'keywords.support']}
      title="helpPage.pageTitleTechnology"
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
                title: t('helpPage.sideNavigation.labelGeneral'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.sideNavigation.labelGeneral')}
      />
      {getContent(locale)}
      <SourceCodeLinks />
    </PageWrapper>
  );
};

export default GeneralTechnologyPage;
