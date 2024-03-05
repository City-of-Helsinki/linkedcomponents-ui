import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
import { mockAuthenticatedLoginState } from '../../../../utils/mockLoginHooks';
import { act, configure, render, screen } from '../../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { image } from '../../__mocks__/image';
import ImageForm from '../ImageForm';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const renderComponent = () => render(<ImageForm image={image} />, { mocks });

test('should show localized alt-text fields', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: true,
    SWEDISH_TRANSLATIONS: true,
    WEB_STORE_INTEGRATION: true,
  });

  await act(async () => {
    await renderComponent();
  });

  screen.getByRole('textbox', {
    name: 'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (suomeksi) *',
  });
  screen.getByLabelText(
    'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (ruotsiksi)'
  );
  screen.getByLabelText(
    'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (englanniksi)'
  );
  screen.getByLabelText(
    'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (venäjäksi)'
  );
  screen.getByLabelText(
    'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (kiinaksi)'
  );
  screen.getByLabelText(
    'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (arabiaksi)'
  );
});

test('should show only Finnish alt-text field', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: false,
    SHOW_ADMIN: true,
    SWEDISH_TRANSLATIONS: true,
    WEB_STORE_INTEGRATION: true,
  });

  await act(async () => {
    await renderComponent();
  });

  screen.getByRole('textbox', {
    name: 'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) *',
  });
});
