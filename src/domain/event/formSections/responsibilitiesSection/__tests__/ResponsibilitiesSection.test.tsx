import { Formik } from 'formik';
import React from 'react';

import { LE_DATA_LANGUAGES } from '../../../../../constants';
import lowerCaseFirstLetter from '../../../../../utils/lowerCaseFirstLetter';
import { mockUnauthenticatedLoginState } from '../../../../../utils/mockLoginHooks';
import { configure, render, screen } from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import ResponsibilitiesSection, {
  ResponsibilitiesSectionProps,
} from '../ResponsibilitiesSection';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockUnauthenticatedLoginState();
});

const type = EVENT_TYPE.General;

const languages: LE_DATA_LANGUAGES[] = [
  LE_DATA_LANGUAGES.FI,
  LE_DATA_LANGUAGES.SV,
];

type InitialValues = {
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: string[];
  [EVENT_FIELDS.PUBLISHER]: string;
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
  [EVENT_FIELDS.PUBLISHER]: '',
  [EVENT_FIELDS.TYPE]: type,
};

const renderComponent = (
  initialValues?: InitialValues,
  props?: Partial<ResponsibilitiesSectionProps>
) =>
  render(
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={vi.fn()}
    >
      <ResponsibilitiesSection
        {...props}
        isEditingAllowed={true}
        isExternalUser={false}
      />
    </Formik>
  );

const findElement = (key: 'publisherSelector') => {
  switch (key) {
    case 'publisherSelector':
      return screen.findByRole('button', {
        name: /tapahtuman julkaisija: valikko/i,
      });
  }
};

test('should render responsibilities section', async () => {
  renderComponent();

  languages.forEach((language) => {
    const langText = lowerCaseFirstLetter(
      translations.form.inLanguage[language]
    );

    screen.getByLabelText(
      translations.event.form.labelProvider[type].replace(
        '{{langText}}',
        langText
      )
    );
  });

  await findElement('publisherSelector');
});
