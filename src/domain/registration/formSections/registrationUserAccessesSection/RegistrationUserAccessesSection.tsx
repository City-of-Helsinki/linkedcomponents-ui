import { ArrayHelpers, FieldArray, useField } from 'formik';
import { ButtonVariant, IconPlus } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import Fieldset from '../../../../common/components/fieldset/Fieldset';
import FieldWithButton from '../../../event/layout/FieldWithButton';
import { REGISTRATION_FIELDS } from '../../constants';
import { RegistrationUserAccessFormFields } from '../../types';
import { getEmptyRegistrationUserAccess } from '../../utils';
import RegistrationUserAccess from './registrationUserAccess/RegistrationUserAccess';

interface Props {
  isEditingAllowed: boolean;
}

const getRegistrationUserAccessPath = (index: number) =>
  `${REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES}[${index}]`;

const RegistrationUserAccessesSection: React.FC<Props> = ({
  isEditingAllowed,
}) => {
  const { t } = useTranslation();

  const [{ value: registrationUserAccesses }] = useField<
    RegistrationUserAccessFormFields[]
  >({
    name: REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES,
  });

  return (
    <Fieldset
      heading={t('registration.form.sections.registrationUserAccesses')}
      hideLegend
    >
      <FieldArray
        name={REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES}
        render={(arrayHelpers: ArrayHelpers) => (
          <div>
            {registrationUserAccesses.map((userAccess, index) => {
              return (
                <RegistrationUserAccess
                  key={userAccess.id || `useraccess-${index}`}
                  isEditingAllowed={isEditingAllowed}
                  onDelete={() => arrayHelpers.remove(index)}
                  registrationUserAccessPath={getRegistrationUserAccessPath(
                    index
                  )}
                />
              );
            })}

            <FieldWithButton>
              <Button
                disabled={!isEditingAllowed}
                fullWidth={true}
                iconStart={<IconPlus />}
                onClick={() =>
                  arrayHelpers.push(getEmptyRegistrationUserAccess())
                }
                type="button"
                variant={ButtonVariant.Primary}
              >
                {t('registration.form.buttonAddRegistrationUserAccess')}
              </Button>
            </FieldWithButton>
          </div>
        )}
      />
    </Fieldset>
  );
};

export default RegistrationUserAccessesSection;
