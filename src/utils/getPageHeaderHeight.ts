import { PAGE_HEADER_ID } from '../constants';

const getPageHeaderHeight = (): number => {
  const pageHeader = document.getElementById(PAGE_HEADER_ID);
  return pageHeader?.clientHeight ? pageHeader.clientHeight : 0;
};

export default getPageHeaderHeight;
