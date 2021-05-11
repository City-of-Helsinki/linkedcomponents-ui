/**
 * Add new parameter to query search query and get new query
 * @param {string} query
 * @param {string} key
 * @param {string} value
 * @return {string}
 */
const composeQuery = (query: string, key: string, value: string): string => {
  return query.concat(`${query ? '&' : '?'}${key}=`, value);
};

export default composeQuery;
