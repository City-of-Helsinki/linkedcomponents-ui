const parseEmailFromCreatedBy = (
  createdBy: string | null | undefined
): string => {
  if (!createdBy) {
    return '';
  }
  const filterRegexp = /[\S._%+-]+@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Za-z]{2,}/gi;
  const targetEmail = createdBy.match(filterRegexp);
  return targetEmail ? targetEmail[0] : '';
};

const openMailtoLink = (
  targetEmail: string | null | undefined,
  subject: string | null | undefined
): void => {
  window.location.href = 'mailto:' + targetEmail + '?subject=' + subject;
};
export { openMailtoLink, parseEmailFromCreatedBy };
