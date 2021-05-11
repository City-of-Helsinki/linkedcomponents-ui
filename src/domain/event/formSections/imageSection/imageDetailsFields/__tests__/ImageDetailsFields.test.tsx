import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';

import { MAX_PAGE_SIZE } from '../../../../../../constants';
import {
  ImageDocument,
  OrganizationsDocument,
  UserDocument,
} from '../../../../../../generated/graphql';
import {
  fakeImage,
  fakeOrganizations,
  fakeUser,
} from '../../../../../../utils/mockDataUtils';
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
import {
  EVENT_FIELDS,
  EVENT_TYPE,
  IMAGE_DETAILS_FIELDS,
} from '../../../../constants';
import { eventValidationSchema } from '../../../../utils';
import ImageDetailsFields, {
  ImageDetailsFieldsProps,
} from '../ImageDetailsFields';

configure({ defaultHidden: true });

const defaultProps: ImageDetailsFieldsProps = {
  field: EVENT_FIELDS.IMAGE_DETAILS,
};

const id = 'hel:123';
const publisher = 'publisher:1';
const imageFields = {
  id,
  atId: `https://api.hel.fi/linkedevents-test/v1/image/${id}/`,
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
const notFoundAtId = `https://api.hel.fi/linkedevents-test/v1/image/${notFoundId}/`;
const notFoundVariables = { createPath: undefined, id: notFoundId };
const mockedNotFoundResponse = {
  request: {
    query: ImageDocument,
    variables: notFoundVariables,
  },
  error: new Error('not found'),
};

const organizationsVariables = {
  child: publisher,
  createPath: undefined,
  pageSize: MAX_PAGE_SIZE,
};
const organizationsResponse = { data: { organizations: fakeOrganizations(0) } };
const mockedOrganizationsResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  result: organizationsResponse,
};

const user = fakeUser({
  organization: publisher,
  adminOrganizations: [publisher],
  organizationMemberships: [],
});
const userVariables = {
  createPath: undefined,
  id: 'user:1',
};
const userResponse = { data: { user } };
const mockedUserResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userResponse,
};

const defaultMocks = [
  mockedImageResponse,
  mockedNotFoundResponse,
  mockedOrganizationsResponse,
  mockedUserResponse,
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
      validationSchema={eventValidationSchema}
    >
      <ImageDetailsFields {...defaultProps} {...props} />
    </Formik>,
    { mocks, store }
  );

test('all fields should be disabled when imageAtId is null', () => {
  renderComponent({ props: { imageAtId: null } });

  const fields = [
    translations.event.form.image.labelAltText,
    translations.event.form.image.labelName,
    translations.event.form.image.labelPhotographerName,
  ];

  fields.forEach((name) => {
    expect(screen.getByRole('textbox', { name })).toBeDisabled();
  });

  expect(
    screen.getByRole('radio', {
      name: translations.event.form.image.license.ccBy,
    })
  ).toBeDisabled();
});

test('should clear field values when imageAtId is null', () => {
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

  const fields = [
    translations.event.form.image.labelAltText,
    translations.event.form.image.labelName,
    translations.event.form.image.labelPhotographerName,
  ];

  fields.forEach((name) => {
    expect(screen.getByRole('textbox', { name })).toHaveValue('');
  });

  expect(
    screen.getByRole('radio', {
      name: translations.event.form.image.license.ccBy,
    })
  ).toBeChecked();
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

  await waitFor(() => {
    expect(
      screen.getByRole('radio', {
        name: translations.event.form.image.license.ccBy,
      })
    ).toBeChecked();
  });

  const fields = [
    translations.event.form.image.labelAltText,
    translations.event.form.image.labelName,
    translations.event.form.image.labelPhotographerName,
  ];

  fields.forEach((name) => {
    expect(screen.getByRole('textbox', { name })).toHaveValue('');
  });
});

test('should set field values', async () => {
  renderComponent({ props: { imageAtId: imageFields.atId } });

  const altTextInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelAltText,
  });
  const nameInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelName,
  });
  const photographerNameInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelPhotographerName,
  });

  const fields = [
    { input: altTextInput, expectedValue: imageFields.altText },
    { input: nameInput, expectedValue: imageFields.name },
    {
      input: photographerNameInput,
      expectedValue: imageFields.photographerName,
    },
  ];

  for (const { input, expectedValue } of fields) {
    await waitFor(() => {
      expect(input).toHaveValue(expectedValue);
      expect(input).toBeEnabled();
    });
  }

  const eventOnlyRadio = screen.getByRole('radio', {
    name: translations.event.form.image.license.eventOnly[eventType],
  });
  expect(eventOnlyRadio).toBeChecked();
  expect(eventOnlyRadio).toBeEnabled();
});

test("all fields should be disabled when user doesn't have permission to edit image", async () => {
  const user = fakeUser({
    organization: '',
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse = {
    request: {
      query: UserDocument,
      variables: userVariables,
    },
    result: userResponse,
  };

  const mocks = [
    ...defaultMocks.filter((mock) => mock.request.query !== UserDocument),
    mockedUserResponse,
  ];
  renderComponent({ mocks, props: { imageAtId: imageFields.atId } });

  const altTextInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelAltText,
  });
  const nameInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelName,
  });
  const photographerNameInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelPhotographerName,
  });

  const fields = [
    { input: altTextInput, expectedValue: imageFields.altText },
    { input: nameInput, expectedValue: imageFields.name },
    {
      input: photographerNameInput,
      expectedValue: imageFields.photographerName,
    },
  ];

  for (const { input, expectedValue } of fields) {
    await waitFor(() => {
      expect(input).toHaveValue(expectedValue);
      expect(input).toBeDisabled();
    });
  }

  const eventOnlyRadio = screen.getByRole('radio', {
    name: translations.event.form.image.license.eventOnly[eventType],
  });
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

  const altTextInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelAltText,
  });

  await waitFor(() => {
    expect(altTextInput).toHaveValue(imageFields.altText);
  });

  userEvent.click(altTextInput);
  userEvent.clear(altTextInput);
  userEvent.type(altTextInput, '123');

  userEvent.tab();

  await screen.findByText('Tämä kenttä tulee olla vähintään 6 merkkiä pitkä');
});
