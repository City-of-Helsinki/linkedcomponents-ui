import React from 'react';

import ExternalLink from '../../../../common/components/externalLink/ExternalLink';
import { SWAGGER_URL } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import removeProtocolFromUrl from '../../../../utils/removeProtocolFromUrl';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';

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
            <p>
              <ExternalLink href="https://api.hel.fi/linkedevents/v1">
                api.hel.fi/linkedevents/v1
              </ExternalLink>{' '}
              (API)
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                github.com/City-of-Helsinki/linkedevents
              </ExternalLink>{' '}
              (software)
            </p>
            <p>
              <ExternalLink href={SWAGGER_URL}>
                {removeProtocolFromUrl(SWAGGER_URL)}
              </ExternalLink>{' '}
              (documentation)
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
            <p>
              <ExternalLink href="https://api.hel.fi/linkedevents/v1">
                api.hel.fi/linkedevents/v1
              </ExternalLink>{' '}
              (rajapinta)
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                github.com/City-of-Helsinki/linkedevents
              </ExternalLink>{' '}
              (ohjelmisto)
            </p>
            <p>
              <ExternalLink href={SWAGGER_URL}>
                {removeProtocolFromUrl(SWAGGER_URL)}
              </ExternalLink>{' '}
              (dokumentaatio)
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
            <p>
              <ExternalLink href="https://api.hel.fi/linkedevents/v1">
                api.hel.fi/linkedevents/v1
              </ExternalLink>{' '}
              (gränssnitt)
            </p>
            <p>
              <ExternalLink href="https://github.com/City-of-Helsinki/linkedevents">
                github.com/City-of-Helsinki/linkedevents
              </ExternalLink>{' '}
              (programvara)
            </p>
            <p>
              <ExternalLink href={SWAGGER_URL}>
                {removeProtocolFromUrl(SWAGGER_URL)}
              </ExternalLink>{' '}
              (dokumentation)
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
    </PageWrapper>
  );
};

export default GeneralInstructionsPage;
