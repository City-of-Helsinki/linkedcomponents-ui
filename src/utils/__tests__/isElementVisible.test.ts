import isElementVisible from '../isElementVisible';

const setElementWidth = (element: HTMLElement, width: number) => {
  element.style.width = `${width}px`;
  // Mock offsetWidth since it is 0 in test environment
  Object.defineProperty(element, 'offsetWidth', {
    configurable: true,
    value: width,
  });
};

const setElementHeight = (element: HTMLElement, height: number) => {
  element.style.height = `${height}px`;
  // Mock offsetHeight since it is 0 in test environment
  Object.defineProperty(element, 'offsetHeight', {
    configurable: true,
    value: height,
  });
};

describe('isElementVisible', () => {
  it('should return true for visible element', () => {
    const element = document.createElement('div');
    setElementWidth(element, 100);
    setElementHeight(element, 100);
    document.body.appendChild(element);

    expect(isElementVisible(element)).toBe(true);

    document.body.removeChild(element);
  });

  it('should return false for element with zero width', () => {
    const element = document.createElement('div');
    setElementWidth(element, 0);
    setElementHeight(element, 100);
    document.body.appendChild(element);

    expect(isElementVisible(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should return false for element with zero height', () => {
    const element = document.createElement('div');
    setElementWidth(element, 100);
    setElementHeight(element, 0);
    document.body.appendChild(element);

    expect(isElementVisible(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should return false for element with visibility hidden', () => {
    const element = document.createElement('div');
    setElementWidth(element, 100);
    setElementHeight(element, 100);
    element.style.visibility = 'hidden';
    document.body.appendChild(element);

    expect(isElementVisible(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should return false for element with display none', () => {
    const element = document.createElement('div');
    setElementWidth(element, 100);
    setElementHeight(element, 100);
    element.style.display = 'none';
    document.body.appendChild(element);

    expect(isElementVisible(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should return false for element with opacity 0', () => {
    const element = document.createElement('div');
    setElementWidth(element, 100);
    setElementHeight(element, 100);
    element.style.opacity = '0';
    document.body.appendChild(element);

    expect(isElementVisible(element)).toBe(false);

    document.body.removeChild(element);
  });
});
