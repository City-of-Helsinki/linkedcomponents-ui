/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { LEServerError, ServerErrorItem } from '../../types';
import parseServerErrorArray from '../parseServerErrorArray';

const testCases: [LEServerError, ServerErrorItem[]][] = [
  ['End time cannot be in the past. Please set a future end time.', []],
  [
    [
      {
        end_time:
          'End time cannot be in the past. Please set a future end time.',
        email: 'Arvon tulee olla uniikki.',
      },
      {
        short_description:
          'Short description length must be 160 characters or less',
      },
    ],
    [
      {
        label: 'end_time',
        message:
          'Lopetusaika ei voi olla menneisyydessä. Määritä tuleva päättymisaika.',
      },
      {
        label: 'email',
        message: 'Arvon tulee olla uniikki.',
      },
      {
        label: 'short_description',
        message: 'Lyhyen kuvauksen pituus saa olla enintään 160 merkkiä.',
      },
    ],
  ],
];

test.each(testCases)(
  'should parse server error array %s, result %s',
  (error, expectedResult) => {
    expect(
      parseServerErrorArray({
        error: error,
        parseLabelFn: (o) => o.key,
        t: i18n.t.bind(i18n),
      })
    ).toEqual(expectedResult);
  }
);
