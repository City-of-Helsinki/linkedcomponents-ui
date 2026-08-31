/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  openMailtoLink,
  parseEmailFromCreatedBy,
} from '../openMailtoLinkUtils';
const cases = [
  ['', ''],
  ['invalid-email', ''],
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
  // A local part cannot contain an unquoted '@', so the address after the
  // last '@' wins; consecutive '@' yields no usable address at all.
  ['Testi Ukkeli - a@b@c.fi', 'b@c.fi'],
  ['Testi Ukkeli - a@@b.fi', ''],
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
