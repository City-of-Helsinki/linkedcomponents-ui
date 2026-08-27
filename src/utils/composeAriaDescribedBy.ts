const composeAriaDescribedBy = (
  id: string,
  helperText: string | undefined,
  errorText: string | undefined,
  successText: string | undefined,
  infoText: string | undefined
): string => {
  return [
    helperText && `${id}-helper`,
    errorText && `${id}-error`,
    successText && `${id}-success`,
    infoText && `${id}-info`,
  ]
    .filter(Boolean)
    .join(' ');
};

export default composeAriaDescribedBy;
