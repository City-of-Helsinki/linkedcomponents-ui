import React from 'react';

interface Props {
  container: React.MutableRefObject<HTMLDivElement | null>;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const useDropdownCloseEvents = ({ container, setIsMenuOpen }: Props) => {
  const handleDocumentClickOrFocusin = React.useCallback(
    (event: MouseEvent | FocusEvent) => {
      const target = event.target;
      const current = container.current;
      // e.g. datepicker menu is closed after selecting date, so check that target is in document
      const isTargetInDocument =
        target instanceof Node && document.contains(target);
      const isTargetInContainer =
        target instanceof Node && current?.contains(target);

      if (isTargetInDocument && !isTargetInContainer) {
        setIsMenuOpen(false);
      }
    },
    [container, setIsMenuOpen]
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
