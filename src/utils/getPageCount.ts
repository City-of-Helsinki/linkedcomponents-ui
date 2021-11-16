const getPageCount = (count: number, pageSize: number): number => {
  return Math.ceil(count / pageSize);
};

export default getPageCount;
