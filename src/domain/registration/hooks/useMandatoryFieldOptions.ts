import camelCase from 'lodash/camelCase';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../types';
import getValue from '../../../utils/getValue';
import pascalCase from '../../../utils/pascalCase';
import {
  CONTACT_PERSON_FIELDS,
  SIGNUP_FIELDS,
} from '../../signupGroup/constants';
import { REGISTRATION_MANDATORY_FIELDS } from '../constants';

type UseMandatoryFieldOptionsState = {
  contactPersonMandatoryFieldOptions: OptionType[];
  signupMandatoryFieldOptions: OptionType[];
};

const useMandatoryFieldOptions = (): UseMandatoryFieldOptionsState => {
  const { t } = useTranslation();

  const state: UseMandatoryFieldOptionsState = useMemo(
    () => ({
      contactPersonMandatoryFieldOptions: getValue(
        (Object.values(REGISTRATION_MANDATORY_FIELDS) as string[])
          .filter((o) =>
            (Object.values(CONTACT_PERSON_FIELDS) as string[]).includes(
              camelCase(o)
            )
          )
          .map((o) => ({
            label: t(`signup.form.contactPerson.label${pascalCase(o)}`),
            value: o,
          })),
        []
      ),
      signupMandatoryFieldOptions: getValue(
        (Object.values(REGISTRATION_MANDATORY_FIELDS) as string[])
          .filter((o) =>
            (Object.values(SIGNUP_FIELDS) as string[]).includes(camelCase(o))
          )
          .map((o) => ({
            label: t(`signup.form.signup.label${pascalCase(o)}`),
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
