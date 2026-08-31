const parseEmailFromCreatedBy = (
  createdBy: string | null | undefined
): string => {
  if (!createdBy) {
    return '';
  }
  // [^\s@]+ rather than \S+: \S matches "@" too, which makes the local part
  // ambiguous and the whole match quadratic (sonar typescript:S8786).
  const filterRegexp = /[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Z]{2,}/gi;
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
