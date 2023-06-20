import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../../../../constants';
import { setFeatureFlags } from '../../../../../../test/featureFlags/featureFlags';
import { MultiLanguageObject } from '../../../../../../types';
import { fakeAuthenticatedAuthContextValue } from '../../../../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../../utils/testUtils';
import {
  imageFields,
  imageNotFoundAtId,
  mockedImageNotFoundResponse,
  mockedImageResponse,
} from '../../../../../image/__mocks__/image';
import {
  DEFAULT_LICENSE_TYPE,
  IMAGE_FIELDS,
  LICENSE_TYPES,
} from '../../../../../image/constants';
import { mockedOrganizationAncestorsResponse } from '../../../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../../constants';
import { publicEventSchema } from '../../../../validation';
import ImageDetailsFields, {
  ImageDetailsFieldsProps,
} from '../ImageDetailsFields';

configure({ defaultHidden: true });

const defaultProps: ImageDetailsFieldsProps = {
  field: EVENT_FIELDS.IMAGE_DETAILS,
  imageAtId: '',
};

const defaultMocks = [
  mockedImageResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
  mockedImageNotFoundResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const eventType = EVENT_TYPE.General;

interface InitialValues {
  [EVENT_FIELDS.IMAGES]: string[];
  [EVENT_FIELDS.IMAGE_DETAILS]: {
    [IMAGE_FIELDS.ALT_TEXT]: MultiLanguageObject;
    [IMAGE_FIELDS.LICENSE]: string;
    [IMAGE_FIELDS.NAME]: string;
    [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: string;
  };
  [EVENT_FIELDS.TYPE]: string;
}

const defaultInitialValus: InitialValues = {
  [EVENT_FIELDS.IMAGES]: [],
  [EVENT_FIELDS.IMAGE_DETAILS]: {
    [IMAGE_FIELDS.ALT_TEXT]: EMPTY_MULTI_LANGUAGE_OBJECT,
    [IMAGE_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
    [IMAGE_FIELDS.NAME]: '',
    [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: '',
  },
  [EVENT_FIELDS.TYPE]: eventType,
};

const renderComponent = ({
  initialValues,
  mocks = defaultMocks,
  props,
}: {
  initialValues?: InitialValues;
  mocks?: MockedResponse[];
  props?: Partial<ImageDetailsFieldsProps>;
}) =>
  act(async () => {
    await render(
      <Formik
        onSubmit={jest.fn()}
        initialValues={initialValues || defaultInitialValus}
        validationSchema={publicEventSchema}
      >
        <ImageDetailsFields {...defaultProps} {...props} />
      </Formik>,
      { mocks, authContextValue }
    );
  });

const findElement = (key: 'altText') => {
  switch (key) {
    case 'altText':
      return screen.findByRole('textbox', {
        name: 'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (suomeksi) *',
      });
  }
};

const getElement = (
  key: 'altText' | 'ccByRadio' | 'eventOnlyRadio' | 'name' | 'photographerName'
) => {
  switch (key) {
    case 'altText':
      return screen.getByRole('textbox', {
        name: 'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) (suomeksi) *',
      });
    case 'ccByRadio':
      return screen.getByRole('radio', { name: 'Creative Commons BY 4.0' });
    case 'eventOnlyRadio':
      return screen.getByRole('radio', {
        name: 'Käyttö rajattu tapahtuman yhteyteen',
      });
    case 'name':
      return screen.getByLabelText(/Kuvateksti/i);
    case 'photographerName':
      return screen.getByLabelText('Kuvaajan nimi');
  }
};

const setLocalizedImageFeatureFlag = (localizedImage: boolean) => {
  setFeatureFlags({
    LOCALIZED_IMAGE: localizedImage,
    SHOW_ADMIN: true,
    SHOW_REGISTRATION: true,
  });
};

test('should show localized alt-text fields', async () => {
  setLocalizedImageFeatureFlag(true);

  await renderComponent({});

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
  setLocalizedImageFeatureFlag(false);

  await renderComponent({});

  screen.getByRole('textbox', {
    name: 'Kuvan vaihtoehtoinen teksti ruudunlukijoille (alt-teksti) *',
  });
});

test('all fields should be disabled when imageAtId is empty', async () => {
  setLocalizedImageFeatureFlag(true);

  await renderComponent({ props: { imageAtId: '' } });

  await findElement('altText');
  const textInputs = [
    getElement('altText'),
    getElement('name'),
    getElement('photographerName'),
  ];

  textInputs.forEach((textInput) => expect(textInput).toBeDisabled());

  expect(getElement('ccByRadio')).toBeDisabled();
});

test('should clear field values when imageAtId is empty', async () => {
  setLocalizedImageFeatureFlag(true);

  await renderComponent({
    initialValues: {
      [EVENT_FIELDS.IMAGES]: [],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_FIELDS.ALT_TEXT]: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Lorem ipsum',
        },
        [IMAGE_FIELDS.LICENSE]: LICENSE_TYPES.EVENT_ONLY,
        [IMAGE_FIELDS.NAME]: 'Lorem ipsum',
        [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: 'Lorem ipsum',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    },
    props: { imageAtId: '' },
  });

  await findElement('altText');
  const textInputs = [
    getElement('altText'),
    getElement('name'),
    getElement('photographerName'),
  ];
  textInputs.forEach((textInput) => expect(textInput).toHaveValue(''));

  expect(getElement('ccByRadio')).toBeChecked();
});

test('should clear field values when image with imageAtId does not exist', async () => {
  setLocalizedImageFeatureFlag(true);

  await renderComponent({
    initialValues: {
      [EVENT_FIELDS.IMAGES]: [imageNotFoundAtId],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_FIELDS.ALT_TEXT]: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Lorem ipsum',
        },
        [IMAGE_FIELDS.LICENSE]: LICENSE_TYPES.EVENT_ONLY,
        [IMAGE_FIELDS.NAME]: 'Lorem ipsum',
        [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: 'Lorem ipsum',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    },
    props: { imageAtId: imageNotFoundAtId },
  });

  const ccByRadio = getElement('ccByRadio');
  await waitFor(() => expect(ccByRadio).toBeChecked());

  const textInputs = [
    getElement('altText'),
    getElement('name'),
    getElement('photographerName'),
  ];

  textInputs.forEach((textInput) => expect(textInput).toHaveValue(''));
});

test('should set field values', async () => {
  setLocalizedImageFeatureFlag(true);

  await renderComponent({ props: { imageAtId: imageFields.atId } });

  const textInputCases = [
    { input: getElement('altText'), expectedValue: imageFields.altText.fi },
    { input: getElement('name'), expectedValue: imageFields.name },
    {
      input: getElement('photographerName'),
      expectedValue: imageFields.photographerName,
    },
  ];

  for (const { input, expectedValue } of textInputCases) {
    await waitFor(() => expect(input).toHaveValue(expectedValue));
  }

  const eventOnlyRadio = getElement('eventOnlyRadio');
  expect(eventOnlyRadio).toBeChecked();
  expect(eventOnlyRadio).toBeEnabled();
});

test('should show validation error when entering too short altText', async () => {
  setLocalizedImageFeatureFlag(true);

  const user = userEvent.setup();

  await renderComponent({
    initialValues: {
      [EVENT_FIELDS.IMAGES]: [imageFields.atId],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_FIELDS.ALT_TEXT]: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Lorem ipsum',
        },
        [IMAGE_FIELDS.LICENSE]: LICENSE_TYPES.CC_BY,
        [IMAGE_FIELDS.NAME]: '',
        [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: '',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    },
    props: { imageAtId: imageFields.atId },
  });

  const altTextInput = getElement('altText');

  await waitFor(() => expect(altTextInput).toHaveValue(imageFields.altText.fi));

  await user.clear(altTextInput);
  await user.type(altTextInput, '123');
  await user.tab();

  await screen.findByText('Tämä kenttä tulee olla vähintään 6 merkkiä pitkä');
});
