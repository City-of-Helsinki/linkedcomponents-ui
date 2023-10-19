/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  openMailtoLink,
  parseEmailFromCreatedBy,
} from '../openMailtoLinkUtils';
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

it('should have correct window.location set after calling the function', async () => {
  const originalLocation = window.location;
  /* @ts-ignore */
  delete window.location;

  window.location = { href: '' } as any;

  openMailtoLink('ukko.kapiainen@testiosoite.fi', 'testiotsikko');

  expect(window.location.href).toBe(
    'mailto:ukko.kapiainen@testiosoite.fi?subject=testiotsikko'
  );

  window.location = originalLocation;
});
