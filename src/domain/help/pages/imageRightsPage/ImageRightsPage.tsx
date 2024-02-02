import React from 'react';
import { useTranslation } from 'react-i18next';

import Breadcrumb from '../../../../common/components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../../constants';
import useLocale from '../../../../hooks/useLocale';
import { Language } from '../../../../types';
import PageWrapper from '../../../app/layout/pageWrapper/PageWrapper';
import TitleRow from '../../../app/layout/titleRow/TitleRow';

const ImageRightsPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <p>
            The City of Helsinki has all the rights to the images. If the
            license of the image to be shared in the interface is marked
            event_only, the image may only be used for information and
            communication about the event. Using images for this purpose is free
            for the user. The use or transfer of the image for other purposes is
            prohibited. When using images, it is essential to mention the source
            and author of the images.
          </p>
        );
      case 'fi':
        return (
          <p>
            Helsingin kaupungilla on kuviin kaikki oikeudet. Mikäli rajapinnassa
            jaettavan kuvan tietojen kohdassa license on merkintä event_only,
            saa kuvaa käyttää ainoastaan kuvan tapahtumaa käsittelevään
            tiedotukseen ja viestintään. Kuvien käyttäminen tähän tarkoitukseen
            on käyttäjälle ilmaista. Kuvan käyttö tai siirto muihin
            tarkoituksiin on kielletty. Kuvia käytettäessä on ehdottomasti
            mainittava kuvien lähde ja kuvaaja.
          </p>
        );
      case 'sv':
        return (
          <p>
            Helsingfors stad har alla rättigheter till bilderna. Om licensen för
            bilden som ska delas i gränssnittet är markerad endast evenemang,
            får bilden endast användas för information och kommunikation om
            bildens evenemang. Att använda bilder för detta ändamål är gratis
            för användaren. Användning eller överföring av bilden för andra
            ändamål är förbjuden. När du använder bilder är det viktigt att
            nämna bildens källa och författare.
          </p>
        );
    }
  };

  return (
    <PageWrapper
      description="helpPage.pageDescriptionImageRights"
      keywords={['keywords.image', 'keywords.rights', 'keywords.license']}
      title="helpPage.pageTitleImageRights"
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
                title: t('helpPage.pageTitleImageRights'),
                path: null,
              },
            ]}
          />
        }
        title={t('helpPage.pageTitleImageRights')}
      />
      {getContent(locale)}
    </PageWrapper>
  );
};

export default ImageRightsPage;
