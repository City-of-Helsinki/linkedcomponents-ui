import { FieldArray, useField } from 'formik';
import { IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import Fieldset from '../../../../common/components/fieldset/Fieldset';
import FieldWithButton from '../../../event/layout/FieldWithButton';
import { REGISTRATION_FIELDS } from '../../constants';
import { RegistrationUserFormFields } from '../../types';
import { getEmptyRegistrationUser } from '../../utils';
import RegistrationUser from './registrationUser/RegistrationUser';

interface Props {
  isEditingAllowed: boolean;
}

const getRegistrationUserPath = (index: number) =>
  `${REGISTRATION_FIELDS.REGISTRATION_USERS}[${index}]`;

const RegistrationUsersSection: React.FC<Props> = ({ isEditingAllowed }) => {
  const { t } = useTranslation();

  const [{ value: registrationUsers }] = useField<RegistrationUserFormFields[]>(
    {
      name: REGISTRATION_FIELDS.REGISTRATION_USERS,
    }
  );

  return (
    <Fieldset
      heading={t('registration.form.sections.registrationUsers')}
      hideLegend
    >
      <FieldArray
        name={REGISTRATION_FIELDS.REGISTRATION_USERS}
        render={(arrayHelpers) => (
          <div>
            {registrationUsers.map((_, index) => {
              return (
                <RegistrationUser
                  key={index}
                  isEditingAllowed={isEditingAllowed}
                  onDelete={() => arrayHelpers.remove(index)}
                  registrationUserPath={getRegistrationUserPath(index)}
                />
              );
            })}

            <FieldWithButton>
              <Button
                disabled={!isEditingAllowed}
                fullWidth={true}
                iconLeft={<IconPlus />}
                onClick={() => arrayHelpers.push(getEmptyRegistrationUser())}
                type="button"
                variant="primary"
              >
                {t('registration.form.buttonAddRegistrationUser')}
              </Button>
            </FieldWithButton>
          </div>
        )}
      />
    </Fieldset>
  );
};

export default RegistrationUsersSection;
