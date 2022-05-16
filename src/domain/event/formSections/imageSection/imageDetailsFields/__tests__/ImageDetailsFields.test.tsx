import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../../../../constants';
import { UserDocument } from '../../../../../../generated/graphql';
import { MultiLanguageObject } from '../../../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../../utils/testUtils';
import translations from '../../../../../app/i18n/fi.json';
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
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../../constants';
import { publicEventSchema } from '../../../../utils';
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

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

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
  render(
    <Formik
      onSubmit={jest.fn()}
      initialValues={initialValues || defaultInitialValus}
      validationSchema={publicEventSchema}
    >
      <ImageDetailsFields {...defaultProps} {...props} />
    </Formik>,
    { mocks, store }
  );

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
      return screen.getByRole('radio', {
        name: translations.image.license.ccBy,
      });
    case 'eventOnlyRadio':
      return screen.getByRole('radio', {
        name: translations.image.license.eventOnly[eventType],
      });
    case 'name':
      return screen.getByRole('textbox', { name: 'Kuvateksti' });
    case 'photographerName':
      return screen.getByRole('textbox', { name: 'Kuvaajan nimi' });
  }
};

test('all fields should be disabled when imageAtId is null', async () => {
  await act(async () => {
    await renderComponent({ props: { imageAtId: null } });
  });

  await findElement('altText');
  const textInputs = [
    getElement('altText'),
    getElement('name'),
    getElement('photographerName'),
  ];

  textInputs.forEach((textInput) => expect(textInput).toBeDisabled());

  expect(getElement('ccByRadio')).toBeDisabled();
});

test('should clear field values when imageAtId is null', async () => {
  await act(async () => {
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
      props: { imageAtId: null },
    });
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
  renderComponent({
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
  renderComponent({ props: { imageAtId: imageFields.atId } });

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

test("all fields should be disabled when user doesn't have permission to edit image", async () => {
  const mocks = [
    ...defaultMocks.filter((mock) => mock.request.query !== UserDocument),
    mockedUserWithoutOrganizationsResponse,
  ];
  await act(async () => {
    await renderComponent({ mocks, props: { imageAtId: imageFields.atId } });
  });

  const textInputs = [
    getElement('altText'),
    getElement('name'),
    getElement('photographerName'),
  ];

  for (const input of textInputs) {
    await waitFor(() => expect(input).toBeDisabled());
  }

  const eventOnlyRadio = getElement('eventOnlyRadio');
  expect(eventOnlyRadio).toBeDisabled();
});

test('should show validation error when entering too short altText', async () => {
  const user = userEvent.setup();
  renderComponent({
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

  await act(async () => await user.click(altTextInput));
  await act(async () => await user.clear(altTextInput));
  await act(async () => await user.type(altTextInput, '123'));
  await act(async () => await user.tab());

  await screen.findByText('Tämä kenttä tulee olla vähintään 6 merkkiä pitkä');
});
