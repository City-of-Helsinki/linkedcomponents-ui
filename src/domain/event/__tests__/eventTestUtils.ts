import { ByRoleMatcher } from '@testing-library/react';

import { screen, within } from '../../../utils/testUtils';

type ExternalUserField = {
  disabled?: boolean;
  label: RegExp | string;
  required?: boolean;
  role?: ByRoleMatcher;
};
export const testExternalUserFields = async () => {
  const fieldGroups: { name: RegExp | string; fields: ExternalUserField[] }[] =
    [
      // Event type
      {
        name: /tapahtumatyyppi/i,
        fields: [{ label: /tapahtuma/i, role: 'radio', disabled: true }],
      },
      // Responsibilities
      {
        name: /vastuut/i,
        fields: [
          {
            label: /tapahtuman julkaisija: valikko/i,
            role: 'button',
            disabled: true,
          },
          { label: /tapahtuman järjestäjä suomeksi/i, required: true },
        ],
      },
      // Description section
      {
        name: /kuvaus/i,
        fields: [
          {
            label:
              /tapahtumalla on ekokompassi tai muu vastaava sertifikaatti/i,
          },
          { label: /sertifikaatin nimi/i, disabled: true, required: true },
        ],
      },
      // Place section
      { name: /paikka/i, fields: [{ label: /sisällä/i }] },
      // Additional info section
      {
        name: /lisätiedot/i,
        fields: [
          {
            label: /Enimmäisosallistujamäärä/i,
            role: 'spinbutton',
            required: true,
          },
        ],
      },
      // External user contact section
      {
        name: /yhteystiedot/i,
        fields: [
          { label: /nimi/i, required: true },
          { label: /sähköpostiosoite/i, required: true },
          { label: /puhelinnumero/i, required: true },
          { label: /organisaatio/i },
          {
            label:
              /olen lukenut tietosuojaselosteen ja annan luvan tietojeni käyttöön/i,
            required: true,
          },
        ],
      },
    ];

  for (const { name, fields } of fieldGroups) {
    const section = await screen.findByRole('group', { name: name });

    for (const { disabled, label, required, role } of fields) {
      const element = role
        ? await within(section).findByRole(role, { name: label })
        : await within(section).findByLabelText(label);
      expect(element).toBeInTheDocument();

      if (disabled) {
        expect(element).toBeDisabled();
      }
      if (required) {
        expect(element).toBeRequired();
      }
    }
  }
};
