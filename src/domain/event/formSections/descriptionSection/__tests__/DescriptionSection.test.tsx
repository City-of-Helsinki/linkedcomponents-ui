/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik';
import { ObjectSchema } from 'yup';

import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  LE_DATA_LANGUAGES,
} from '../../../../../constants';
import { MultiLanguageObject } from '../../../../../types';
import { mockAuthenticatedLoginState } from '../../../../../utils/mockLoginHooks';
import {
  configure,
  mockString,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import {
  externalUserEventSchema,
  publicEventSchema,
} from '../../../validation';
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
  [EVENT_FIELDS.HAS_ENVIRONMENTAL_CERTIFICATE]?: boolean;
  [EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE]?: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.DESCRIPTION]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
  [EVENT_FIELDS.NAME]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [EVENT_FIELDS.SHORT_DESCRIPTION]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [EVENT_FIELDS.TYPE]: type,
};

const defaultProps: DescriptionSectionProps = {
  isEditingAllowed: true,
  isExternalUser: false,
  selectedLanguage: languages[0],
  setSelectedLanguage: vi.fn(),
};

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const mocks = [mockedUserResponse];

const renderComponent = (
  initialValues?: Partial<InitialValues>,
  props?: Partial<DescriptionSectionProps>,
  schema: ObjectSchema<any> = publicEventSchema
) => {
  const { rerender, ...rest } = render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={vi.fn()}
      enableReinitialize={true}
      validationSchema={schema}
    >
      <DescriptionSection {...defaultProps} {...props} />
    </Formik>,
    { mocks }
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
          onSubmit={vi.fn()}
          enableReinitialize={true}
          validationSchema={schema}
        >
          <DescriptionSection {...defaultProps} {...props} />
        </Formik>
      ),
    ...rest,
  };
};

const findDescriptionFiInput = () =>
  screen.findByLabelText(/tekstimuotoilueditori. muokkausalue: main/i);

const getElement = (
  key: 'fiButton' | 'nameFi' | 'shortDescriptionFi' | 'svButton'
) => {
  switch (key) {
    case 'fiButton':
      return screen.getByRole('tab', { name: /suomi/i });
    case 'nameFi':
      return screen.getByLabelText(/tapahtuman otsikko suomeksi/i);
    case 'shortDescriptionFi':
      return screen.getByLabelText(/lyhyt kuvaus suomeksi/i);
    case 'svButton':
      return screen.getByRole('tab', { name: /ruotsi/i });
  }
};

test('should change form section language', async () => {
  const setSelectedLanguage = vi.fn();
  const user = userEvent.setup();
  renderComponent(undefined, { setSelectedLanguage });

  const svButton = getElement('svButton');
  await user.click(svButton);

  expect(setSelectedLanguage).toBeCalledWith('sv');
});

// eslint-disable-next-line max-len
test('should change selected language when current selected language is removed from event info languages', async () => {
  const setSelectedLanguage = vi.fn();

  const { rerender } = await renderComponent(
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
  const user = userEvent.setup();
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

  await user.click(nameInput);
  await user.click(shortDescriptionInput);

  await screen.findByText('Tämä kenttä on pakollinen');
});

test('should show validation error if short description is missing', async () => {
  const user = userEvent.setup();
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

  await user.click(shortDescriptionInput);
  await user.click(nameInput);

  await screen.findByText('Tämä kenttä on pakollinen');
});

test('should show validation error if short description is too long', async () => {
  const user = userEvent.setup();
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

  await user.click(shortDescriptionInput);
  await user.click(nameInput);

  await screen.findByText('Tämä kenttä voi olla korkeintaan 160 merkkiä pitkä');
});

test('should show validation error if description is missing', async () => {
  const setSelectedLanguage = vi.fn();
  const user = userEvent.setup();
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

  const descriptionInput = await findDescriptionFiInput();
  const shortDescriptionInput = getElement('shortDescriptionFi');

  await user.click(descriptionInput);
  await user.click(shortDescriptionInput);

  await screen.findByText('Tämä kenttä on pakollinen');
});

test('should show validation error if description is too long', async () => {
  const setSelectedLanguage = vi.fn();
  const user = userEvent.setup();
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

  const descriptionInput = await findDescriptionFiInput();
  const shortDescriptionInput = getElement('shortDescriptionFi');

  await user.click(descriptionInput);
  await user.click(shortDescriptionInput);

  await screen.findByText(
    'Tämä kenttä voi olla korkeintaan 5000 merkkiä pitkä'
  );
});

test('environmental cerfiticate should be required if hasEnvironmentalCerfiticate is checked', async () => {
  const user = userEvent.setup();
  const schema = externalUserEventSchema;

  renderComponent(
    {
      [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
      [EVENT_FIELDS.DESCRIPTION]: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: 'Description',
      },
      [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Name' },
      [EVENT_FIELDS.SHORT_DESCRIPTION]: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: 'Short description',
      },
      [EVENT_FIELDS.HAS_ENVIRONMENTAL_CERTIFICATE]: false,
      [EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE]: '',
    },
    { isExternalUser: true },
    schema
  );

  const hasEnvironmentalCertificateInput = await screen.findByLabelText(
    /tapahtumalla on ekokompassi tai muu vastaava sertifikaatti/i
  );
  const environmentalCertificateInput =
    await screen.findByLabelText(/sertifikaatin nimi/i);
  const nameInput = getElement('nameFi');

  expect(hasEnvironmentalCertificateInput).not.toBeChecked();

  await user.click(hasEnvironmentalCertificateInput);

  expect(hasEnvironmentalCertificateInput).toBeChecked();
  expect(environmentalCertificateInput).not.toBeDisabled();

  await user.click(environmentalCertificateInput);
  await user.click(nameInput);

  expect(
    await screen.findByText('Tämä kenttä on pakollinen')
  ).toBeInTheDocument();
});
