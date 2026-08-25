import getValue from './getValue';
import skipFalsyType from './skipFalsyType';

const parseIdFromAtId = (atId: string | null): string | null =>
  getValue(atId?.split('/').findLast(skipFalsyType), null);

export default parseIdFromAtId;
