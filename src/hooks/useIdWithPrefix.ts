import React from 'react';

import getValue from '../utils/getValue';
import sanitizeElementId from '../utils/sanitizeElementId';

interface Props {
  id?: string;
  prefix: string;
}

const useIdWithPrefix = ({ id: _id, prefix }: Props) => {
  const generatedId = sanitizeElementId(React.useId());
  const [idWithPrefix] = React.useState(
    getValue(_id, `${prefix}${generatedId}`)
  );

  return idWithPrefix;
};

export default useIdWithPrefix;
