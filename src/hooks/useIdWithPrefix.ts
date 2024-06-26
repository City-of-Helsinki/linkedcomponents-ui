import React from 'react';

import getValue from '../utils/getValue';

interface Props {
  id?: string;
  prefix: string;
}

const useIdWithPrefix = ({ id: _id, prefix }: Props) => {
  const id = React.useId();
  const [idWithPrefix] = React.useState(getValue(_id, `${prefix}${id}`));

  return idWithPrefix;
};

export default useIdWithPrefix;
