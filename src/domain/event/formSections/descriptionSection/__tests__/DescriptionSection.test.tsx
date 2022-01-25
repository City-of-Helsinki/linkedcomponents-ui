import { Formik } from 'formik';
import React from 'react';

import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  LE_DATA_LANGUAGES,
} from '../../../../../constants';
import { MultiLanguageObject } from '../../../../../types';
import {
  configure,
  mockString,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { publicEventSchema } from '../../../utils';
import DescriptionSection, {
  DescriptionSectionProps,
} from '../DescriptionSection';

configure({ defaultHidden: true });

const languages: LE_DATA_LANGUAGES[] = [
  LE_DATA_LANGUAGES.FI,
  LE_DATA_LANGUAGES.SV,
];
const type = EVENT_TYPE.General;

type InitialValues = {
  [EVENT_FIELDS.DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: LE_DATA_LANGUAGES[];
  [EVENT_FIELDS.NAME]: MultiLanguageObject;
  [EVENT_FIELDS.SHORT_DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.DESCRIPTION]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
  [EVENT_FIELDS.NAME]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [EVENT_FIELDS.SHORT_DESCRIPTION]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [EVENT_FIELDS.TYPE]: type,
};

const defaultProps: DescriptionSectionProps = {
  selectedLanguage: languages[0],
  setSelectedLanguage: jest.fn(),
};

const renderComponent = (
  initialValues?: Partial<InitialValues>,
  props?: Partial<DescriptionSectionProps>
) => {
  const { rerender, ...rest } = render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={publicEventSchema}
    >
      <DescriptionSection {...defaultProps} {...props} />
    </Formik>
  );

  return {
    rerender: (newInitialValues?: Partial<InitialValues>) =>
      rerender(
        <Formik
          initialValues={{
            ...defaultInitialValues,
            ...initialValues,
            ...newInitialValues,
          }}
          onSubmit={jest.fn()}
          enableReinitialize={true}
          validationSchema={publicEventSchema}
        >
          <DescriptionSection {...defaultProps} {...props} />
        </Formik>
      ),
    ...rest,
  };
};

const getElement = (
  key:
    | 'descriptionFi'
    | 'fiButton'
    | 'nameFi'
    | 'shortDescriptionFi'
    | 'svButton'
) => {
  switch (key) {
    case 'descriptionFi':
      return screen.getByRole('textbox', {
        name: /tapahtuman kuvaus suomeksi/i,
      });
    case 'fiButton':
      return screen.getByRole('tab', { name: /suomi/i });
    case 'nameFi':
      return screen.getByRole('textbox', {
        name: /tapahtuman otsikko suomeksi/i,
      });
    case 'shortDescriptionFi':
      return screen.getByRole('textbox', {
        name: /lyhyt kuvaus suomeksi/i,
      });
    case 'svButton':
      return screen.getByRole('tab', { name: /ruotsi/i });
  }
};

test('should change form section language', () => {
  const setSelectedLanguage = jest.fn();
  renderComponent(undefined, { setSelectedLanguage });

  const svButton = getElement('svButton');
  userEvent.click(svButton);

  expect(setSelectedLanguage).toBeCalledWith('sv');
});

// eslint-disable-next-line max-len
test('should change selected language when current selected language is removed from event info languages', () => {
  const setSelectedLanguage = jest.fn();
  const { rerender } = renderComponent(
    {
      [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [
        LE_DATA_LANGUAGES.FI,
        LE_DATA_LANGUAGES.SV,
      ],
    },
    { setSelectedLanguage }
  );

  const fiButton = getElement('fiButton');
  const svButton = getElement('svButton');

  expect(fiButton).toBeInTheDocument();
  expect(svButton).toBeInTheDocument();
  expect(fiButton.getAttribute('aria-selected')).toBe('true');
  expect(svButton.getAttribute('aria-selected')).toBe('false');

  rerender({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.SV],
  });

  expect(setSelectedLanguage).toBeCalledWith('sv');
});

test('should show validation error if name is missing', async () => {
  renderComponent({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
    [EVENT_FIELDS.DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: 'Description',
    },
    [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
    [EVENT_FIELDS.SHORT_DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: 'Short description',
    },
  });

  const nameInput = getElement('nameFi');
  const shortDescriptionInput = getElement('shortDescriptionFi');

  userEvent.click(nameInput);
  userEvent.click(shortDescriptionInput);

  await screen.findByText('Tämä kenttä on pakollinen');
});

test('should show validation error if short description is missing', async () => {
  renderComponent({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
    [EVENT_FIELDS.DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: 'Description',
    },
    [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Name' },
    [EVENT_FIELDS.SHORT_DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
    },
  });

  const shortDescriptionInput = getElement('shortDescriptionFi');
  const nameInput = getElement('nameFi');

  userEvent.click(shortDescriptionInput);
  userEvent.click(nameInput);

  await screen.findByText('Tämä kenttä on pakollinen');
});

test('should show validation error if short description is too long', async () => {
  renderComponent({
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
    [EVENT_FIELDS.DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: 'Description',
    },
    [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Name' },
    [EVENT_FIELDS.SHORT_DESCRIPTION]: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: mockString(5001),
    },
  });

  const shortDescriptionInput = getElement('shortDescriptionFi');
  const nameInput = getElement('nameFi');

  userEvent.click(shortDescriptionInput);
  userEvent.click(nameInput);

  await screen.findByText('Tämä kenttä voi olla korkeintaan 160 merkkiä pitkä');
});

test('should show validation error if description is missing', async () => {
  const setSelectedLanguage = jest.fn();
  renderComponent(
    {
      [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
      [EVENT_FIELDS.DESCRIPTION]: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
      },
      [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Name' },
      [EVENT_FIELDS.SHORT_DESCRIPTION]: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: 'Short description',
      },
    },
    { setSelectedLanguage }
  );

  const descriptionInput = getElement('descriptionFi');
  const shortDescriptionInput = getElement('shortDescriptionFi');

  userEvent.click(descriptionInput);
  userEvent.click(shortDescriptionInput);

  await screen.findByText('Tämä kenttä on pakollinen');
});

test('should show validation error if description is too long', async () => {
  const setSelectedLanguage = jest.fn();
  renderComponent(
    {
      [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
      [EVENT_FIELDS.DESCRIPTION]: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: mockString(5001),
      },
      [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Name' },
      [EVENT_FIELDS.SHORT_DESCRIPTION]: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: 'Short description',
      },
    },
    { setSelectedLanguage }
  );

  const descriptionInput = getElement('descriptionFi');
  const shortDescriptionInput = getElement('shortDescriptionFi');

  userEvent.click(descriptionInput);
  userEvent.click(shortDescriptionInput);

  await screen.findByText(
    'Tämä kenttä voi olla korkeintaan 5000 merkkiä pitkä'
  );
});
