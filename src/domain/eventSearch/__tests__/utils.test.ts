import { ROUTES } from '../../../constants';
import { EventQueryParam } from '../types';
import { addParamsToEventQueryString, getEventParamValue } from '../utils';

describe('addParamsToEventQueryString function', () => {
  it('should add returnPath to search', () => {
    expect(
      addParamsToEventQueryString('?text=search', {
        returnPath: `/fi${ROUTES.SEARCH}`,
      })
    ).toBe('?text=search&returnPath=%2Fsearch');
  });

  it('should add multiple returnPaths to search', () => {
    expect(
      addParamsToEventQueryString('?text=search', {
        returnPath: [`/fi${ROUTES.SEARCH}`, `/fi${ROUTES.EVENTS}`],
      })
    ).toBe('?text=search&returnPath=%2Fsearch&returnPath=%2Fevents');
  });
});

describe('getEventParamValue function', () => {
  it('should get returnPath without locale', () => {
    expect(
      getEventParamValue({
        param: 'returnPath',
        value: `/fi${ROUTES.SEARCH}`,
      })
    ).toBe(ROUTES.SEARCH);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getEventParamValue({
        param: 'unsupported' as EventQueryParam,
        value: 'value',
      })
    ).toThrowError();
  });
});
