import composeQuery from './composeQuery';

interface VariableToKeyItem {
  key: string;
  value: unknown;
}

const queryBuilder = (items: VariableToKeyItem[]): string => {
  let query = '';
  items.forEach((item) => {
    if (Array.isArray(item.value) && item.value?.length) {
      query = composeQuery(query, item.key, item.value.join(','));
    } else if (typeof item.value === 'boolean') {
      query = composeQuery(query, item.key, item.value ? 'true' : 'false');
    } else if (typeof item.value === 'number') {
      query = composeQuery(query, item.key, (item.value as number).toString());
    } else if (typeof item.value === 'string') {
      query = composeQuery(query, item.key, item.value);
    }
  });

  return query;
};

export default queryBuilder;
