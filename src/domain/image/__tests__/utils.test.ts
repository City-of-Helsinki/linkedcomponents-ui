import { imagePathBuilder, imagesPathBuilder } from '../utils';

describe('imagePathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      imagePathBuilder({
        args: { id: 'hel:123' },
      })
    ).toBe('/image/hel:123/');
  });
});

describe('imagesPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      imagesPathBuilder({
        args: { dataSource: 'data-source' },
      })
    ).toBe('/image/?data_source=data-source');

    expect(
      imagesPathBuilder({
        args: { page: 3 },
      })
    ).toBe('/image/?page=3');

    expect(
      imagesPathBuilder({
        args: { pageSize: 3 },
      })
    ).toBe('/image/?page_size=3');

    expect(
      imagesPathBuilder({
        args: { publisher: 'hel:123' },
      })
    ).toBe('/image/?publisher=hel:123');
  });
});
