import { header } from './selectors/header';
import { getPathname } from './utils/clientUtils';
import { getEnvUrl } from './utils/settings';

fixture('Landing page').page(getEnvUrl('fi'));

test('Changing language', async (t) => {
  await t
    .click(header.languageSelector)
    .click(header.languageSelectorItemSv)
    .expect(getPathname())
    .eql('/sv');
});
