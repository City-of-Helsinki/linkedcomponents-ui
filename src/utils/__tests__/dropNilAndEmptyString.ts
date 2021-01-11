import dropNilAndEmptyString from '../dropNilAndEmptyString';

test('should update locale param', () => {
  expect(dropNilAndEmptyString({ empty: null, value: 'value' })).toEqual({
    value: 'value',
  });

  expect(
    dropNilAndEmptyString({ array: ['item1'], empty: null, value: 'value' })
  ).toEqual({
    array: ['item1'],
    value: 'value',
  });

  expect(
    dropNilAndEmptyString({
      array: [{ arrayKey: 'item1', empty: '' }],
      empty: null,
      value: 'value',
    })
  ).toEqual({
    array: [{ arrayKey: 'item1' }],
    value: 'value',
  });

  expect(
    dropNilAndEmptyString({
      empty: null,
      nestedObject: { array: [{ arrayKey: 'item1', empty: '' }], empty: null },
      value: 'value',
    })
  ).toEqual({
    nestedObject: { array: [{ arrayKey: 'item1' }] },
    value: 'value',
  });
});
