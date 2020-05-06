import React, { FC, memo } from 'react';
import { BareProps } from './types';

interface Props extends BareProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: () => void;
}

export const TagInput: FC<Props> = memo(({
  className,
  id,
  label,
  name,
  onChange,
  value
}) => {
  return (
    <div>
      <input
        id={id}
        name={name}
        onChange={onChange}
        value={value}
      />
      {label ? <span>{label}</span> : null}
    </div>
  );
});
