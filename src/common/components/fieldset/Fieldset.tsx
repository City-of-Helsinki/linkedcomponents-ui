import classNames from 'classnames';
import { Fieldset as HdsFieldset, FieldsetProps } from 'hds-react';
import { FC } from 'react';

import styles from './fieldset.module.scss';

type Props = { hideLegend?: boolean } & FieldsetProps;

const Fieldset: FC<Props> = ({ children, className, hideLegend, ...rest }) => {
  return (
    <HdsFieldset
      {...rest}
      className={classNames(className, { [styles.hideLegend]: hideLegend })}
    >
      {children}
    </HdsFieldset>
  );
};

export default Fieldset;
