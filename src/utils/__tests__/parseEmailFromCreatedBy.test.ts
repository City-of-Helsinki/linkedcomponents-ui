import parseEmailFromCreatedBy from '../parseEmailFromCreatedBy';
const cases = [
  [
    'Testi-Ukko Kapiainen - ukko.kapiainen@testiosoite.fi',
    'ukko.kapiainen@testiosoite.fi',
  ],
  ['Testi Ukkeli - testi-ukkeli@testiosoite.fi', 'testi-ukkeli@testiosoite.fi'],
  ['Testi Idea - testi.idea@testi-osoite.fi', 'testi.idea@testi-osoite.fi'],
  [
    'Ääripää Äijä - äijä-ääripää@älykäsosoite.fi',
    'äijä-ääripää@älykäsosoite.fi',
  ],
];

it.each(cases)(
  'Should find the email address from this %p to be %p',
  (createdBy, email) => {
    expect(parseEmailFromCreatedBy(createdBy)).toBe(email);
  }
);
