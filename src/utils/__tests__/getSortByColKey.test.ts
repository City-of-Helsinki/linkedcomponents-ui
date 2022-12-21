import getSortByColKey from '../getSortByColKey';

describe('getSortByColKey function', () => {
  it('should get correct sort', () => {
    expect(getSortByColKey({ colKey: 'name', sort: 'name' })).toBe('-name');
    expect(getSortByColKey({ colKey: 'name', sort: '-name' })).toBe('name');
    expect(getSortByColKey({ colKey: 'id', sort: 'name' })).toBe('id');
    expect(getSortByColKey({ colKey: 'id', sort: '-name' })).toBe('id');
  });
});
