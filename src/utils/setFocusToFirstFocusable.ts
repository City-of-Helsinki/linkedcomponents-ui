const setFocusToFirstFocusable = (id: string): undefined => {
  const element = document.getElementById(id);

  /* istanbul ignore next */
  if (!element) return;

  if (element?.tabIndex >= 0) {
    element?.focus();
  } else {
    const focusable = element?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    (focusable?.[0] as HTMLElement)?.focus();
  }
};

export default setFocusToFirstFocusable;
