import React, { FC, memo } from 'react';
import { CurrencyId } from '@acala-network/types/interfaces';
import { Input } from 'semantic-ui-react';
import { useApi } from '@honzon-platform/react-hooks';

interface Props {
  id?: string;
  name?: string;
  token: string | CurrencyId;
  onChange: any;
  error?: boolean;
  placeholder?: string;
  value: any;
}

export const BalanceInput: FC<Props> = memo(({
  error,
  id,
  name,
  onChange,
  placeholder,
  token,
  value
}) => {
  const { api } = useApi();
  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const CurrencyId = api.registry.get('CurrencyId')!;

  if (typeof token === 'string') {
    token = new (CurrencyId as any)(api.registry, token) as CurrencyId;

    if (!token) {
      console.warn(`${token} is not support`);
    }
  }

  return (
    <Input
      error={error}
      id={id}
      label={token.toString()}
      labelPosition='right'
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      type='number'
      value={value}
    />
  );
});

BalanceInput.displayName = 'BalanceInput';
