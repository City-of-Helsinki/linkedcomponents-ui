import { Formik } from 'formik';
import React from 'react';

import { ImageDocument } from '../../../../../../generated/graphql';
import { fakeImage } from '../../../../../../utils/mockDataUtils';
import {
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
import { createEventValidationSchema } from '../../../../utils';
import ImageDetailsFields, {
  ImageDetailsFieldsProps,
} from '../ImageDetailsFields';

const defaultProps: ImageDetailsFieldsProps = {
  field: EVENT_FIELDS.IMAGE_DETAILS,
};

const id = 'hel:123';
const imageDetails = {
  id,
  atId: `https://api.hel.fi/linkedevents-test/v1/image/${id}/`,
  altText: 'Alt',
  license: LICENSE_TYPES.EVENT_ONLY,
  name: 'Image name',
  photographerName: 'Photographer name',
};
const notFoundId = 'not-found';
const notFoundAtId = `https://api.hel.fi/linkedevents-test/v1/image/${notFoundId}/`;

const image = fakeImage(imageDetails);
const imageResponse = { data: { image } };

const mocks = [
  {
    request: {
      query: ImageDocument,
      variables: { createPath: undefined, id },
    },
    result: imageResponse,
  },
  {
    request: {
      query: ImageDocument,
      variables: { createPath: undefined, id: notFoundId },
    },
    error: new Error('not found'),
  },
];

const eventType = EVENT_TYPE.EVENT;

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

const renderComponent = (
  props?: Partial<ImageDetailsFieldsProps>,
  initialValues?: InitialValues
) =>
  render(
    <Formik
      onSubmit={jest.fn()}
      initialValues={initialValues || defaultInitialValus}
      validationSchema={createEventValidationSchema}
    >
      <ImageDetailsFields {...defaultProps} {...props} />
    </Formik>,
    { mocks }
  );

test('all fields should be disabled when imageAtId is null', () => {
  renderComponent({ imageAtId: null });

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
  renderComponent(
    { imageAtId: null },
    {
      [EVENT_FIELDS.IMAGES]: [],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_DETAILS_FIELDS.ALT_TEXT]: 'Lorem ipsum',
        [IMAGE_DETAILS_FIELDS.LICENSE]: LICENSE_TYPES.EVENT_ONLY,
        [IMAGE_DETAILS_FIELDS.NAME]: 'Lorem ipsum',
        [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: 'Lorem ipsum',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    }
  );

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
  renderComponent(
    { imageAtId: notFoundAtId },
    {
      [EVENT_FIELDS.IMAGES]: [notFoundAtId],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_DETAILS_FIELDS.ALT_TEXT]: 'Lorem ipsum',
        [IMAGE_DETAILS_FIELDS.LICENSE]: LICENSE_TYPES.EVENT_ONLY,
        [IMAGE_DETAILS_FIELDS.NAME]: 'Lorem ipsum',
        [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: 'Lorem ipsum',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    }
  );

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
  renderComponent({ imageAtId: imageDetails.atId });

  await waitFor(() => {
    expect(
      screen.getByRole('textbox', {
        name: translations.event.form.image.labelAltText,
      })
    ).toHaveValue(imageDetails.altText);
  });

  expect(
    screen.getByRole('textbox', {
      name: translations.event.form.image.labelName,
    })
  ).toHaveValue(imageDetails.name);

  expect(
    screen.getByRole('textbox', {
      name: translations.event.form.image.labelPhotographerName,
    })
  ).toHaveValue(imageDetails.photographerName);

  expect(
    screen.getByRole('radio', {
      name: translations.event.form.image.license.eventOnly[eventType],
    })
  ).toBeChecked();
});

test('should show validation error when entering too short altText', async () => {
  renderComponent(
    { imageAtId: imageDetails.atId },
    {
      [EVENT_FIELDS.IMAGES]: [imageDetails.atId],
      [EVENT_FIELDS.IMAGE_DETAILS]: {
        [IMAGE_DETAILS_FIELDS.ALT_TEXT]: '',
        [IMAGE_DETAILS_FIELDS.LICENSE]: LICENSE_TYPES.CC_BY,
        [IMAGE_DETAILS_FIELDS.NAME]: '',
        [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: '',
      },
      [EVENT_FIELDS.TYPE]: eventType,
    }
  );

  const altTextInput = screen.getByRole('textbox', {
    name: translations.event.form.image.labelAltText,
  });

  await waitFor(() => {
    expect(altTextInput).toHaveValue(imageDetails.altText);
  });

  userEvent.click(altTextInput);
  userEvent.clear(altTextInput);
  userEvent.type(altTextInput, '123');

  userEvent.tab();

  await waitFor(() => {
    expect(
      screen.queryByText('Tämä kenttä tulee olla vähintään 6 merkkiä pitkä')
    ).toBeInTheDocument();
  });
});
