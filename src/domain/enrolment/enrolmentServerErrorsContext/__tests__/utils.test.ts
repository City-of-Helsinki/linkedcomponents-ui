/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import {
  parseEnrolmentServerErrors,
  parseSeatsReservationServerErrors,
} from '../utils';

describe('parseEnrolmentServerErrors', () => {
  it('should set server error items', async () => {
    const result = {
      city: ['Tämän kentän arvo ei voi olla "null".'],
      detail: 'The participant is too old.',
      name: ['The name must be specified.'],
      non_field_errors: [
        'Kenttien email, registration tulee muodostaa uniikki joukko.',
        'Kenttien phone_number, registration tulee muodostaa uniikki joukko.',
      ],
    };

    expect(
      parseEnrolmentServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([
      { label: 'Kaupunki', message: 'Tämän kentän arvo ei voi olla "null".' },
      { label: '', message: 'Osallistuja on liian vanha.' },
      { label: 'Nimi', message: 'Nimi on pakollinen.' },
      { label: '', message: 'Sähköpostiosoitteella on jo ilmoittautuminen.' },
    ]);
  });

  it('should return server error items when result is array', () => {
    const result = [
      { name: ['The name must be specified.'] },
      { name: ['The name must be specified.'] },
    ];

    expect(
      parseEnrolmentServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([
      { label: 'Nimi', message: 'Nimi on pakollinen.' },
      { label: 'Nimi', message: 'Nimi on pakollinen.' },
    ]);
  });

  it('should return server error items when result is array of string', () => {
    const result = ['Could not find all objects to update.'];

    expect(
      parseEnrolmentServerErrors({ result, t: i18n.t.bind(i18n) })
    ).toEqual([
      { label: '', message: 'Kaikkia päivitettäviä objekteja ei löytynyt.' },
    ]);
  });
});

describe('parseSeatsReservationServerErrors', () => {
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
