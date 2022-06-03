import React from 'react';

interface Props {
  id?: string;
  prefix: string;
}

const useIdWithPrefix = ({ id: _id, prefix }: Props) => {
  const id = React.useId();
  const [idWithPrefix] = React.useState(_id || `${prefix}${id}`);

  return idWithPrefix;
};

export default useIdWithPrefix;
