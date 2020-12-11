import { Meta } from '../generated/graphql';

const getNextPage = (meta: Meta): number | null => {
  if (!meta.next) return null;

  const search = meta.next.split('?')[1];
  const searchParams = new URLSearchParams(decodeURIComponent(search));
  const page = searchParams.get('page');

  return page ? Number(page) : null;
};

export default getNextPage;
