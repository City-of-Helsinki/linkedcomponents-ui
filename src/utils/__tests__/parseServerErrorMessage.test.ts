/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { LEServerError } from '../../types';
import parseServerErrorMessage from '../parseServerErrorMessage';

const testCases: [LEServerError, string][] = [
  ['An object with given id already exists.', 'Arvon tulee olla uniikki.'],
  [
    'Arvo saa olla enintään 255 merkkiä pitkä.',
    'Arvo saa olla enintään 255 merkkiä pitkä.',
  ],
  [
    { error: 'Arvo saa olla enintään 255 merkkiä pitkä.' },
    'Arvo saa olla enintään 255 merkkiä pitkä.',
  ],
  [
    [{ error: 'Arvo saa olla enintään 255 merkkiä pitkä.' }],
    'Arvo saa olla enintään 255 merkkiä pitkä.',
  ],
  [
    { error: ['Arvo saa olla enintään 255 merkkiä pitkä.'] },
    'Arvo saa olla enintään 255 merkkiä pitkä.',
  ],
  [
    [{ error: ['Arvo saa olla enintään 255 merkkiä pitkä.'] }],
    'Arvo saa olla enintään 255 merkkiä pitkä.',
  ],
  ['Arvon tulee olla uniikki.', 'Arvon tulee olla uniikki.'],
  [
    'Could not find all objects to update.',
    'Kaikkia päivitettäviä objekteja ei löytynyt.',
  ],
  [
    'End time cannot be in the past. Please set a future end time.',
    'Lopetusaika ei voi olla menneisyydessä. Määritä tuleva päättymisaika.',
  ],
  [
    'Kenttien email, registration tulee muodostaa uniikki joukko.',
    'Sähköpostiosoitteella on jo ilmoittautuminen.',
  ],
  [
    'Kenttien phone_number, registration tulee muodostaa uniikki joukko.',
    'Puhelinnumerolla on jo ilmoittautuminen.',
  ],
  [
    [
      'Kenttien email, registration tulee muodostaa uniikki joukko.',
      'Kenttien phone_number, registration tulee muodostaa uniikki joukko.',
    ],
    'Sähköpostiosoitteella on jo ilmoittautuminen.',
  ],
  [['Metodi "DELETE" ei ole sallittu.'], 'Metodi "DELETE" ei ole sallittu.'],
  [['Metodi "POST" ei ole sallittu.'], 'Metodi "POST" ei ole sallittu.'],
  [['Metodi "PUT" ei ole sallittu.'], 'Metodi "PUT" ei ole sallittu.'],
  [
    'Price info must be specified before an event is published.',
    'Hintatiedot on määritettävä ennen tapahtuman julkaisemista.',
  ],
  [
    'Short description length must be 160 characters or less',
    'Lyhyen kuvauksen pituus saa olla enintään 160 merkkiä.',
  ],
  ['Syötä oikea URL-osoite.', 'Syötä oikea URL-osoite.'],
  ['The name must be specified.', 'Nimi on pakollinen.'],
  ['The participant is too old.', 'Osallistuja on liian vanha.'],
  ['The participant is too young.', 'Osallistuja on liian nuori.'],
  [
    'This field must be specified before an event is published.',
    'Tämä kenttä on määritettävä ennen tapahtuman julkaisemista.',
  ],
  ['Tämä kenttä ei voi olla tyhjä.', 'Tämä kenttä ei voi olla tyhjä.'],
  [
    'Tämän kentän arvo ei voi olla "null".',
    'Tämän kentän arvo ei voi olla "null".',
  ],
  ['Tämän luvun on oltava vähintään 0.', 'Tämän luvun on oltava vähintään 0.'],
];

test.each(testCases)(
  'should return correct error message with error %p, result %p',
  (error, expectedResult) => {
    expect(
      parseServerErrorMessage({
        error: error,
        t: i18n.t.bind(i18n),
      })
    ).toBe(expectedResult);
  }
);
