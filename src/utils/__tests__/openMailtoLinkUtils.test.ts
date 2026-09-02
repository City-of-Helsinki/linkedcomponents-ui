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

const subjectCases = [
  // "&" and "#" used to truncate the subject silently.
  ['Konsertti & tanssi', 'Konsertti%20%26%20tanssi'],
  ['Taide #2026', 'Taide%20%232026'],
  ['Kevät 100%', 'Kev%C3%A4t%20100%25'],
  ['Kysely: mitä mieltä?', 'Kysely%3A%20mit%C3%A4%20mielt%C3%A4%3F'],
];

it.each(subjectCases)(
  'should encode the subject %p as %p',
  (subject, encoded) => {
    const originalLocation = window.location;
    /* @ts-ignore */
    delete window.location;
    window.location = { href: '' } as any;

    openMailtoLink('a@b.fi', subject);

    expect(window.location.href).toBe(`mailto:a@b.fi?subject=${encoded}`);
    expect(new URL(window.location.href).searchParams.get('subject')).toBe(
      subject
    );

    window.location = originalLocation;
  }
);

it('should keep "@" literal but encode the rest of the address', () => {
  const originalLocation = window.location;
  /* @ts-ignore */
  delete window.location;
  window.location = { href: '' } as any;

  openMailtoLink('a&b@c.fi', 'otsikko');

  expect(window.location.href).toBe('mailto:a%26b@c.fi?subject=otsikko');

  // RFC 6068 requires "=" and ";" in the addr-spec to be percent-encoded.
  openMailtoLink('a=b@c.fi', 'otsikko');

  expect(window.location.href).toBe('mailto:a%3Db@c.fi?subject=otsikko');

  openMailtoLink('a;b@c.fi', 'otsikko');

  expect(window.location.href).toBe('mailto:a%3Bb@c.fi?subject=otsikko');

  openMailtoLink('äijä@älykäs.fi', 'otsikko');

  // Internationalised addresses must not be mangled.
  expect(window.location.href).toBe('mailto:äijä@älykäs.fi?subject=otsikko');

  window.location = originalLocation;
});
