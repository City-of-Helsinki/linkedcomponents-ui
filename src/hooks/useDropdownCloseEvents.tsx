import React from 'react';

interface Props {
  container: React.MutableRefObject<HTMLDivElement | null>;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const useDropdownCloseEvents = ({
  container,
  isMenuOpen,
  setIsMenuOpen,
}: Props): void => {
  const handleDocumentClickOrFocusin = React.useCallback(
    (event: MouseEvent | FocusEvent) => {
      const target = event.target;
      const current = container.current;
      // e.g. datepicker menu is closed after selecting date, so check that target is in document
      const isTargetInDocument =
        target instanceof Node && document.contains(target);
      const isTargetInContainer =
        target instanceof Node && current?.contains(target);

      if (isMenuOpen && isTargetInDocument && !isTargetInContainer) {
        setIsMenuOpen(false);
      }
    },
    [container, isMenuOpen, setIsMenuOpen]
  );

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClickOrFocusin);
    document.addEventListener('focusin', handleDocumentClickOrFocusin);

    return () => {
      document.removeEventListener('click', handleDocumentClickOrFocusin);
      document.removeEventListener('focusin', handleDocumentClickOrFocusin);
    };
  });
};

export default useDropdownCloseEvents;
