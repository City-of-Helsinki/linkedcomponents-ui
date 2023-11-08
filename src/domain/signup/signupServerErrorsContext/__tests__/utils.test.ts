/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import {
  parseSeatsReservationServerErrors,
  parseSignupGroupServerErrors,
} from '../utils';

describe('parseSignupGroupServerErrors', () => {
  it('should set server error items', async () => {
    const result = {
      contact_person: {
        email: ['Tämän kentän arvo ei voi olla "null".'],
      },
      registration: ['The name must be specified.'],
      signups: [
        {
          city: ['Tämän kentän arvo ei voi olla "null".'],
          detail: 'The participant is too old.',
          firstName: ['The name must be specified.'],
          non_field_errors: [
            'Kenttien email, registration tulee muodostaa uniikki joukko.',
            'Kenttien phone_number, registration tulee muodostaa uniikki joukko.',
          ],
        },
      ],
    };

    expect(
      parseSignupGroupServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([
      { label: 'Ilmoittautuminen', message: 'Nimi on pakollinen.' },
      { label: 'Kaupunki', message: 'Tämän kentän arvo ei voi olla "null".' },
      { label: '', message: 'Osallistuja on liian vanha.' },
      { label: 'Etunimi', message: 'Nimi on pakollinen.' },
      { label: '', message: 'Sähköpostiosoitteella on jo ilmoittautuminen.' },
    ]);
  });

  it('should return server error items when result is array', () => {
    const result = [
      { firstName: ['The name must be specified.'] },
      { lastName: ['The name must be specified.'] },
    ];

    expect(
      parseSignupGroupServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([
      { label: 'Etunimi', message: 'Nimi on pakollinen.' },
      { label: 'Sukunimi', message: 'Nimi on pakollinen.' },
    ]);
  });

  it('should return server error items when result is array of string', () => {
    const result = ['Could not find all objects to update.'];

    expect(
      parseSignupGroupServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([
      { label: '', message: 'Kaikkia päivitettäviä objekteja ei löytynyt.' },
    ]);
  });
});

describe('parseSeatsReservationServerErrors', () => {
  it('should set generic server error items', async () => {
    const result = { detail: 'Metodi "POST" ei ole sallittu.' };

    expect(
      parseSeatsReservationServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([{ label: '', message: 'Metodi "POST" ei ole sallittu.' }]);
  });

  it('should set server error items', async () => {
    const result = {
      name: ['The name must be specified.'],
    };

    expect(
      parseSeatsReservationServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([{ label: 'name', message: 'Nimi on pakollinen.' }]);
  });

  it('should return server error items when result is array', () => {
    const result = [
      { name: ['The name must be specified.'] },
      { name: ['The name must be specified.'] },
    ];

    expect(
      parseSeatsReservationServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([
      { label: 'name', message: 'Nimi on pakollinen.' },
      { label: 'name', message: 'Nimi on pakollinen.' },
    ]);
  });

  it('should return server error items when result is array of string', () => {
    const result = ['Could not find all objects to update.'];

    expect(
      parseSeatsReservationServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([
      { label: '', message: 'Kaikkia päivitettäviä objekteja ei löytynyt.' },
    ]);
  });
});
