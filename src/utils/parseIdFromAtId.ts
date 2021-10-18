import skipFalsyType from './skipFalsyType';

const parseIdFromAtId = (atId: string | null): string | null =>
  atId?.split('/').filter(skipFalsyType).pop() || null;

export default parseIdFromAtId;
