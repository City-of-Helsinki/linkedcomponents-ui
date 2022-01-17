import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';

import {
  ImageDocument,
  UserDocument,
} from '../../../../../../generated/graphql';
import generateAtId from '../../../../../../utils/generateAtId';
import { fakeImage } from '../../../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../../utils/testUtils';
import translations from '../../../../../app/i18n/fi.json';
import {
  DEFAULT_LICENSE_TYPE,
  LICENSE_TYPES,
} from '../../../../../image/constants';
import { TEST_PUBLISHER_ID } from '../../../../../organization/constants';
import {
  EVENT_FIELDS,
  EVENT_TYPE,
  IMAGE_DETAILS_FIELDS,
} from '../../../../constants';
import { publicEventSchema } from '../../../../utils';
import {
  mockedOrganizationsResponse,
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../__mocks__/imageSection';
import ImageDetailsFields, {
  ImageDetailsFieldsProps,
} from '../ImageDetailsFields';

configure({ defaultHidden: true });

const defaultProps: ImageDetailsFieldsProps = {
  field: EVENT_FIELDS.IMAGE_DETAILS,
  imageAtId: '',
};

const id = 'hel:123';
const atId = generateAtId(id, 'image');
const publisher = TEST_PUBLISHER_ID;
const imageFields = {
  id,
  atId,
  altText: 'Alt',
  license: LICENSE_TYPES.EVENT_ONLY,
  name: 'Image name',
  photographerName: 'Photographer name',
  publisher,
};
const image = fakeImage(imageFields);
const imageVariables = { createPath: undefined, id };
const imageResponse = { data: { image } };
const mockedImageResponse = {
  request: {
    query: ImageDocument,
    variables: imageVariables,
  },
  result: imageResponse,
};

const notFoundId = 'not-found';
const notFoundAtId = generateAtId(notFoundId, 'image');
const notFoundVariables = { createPath: undefined, id: notFoundId };
const mockedNotFoundResponse = {
  request: {
    query: ImageDocument,
    variables: notFoundVariables,
  },
  error: new Error('not found'),
};

const defaultMocks = [
  mockedImageResponse,
  mockedOrganizationsResponse,
  mockedUserResponse,
  mockedNotFoundResponse,
];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const eventType = EVENT_TYPE.General;

interface InitialValues {
  [EVENT_FIELDS.IMAGES]: string[];
  [EVENT_FIELDS.IMAGE_DETAILS]: {
    [IMAGE_DETAILS_FIELDS.ALT_TEXT]: string;
    [IMAGE_DETAILS_FIELDS.LICENSE]: string;
    [IMAGE_DETAILS_FIELDS.NAME]: string;
    [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: string;
  };
  [EVENT_FIELDS.TYPE]: string;
}

const defaultInitialValus: InitialValues = {
  [EVENT_FIELDS.IMAGES]: [],
  [EVENT_FIELDS.IMAGE_DETAILS]: {
    [IMAGE_DETAILS_FIELDS.ALT_TEXT]: '',
    [IMAGE_DETAILS_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
    [IMAGE_DETAILS_FIELDS.NAME]: '',
    [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: '',
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
        name: translations.event.form.image.labelAltText,
      });
  }
};

const getElement = (
  key: 'altText' | 'ccByRadio' | 'eventOnlyRadio' | 'name' | 'photographerName'
) => {
  switch (key) {
    case 'altText':
      return screen.getByRole('textbox', {
        name: translations.event.form.image.labelAltText,
      });
    case 'ccByRadio':
      return screen.getByRole('radio', {
        name: translations.event.form.image.license.ccBy,
      });
    case 'eventOnlyRadio':
      return screen.getByRole('radio', {
        name: translations.event.form.image.license.eventOnly[eventType],
      });
    case 'name':
      return screen.getByRole('textbox', {
        name: translations.event.form.image.labelName,
      });
    case 'photographerName':
      return screen.getByRole('textbox', {
        name: translations.event.form.image.labelPhotographerName,
      });
  }
};

test('all fields should be disabled when imageAtId is null', async () => {
  renderComponent({ props: { imageAtId: null } });

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
  renderComponent({
    initialValues: {
      [EVENT_FIELDS.IMAGES]: [],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_DETAILS_FIELDS.ALT_TEXT]: 'Lorem ipsum',
        [IMAGE_DETAILS_FIELDS.LICENSE]: LICENSE_TYPES.EVENT_ONLY,
        [IMAGE_DETAILS_FIELDS.NAME]: 'Lorem ipsum',
        [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: 'Lorem ipsum',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    },
    props: { imageAtId: null },
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
      [EVENT_FIELDS.IMAGES]: [notFoundAtId],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_DETAILS_FIELDS.ALT_TEXT]: 'Lorem ipsum',
        [IMAGE_DETAILS_FIELDS.LICENSE]: LICENSE_TYPES.EVENT_ONLY,
        [IMAGE_DETAILS_FIELDS.NAME]: 'Lorem ipsum',
        [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: 'Lorem ipsum',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    },
    props: { imageAtId: notFoundAtId },
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
    { input: getElement('altText'), expectedValue: imageFields.altText },
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
  renderComponent({ mocks, props: { imageAtId: imageFields.atId } });

  const textInputs = [
    getElement('altText'),
    getElement('name'),
    getElement('photographerName'),
  ];

  for (const input of textInputs) {
    await waitFor(() => expect(input).toBeDisabled());
  }

  const eventOnlyRadio = getElement('eventOnlyRadio');
  expect(eventOnlyRadio).toBeChecked();
  expect(eventOnlyRadio).toBeDisabled();
});

test('should show validation error when entering too short altText', async () => {
  renderComponent({
    initialValues: {
      [EVENT_FIELDS.IMAGES]: [imageFields.atId],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_DETAILS_FIELDS.ALT_TEXT]: '',
        [IMAGE_DETAILS_FIELDS.LICENSE]: LICENSE_TYPES.CC_BY,
        [IMAGE_DETAILS_FIELDS.NAME]: '',
        [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: '',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    },
    props: { imageAtId: imageFields.atId },
  });

  const altTextInput = getElement('altText');

  await waitFor(() => expect(altTextInput).toHaveValue(imageFields.altText));

  userEvent.click(altTextInput);
  userEvent.clear(altTextInput);
  userEvent.type(altTextInput, '123');

  userEvent.tab();

  await screen.findByText('Tämä kenttä tulee olla vähintään 6 merkkiä pitkä');
});
