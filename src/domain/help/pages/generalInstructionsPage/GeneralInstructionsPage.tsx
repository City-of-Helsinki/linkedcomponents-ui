import React from 'react';

import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import SourceCodeLinks from '../../sourceCodeLinks/SourceCodeLinks';
import SwaggerLink from '../swaggerLink/SwaggerLink';

const GeneralInstructionsPage: React.FC = () => {
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>General</h1>
            <p>
              These Linked Events instructions provide answers to the most
              common questions, as well as instructions for using the control
              panel and interface. More detailed information about the Linked
              Events interface, software and documentation can be found at:
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Yleistä</h1>
            <p>
              Näistä Linked Events ohjeista löydät vastaukset yleisimpiin
              kysymyksiin sekä ohjeet hallintapaneelin ja rajapinnan käyttöön.
              Tarkemmat tiedot Linked Events-rajapinnasta, -ohjelmistosta ja
              -dokumentaatiosta löytyy osoitteista:
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Allmänt</h1>
            <p>
              Dessa instruktioner för Linked Events ger svar på de vanligaste
              frågorna samt instruktioner för hur du använder kontrollpanelen
              och gränssnittet. Mer detaljerad information om Linked Events
              gränssnitt, programvara och dokumentation finns på:
            </p>
          </>
        );
    }
  };
  return (
    <PageWrapper
      description="helpPage.pageDescriptionInstructions"
      keywords={['keywords.support', 'keywords.help', 'keywords.instructions']}
      title="helpPage.pageTitleInstructions"
    >
      {getContent(locale)}
      <SourceCodeLinks showExplanations />
      <SwaggerLink showExplanations />
    </PageWrapper>
  );
};

export default GeneralInstructionsPage;
