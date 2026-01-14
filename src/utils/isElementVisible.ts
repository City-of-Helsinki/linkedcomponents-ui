/**
 * Check if an element is visible to the user.
 * Returns false for elements that are:
 * - Hidden with CSS (display: none, visibility: hidden, opacity: 0)
 * - Have zero width or height
 * - Are used for accessibility purposes only (like ResetFocus)
 */
const isElementVisible = (element: HTMLElement): boolean => {
  // Check if element has dimensions
  if (element.offsetWidth === 0 || element.offsetHeight === 0) {
    return false;
  }

  // Check computed styles
  const style = window.getComputedStyle(element);

  if (
    style.visibility === 'hidden' ||
    style.display === 'none' ||
    parseFloat(style.opacity) === 0
  ) {
    return false;
  }

  return true;
};

export default isElementVisible;
