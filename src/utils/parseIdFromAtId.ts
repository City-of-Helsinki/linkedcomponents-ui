const parseIdFromAtId = (atId: string | null) =>
  atId
    ?.split('/')
    .filter((t) => t)
    .pop() || null;

export default parseIdFromAtId;
