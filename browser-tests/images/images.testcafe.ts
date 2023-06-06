/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RequestLogger } from 'testcafe';

import getValue from '../../src/utils/getValue';
import { findCookieConsentModal } from '../cookieConsentModal/cookieConsentModal.components';
import { getImages } from '../data/imageData';
import { isFeatureEnabled } from '../utils/featureFlag.utils';
import { requestLogger } from '../utils/requestLogger';
import { getEnvUrl, LINKED_EVENTS_URL } from '../utils/settings';
import { clearDataToPrintOnFailure } from '../utils/testcafe.utils';
import { getUrlUtils } from '../utils/url.utils';
import { getImagesPage } from './images.components';

const imagesLogger = RequestLogger(new RegExp(LINKED_EVENTS_URL), {
  logResponseBody: true,
  stringifyResponseBody: true,
});

let urlUtils: ReturnType<typeof getUrlUtils>;

fixture('Images page')
  .page(getEnvUrl('/fi/administration/images'))
  .beforeEach(async (t) => {
    clearDataToPrintOnFailure(t);
    urlUtils = getUrlUtils(t);
  })
  .after(async () => {
    requestLogger.clear();
    imagesLogger.clear();
  })
  .requestHooks([requestLogger, imagesLogger]);

if (isFeatureEnabled('SHOW_ADMIN')) {
  test('Create images button works', async (t) => {
    const cookieConsentModal = await findCookieConsentModal(t);
    await cookieConsentModal.actions.acceptAllCookies();

    const imagesPage = await getImagesPage(t);

    await imagesPage.actions.clickCreateImageButton();
    await urlUtils.actions.forceReload();
    await urlUtils.expectations.urlChangedToCreateImagePage();
  });

  test.disablePageReloads(
    'Search url by image name shows image row data for a image',
    async (t) => {
      const imagesPage = await getImagesPage(t);
      await imagesPage.pageIsLoaded();

      const images = await getImages(t, imagesLogger);
      const [image] = images;

      await urlUtils.actions.navigateToImagesUrl(getValue(image.name, ''));

      const searchResults = await imagesPage.findSearchResultList();
      const imageRow = await searchResults.imageRow(image);

      await imageRow.actions.clickImageRow();
      await urlUtils.actions.forceReload();
      await urlUtils.expectations.urlChangedToImagePage(image);
    }
  );
}
