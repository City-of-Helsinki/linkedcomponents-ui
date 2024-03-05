import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';
import SourceCodeLinks from '../../sourceCodeLinks/SourceCodeLinks';
import SwaggerLink from '../swaggerLink/SwaggerLink';

const GeneralInstructionsPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <p>
            These Linked Events instructions provide answers to the most common
            questions, as well as instructions for using the control panel and
            interface. More detailed information about the Linked Events
            interface, software and documentation can be found at:
          </p>
        );
      case 'fi':
        return (
          <p>
            Näistä Linked Events ohjeista löydät vastaukset yleisimpiin
            kysymyksiin sekä ohjeet hallintapaneelin ja rajapinnan käyttöön.
            Tarkemmat tiedot Linked Events-rajapinnasta, -ohjelmistosta ja
            -dokumentaatiosta löytyy osoitteista:
          </p>
        );
      case 'sv':
        return (
          <p>
            Dessa instruktioner för Linked Events ger svar på de vanligaste
            frågorna samt instruktioner för hur du använder kontrollpanelen och
            gränssnittet. Mer detaljerad information om Linked Events
            gränssnitt, programvara och dokumentation finns på:
          </p>
        );
    }
  };

  return (
    <PageWrapper
      description="helpPage.pageDescriptionInstructions"
      keywords={['keywords.support', 'keywords.help', 'keywords.instructions']}
      title="helpPage.pageTitleInstructions"
    >
      <TitleRow
        breadcrumb={
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: t('helpPage.pageTitle'), path: ROUTES.HELP },
              {
                title: t('helpPage.sideNavigation.labelInstructions'),
                path: ROUTES.INSTRUCTIONS,
              },
              { title: t('helpPage.sideNavigation.labelGeneral'), path: null },
            ]}
          />
        }
        title={t('helpPage.sideNavigation.labelGeneral')}
      />
      {getContent(locale)}
      <SourceCodeLinks showExplanations />
      <SwaggerLink showExplanations />
    </PageWrapper>
  );
};

export default GeneralInstructionsPage;
