import camelCase from 'lodash/camelCase';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import getValue from '../../../utils/getValue';
import pascalCase from '../../../utils/pascalCase';
import { ATTENDEE_FIELDS, ENROLMENT_FIELDS } from '../../enrolment/constants';
import { REGISTRATION_MANDATORY_FIELDS } from '../constants';

type UseMandatoryFieldOptionsState = {
  contactMandatoryFieldOptions: OptionType[];
  personMandatoryFieldOptions: OptionType[];
};

const useMandatoryFieldOptions = (): UseMandatoryFieldOptionsState => {
  const { t } = useTranslation();

  const state: UseMandatoryFieldOptionsState = useMemo(
    () => ({
      contactMandatoryFieldOptions: getValue(
        (Object.values(REGISTRATION_MANDATORY_FIELDS) as string[])
          .filter((o) =>
            (Object.values(ENROLMENT_FIELDS) as string[]).includes(camelCase(o))
          )
          .map((o) => ({
            label: t(`enrolment.form.label${pascalCase(o)}`),
            value: o,
          })),
        []
      ),
      personMandatoryFieldOptions: getValue(
        (Object.values(REGISTRATION_MANDATORY_FIELDS) as string[])
          .filter((o) =>
            (Object.values(ATTENDEE_FIELDS) as string[]).includes(camelCase(o))
          )
          .map((o) => ({
            label: t(`enrolment.form.label${pascalCase(o)}`),
            value: o,
          })),
        []
      ),
    }),
    [t]
  );

  return state;
};

export default useMandatoryFieldOptions;
