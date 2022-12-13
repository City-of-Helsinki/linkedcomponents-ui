import { Header } from '../types';
import { processRows } from '../utils';

describe('processRows function', () => {
  const item1 = { name: 'Name 1', id: '1' };
  const item2 = { name: 'Name 2', id: '2' };
  const item3 = { name: 'Name 3', id: '3' };
  const rows = [item2, item1, item3];
  const cols: Header[] = [
    {
      customSortCompareFunction: (a: string, b: string) => {
        if (a < b) {
          return 1;
        }
        if (a > b) {
          return -1;
        }
        return 0;
      },
      headerName: 'Id',
      isSortable: true,
      key: 'id',
    },
    { headerName: 'Name', isSortable: true, key: 'name' },
  ];

  it('should sort rows by id in ascending order', () => {
    expect(processRows(rows, 'asc', 'id', cols)).toEqual([item3, item2, item1]);
  });

  it('should sort rows by id in descending order', () => {
    expect(processRows(rows, 'desc', 'id', cols)).toEqual([
      item1,
      item2,
      item3,
    ]);
  });

  it('should sort rows by name in ascending order', () => {
    expect(processRows(rows, 'asc', 'name', cols)).toEqual([
      item1,
      item2,
      item3,
    ]);
  });

  it('should sort rows by name in descending order', () => {
    expect(processRows(rows, 'desc', 'name', cols)).toEqual([
      item3,
      item2,
      item1,
    ]);
  });
});
