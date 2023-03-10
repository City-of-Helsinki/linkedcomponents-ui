import React from 'react';

import { setFeatureFlags } from '../../../../test/featureFlags/featureFlags';
import { act, render, screen } from '../../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { image } from '../../__mocks__/image';
import ImageForm from '../ImageForm';

const mocks = [mockedOrganizationResponse, mockedOrganizationAncestorsResponse];

const renderComponent = () => render(<ImageForm image={image} />, { mocks });

test('should show localized alt-text fields', async () => {
  setFeatureFlags({
    LOCALIZED_IMAGE: true,
    SHOW_ADMIN: true,
    SHOW_REGISTRATION: true,
  });

  await act(async () => {
    await renderComponent();
  });

  screen.getByLabelText(
    'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (suomeksi) *'
  );
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
    SHOW_REGISTRATION: true,
  });

  await act(async () => {
    await renderComponent();
  });

  screen.getByLabelText(
    'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) *'
  );
});
